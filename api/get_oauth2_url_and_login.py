from http.server import BaseHTTPRequestHandler
import json
from diamond.wrapper.wrapper import get_oauth2_url_and_login

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        result = get_oauth2_url_and_login()
        self.send_response(200, result)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {
            "message": "OAuth2 url and login",
            "result": result
        }
        self.wfile.write(json.dumps(response).encode('utf-8'))