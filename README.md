# ◆ InterviewReady AI

> **AI-driven resume appraisal, gap analysis, and personalized interview readiness roadmap.**

---

## 🌟 Overview

**InterviewReady AI** is an intelligent web application designed to help job seekers prepare thoroughly for technical and behavioral interviews. By analyzing your resume against a target job description and your personal self-description, InterviewReady AI generates:

- 📊 **Overall Match Score**: A fit score with compatibility tiers (Strong Fit, Good Fit, Moderate Fit, Needs Work).
- 💡 **Technical Question Bank**: Targeted technical interview questions with interviewer intentions and recommended answer strategies.
- 💬 **Behavioral Assessment**: Role-specific behavioral and situational questions with tailored responses.
- ⚠️ **Skill Gap Analysis**: Identification of lacking skills categorized by severity (*High*, *Medium*, *Low*).
- 📅 **Day-by-Day Preparation Plan**: A step-by-step preparation plan with focused daily goals and actionable tasks.
- 📜 **Historical Report Dashboard**: Instant access to your previously generated reports.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Routing**: [React Router v8](https://reactrouter.com/)
- **Styling**: Vanilla CSS with custom design tokens, dark theme, glassmorphism, and responsive layouts
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Typography**: [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (CommonJS)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/)
- **Authentication**: JWT stored in secure `HttpOnly` cookies + MongoDB Token Blacklist for logout
- **File Upload**: [Multer](https://github.com/expressjs/multer) (In-memory storage)
- **PDF Extraction**: [pdf-parse](https://www.npmjs.com/package/pdf-parse)

### Artificial Intelligence
- **SDK**: [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Models**: Multi-tier fallback chain (`gemini-3.6-flash` → `gemini-3.5-flash-lite` → `gemini-3-flash-preview`)
- **Schema**: Native JSON Schema validation for structured, deterministic output

---

## 📁 Project Structure

```
InterviewReady-AI/
├── .gitignore
├── README.md
│
├── Backend/
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   ├── server.js                 # Server entry point & DB connection
│   └── src/
│       ├── app.js                # Express app configuration & middleware
│       ├── config/
│       │   └── database.js       # MongoDB connection logic
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── interview.controller.js
│       ├── middlewares/
│       │   ├── auth.middleware.js # JWT authentication & blacklist verification
│       │   └── file.middleware.js # Multer PDF upload configuration (5MB limit)
│       ├── models/
│       │   ├── blacklist.model.js
│       │   ├── interviewReport.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── interview.routes.js
│       └── services/
│           └── ai.service.js     # Gemini AI prompt orchestration & fallback logic
│
└── Frontend/
    ├── .env.example              # Frontend environment variables template
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   └── interviewready_ai_logo.png
    └── src/
        ├── App.jsx               # Context providers & routing
        ├── app.routes.jsx        # Route definitions
        ├── index.css             # Design tokens & global styling
        ├── main.jsx              # React DOM mounting
        └── features/
            ├── auth/
            │   ├── auth.context.jsx
            │   ├── auth.form.css
            │   ├── components/Protected.jsx
            │   ├── hooks/useAuth.js
            │   ├── pages/Login.jsx
            │   ├── pages/Register.jsx
            │   └── services/auth.api.js
            ├── interview/
            │   ├── interview.context.jsx
            │   ├── hooks/useInterview.js
            │   ├── pages/Home.jsx
            │   ├── pages/Interview.jsx
            │   ├── services/interview.api.js
            │   └── style/
            │       ├── home.css
            │       └── interview.css
            └── style/
                ├── Navbar.jsx
                ├── button.css
                └── navbar.css
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection URI)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

---

### 1. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Or create `.env` manually in `Backend/`:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   CLIENT_ORIGIN=http://localhost:5173
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:3000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional, defaults to port 5173 and backend at port 3000) by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Or create `.env` in `Frontend/`:
   ```env
   PORT=5173
   VITE_PORT=5173
   VITE_API_URL=http://localhost:3000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & set `HttpOnly` JWT cookie |
| `GET` | `/api/auth/logout` | Public | Clear JWT cookie & blacklist token in DB |
| `GET` | `/api/auth/get-me` | Private | Fetch details of the authenticated user |

### Interview Reports (`/api/interview`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interview/` | Private | Generate report from PDF resume, self description & JD (`multipart/form-data`) |
| `GET` | `/api/interview/` | Private | Fetch all previous interview reports of the logged-in user |
| `GET` | `/api/interview/report/:interviewID` | Private | Fetch full interview report details by Report ID |

---

## 🔒 Security Features

- **HttpOnly Cookies**: JWT tokens are transmitted via `HttpOnly`, `sameSite: "lax"` cookies to guard against Cross-Site Scripting (XSS).
- **Token Blacklisting**: Revoked tokens on logout are added to a MongoDB TTL index (auto-expiring after 24 hours).
- **File Validation**: File uploads are restricted to PDF documents under 5MB and parsed safely in memory without storing raw files on disk.
- **Password Hashing**: Passwords are encrypted using `bcryptjs` with salt rounds before database persistence.
