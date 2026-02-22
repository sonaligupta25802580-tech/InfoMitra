from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_all_schemes, get_scheme_by_id, find_user_by_id, create_scheme, get_marquee_settings, get_recent_schemes
from eligibility import check_eligibility

schemes_bp = Blueprint('schemes', __name__)

@schemes_bp.route('/', methods=['GET'])
def get_schemes():
    schemes = get_all_schemes()
    return jsonify(schemes), 200

@schemes_bp.route('/eligible', methods=['GET'])
@jwt_required()
def get_eligible_schemes():
    user_id = get_jwt_identity()
    user = find_user_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user_profile = user.get('profile', {})
    all_schemes = get_all_schemes()
    
    eligible_schemes = []
    for scheme in all_schemes:
        is_eligible, reason = check_eligibility(user_profile, scheme)
        if is_eligible:
            eligible_schemes.append(scheme)
    
    return jsonify(eligible_schemes), 200

@schemes_bp.route('/<scheme_id>', methods=['GET'])
def get_scheme(scheme_id):
    scheme = get_scheme_by_id(scheme_id)
    
    if not scheme:
        return jsonify({'error': 'Scheme not found'}), 404
    
    return jsonify(scheme), 200

@schemes_bp.route('/marquee-data', methods=['GET'])
def get_marquee_data():
    settings = get_marquee_settings()
    
    if not settings.get('is_active', True):
        return jsonify({'is_active': False}), 200
    
    result = {
        'is_active': True,
        'custom_message': settings.get('custom_message', ''),
        'show_new_schemes': settings.get('show_new_schemes', True),
        'schemes': []
    }
    
    if settings.get('show_new_schemes', True):
        recent = get_recent_schemes(5)
        result['schemes'] = recent
    
    return jsonify(result), 200


@schemes_bp.route('/', methods=['POST'])
def create_new_scheme():
    data = request.json
    scheme_id = create_scheme(data)
    return jsonify({'message': 'Scheme created', 'id': str(scheme_id)}), 201
