from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        # Your task logic here
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {
            "message": "Single node task executed successfully"
        }
        self.wfile.write("Single node task executed successfully".encode('utf-8'))
