# InfoMitra 🇮🇳
### Multilingual Chatbot for Government Scheme Awareness

## What is InfoMitra?

InfoMitra means "Information Friend" in Hindi. It is a web application that helps Indian citizens — especially people from rural areas — to find out which government schemes they are eligible for. Many people in India do not know about schemes like PM-Kisan, Ayushman Bharat, or scholarship programs. Our project tries to solve this problem by giving them a simple, easy-to-use platform with chatbot support.

The chatbot can understand questions in **English, Hindi, and Marathi** and gives answers about government schemes in a simple way.

---

## Main Features

- 🔐 **User Login / Signup** — using phone number and password
- 📋 **Profile Setup** — user fills in details like age, state, category, education, etc.
- ✅ **Eligibility Check** — system automatically finds schemes the user qualifies for
- 🗂️ **Browse All Schemes** — see all available government schemes
- 🤖 **AI Chatbot** — ask questions about schemes in simple language
- 🌐 **Multilingual** — English, Hindi, Marathi support
- 👨‍💼 **Admin Panel** — admin can add, edit, delete schemes and manage users
- 📱 **PWA Support** — can be installed on mobile like an app

---

## Tech Stack

| Part | Technology Used |
|------|----------------|
| Frontend | React.js (Vite), Tailwind CSS, react-i18next |
| Backend | Python Flask, Flask-JWT-Extended |
| Database | MongoDB (via PyMongo) |
| AI Chatbot | LLM API (lightweight, free for students) |
| Auth | JWT Tokens + bcrypt password hashing |
| PWA | Vite PWA Plugin, Service Worker |

---

## Project Structure

```
InfoMitra/
├── backend/
│   ├── app.py           → Main Flask server
│   ├── auth.py          → Login, Signup, Profile routes
│   ├── schemes.py       → Scheme listing and detail routes
│   ├── eligibility.py   → Logic to check if user is eligible
│   ├── chat.py          → AI Chatbot logic
│   ├── admin.py         → Admin panel routes
│   ├── models.py        → MongoDB database functions
│   ├── config.py        → Environment config
│   ├── seed.py          → Script to add sample data
│   └── requirements.txt → Python packages needed
│
├── frontend/
│   ├── src/
│   │   ├── pages/       → All page components (Home, Login, Dashboard, etc.)
│   │   ├── components/  → Reusable components (Chatbot, Navbar, etc.)
│   │   ├── context/     → Auth context (login state management)
│   │   ├── App.jsx      → Main app with routing
│   │   └── i18n.js      → Multilingual configuration
│   ├── public/          → Icons, images, PWA assets
│   └── package.json     → Node packages
│
└── README.md
```

---

## Quick Start

Please see **[How_to_Run.md](./How_to_Run.md)** for full step-by-step instructions.

**Short version:**
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
python seed.py
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Demo Login Credentials

| Type | Phone | Password |
|------|-------|----------|
| Regular User | 9876543210 | demo123 |
| Admin User | 9876543210 | demo123 |

> Note: Same user has admin access. Admin panel button appears on dashboard.

---

## API Endpoints (Short Summary)

| Route | Method | What it does |
|-------|--------|-------------|
| `/auth/signup` | POST | Create new account |
| `/auth/login` | POST | Login |
| `/auth/profile` | GET/PUT | View or update profile |
| `/schemes/` | GET | Get all schemes |
| `/schemes/eligible` | GET | Get schemes user is eligible for |
| `/chat/message` | POST | Send message to AI chatbot |
| `/admin/schemes` | GET/POST | Admin: manage schemes |
| `/admin/users` | GET | Admin: view all users |

---

## Documents

- 📄 [Project Description](./Project_Description.md)
- ❓ [Problem Statement](./Problem_Statement.md)
- 🚀 [How to Run](./How_to_Run.md)
- ✅ [Pros and Cons](./Pros_Cons.md)
- 🔮 [Future Implementation](./Future_Implementation.md)

---
