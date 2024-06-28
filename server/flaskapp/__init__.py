import os
import torch
from flask import Flask, jsonify, request, make_response,render_template
from flaskapp.db import get_db
from flask_sockets import Sockets
import io
from PIL import Image
import numpy as np
from models.common import DetectMultiBackend
from utils.general import non_max_suppression, scale_boxes
import base64


# 预加载 YOLOv5 模型
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
weights = 'best.pt'  # 模型权重文件路径
model = DetectMultiBackend(weights, device=device)
model.eval()


def preprocess_image(image):
    # 转换图像到模型输入格式
    image = image.resize((640, 640))
    image = np.array(image)
    image = image.transpose(2, 0, 1)  # HWC to CHW
    image = np.ascontiguousarray(image)
    image = torch.from_numpy(image).float().div(255.0).unsqueeze(0).to(device)
    return image


# 用于保存socket连接
clients = {}

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


    @app.route('/detect', methods=['POST'])
    def detect():
        print('接收到数据')
        data = request.get_json()
        image_data = base64.b64decode(data['image'])
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # 进行图像预处理
        image_tensor = preprocess_image(image)

        # 进行目标检测
        with torch.no_grad():
            results = model(image_tensor)
            detections = non_max_suppression(results)
        # 处理检测结果
        detection_results = []
        for det in detections:
            if det is not None and len(det):
                det[:, :4] = scale_boxes(image_tensor.shape[2:], det[:, :4], image.size).round()
                for *xyxy, conf, cls in reversed(det):
                    detection_results.append({
                        'label': model.names[int(cls)],
                        'confidence': float(conf),
                        'box': [int(coord) for coord in xyxy]
                    })

        detect_res = None
        max_confidence = -1
        print(detection_results)
        # 遍历检测结果列表
        for result in detection_results:
            confidence = result['confidence']
            # 检查当前结果的置信度是否比已记录的最大置信度还要高
            if confidence > max_confidence:
                max_confidence = confidence
                detect_res = result

        if len(detection_results) != 0:
            return jsonify({'label':detect_res['label']})
        else:
            return jsonify({'label':'null'})
        
        
        

    
    # a simple page that says hello
    @app.route('/sb', methods=['GET'])
    def sb():
        print('sb')
        return 'Hello, World!' 

    # a simple page that says hello
    @app.route('/hello', methods=['GET'])
    def hello():
        mac = request.args.get('mac')
        ws = clients[mac]
        ws.send('hhh') # 发送socket消息
        print('sb')
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
    

    @sockets.route('/connect')
    def connect_socket(ws):
        mac_address = request.args.get('mac')
        clients[mac_address] = ws
        print(mac_address)
        while not ws.closed:
            message = ws.receive() 

    


        
    from . import db
    db.init_app(app)
    return app
