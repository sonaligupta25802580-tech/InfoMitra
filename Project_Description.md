# Project Description — InfoMitra

## 1. Introduction

InfoMitra is a full-stack web application that I have built as my semester project. The name "InfoMitra" comes from two words — "Info" meaning information, and "Mitra" which means friend in Hindi. So basically, InfoMitra is like an information friend for Indian citizens.

The main idea of this project is very simple — there are so many government schemes in India like PM-Kisan, Ayushman Bharat, scholarships for SC/ST students, housing schemes, pension schemes, and many more. But most common people, especially in rural areas, do not know about these schemes. Even if they know, they don't understand who is eligible, what documents are needed, or how to apply.

So I built InfoMitra to solve this problem. It is a website where a user can create an account, fill in their personal details, and the system will automatically show them which government schemes they are eligible for. There is also an AI-powered chatbot that can answer questions about schemes in simple language.

---

## 2. What the Project Does (Features)

### 2.1 User Registration and Login
- User can sign up using their phone number and password
- Login is done using JWT (JSON Web Token) — this is a secure way to keep the user logged in
- Passwords are stored in encrypted form using bcrypt (so even if database is hacked, passwords are safe)

### 2.2 Profile Onboarding
- After login, user fills in their profile details:
  - Name, Age, Gender
  - State (which state they live in)
  - Category (General, OBC, SC, ST)
  - Whether they are a student or not
  - Education level (10th, 12th, Graduate, etc.)
  - Whether they have any disability
  - Area type (Urban or Rural)
- This profile information is used to check eligibility for schemes

### 2.3 Eligibility-Based Scheme Filtering
- This is the most important feature of our project
- Once the user fills their profile, the system checks all schemes in the database and finds which ones the user qualifies for
- The eligibility checking uses a **fuzzy matching algorithm** — this means even if there is a small spelling difference (like "Maharashtra" vs "Maharastra"), the system can still match it correctly
- The algorithm checks: age range, state, category (SC/ST/OBC/General), student status, education level, disability status

### 2.4 Browse All Schemes
- User can also browse all available schemes without eligibility filter
- Schemes are shown as cards with name, category, and brief description
- Clicking on a scheme shows full details: eligibility, benefits, required documents, how to apply, and official link

### 2.5 Multilingual Support
- The entire application supports **3 languages: English, Hindi, and Marathi**
- User can switch language from the top of the page
- Scheme information (name, eligibility, benefits, documents, apply process) is stored in all 3 languages in the database
- We used the `react-i18next` library for this

### 2.6 AI Chatbot (InfoMitra Assistant)
- There is a floating chatbot button on the bottom-right corner of every page
- User can click it and ask questions like:
  - "Show me all schemes"
  - "What schemes are available for SC students?"
  - "I am 25 years old, female, from Maharashtra — what schemes can I get?"
  - "Tell me about education schemes"
- The chatbot uses an **LLM (Large Language Model) API** to understand the question and give a proper answer
- **Why LLM?** — Because LLMs can understand natural language questions in a very intelligent way. They can understand context, handle different ways of asking the same question, and give human-like responses.
- **Why not a very big LLM?** — Large language models like GPT-4 are very powerful but they are also very heavy and expensive to run. For a student project like ours, running such heavy models on our own server is not practical. So we chose a **lightweight but capable LLM API** that is free for students and works very well for our use case without needing heavy computing resources.
- The chatbot uses **function calling** — this means the LLM can directly call our database functions to get real scheme data. So the chatbot never makes up fake information — it always fetches real data from our MongoDB database.

### 2.7 Admin Panel
- There is a separate admin panel for managing the application
- Admin can:
  - View all registered users
  - Delete user accounts
  - Add new government schemes
  - Edit existing scheme details
  - Delete schemes
  - Manage marquee banner (scrolling announcement on top of the page)
- Admin access is given based on phone number (configured in backend)

### 2.8 Progressive Web App (PWA)
- InfoMitra is also a PWA — this means users can install it on their phone or computer like a regular app
- It works offline to some extent (shows cached pages when there is no internet)
- This is very useful for rural users who may have slow or unstable internet

---

## 3. System Architecture

The project follows a standard **client-server architecture**:

```
┌─────────────────────────────────────────────────────┐
│                    USER'S BROWSER                    │
│                                                      │
│   React.js Frontend (Vite)                          │
│   - Pages: Home, Login, Dashboard, Schemes, etc.    │
│   - Components: Chatbot, Navbar, Language Toggle    │
│   - Tailwind CSS for styling                        │
│   - react-i18next for multilingual                  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP Requests (Axios)
                       │ (REST API calls)
┌──────────────────────▼──────────────────────────────┐
│                  PYTHON FLASK BACKEND                │
│                                                      │
│   Routes / Blueprints:                              │
│   - /auth    → Login, Signup, Profile               │
│   - /schemes → List, Detail, Eligible               │
│   - /chat    → AI Chatbot messages                  │
│   - /admin   → Admin CRUD operations                │
│                                                      │
│   Services:                                         │
│   - JWT Authentication                              │
│   - Eligibility Engine (fuzzy matching)             │
│   - LLM API integration (function calling)          │
└──────────┬───────────────────────┬──────────────────┘
           │                       │
┌──────────▼──────────┐  ┌────────▼────────────────┐
│      MONGODB        │  │    LLM API (External)    │
│                     │  │                          │
│  Collections:       │  │  - Understands natural   │
│  - users            │  │    language questions    │
│  - schemes          │  │  - Calls our DB functions│
│  - site_settings    │  │  - Returns answers       │
└─────────────────────┘  └──────────────────────────┘
```

