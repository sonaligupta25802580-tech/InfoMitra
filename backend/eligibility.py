from difflib import SequenceMatcher

def fuzzy_match(str1, str2, threshold=0.75):
    """
    Compare two strings and return True if similarity is above threshold.
    Uses SequenceMatcher for fuzzy string matching.
    
    Args:
        str1: First string to compare
        str2: Second string to compare
        threshold: Similarity threshold (0.0 to 1.0), default 0.75
    
    Returns:
        bool: True if strings are similar enough
    """
    if not str1 or not str2:
        return False
    
    # Convert to lowercase for case-insensitive comparison
    str1_lower = str(str1).lower().strip()
    str2_lower = str(str2).lower().strip()
    
    # Exact match
    if str1_lower == str2_lower:
        return True
    
    # Check if one string contains the other (only for short strings or very similar lengths)
    # This prevents "Graduate" from matching "Post-Graduate"
    len_diff = abs(len(str1_lower) - len(str2_lower))
    if len_diff <= 3:  # Allow small length differences for substring matching
        if str1_lower in str2_lower or str2_lower in str1_lower:
            return True
    
    # Calculate similarity ratio
    similarity = SequenceMatcher(None, str1_lower, str2_lower).ratio()
    return similarity >= threshold


def check_tags_match(user_profile, scheme_tags):
    """
    Check if scheme tags match user profile attributes.
    This enables intelligent matching based on tags like 'scholarship', 'SC', 'women', etc.
    
    Args:
        user_profile: Dictionary containing user profile information
        scheme_tags: List of tags associated with the scheme
    
    Returns:
        bool: True if any tags match user profile
    """
    if not scheme_tags:
        return True  # No tags means no tag-based filtering
    
    # Extract user attributes for matching
    user_attributes = []
    
    # Add category
    if user_profile.get('category'):
        user_attributes.append(user_profile['category'].lower())
    
    # Add education level
    if user_profile.get('education'):
        user_attributes.append(user_profile['education'].lower())
        # Add related terms
        education = user_profile['education'].lower()
        if 'graduate' in education or 'post-graduate' in education:
            user_attributes.extend(['student', 'education', 'higher education'])
        elif '10th' in education or '12th' in education:
            user_attributes.extend(['student', 'education', 'school'])
    
    # Add student status
    if user_profile.get('student') == 'yes':
        user_attributes.extend(['student', 'education'])
    
    # Add disability status
    if user_profile.get('disability') == 'yes':
        user_attributes.extend(['disability', 'disabled', 'handicapped', 'pwd'])
    
    # Add gender-related terms
    gender = user_profile.get('gender', '').lower()
    if gender == 'female':
        user_attributes.extend(['women', 'woman', 'girl', 'female'])
    elif gender == 'male':
        user_attributes.extend(['men', 'man', 'boy', 'male'])
    
    # Add area type
    if user_profile.get('area'):
        user_attributes.append(user_profile['area'].lower())
    
    # Add age-related terms
    age = user_profile.get('age')
    if age:
        try:
            age = int(age)
        except (ValueError, TypeError):
            age = None
    if age:
        if age < 18:
            user_attributes.extend(['child', 'minor', 'youth'])
        elif age >= 60:
            user_attributes.extend(['senior', 'elderly', 'pension'])
        elif 18 <= age <= 35:
            user_attributes.extend(['youth', 'young'])
    
    # Check if any scheme tag matches user attributes (with fuzzy matching)
    for tag in scheme_tags:
        tag_lower = str(tag).lower().strip()
        for attr in user_attributes:
            if fuzzy_match(tag_lower, attr, threshold=0.7):
                return True
            # Also check if tag contains attribute or vice versa
            if tag_lower in attr or attr in tag_lower:
                return True
    
    return False


def check_eligibility(user_profile, scheme):
    """
    Enhanced eligibility check with tag matching and fuzzy string matching.
    
    Args:
        user_profile: Dictionary containing user profile information
        scheme: Dictionary containing scheme information
    
    Returns:
        tuple: (is_eligible: bool, reason: str)
    """
    reasons = []
    
    if not user_profile:
        return False, "Profile not completed"
    
    # Check age requirements (strict check)
    age = user_profile.get('age')
    if age:
        try:
            age = int(age)
        except ValueError:
            return False, "Invalid age"
        min_age = scheme.get('min_age')
        max_age = scheme.get('max_age')

        if min_age and age < min_age:
            reasons.append(f"Minimum age required: {min_age}")

        if max_age and age > max_age:
            reasons.append(f"Maximum age allowed: {max_age}")

    
    # Check state requirements (with fuzzy matching)
    user_state = user_profile.get('state')
    scheme_states = scheme.get('states', [])
    if scheme_states and user_state:
        # Use fuzzy matching for state names
        state_match = False
        for scheme_state in scheme_states:
            if fuzzy_match(user_state, scheme_state, threshold=0.8):
                state_match = True
                break
        
        if not state_match:
            reasons.append(f"Not available in {user_state}")
    
    # Check category requirements (with fuzzy matching)
    user_category = user_profile.get('category')
    eligible_categories = scheme.get('eligible_categories', [])
    if eligible_categories and user_category:
        # Use fuzzy matching for categories
        category_match = False
        for eligible_cat in eligible_categories:
            if fuzzy_match(user_category, eligible_cat, threshold=0.85):
                category_match = True
                break
        
        if not category_match:
            reasons.append(f"Category {user_category} not eligible")
    
    # Check disability requirements
    disability_supported = scheme.get('disability_supported', [])
    user_disability = user_profile.get('disability')
    if disability_supported:
        if user_disability != 'yes':
            reasons.append("Requires disability")
        else:
            user_disability_type = user_profile.get('disabilityPercent')
            if user_disability_type and disability_supported:
                pass  # Could add more specific disability type checking here
    
    # Check student requirements (strict check)
    student_required = scheme.get('student_required')
    user_student = user_profile.get('student')
    if student_required is True:
        if user_student != 'yes':
            reasons.append("Only for students")
    elif student_required is False:
        if user_student == 'yes':
            reasons.append("Not for students")
    
    # Check education requirements (with fuzzy matching)
    education_required = scheme.get('education_required', [])
    user_education = user_profile.get('education')
    if education_required and user_education:
        # Use fuzzy matching for education levels
        education_match = False
        for required_edu in education_required:
            if fuzzy_match(user_education, required_edu, threshold=0.8):
                education_match = True
                break
        
        if not education_match:
            reasons.append(f"Education level {user_education} not eligible")
    
    # If there are blocking reasons, check if tags can override
    # Tags provide additional context that might make user eligible
    scheme_tags = scheme.get('tags', [])
    tags_match = check_tags_match(user_profile, scheme_tags)
    
    # If strict criteria failed but tags match, reduce the strictness
    if reasons and tags_match:
        # Filter out non-critical reasons if tags match
        critical_reasons = []
        for reason in reasons:
            # Keep only age-related and student requirement reasons as critical
            if 'age' in reason.lower() or 'only for students' in reason.lower():
                critical_reasons.append(reason)
        
        # If only non-critical reasons remain and tags match, consider eligible
        if not critical_reasons:
            return True, "Eligible based on profile and scheme tags"
        else:
            reasons = critical_reasons
    
    if reasons:
        return False, "; ".join(reasons)
    
    return True, "Eligible"
