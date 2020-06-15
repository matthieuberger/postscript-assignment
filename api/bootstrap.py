""" An intermediary bootstrapping file that makes factories of various reusable app components. """

import os
import typing as t

from flask import Flask
from flask_cors import CORS
from twilio.rest import Client
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow



def app_factory(config: t.Optional[t.Dict[str, t.Any]] = None) -> Flask:
    """ Bootstraps a Flask application and adds dependencies to the resulting object.

    After bootstrap, it's a good idea to never import from `run` or the source of the bootstraped
    Flask application. Instead, all boostrapped extensions should be accessed with Flask's `current_app`.

    Example:
        from flask import current_app as app

        ...

        def my_method():
            with app.app_context():
                result = app.db.session.query(MyModel).first()

    Args:
        config (Optional[Dict[str, Any]]): A configuration object to update the app's config with

    Returns:
        Flask: The bootstrapped flask application object
    """
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = bool(
        os.environ.get("SQLALCHEMY_TRACK_MODIFICATIONS", 0)
    )
    app.config["DEBUG"] = True
    app.config.update(**(config or {}))
    app.db = database_factory(app)
    app.ma = serializer_dactroy(app)
    app.twilio = twilio_factory(app)
    cors_header(app)
    return app


def database_factory(app: Flask) -> SQLAlchemy:
    """ Bootstraps SQLAlchemy for use with the Flask-SQLAlchemy extension. 
    
    Override this method with another db factory if you'd prefer, just be
    sure to update the return typing of the `database_factory` method.

    Args:
        app (Flask): The flask app to add this db engine to

    Returns:
        SQLAlchemy: The SQLAlchemy engine
    """
    from models import db

    db.init_app(app)
    app.app_context().push()
    db.create_all()
    return db

def serializer_dactroy(app: Flask) -> Marshmallow:
    """Bootstrap Marshmallow for use with the flask-marshmallow extension.

    Args:
        app (Flask): The flask app to add this db engine to

    Returns:
        Marshmallow: Marshmallow
    """
    from models import ma

    ma.init_app(app)
    return ma

def twilio_factory(app: Flask) -> Client:
    """Bootstrap twilio

    Args:
        app (Flask): The flask app to add this db engine to
    
    Returns:
        Client: Twilio client
    """
    ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
    AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
    app.config['PHONE_NUM'] = os.environ.get('TWILIO_DEFAULT_PHONE_NUM')
    return Client(ACCOUNT_SID, AUTH_TOKEN)


def cors_header(app: Flask):
    """Add CORS to make sure we can access the API easily from our React app later.

    Args:
        app (Flask): The flask app to add this db engine to
    """
    CORS(app)