from handler import DuolangoHandler

class handler(DuolangoHandler):
	def do_GET(self):
		self.success({ "data": True })
		return
