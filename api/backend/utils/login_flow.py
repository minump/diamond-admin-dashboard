import json
from flask import request

import globus_sdk
from globus_sdk.scopes import AuthScopes
from globus_compute_sdk import Client as GlobusComputeClient
from globus_compute_sdk.sdk.login_manager import AuthorizerLoginManager
from globus_compute_sdk.sdk.login_manager.manager import ComputeScopeBuilder

def initialize_compute_login_manager() -> AuthorizerLoginManager:

    tokens = json.loads(request.cookies.get("tokens"))
    tokens_value = json.loads(json.loads(tokens['value'].replace("\\054", ",")).replace("'", "\""))

    openid_token = None
    funcx_service_token = None

    for key, value in tokens_value.items():
        if value.get('resource_server') == 'funcx_service':
            funcx_service_token = value.get('access_token')
        if 'openid' in value.get('scope', ''):
            openid_token = value.get('access_token')

    ComputeScopes = ComputeScopeBuilder()
    compute_auth = globus_sdk.AccessTokenAuthorizer(funcx_service_token)
    openid_auth = globus_sdk.AccessTokenAuthorizer(openid_token)

    compute_login_manager = AuthorizerLoginManager(
        authorizers={ComputeScopes.resource_server: compute_auth,
                    AuthScopes.resource_server: openid_auth}
    )
    compute_login_manager.ensure_logged_in()

    return compute_login_manager


def initialize_globus_compute_client() -> GlobusComputeClient:
    login_manager = initialize_compute_login_manager()
    return GlobusComputeClient(login_manager=login_manager)
