import logging
import os

import requests
from diamond.wrapper.wrapper import register_container
from flask import flash, jsonify, make_response, redirect, request, session, url_for

from api.backend.utils.decorators import authenticated
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


@app.route("/", methods=["GET"])
def home():
    """Home route."""
    return redirect("http://localhost:3000/sign-in")


@app.route("/signup", methods=["GET"])
def signup():
    """Send the user to Globus Auth with signup=1."""
    return redirect(url_for("authcallback", signup=1))


@app.route("/login", methods=["GET"])
def login():
    """Send the user to Globus Auth."""
    return redirect(url_for("authcallback"))


@app.route("/logout", methods=["GET"])
@authenticated
def logout():
    """
    - Revoke the tokens with Globus Auth.
    - Destroy the session state.
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
    log.info(f"Session after clearing: {session}")

    redirect_uri = url_for("home", _external=True)

    ga_logout_url = []
    ga_logout_url.append(os.environ["GLOBUS_AUTH_LOGOUT_URI"])
    ga_logout_url.append("?client={}".format(os.environ["PORTAL_CLIENT_ID"]))
    ga_logout_url.append("&redirect_uri={}".format(redirect_uri))
    ga_logout_url.append("&redirect_name=Diamond Service")

    # Redirect the user to the Globus Auth logout page
    return redirect("".join(ga_logout_url))


@app.route("/profile", methods=["GET", "POST"])
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
        response = make_response(redirect("http://localhost:3000/"))
        response.set_cookie("primary_identity", session["primary_identity"])
        response.set_cookie("name", session["name"])
        response.set_cookie("email", session["email"])
        response.set_cookie("institution", session["institution"])
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


@app.route("/authcallback", methods=["GET"])
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

            if response.status_code == 200:
                return redirect(url_for("profile"))
            else:
                log.error("Failed to create profile")
                return "Error creating profile", 500


@app.route("/loadprofile", methods=["GET"])
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
