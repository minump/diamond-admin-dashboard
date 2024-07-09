from functools import wraps

from flask import redirect, request, session, url_for


def authenticated(fn):
    """Mark a route as requiring authentication."""

    @wraps(fn)
    def decorated_function(*args, **kwargs):
        if not session.get("is_authenticated"):
            return redirect(url_for("login", next=request.url))

        if request.path == "/logout":
            return fn(*args, **kwargs)

        if (
            not session.get("name")
            or not session.get("email")
            or not session.get("institution")
        ) and request.path != "/profile":
            return redirect(url_for("profile", next=request.url))

        if request.path == "/profile" and request.method == "POST":
            return redirect(url_for("profile"), code=307)

        return fn(*args, **kwargs)

    return decorated_function