---

## 4. Database Design

We used **MongoDB** (a NoSQL database) for storing data. MongoDB stores data in JSON-like format which is very flexible and easy to work with in Python.

### Collections:

**users** — stores user account and profile information
```json
{
  "phone": "9876543210",
  "password_hash": "...(encrypted)...",
  "role": "user",
  "profile": {
    "name": "Sonali",
    "age": 22,
    "gender": "female",
    "state": "Maharashtra",
    "category": "SC",
    "student": "yes",
    "education": "Graduate",
    "disability": "no"
  }
}
```

**schemes** — stores all government scheme information in 3 languages
```json
{
  "scheme_name": { "en": "PM Kisan", "hi": "पीएम किसान", "mr": "पीएम किसान" },
  "category": "Agriculture",
  "eligibility": { "en": "...", "hi": "...", "mr": "..." },
  "benefits": { "en": "...", "hi": "...", "mr": "..." },
  "min_age": 18,
  "max_age": null,
  "eligible_categories": [],
  "states": [],
  "tags": ["farmer", "agriculture"]
}
```

**site_settings** — stores marquee banner settings for admin

---

## 5. Eligibility Algorithm

The eligibility checking is done in `eligibility.py`. It uses a **fuzzy string matching** technique using Python's `SequenceMatcher` from the `difflib` library.

**How it works:**
1. Take the user's profile (age, state, category, etc.)
2. For each scheme in the database, check:
   - Is user's age within the scheme's min_age and max_age?
   - Does user's state match the scheme's allowed states?
   - Does user's category (SC/ST/OBC/General) match?
   - Is user a student (if scheme requires it)?
   - Does user's education level match?
   - Does user have disability (if scheme requires it)?
3. If all conditions pass → user is eligible
4. Fuzzy matching is used so small spelling differences don't cause problems
5. Tags are also used for additional matching (e.g., if scheme has tag "women" and user is female)

---

## 6. Technologies Used and Why

| Technology | Why We Chose It |
|-----------|----------------|
| **React.js** | Modern, fast, component-based UI. Easy to build interactive pages. Large community support. |
| **Python Flask** | Lightweight and simple backend framework. Very good for building REST APIs. Easy to integrate with AI/ML libraries. |
| **MongoDB** | NoSQL database, stores data in JSON format. Very flexible — easy to add new fields without changing schema. Good for multilingual data. |
| **JWT (JSON Web Token)** | Secure way to handle user authentication without storing session on server. |
| **bcrypt** | Industry standard for password hashing. Keeps user passwords safe. |
| **Tailwind CSS** | Utility-first CSS framework. Makes styling fast and consistent. |
| **react-i18next** | Best library for multilingual support in React. Easy to add new languages. |
| **LLM API** | For the chatbot — understands natural language, gives intelligent responses, supports function calling to fetch real data. |
| **Vite** | Fast build tool for React. Much faster than Create React App. |

---

## 7. Sample Schemes in the System

The database is pre-loaded with 10 government schemes:

| Scheme Name | Category |
|------------|---------|
| Post Matric Scholarship for SC Students | Education |
| Pradhan Mantri Kisan Samman Nidhi (PM-Kisan) | Agriculture |
| NHFDC Loan for Persons with Disability | Disability |
| Beti Bachao Beti Padhao | Women Empowerment |
| Pradhan Mantri Awas Yojana - Urban | Housing |
| National Means cum Merit Scholarship | Education |
| Atal Pension Yojana | Pension |
| Rajiv Gandhi National Fellowship for SC Students | Education |
| Pradhan Mantri Matru Vandana Yojana | Women and Child |
| Stand Up India Scheme | Entrepreneurship |

---

## 8. User Flow

**For a Regular User:**
1. Open the website → See the Home page with information about InfoMitra
2. Click "Sign Up" → Enter phone number and password
3. After login → Fill in profile details (onboarding page)
4. Go to Dashboard → Choose "Eligible Schemes" or "All Schemes"
5. See scheme cards → Click any scheme to see full details
6. Use the chatbot (bottom-right button) to ask questions anytime
7. Can edit profile anytime from the Edit Profile page

**For an Admin:**
1. Login with admin phone number
2. Dashboard shows "Admin Panel" button
3. Can view statistics (total users, total schemes)
4. Can add/edit/delete schemes with multilingual content
5. Can view and delete user accounts
6. Can update the marquee banner message

---