import os

from flask import Flask, jsonify, request, make_response,render_template
from flaskapp.db import get_db
from flask_sockets import Sockets




def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'data.sqlite'),
    )

    # 初始化websockets
    sockets = Sockets(app) 

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

        # 检查 email 是否已存在
        user = db.execute(
            'SELECT * FROM user WHERE email = ?', (email,)
        ).fetchone()

        if user is not None:
            return '邮箱已经注册了', 400
        # 插入新用户
        db.execute(
            'INSERT INTO user (email, password) VALUES (?, ?)',
            (email, password)
        )
        db.commit()
        return '用户注册成功', 201
    

    @app.route('/login', methods=['POST'])
    def login():
        email = request.form['email']
        password = request.form['password']
        db = get_db()
        user = db.execute(
            'SELECT * FROM user WHERE email = ?', (email,)
        ).fetchone()

        if user is None or user['password'] != password:
            return '登录失败', 401

        return 'login successful', 200
    
    @sockets.route('/echo')
    def echo_socket(ws):
        print('客户端已经连接')
        while not ws.closed:
            message = ws.receive()
            if message:
                print(f"Received message: {message}")
                ws.send(f"Echo: {message}")
    


        
    from . import db
    db.init_app(app)
    return app
