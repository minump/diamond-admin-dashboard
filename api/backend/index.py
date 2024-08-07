import logging
import os

import requests
from flask import flash, jsonify, make_response, redirect, request, session, url_for

from api.backend.utils.decorators import authenticated
from api.backend.utils.login_flow import initialize_globus_compute_client
from api.backend.utils.utils import get_safe_redirect, load_portal_client

from . import app, database

# create and configure logger
logging.basicConfig(
    level=logging.INFO,
    datefmt="%Y-%m-%dT%H:%M:%S",
    format="%(asctime)-15s.%(msecs)03dZ %(levelname)-7s : %(name)s - %(message)s",
)
# create log object with current module name
log = logging.getLogger(__name__)

HOST = os.environ.get("HOST", "http://diamond.localhost")
NEXT_URL = os.environ.get("NEXT_URL", "http://diamond.localhost:3000")

@app.route("/", methods=["GET"])
def home():
    """Home route."""
    return redirect(NEXT_URL + "/sign-in")


@app.route("/api/signup", methods=["GET"])
def signup():
    """Send the user to Globus Auth with signup=1."""
    return redirect(url_for("authcallback", signup=1))


@app.route("/api/login", methods=["GET"])
def login():
    """Send the user to Globus Auth."""
    return redirect(url_for("authcallback"))


@app.route(
    "/api/is_authenticated",
    methods=["GET"],
)
@authenticated
def is_authenticated():
    # log.info(f"cookies in backend: {request.cookies}")
    # log.info(f"session in backend: {session}")
    return jsonify({"is_authenticated": True})


@app.route("/api/list_active_endpoints", methods=["GET"])
@authenticated
def diamond_list_active_endpoints():
    globus_compute_client = initialize_globus_compute_client()
    active_endpoints = []
    endpoints = globus_compute_client.get_endpoints()
    for endpoint in endpoints:
        endpoint_uuid = endpoint["uuid"]
        endpoint_status = globus_compute_client.get_endpoint_status(
            endpoint_uuid=endpoint_uuid)['status']
        if endpoint_status == "online":
            active_endpoints.append({
                "endpoint_name": endpoint["name"],
                "endpoint_uuid": endpoint_uuid})
    logging.info(active_endpoints)
    return active_endpoints


# @app.route("/api/endpoint_status", methods=["POST"])
# @authenticated
# def diamond_get_endpoint_status():
#     """
#     Parameters:
#     ----------
#       endpoint_uuid: str
#     Returns:
#     --------
#       {'details': 
#         {'total_workers': 0, 
#          'idle_workers': 0,
#          'pending_tasks': 0, 
#          'outstanding_tasks': 0, 
#          'managers': 0, 
#          'nodes_per_block': 1, 
#          'total_cores': 0, 
#          'prefetch_capacity': 0, 
#          'rp_processed_timestamp': '1722360392.8201761', 
#          'cores_per_worker': 1.0, 
#          'max_workers_per_node': 2, 
#          'heartbeat_period': 30, 
#          'active_managers': 0, 
#          'max_blocks': 1, 
#          'scheduler_mode': 0, 
#          'total_mem': 0, 
#          'worker_mode': 0, 
#          'min_blocks': 0, 
#          'mem_per_worker': None, 
#          'total_core_hrs': 0, 
#          'new_core_hrs': 0, 
#          'scaling_enabled': True
#         }, 
#         'status': 'online'}
#     """
#     globus_compute_client = initialize_globus_compute_client()
#     endpoint_uuid = request.json.get('endpoint_uuid')
#     logging.info(f"Getting endpoint status, endpoint_uuid: {endpoint_uuid}")
#     endpoint_status = globus_compute_client.get_endpoint_status(endpoint_uuid=endpoint_uuid)
#     logging.info(endpoint_status)
#     return jsonify(endpoint_status)


# @app.route("/api/register_container", methods=["POST"])
# @authenticated
# def diamond_endpoint_register_container():
#     """
#     Parameters:
#     ----------
#       base_image: str
#         docker_url, e.g. gcyang/openfold:0.1
#       container_type : str
#       name : str
#       description : str
#     Returns:
#     --------
#       container_id: str
#     """
#     globus_compute_client = initialize_globus_compute_client()
#     base_image = request.json.get('base_image')
#     container_type = request.json.get('container_type')
#     name = request.json.get('name')
#     description = request.json.get('description')
#     logging.info(f"Registering container")
#     container_id = globus_compute_client.register_container(
#         base_image=base_image,
#         container_type=container_type,
#         name=name,
#         description=description
#     )
#     logging.info(container_id)
#     return jsonify(container_id)


@app.route("/api/logout", methods=["GET"])
@authenticated
def logout():
    """
    - Revoke the tokens with Globus Auth.
    - Destroy the session state.
    - Remove cookies containing 'tokens'.
    - Redirect the user to the Globus Auth logout page.
    """
    client = load_portal_client()

    # Revoke the tokens with Globus Auth
    for token, token_type in (
        (token_info[ty], ty)
        # get all of the token info dicts
        for token_info in session["tokens"].values()
        # cross product with the set of token types
        for ty in ("access_token", "refresh_token")
        # only where the relevant token is actually present
        if token_info[ty] is not None
    ):
        client.oauth2_revoke_token(token, body_params={"token_type_hint": token_type})

    # Destroy the session state
    session.clear()

    # Remove cookies containing 'tokens'
    response = make_response(redirect(url_for("home", _external=True)))
    response.delete_cookie("tokens")

    log.info(f"Session after clearing: {session}")

    redirect_uri = url_for("home", _external=True)

    ga_logout_url = []
    ga_logout_url.append(os.environ["GLOBUS_AUTH_LOGOUT_URI"])
    ga_logout_url.append("?client={}".format(os.environ["PORTAL_CLIENT_ID"]))
    ga_logout_url.append("&redirect_uri={}".format(redirect_uri))
    ga_logout_url.append("&redirect_name=Diamond Service")

    # Redirect the user to the Globus Auth logout page
    response.headers["Location"] = "".join(ga_logout_url)
    return response


