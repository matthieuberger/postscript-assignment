
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from sqlalchemy import event, DDL

db = SQLAlchemy()
ma = Marshmallow()

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # 255 should be ok considering it is a text message
    content = db.Column(db.String(255))
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    product = db.relationship("Product", backref="messages")

class NestedMessageSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Message
    
    id = ma.auto_field()
    content = ma.auto_field()

class MessageSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Message
    
    id = ma.auto_field()
    content = ma.auto_field(required=True)
    product_id = ma.auto_field(required=True)

class ProductSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Product

    id = ma.auto_field()
    name = ma.auto_field()
    messages = ma.Nested(NestedMessageSchema, many=True)

class SendMessageSchema(ma.Schema):
    phone = ma.String(required=True)

    

# Create some initial products for the database
# TODO: Could be move to a sperate file for cleaning purpose
@event.listens_for(Product.__table__, 'after_create')
def insert_initial_values(*args, **kwargs):
    """ Create 9 initial products in the database. 
    """
    for i in range(1, 10):
        product = Product(name=f"Product {i}")
        print(product.id)
        db.session.add(product)
    
    db.session.commit()
