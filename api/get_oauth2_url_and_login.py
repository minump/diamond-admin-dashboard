from http.server import BaseHTTPRequestHandler
import json
from diamond.wrapper.wrapper import get_oauth2_url_and_login

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        result = get_oauth2_url_and_login()


        self.send_response(200, result)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {
            "message": "Multi node task executed successfully",
            "result": result
        }
        self.wfile.write(json.dumps(response).encode('utf-8'))