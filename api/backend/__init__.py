import json
import logging
import os

import dotenv
from dotenv import dotenv_values, load_dotenv
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

from api.backend.utils.database import Database

logging.basicConfig(level=logging.INFO)
load_dotenv(override=True)

# logging.info('env: ',dotenv.dotenv_values().keys())
# logging.info("Loading configuration from .env file", os.environ['USER_SCOPES'])

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
config = dotenv_values()
app.config.from_mapping(config)
# app.secret_key = os.environ.get('SECRET_KEY', 'DEFAULT_SECRET_KEY')

with app.app_context():
    database = Database(app)
    database.ensure_tables_exist()
