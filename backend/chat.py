from flask import Blueprint, request, jsonify
from google import genai
from google.genai import types
from models import get_all_schemes, get_scheme_by_id
from config import Config
import json

chat_bp = Blueprint('chat', __name__)

# ─── Function Declarations ────────────────────────────────────────────────────

get_all_schemes_declaration = {
    "name": "get_all_schemes",
    "description": (
        "Retrieves all available government schemes from the InfoMitra database. "
        "Use this when the user asks what schemes are available, wants a list of schemes, "
        "or asks general questions about government programs."
    ),
    "parameters": {
        "type": "object",
        "properties": {},
        "required": []
    }
}

search_schemes_by_category_declaration = {
    "name": "search_schemes_by_category",
    "description": (
        "Search for government schemes by a specific category. "
        "Available categories include: Education, Agriculture, Housing, Disability, "
        "Women Empowerment, Pension, Entrepreneurship, Women and Child. "
        "Use this when the user asks about schemes in a particular domain or sector."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "category": {
                "type": "string",
                "description": (
                    "The category to search for. Examples: 'Education', 'Agriculture', "
                    "'Housing', 'Disability', 'Women Empowerment', 'Pension', 'Entrepreneurship'"
                )
            }
        },
        "required": ["category"]
    }
}

search_schemes_by_eligibility_declaration = {
    "name": "search_schemes_by_eligibility",
    "description": (
        "Search for government schemes that a person may be eligible for, based on their "
        "personal details. Use this when the user provides information about themselves "
        "such as age, caste/social category, state, gender, disability status, or student status, "
        "and wants to know which schemes they qualify for."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "age": {
                "type": "integer",
                "description": "Age of the person in years"
            },
            "category": {
                "type": "string",
                "description": "Social/caste category: SC, ST, OBC, or General",
                "enum": ["SC", "ST", "OBC", "General"]
            },
            "state": {
                "type": "string",
                "description": "State of residence in India (e.g., 'Maharashtra', 'Delhi')"
            },
            "gender": {
                "type": "string",
                "description": "Gender of the person",
                "enum": ["male", "female"]
            },
            "is_student": {
                "type": "boolean",
                "description": "Whether the person is currently a student"
            },
            "has_disability": {
                "type": "boolean",
                "description": "Whether the person has a disability"
            }
        },
        "required": []
    }
}

# ─── Function Implementations ─────────────────────────────────────────────────

def fn_get_all_schemes():
    """Fetch all schemes and return a summarized list."""
    schemes = get_all_schemes()
    result = []
    for s in schemes:
        name = s.get('scheme_name', {})
        result.append({
            "id": s.get('_id'),
            "name": name.get('en', 'Unknown') if isinstance(name, dict) else str(name),
            "category": s.get('category', ''),
            "benefits": (s.get('benefits', {}).get('en', '') if isinstance(s.get('benefits'), dict) else ''),
            "eligibility": (s.get('eligibility', {}).get('en', '') if isinstance(s.get('eligibility'), dict) else ''),
            "official_link": s.get('official_link', ''),
            "tags": s.get('tags', [])
        })
    return result


def fn_search_schemes_by_category(category: str):
    """Filter schemes by category (case-insensitive partial match)."""
    schemes = get_all_schemes()
    category_lower = category.lower().strip()
    result = []
    for s in schemes:
        scheme_category = s.get('category', '').lower()
        if category_lower in scheme_category or scheme_category in category_lower:
            name = s.get('scheme_name', {})
            result.append({
                "id": s.get('_id'),
                "name": name.get('en', 'Unknown') if isinstance(name, dict) else str(name),
                "category": s.get('category', ''),
                "benefits": (s.get('benefits', {}).get('en', '') if isinstance(s.get('benefits'), dict) else ''),
                "eligibility": (s.get('eligibility', {}).get('en', '') if isinstance(s.get('eligibility'), dict) else ''),
                "official_link": s.get('official_link', ''),
                "tags": s.get('tags', [])
            })
    return result


def fn_search_schemes_by_eligibility(age=None, category=None, state=None,
                                      gender=None, is_student=None, has_disability=None):
    """Filter schemes based on eligibility criteria."""
    from eligibility import check_eligibility

    # Build a mock user profile from the provided criteria
    user_profile = {}
    if age is not None:
        user_profile['age'] = int(age)
    if category:
        user_profile['category'] = category
    if state:
        user_profile['state'] = state
    if gender:
        user_profile['gender'] = gender
    if is_student is not None:
        user_profile['student'] = 'yes' if is_student else 'no'
    if has_disability is not None:
        user_profile['disability'] = 'yes' if has_disability else 'no'

    schemes = get_all_schemes()
    result = []
    for s in schemes:
        is_eligible, reason = check_eligibility(user_profile, s)
        if is_eligible:
            name = s.get('scheme_name', {})
            result.append({
                "id": s.get('_id'),
                "name": name.get('en', 'Unknown') if isinstance(name, dict) else str(name),
                "category": s.get('category', ''),
                "benefits": (s.get('benefits', {}).get('en', '') if isinstance(s.get('benefits'), dict) else ''),
                "eligibility": (s.get('eligibility', {}).get('en', '') if isinstance(s.get('eligibility'), dict) else ''),
                "official_link": s.get('official_link', ''),
                "tags": s.get('tags', [])
            })
    return result


