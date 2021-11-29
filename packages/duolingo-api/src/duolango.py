"""An unofficial API for duolingo.com"""
import duolingo
import re
import json
import random
from datetime import datetime, timedelta
from json import JSONDecodeError

import requests

class Struct:
	def __init__(self, **entries):
		self.__dict__.update(entries)


class DuolingoException(Exception):
	pass


class AlreadyHaveStoreItemException(DuolingoException):
	pass


class InsufficientFundsException(DuolingoException):
	pass


class CaptchaException(DuolingoException):
	pass


class OtherUserException(DuolingoException):
	"""
	This exception is raised when set_username() has been called to get info on another user, but a method has then
	been used which cannot give data on that new user.
	"""
	pass

class Duolango(duolingo.Duolingo):
	def __init__(self, username, password=None, *, jwt=None, session_file=None):
		self.username = username
		self._original_username = username
		self.password = password
		self.session_file = session_file
		self.session = requests.Session()
		self.leader_data = None
		self.jwt = jwt
		self.is_not_authenticated = False

		if password or jwt or session_file:
			self._login()
			self.user_data = Struct(**self._get_data())
			self.voice_url_dict = None
		else:
			self.is_not_authenticated = True

	def _check_authentication(self):
		if self.is_not_authenticated:
			raise DuolingoException("Password, jwt, or session_file must be specified in order to authenticate.")

	def _make_req(self, url, data=None, method=None):
		headers = {}
		if self.jwt is not None:
			headers['Authorization'] = 'Bearer ' + self.jwt
			self.session.cookies.set('jwt_token', self.jwt)
		headers['User-Agent'] = self.USER_AGENT

		if method is None:
			method = 'POST' if data else 'GET'
		req = requests.Request(method,
													url,
													json=data,
													headers=headers,
													cookies=self.session.cookies)
		prepped = req.prepare()
		resp = self.session.send(prepped)
		if resp.status_code == 403 and resp.json().get("blockScript") is not None:
			raise super.CaptchaException(
				"Request to URL: {}, using user agent {}, was blocked, and requested a captcha to be solved. "
				"Try changing the user agent and logging in again.".format(
						url, self.USER_AGENT)
			)
		return resp

	def login(self):
		self._login()
		return self.jwt

	def get_courses(self):
		return self.get_data_by_user_id(['courses'])['courses']

	def get_current_course(self):
		return self.get_data_by_user_id(['currentCourse'])['currentCourse']

	def change_course(self, course_id, from_language, to_language):
		url = self.get_user_url_by_id(fields=['currentCourse'])
		data = {
			'courseId': course_id,
			'fromLanguage': from_language,
			'toLanguage': to_language,
		}
		return self._make_req(url, data, method='PATCH').json()

	def _get_skills_data(self):
		current_course = self.get_current_course()
		skill_groups = current_course['skills']
		skill_groups_without_bonus = []
		for skill_group in skill_groups:
			# assume in a skill group, all skills are either bonus or not
			# so just look at the first skill
			if (not 'bonus' in skill_group[0]) or (not skill_group[0]['bonus']):
				skill_groups_without_bonus.append(skill_group)
		return skill_groups_without_bonus
		

	def get_current_tree(self):
		skill_groups_without_bonus = self._get_skills_data()
		tree = map(lambda skill_group: str(len(skill_group)), skill_groups_without_bonus)
		return [item for item in list(tree)]
	
	def get_current_progress(self):
		skill_groups_without_bonus = self._get_skills_data()
		progress = []
		for skill_group in skill_groups_without_bonus:
			for skill in skill_group:
				progress.append(str(skill['finishedLevels']))
		return progress
