from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client.get_database()

users_collection = db.users
schemes_collection = db.schemes
site_settings_collection = db.site_settings

def create_user(email, phone, password_hash, profile=None, role='user'):
    user = {
        'email': email,
        'phone': phone,
        'password_hash': password_hash,
        'profile': profile or {},
        'role': role,
        'onboarded': False
    }
    result = users_collection.insert_one(user)
    return result.inserted_id

def find_user_by_phone(phone):
    return users_collection.find_one({'phone': phone})

def find_user_by_email(email):
    return users_collection.find_one({'email': email})

def find_user_by_id(user_id):
    from bson import ObjectId
    return users_collection.find_one({'_id': ObjectId(user_id)})

def update_user_profile(user_id, profile):
    from bson import ObjectId
    users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {'profile': profile, 'onboarded': True}}
    )

def create_scheme(scheme_data):
    result = schemes_collection.insert_one(scheme_data)
    return result.inserted_id

def get_all_schemes():
    schemes = list(schemes_collection.find())
    for scheme in schemes:
        scheme['_id'] = str(scheme['_id'])
    return schemes

def get_scheme_by_id(scheme_id):
    from bson import ObjectId
    scheme = schemes_collection.find_one({'_id': ObjectId(scheme_id)})
    if scheme:
        scheme['_id'] = str(scheme['_id'])
    return scheme


def get_marquee_settings():
    settings = site_settings_collection.find_one({'type': 'marquee'})
    if settings:
        settings['_id'] = str(settings['_id'])
    else:
        # Return defaults if no settings exist yet
        settings = {
            'type': 'marquee',
            'custom_message': '',
            'show_new_schemes': True,
            'is_active': True
        }
    return settings


def update_marquee_settings(data):
    result = site_settings_collection.update_one(
        {'type': 'marquee'},
        {'$set': {
            'type': 'marquee',
            'custom_message': data.get('custom_message', ''),
            'show_new_schemes': data.get('show_new_schemes', True),
            'is_active': data.get('is_active', True)
        }},
        upsert=True
    )
    return result.modified_count or result.upserted_id


def get_recent_schemes(limit=5):
    """Get the most recently added schemes (by _id descending)."""
    schemes = list(schemes_collection.find().sort('_id', -1).limit(limit))
    for scheme in schemes:
        scheme['_id'] = str(scheme['_id'])
    return schemes
