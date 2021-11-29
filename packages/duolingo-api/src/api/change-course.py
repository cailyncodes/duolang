
import json
from duolango import Duolango
from handler import DuolangoHandler

class handler(DuolangoHandler):
	def do_POST(self):
		self.send_response(201)
		self._allow_cors()
		self.connect_api()
		body = self.rfile.read(int(self.headers.get('Content-Length')))
		req_data = json.loads(body)
		course_id = req_data['courseId']
		from_language = req_data['fromLanguage']
		to_language = req_data['toLanguage']
		data = self.lingo.change_course(course_id, from_language, to_language)
		self.success(data)
		return
