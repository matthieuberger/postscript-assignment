from functools import wraps
from flask import request
from marshmallow import ValidationError

def data_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        json_data = request.get_json()
        if not json_data:
            return {"message": "No content data provided"}, 400
        return f(*args, **kwargs)
    return decorated_function


def validate_schema(schema=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if schema is not None:
                # Validate and deserialize input
                try:
                    json_data = request.get_json()
                    schema.load(json_data)
                except ValidationError as err:
                    return err.messages, 422
            return f(*args, **kwargs)
        return decorated_function
    return decorator
