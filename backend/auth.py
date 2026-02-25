from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from models import create_user, find_user_by_phone, find_user_by_email, find_user_by_id, update_user_profile

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    
    if not phone or not password:
        return jsonify({'error': 'Phone and password required'}), 400
    
    if not phone.isdigit() or len(phone) != 10:
        return jsonify({'error': 'Phone number must be exactly 10 digits'}), 400
    
    existing_user = find_user_by_phone(phone)
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400
    
    if email:
        existing_email = find_user_by_email(email)
        if existing_email:
            return jsonify({'error': 'Email already exists'}), 400
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    user_id = create_user(email, phone, password_hash)
    
    access_token = create_access_token(identity=str(user_id))
    
    return jsonify({
        'message': 'User created successfully',
        'access_token': access_token,
        'user_id': str(user_id)
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    phone = data.get('phone')
    email = data.get('email')
    password = data.get('password')
    
    if not password or (not phone and not email):
        return jsonify({'error': 'Phone or Email and password required'}), 400
    
    if phone and (not phone.isdigit() or len(phone) != 10):
        return jsonify({'error': 'Phone number must be exactly 10 digits'}), 400
    
    user = None
    if email:
        user = find_user_by_email(email)
    if not user and phone:
        user = find_user_by_phone(phone)
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=str(user['_id']))
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user_id': str(user['_id'])
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = find_user_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'email': user.get('email'),
        'phone': user.get('phone'),
        'profile': user.get('profile', {}),
        'role': user.get('role', 'user'),
        'onboarded': user.get('onboarded', False)
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.json
    
    profile = {
        'name': data.get('name'),
        'phone_number': data.get('phone_number'),
        'gender': data.get('gender'),
        'age': data.get('age'),
        'state': data.get('state'),
        'area': data.get('area'),
        'category': data.get('category'),
        'disability': data.get('disability'),
        'disabilityPercent': data.get('disabilityPercent'),
        'student': data.get('student'),
        'education': data.get('education'),
        'preferred_language': data.get('preferred_language', 'en')
    }
    
    update_user_profile(user_id, profile)
    
    return jsonify({'message': 'Profile updated successfully'}), 200
