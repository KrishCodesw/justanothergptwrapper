# GetSQL: Natural Language to SQL Platform

**Turn plain English into complex SQL queries instantly.**
NLP2SQL is a robust, full-stack application designed to bridge the gap between human thought and database logic. It uses advanced LLMs (Google Gemini) to understand your specific database schema and generate accurate, optimized SQL queries.

![Project Banner](https://github.com/KrishCodesw/justanothergptwrapper/blob/main/banner.png)



---

##  System Architecture

The application follows a modern, containerized microservices architecture. It separates the AI processing engine (Python) from the application logic (Node.js), using a shared PostgreSQL database for persistence.

![System Architecture Diagram](https://github.com/KrishCodesw/justanothergptwrapper/blob/main/sd.png)


### **Flow Overview:**
1.  **Frontend (Next.js):** Manages UI state, user authentication, and optimistic updates.
2.  **AI Engine (FastAPI):** Receives the prompt + schema, handles rate limiting , and communicates with Google Gemini.
3.  **Data Layer (PostgreSQL):** Stores user history, saved queries, and user profiles via Prisma ORM.
4.  **Sync Engine:** A dedicated logic flow that detects when a Guest user logs in and automatically pushes their local history to the persistent database.

---

## Key Features

* **Schema-Aware Generation:** Paste your `CREATE TABLE` scripts, and the AI generates SQL specifically for your database structure.
* **Hybrid "Guest" & "Pro" Modes:**
    * **Guest:** No login required. History saved to LocalStorage. Limited to 2 queries.
    * **Pro:** Persistent database storage, unlimited queries, and cross-device history synchronization.
* **Smart Synchronization:** Seamlessly migrates your guest queries to your account immediately upon sign-up/login.
* **Resilient AI Layer:** Built to handle API rate limits gracefully without crashing.
* **Premium UI/UX:** A minimalist, "Pro Workspace" aesthetic with distraction-free inputs and syntax highlighting.

---

## 🛠 Tech Stack

### **Frontend**
* **Framework:** Next.js 14+ (App Router)
* **Auth:** Email Password + Google Signin 
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Icons:** Lucide React

### **Backend & AI**
* **API Framework:** FastAPI (Python)
* **AI Model:** Google Gemini 2.5 Flash
* **Orchestration:** Uvicorn

### **Database & DevOps**
* **Database:** PostgreSQL
* **ORM:** Prisma


---

##  Getting Started

### **1. Clone the Repository**
```bash
git clone [https://github.com/KrishCodesw/justanothergptwrapper.git](https://github.com/KrishCodesw/justanothergptwrapper.git)
cd justanothergptwrapper

cd frontend 
npm ci 
```

2. Environment Setup
Create a .env file in the root directory:

Code snippet

# .env file
```bash
# Database (Neon.tech URL)
DATABASE_URL="postgresql://user:password@db:5432/slang_db" 

# AI Configuration
GEMINI_API_KEY="your_actual_google_api_key_here"

# Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

```bash
npx prisma generate
npm run dev
```
3. Backend setup
```bash
cd ..
cd venv 
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```
