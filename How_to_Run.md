# How to Run InfoMitra — Step by Step Guide

## Before You Start — What You Need to Install

Please make sure the following software is already installed on your computer:

| Software | Version | Where to Download |
|---------|---------|------------------|
| Node.js | v16 or higher | https://nodejs.org |
| Python | 3.8 or higher | https://python.org |
| MongoDB | Latest | https://www.mongodb.com/try/download/community |
| Git | Any | https://git-scm.com |

> **Note:** If you are using MongoDB Atlas (cloud), you don't need to install MongoDB locally. Just get your connection string from Atlas.

---

## Step 1 — Get the Project Files

If you have the project as a ZIP file, just extract it. If you are cloning from GitHub:

```bash
git clone <repository-url>
cd InfoMitra
```

After this, your folder structure should look like:
```
InfoMitra/
├── backend/
├── frontend/
└── README.md
```

---

## Step 2 — Set Up the Environment File (Very Important!)

The backend needs some secret keys and database connection details. These are stored in a `.env` file.

Go inside the `backend` folder and create a new file called `.env`:

```bash
cd backend
```

Now create a file named `.env` and write the following inside it:

```
MONGO_URI=mongodb://localhost:27017/infomitra
JWT_SECRET=my-secret-key-change-this
PORT=5000
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your-llm-api-key-here
```

**Explanation of each line:**
- `MONGO_URI` — This is the address of your MongoDB database. If you are using local MongoDB, keep it as shown above. If you are using MongoDB Atlas, replace with your Atlas connection string.
- `JWT_SECRET` — This is a secret key used for user login tokens. You can write anything here, but keep it secret.
- `PORT` — The port number on which the backend server will run. 5000 is fine.
- `CORS_ORIGIN` — The address of your frontend. Keep it as `http://localhost:3000`.
- `GEMINI_API_KEY` — This is the API key for the AI chatbot. You need to get this from the LLM provider's website. If you don't have it, the chatbot will not work, but the rest of the app will work fine.

> **Important:** Never share your `.env` file with anyone. Never upload it to GitHub. The `.gitignore` file already makes sure it is not uploaded.

---

## Step 3 — Set Up the Backend (Python Flask)

Open a terminal and go to the backend folder:

```bash
cd backend
```

### 3.1 — Create a Virtual Environment

A virtual environment keeps all Python packages separate for this project. This is a good practice.

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

After activation, you will see `(venv)` at the start of your terminal line. This means the virtual environment is active.

### 3.2 — Install Python Packages

```bash
pip install -r requirements.txt
```

This will install all the required packages:
- Flask (web framework)
- Flask-CORS (for allowing frontend to connect)
- Flask-JWT-Extended (for login tokens)
- PyMongo (for MongoDB connection)
- python-dotenv (for reading .env file)
- bcrypt (for password encryption)
- google-genai (for AI chatbot)

Wait for all packages to install. It may take 1-2 minutes.

### 3.3 — Add Sample Data to Database (Seed)

This step will add 10 sample government schemes and 1 demo user to your MongoDB database:

```bash
python seed.py
```

You should see output like:
```
Starting seed process...
Seeded 10 schemes successfully
Created demo user with phone: 9876543210, password: demo123
Seed completed successfully!
```

### 3.4 — Start the Backend Server

```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

The backend is now running on **http://localhost:5000**

> Keep this terminal open. Do not close it.

---

## Step 4 — Set Up the Frontend (React)

Open a **new terminal window** (keep the backend terminal running) and go to the frontend folder:

```bash
cd frontend
```

### 4.1 — Install Node Packages

```bash
npm install
```

This will install all the required packages listed in `package.json`. It may take 2-3 minutes.

### 4.2 — Start the Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

The frontend is now running on **http://localhost:3000**

> Keep this terminal open too.

---

## Step 5 — Open the Application

Open your web browser and go to:

```
http://localhost:3000
```

You should see the InfoMitra home page! 🎉

---

## Step 6 — Login and Test

Use these demo credentials to test the application:

### Regular User Login:
- **Phone:** 9876543210
- **Password:** demo123

### Admin Login:
- **Phone:** 9876543210
- **Password:** demo123
- *(Same user — admin panel button appears on dashboard)*

---

## Testing the API Directly (Optional)

If you want to test the backend API directly using curl or Postman:

### Test if backend is running:
```bash
curl http://localhost:5000/
```
Expected response: `{"message": "InfoMitra API"}`

### Login:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\",\"password\":\"demo123\"}"
```

### Get all schemes:
```bash
curl http://localhost:5000/schemes/
```

### Get eligible schemes (need token from login):
```bash
curl http://localhost:5000/schemes/eligible \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Common Problems and Solutions

### Problem 1: `ModuleNotFoundError` when running `python app.py`
**Solution:** Make sure your virtual environment is activated. You should see `(venv)` in your terminal. If not, run:
```bash
venv\Scripts\activate    # Windows
source venv/bin/activate  # Mac/Linux
```

### Problem 2: `pymongo.errors.ServerSelectionTimeoutError`
**Solution:** MongoDB is not running. Start MongoDB service:
- **Windows:** Open Services → Find "MongoDB" → Start it
- Or run: `mongod` in a separate terminal

### Problem 3: Frontend shows "Network Error" or API not working
**Solution:** Make sure the backend is running on port 5000. Check your `.env` file has `CORS_ORIGIN=http://localhost:3000`.

### Problem 4: Chatbot not working
**Solution:** The chatbot needs a valid LLM API key in the `.env` file (`GEMINI_API_KEY`). Without it, the chatbot will show an error. All other features will still work normally.

### Problem 5: `npm install` fails
**Solution:** Make sure Node.js version is 16 or higher. Check with: `node --version`

### Problem 6: Port 3000 or 5000 already in use
**Solution:** Either close the other application using that port, or change the port in `.env` file and `vite.config.js`.

---

## Running in Production (Build Mode)

If you want to test the PWA (Progressive Web App) features, you need to build the frontend:

```bash
cd frontend
npm run build
npm run preview
```

This will run the built version on `http://localhost:4173`. In this mode, you can install the app on your phone/computer.

---

## Summary of All Commands

```bash
# ── BACKEND ──────────────────────────────────────
cd backend
python -m venv venv
venv\Scripts\activate          # Windows only
pip install -r requirements.txt
python seed.py                 # Only needed once
python app.py                  # Keep running

# ── FRONTEND (new terminal) ───────────────────────
cd frontend
npm install                    # Only needed once
npm run dev                    # Keep running

# ── OPEN BROWSER ─────────────────────────────────
# Go to: http://localhost:3000
```

---

*If you face any other problem, please check that all the steps above are done correctly, especially the `.env` file setup and MongoDB connection.*
