from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import (
    users_collection, 
    schemes_collection, 
    find_user_by_id,
    get_all_schemes,
    get_scheme_by_id,
    create_scheme,
    get_marquee_settings,
    update_marquee_settings
)
from bson import ObjectId
import bcrypt

admin_bp = Blueprint('admin', __name__)

def is_admin():
    user_id = get_jwt_identity()
    user = find_user_by_id(user_id)
    return user and user.get('role') == 'admin'

@admin_bp.route('/check', methods=['GET'])
@jwt_required()
def check_admin():
    if is_admin():
        return jsonify({'is_admin': True}), 200
    return jsonify({'is_admin': False}), 200

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    users = list(users_collection.find())
    for user in users:
        user['_id'] = str(user['_id'])
        user.pop('password_hash', None)
    
    return jsonify(users), 200

@admin_bp.route('/users/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    user = find_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user['_id'] = str(user['_id'])
    user.pop('password_hash', None)
    return jsonify(user), 200

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    result = users_collection.delete_one({'_id': ObjectId(user_id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'message': 'User deleted successfully'}), 200

@admin_bp.route('/schemes', methods=['GET'])
@jwt_required()
def admin_get_schemes():
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    schemes = get_all_schemes()
    return jsonify(schemes), 200

@admin_bp.route('/schemes/<scheme_id>', methods=['GET'])
@jwt_required()
def admin_get_scheme(scheme_id):
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    scheme = get_scheme_by_id(scheme_id)
    if not scheme:
        return jsonify({'error': 'Scheme not found'}), 404
    
    return jsonify(scheme), 200

@admin_bp.route('/schemes', methods=['POST'])
@jwt_required()
def admin_create_scheme():
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    scheme_id = create_scheme(data)
    return jsonify({'message': 'Scheme created', 'id': str(scheme_id)}), 201

@admin_bp.route('/schemes/<scheme_id>', methods=['PUT'])
@jwt_required()
def admin_update_scheme(scheme_id):
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    data.pop('_id', None)
    
    result = schemes_collection.update_one(
        {'_id': ObjectId(scheme_id)},
        {'$set': data}
    )
    
    if result.matched_count == 0:
        return jsonify({'error': 'Scheme not found'}), 404
    
    return jsonify({'message': 'Scheme updated successfully'}), 200

@admin_bp.route('/schemes/<scheme_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_scheme(scheme_id):
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    result = schemes_collection.delete_one({'_id': ObjectId(scheme_id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Scheme not found'}), 404
    
    return jsonify({'message': 'Scheme deleted successfully'}), 200

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    total_users = users_collection.count_documents({})
    total_schemes = schemes_collection.count_documents({})
    
    return jsonify({
        'total_users': total_users,
        'total_schemes': total_schemes
    }), 200


@admin_bp.route('/marquee', methods=['GET'])
@jwt_required()
def get_marquee():
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    settings = get_marquee_settings()
    return jsonify(settings), 200


@admin_bp.route('/marquee', methods=['PUT'])
@jwt_required()
def update_marquee():
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    update_marquee_settings(data)
    return jsonify({'message': 'Marquee settings updated successfully'}), 200
