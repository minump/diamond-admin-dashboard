from http.server import BaseHTTPRequestHandler
import json

from diamond.wrapper.wrapper import register_container

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
        # result = sdk_register_container(base_image, image_file_name, endpoint, work_path)
        # register_container(endpoint_id: str,work_path: str,image_file_name: str,base_image: str)
        result = register_container(endpoint, work_path, image_file_name, base_image)

        self.send_response(200, result)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {
            "message": "Container registered successfully",
            "result": result
        }
        self.wfile.write(json.dumps(response).encode('utf-8'))