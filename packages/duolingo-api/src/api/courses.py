from handler import DuolangoHandler

class handler(DuolangoHandler):
	def do_GET(self):
		self.send_response(200)
		self._allow_cors()
		self.connect_api()
		data = self.lingo.get_courses()
		self.success(data)
		return
