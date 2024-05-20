from http.server import BaseHTTPRequestHandler
import json
from diamond_sdk import register_container as sdk_register_container

class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        # Extract parameters from the request
        base_image = data['base_image']
        image_file_name = data['image_file_name']
        endpoint = data['endpoint']
        work_path = data['work_path']

        # Call the SDK function
        result = sdk_register_container(base_image, image_file_name, endpoint, work_path)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {
            "message": "Container registered successfully",
            "result": result
        }
        self.wfile.write(json.dumps(response).encode('utf-8'))