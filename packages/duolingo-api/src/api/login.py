import json
from duolango import Duolango
from handler import DuolangoHandler

class handler(DuolangoHandler):
	def do_POST(self):
		self.send_response(201)
		self._allow_cors()
		body = self.rfile.read(int(self.headers.get('Content-Length')))
		req_data = json.loads(body)
		username = req_data['username']
		password = req_data['password']
		lingo = Duolango(username)
		lingo.password = password
		data = lingo.login()
		self.success({ "jwt": data[0], "username": data[1] })
		return
