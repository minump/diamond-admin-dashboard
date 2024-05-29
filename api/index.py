from flask import ( Flask, request, jsonify,  make_response, Request, Response)
from diamond.wrapper.wrapper import register_container
app = Flask(__name__)

@app.route('/api/register_container', methods=['POST'])
def registerContainer():
	request_data = request.get_json()
	base_image = request_data['base_image']
	image_file_name = request_data['image_file_name']
	endpoint = request_data['endpoint']
	work_path = request_data['work_path']
	register_container(endpoint_id=endpoint, work_path=work_path,base_image=base_image,image_file_name=image_file_name)
	return jsonify({"message": "Container registered successfully"})

if __name__ == '__main__':
	app.run(port=5328)