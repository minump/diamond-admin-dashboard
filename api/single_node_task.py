from http.server import BaseHTTPRequestHandler
import os
import json
import pickle
import base64
import globus_sdk
from globus_sdk.scopes import AuthScopes

from globus_compute_sdk import Client, Executor
from globus_compute_sdk.serialize import CombinedCode
from globus_compute_sdk.sdk.login_manager import AuthorizerLoginManager
from globus_compute_sdk.sdk.login_manager.manager import ComputeScopeBuilder

class handler(BaseHTTPRequestHandler):

    def do_POST(self, data):
        globus_data_raw = os.getenv("GLOBUS_DATA")
        tutorial_endpoint = os.getenv("GLOBUS_ENDPOINT") # Public tutorial endpoint
        if globus_data_raw:
            tokens = pickle.loads(base64.b64decode(os.getenv('GLOBUS_DATA')))['tokens']
            
            ComputeScopes = ComputeScopeBuilder()
            
            # Create Authorizers from the Compute and Auth tokens
            compute_auth = globus_sdk.AccessTokenAuthorizer(tokens[ComputeScopes.resource_server]['access_token'])
            openid_auth = globus_sdk.AccessTokenAuthorizer(tokens['auth.globus.org']['access_token'])
            
            # Create a Compute Client from these authorizers
            compute_login_manager = AuthorizerLoginManager(
                authorizers={ComputeScopes.resource_server: compute_auth,
                            AuthScopes.resource_server: openid_auth}
            )
            compute_login_manager.ensure_logged_in()
            gc = Client(login_manager=compute_login_manager, code_serialization_strategy=CombinedCode())
            gce = Executor(endpoint_id=tutorial_endpoint, client=gc)
            result = gce.execute(
                "python3",
                "-c",
                "print('Hello, world!')",
            )
            print(result)
            self.send_response(200, result)
        else:
            self.send_response(400, "No GLOBUS_DATA found")
        # self.send_response(200)
        # self.send_header('Content-type', 'application/json')
        # self.end_headers()
        # response = {
        #     "message": "Single node task executed successfully"
        # }
        # self.wfile.write("Single node task executed successfully".encode('utf-8'))