@app.route("/api/profile", methods=["GET", "POST"])
@authenticated
def profile():
    """User profile information. Assocated with a Globus Auth identity."""
    log.info("profile route")
    if request.method == "GET":
        identity_id = session.get("primary_identity")
        profile = database.load_profile(identity_id)
        log.info(f"Profile: {profile}")

        if profile:
            name, email, institution = profile

            session["name"] = name
            session["email"] = email
            session["institution"] = institution
        else:
            flash("Please complete any missing profile fields and press Save.")

        if request.args.get("next"):
            session["next"] = get_safe_redirect()

        log.info(f"Session: {session}")

        if not profile and session.get("is_authenticated") == True:
            identity_id = session["primary_identity"]
            name = session["name"]
            email = session["email"]
            institution = session["institution"]
            database.save_profile(
                identity_id=identity_id,
                name=name,
                email=email,
                institution=institution,
            )

            flash("Thank you! Your profile has been successfully updated.")
            return redirect(url_for("profile"))
        # return jsonify(
        #     {
        #         "name": session["name"],
        #         "email": session["email"],
        #         "institution": session["institution"],
        #     }
        # )
        # return render_template("profile.jinja2")
        # Redirect to localhost:3000/profile
        response = make_response(redirect(f"{HOST}"))
        response.set_cookie("is_authenticated", "true")
        response.set_cookie("primary_username", session["primary_username"])
        response.set_cookie("primary_identity", session["primary_identity"])
        response.set_cookie("name", session["name"])
        response.set_cookie("email", session["email"])
        response.set_cookie("institution", session["institution"])
        response.set_cookie("tokens", str(session["tokens"]))
        return response
    elif request.method == "POST":
        name = session["name"] = request.form["name"]
        email = session["email"] = request.form["email"]
        institution = session["institution"] = request.form["institution"]
        database.save_profile(
            identity_id=session["primary_identity"],
            name=name,
            email=email,
            institution=institution,
        )

        flash("Thank you! Your profile has been successfully updated.")

        if "next" in session:
            redirect_to = session["next"]
            session.pop("next")
        else:
            redirect_to = url_for("profile")

        return redirect(redirect_to)


@app.route("/api/authcallback", methods=["GET"])
def authcallback():
    """Handles the interaction with Globus Auth."""
    # If we're coming back from Globus Auth in an error state, the error
    # will be in the "error" query string parameter.
    if "error" in request.args:
        flash(
            "You could not be logged into the portal: "
            + request.args.get("error_description", request.args["error"])
        )
        return redirect(url_for("home"))

    # Set up our Globus Auth/OAuth2 state
    redirect_uri = url_for("authcallback", _external=True)

    client = load_portal_client()
    client.oauth2_start_flow(
        redirect_uri,
        refresh_tokens=True,
        requested_scopes=os.environ["USER_SCOPES"].split(),
    )

    # If there's no "code" query string parameter, we're in this route
    # starting a Globus Auth login flow.
    if "code" not in request.args:
        additional_authorize_params = (
            {"signup": 1} if request.args.get("signup") else {}
        )

        auth_uri = client.oauth2_get_authorize_url(
            query_params=additional_authorize_params
        )

        return redirect(auth_uri)
    else:
        # If we do have a "code" param, we're coming back from Globus Auth
        # and can start the process of exchanging an auth code for a token.
        code = request.args.get("code")
        tokens = client.oauth2_exchange_code_for_tokens(code)

        id_token = tokens.decode_id_token()
        session.update(
            tokens=tokens.by_resource_server,
            is_authenticated=True,
            name=id_token.get("name"),
            email=id_token.get("email"),
            institution=id_token.get("organization"),
            primary_username=id_token.get("preferred_username"),
            primary_identity=id_token.get("sub"),
        )

        profile = database.load_profile(session["primary_identity"])

        if profile:
            name, email, institution = profile

            session["name"] = name
            session["email"] = email
            session["institution"] = institution
            log.info("profile found redirecting to profile... GET")
            return redirect(url_for("profile"))
        else:
            log.info("profile not found, creating...")

            # Create a mock form with the necessary data
            form_data = {
                "name": session["name"],
                "email": session["email"],
                "institution": session["institution"],
                "identity_id": session["primary_identity"],
            }

            # Send a POST request to the profile creation endpoint
            response = requests.post(url_for("profile", _external=True), json=form_data)

            log.info("POST profile call done, redirecting to profile... GET")
            if response.status_code == 200:
                return redirect(url_for("profile"))
            else:
                log.error("Failed to create profile")
                return "Error creating profile", 500


@app.route("/api/loadprofile", methods=["GET"])
def loadprofile():
    log.info("loadprofile route")
    return redirect(url_for("profile"))


@app.route("/api/register_container", methods=["POST"])
def registerContainer():
    request_data = request.get_json()
    base_image = request_data["base_image"]
    image_file_name = request_data["image_file_name"]
    endpoint = request_data["endpoint"]
    work_path = request_data["work_path"]
    register_container(
        endpoint_id=endpoint,
        work_path=work_path,
        base_image=base_image,
        image_file_name=image_file_name,
    )
    return jsonify({"message": "Container registered successfully"})


if __name__ == "__main__":
    app.run(port=5328)
