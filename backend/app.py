from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from auth import auth_bp
from schemes import schemes_bp
from admin import admin_bp
from chat import chat_bp

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET
CORS(app, origins=[Config.CORS_ORIGIN])
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(schemes_bp, url_prefix='/schemes')
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(chat_bp, url_prefix='/chat')

@app.route('/')
def home():
    return {'message': 'InfoMitra API'}, 200

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True, port=Config.PORT)
