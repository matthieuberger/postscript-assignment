""" The main Flask application file that bootstraps and starts the app. """

import os

from bootstrap import app_factory
from marshmallow import ValidationError
from flask import request

from helpers import data_required, validate_schema
from models import Product, ProductSchema, Message, MessageSchema, SendMessageSchema, db

app = app_factory()
twilio = app.twilio

# Using schemas to serialize and make sure payloads are ok
product_schema = ProductSchema()
products_schema = ProductSchema(many=True,  only=("id", "name"))
message_schema = MessageSchema()
send_message_schema = SendMessageSchema()


##### API #####

@app.route("/products")
def get_products():
    products = Product.query.all()
    # Serialize the queryset
    result = products_schema.dump(products)
    return {"data": result}


@app.route("/products/<int:pk>")
def get_product(pk):
    product = Product.query.get(pk)

    if not product: #HAndle wrong id
        return {"message": f"Product with id: {pk} could not be found."}, 404

    product_result = product_schema.dump(product)
    return {"data": product_result}


@app.route("/messages", methods=["POST"])
@data_required
@validate_schema(schema=message_schema)
def new_message():
    json_data = request.get_json()
    data = message_schema.load(json_data)

    # Getting related product
    product_id = data["product_id"]
    product = Product.query.get(product_id)
    if not product:
        return {"message": "Product could not be found."}, 400


    # Create new message
    message = Message(content=data["content"], product=product)
    db.session.add(message)
    db.session.commit()
    result = message_schema.dump(Message.query.get(message.id))
    return {"message": "New message successfully created.", "data": result}

@app.route("/messages/<int:pk>/send", methods=["POST"])
@data_required
@validate_schema(schema=send_message_schema)
def send_message(pk):
    json_data = request.get_json()
    data = send_message_schema.load(json_data)
    toNumber = data['phone']

    #Handle wrong id
    message = Message.query.get(pk)
    if not message:
        return {"message": f"Message with id: {pk} could not be found."}, 404
    
    # Phone number is configured in app config
    fromNumber = app.config['PHONE_NUM']

    # Send message using twilio API
    twilio.messages.create(to=toNumber, from_=fromNumber, body=message.content)
    
    return {"message": "Succesfuly sent message!"}, 200


@app.route("/health-check")
def health_check():
    return {"success": True}



if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", False))
