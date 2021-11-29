import json
from duolango import Duolango
from http.server import BaseHTTPRequestHandler

class DuolangoHandler(BaseHTTPRequestHandler):
	def _allow_cors(self):
		self.send_header('Access-Control-Allow-Origin', self.headers.get('Origin'))
		self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, X-Duolingo-Username")
		self.send_header('Access-Control-Allow-Methods', '*')

	def do_OPTIONS(self):
		self.send_response(200)
		self._allow_cors()
		self.end_headers()

	def connect_api(self):
		authorization = self.headers.get('Authorization')
		username = self.headers.get('X-Duolingo-Username')
		if not authorization:
			self.error(401, { "err": "No authorization header" })
		if not username:
			self.error(401, { "err": "No duolingo username header" })
		bearer_token = authorization[7:]
		self.lingo = Duolango(username, jwt=bearer_token)

	@staticmethod
	def to_json(data):
		return bytes(json.dumps(data), 'utf-8')

	def success(self, data):
		self.send_response(200)
		self.send_header('Content-type', 'application/json')
		self.end_headers()
		self.wfile.write(self.to_json(data))

	def error(self, code, data):
		self.send_response(code)
		self.send_header('Content-type', 'application/json')
		self.end_headers()
		self.wfile.write(self.to_json(data))
