"""Manage access to the database."""

import logging
import os
import sqlite3

from flask import g

# create and configure logger
logging.basicConfig(
    level=logging.INFO,
    datefmt="%Y-%m-%dT%H:%M:%S",
    format="%(asctime)-15s.%(msecs)03dZ %(levelname)-7s : %(name)s - %(message)s",
)
# create log object with current module name
log = logging.getLogger(__name__)


class Database:
    """Database access."""

    def __init__(self, app):
        """Constructor."""
        self.app = app

        @app.teardown_appcontext
        def close_connection(exception):
            """Close database connection when finished handling request."""
            db = getattr(g, "_database", None)

            if db is not None:
                db.close()

    def ensure_tables_exist(self):
        """Ensure all required tables are created."""
        db = self.get_db()
        db.execute(
            """
						CREATE TABLE IF NOT EXISTS profile (
								identity_id VARCHAR(255) PRIMARY KEY,
								name VARCHAR(255),
								email VARCHAR(255),
								institution TEXT
						)
				"""
        )
        db.commit()

    def connect_to_db(self):
        """Open database and return a connection handle."""
        return sqlite3.connect(os.environ["DATABASE"])

    def get_db(self):
        """Return the app global db connection or create one."""
        db = getattr(g, "_database", None)

        if db is None:
            db = g._database = self.connect_to_db()
            db.row_factory = sqlite3.Row

        return db

    def query_db(self, query, args=(), one=False):
        """Query the database."""
        log.info(f"Querying database: {query}")
        cur = self.get_db().execute(query, args)

        rv = cur.fetchall()
        cur.close()

        return (rv[0] if rv else None) if one else rv

    def save_profile(self, identity_id=None, name=None, email=None, institution=None):
        """Persist user profile."""
        log.info(f"Saving profile: {name}, {email}, {institution}")
        db = self.get_db()
        # Ensure the data types are correct, convert if necessary

        identity_id = str(identity_id) if identity_id is not None else None
        name = str(name) if name is not None else None
        email = str(email) if email is not None else None
        institution = str(institution) if institution is not None else None

        db.execute(
            """update profile set name = ?, email = ?, institution = ?
									 where identity_id = ? on conflict(identity_id) do update set
                                    name = excluded.name, email = excluded.email, institution = excluded.institution""",
            (name, email, institution, identity_id),
        )

        db.execute(
            """insert or replace into profile (identity_id, name, email, institution)
               values (?, ?, ?, ?)""",
            (identity_id, name, email, institution),
        )
        db.commit()

    def load_profile(self, identity_id):
        """Load user profile."""
        log.info(f"Loading profile: {identity_id}")
        return self.query_db(
            """select name, email, institution from profile
														 where identity_id = ?""",
            [identity_id],
            one=True,
        )