# ─── Function Dispatcher ──────────────────────────────────────────────────────

def execute_function(name: str, args: dict):
    """Execute the named function with the given arguments."""
    if name == "get_all_schemes":
        return fn_get_all_schemes()
    elif name == "search_schemes_by_category":
        return fn_search_schemes_by_category(**args)
    elif name == "search_schemes_by_eligibility":
        return fn_search_schemes_by_eligibility(**args)
    else:
        return {"error": f"Unknown function: {name}"}


# ─── System Prompt ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are InfoMitra Assistant, a helpful AI chatbot for the InfoMitra platform — 
a service that helps Indian citizens discover government schemes and welfare programs they are eligible for.

Your responsibilities:
- Answer general questions about government schemes, eligibility, and benefits in a friendly, clear manner
- Use the provided database functions to fetch real scheme data when users ask about available schemes
- Help users understand which schemes they might qualify for based on their personal details
- Provide information about how to apply for schemes, required documents, and official links
- Be concise but informative; use bullet points for lists of schemes

Guidelines:
- Always be polite, empathetic, and helpful
- If a user shares personal details (age, category, state, etc.), use search_schemes_by_eligibility to find relevant schemes
- When listing schemes, include the name, key benefit, and official link
- If no schemes match, suggest the user complete their profile on InfoMitra for personalized recommendations
- You support English primarily, but can understand Hindi/Marathi queries and respond in English
- Do NOT make up scheme information — always use the database functions for scheme data"""


# ─── Chat Endpoint ────────────────────────────────────────────────────────────

@chat_bp.route('/message', methods=['POST'])
def chat_message():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Message is required'}), 400

    user_message = data.get('message', '').strip()
    history = data.get('history', [])  # List of {role, parts: [{text}]}

    if not user_message:
        return jsonify({'error': 'Message cannot be empty'}), 400

    if not Config.GEMINI_API_KEY:
        return jsonify({'error': 'Gemini API key not configured'}), 500

    try:
        client = genai.Client(api_key=Config.GEMINI_API_KEY)

        tools = types.Tool(function_declarations=[
            get_all_schemes_declaration,
            search_schemes_by_category_declaration,
            search_schemes_by_eligibility_declaration
        ])

        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            tools=[tools],
            temperature=0.7,
        )

        # Build conversation contents from history
        contents = []
        for turn in history:
            role = turn.get('role', 'user')
            text = turn.get('text', '')
            if text:
                contents.append(
                    types.Content(
                        role=role,
                        parts=[types.Part(text=text)]
                    )
                )

        # Add the new user message
        contents.append(
            types.Content(
                role='user',
                parts=[types.Part(text=user_message)]
            )
        )

        # ── Function calling loop ──────────────────────────────────────────────
        max_iterations = 5
        iteration = 0

        while iteration < max_iterations:
            iteration += 1

            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=contents,
                config=config,
            )

            candidate = response.candidates[0]
            response_content = candidate.content

            # Check if there are function calls in any part
            function_calls = []
            text_parts = []

            for part in response_content.parts:
                if hasattr(part, 'function_call') and part.function_call:
                    function_calls.append(part.function_call)
                elif hasattr(part, 'text') and part.text:
                    text_parts.append(part.text)

            if not function_calls:
                # No function calls — return the text response
                final_text = ' '.join(text_parts) if text_parts else response.text
                return jsonify({'response': final_text}), 200

            # Append the model's response (with function calls) to contents
            contents.append(response_content)

            # Execute each function call and collect results
            function_response_parts = []
            for fc in function_calls:
                fn_name = fc.name
                fn_args = dict(fc.args) if fc.args else {}

                fn_result = execute_function(fn_name, fn_args)

                function_response_parts.append(
                    types.Part.from_function_response(
                        name=fn_name,
                        response={"result": fn_result}
                    )
                )

            # Append function results back to contents
            contents.append(
                types.Content(
                    role='user',
                    parts=function_response_parts
                )
            )

        # If we exhausted iterations, return whatever text we have
        return jsonify({'response': 'I encountered an issue processing your request. Please try again.'}), 200

    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'error': f'Chat service error: {str(e)}'}), 500
