import os

from flask import Flask, jsonify, request, make_response
from flaskapp.db import get_db

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'data.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'
    

    @app.route('/register', methods=['POST'])
    def register():
        email = request.form['email']
        password = request.form['password']

        db = get_db()
        db.execute(
            'INSERT INTO user (email, password) VALUES (?, ?)',
            (email, password)
        )
        db.commit()
        return 'User registered successfully', 201

    @app.route('/login', methods=['POST'])
    def login():
        email = request.form['email']
        password = request.form['password']
        db = get_db()
        user = db.execute(
            'SELECT * FROM user WHERE email = ?', (email,)
        ).fetchone()

        if user is None or user['password'] != password:
            return 'Invalid credentials', 401

        return 'Logged in successfully', 200

    from . import db
    db.init_app(app)
    return app