
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/infomitra')
    JWT_SECRET = os.getenv('JWT_SECRET', 'dev-secret-key')
    PORT = int(os.getenv('PORT', 5000))
    CORS_ORIGIN = os.getenv('CORS_ORIGIN', 'http://localhost:3000')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
