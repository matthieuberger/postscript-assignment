""" The main Flask application file that bootstraps and starts the app. """

import os

from bootstrap import app_factory

app = app_factory()

class Product(app.db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))

    def __init__(self, name):
        self.name = name

    def serialize(self):
        return {"id": self.id,
                "name": self.name}


@app.route("/health-check")
def health_check():
    return {"success": True}


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", False))
