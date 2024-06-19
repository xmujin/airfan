from flask import Flask
from flaskapp import create_app



app = create_app()
if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    try:
        server = pywsgi.WSGIServer(('0.0.0.0', 5000), app, handler_class=WebSocketHandler)
        print('Server running on http://0.0.0.0:5000')
        server.serve_forever()
    except Exception as e:
        print(f"Server encountered an error: {e}")