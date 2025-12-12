# GetSQL: Natural Language to SQL Platform

**Turn plain English into complex SQL queries instantly.**
NLP2SQL is a robust, full-stack application designed to bridge the gap between human thought and database logic. It uses advanced LLMs (Google Gemini) to understand your specific database schema and generate accurate, optimized SQL queries.

![Project Banner](https://via.placeholder.com/1200x300?text=NLP2SQL+Dashboard+Preview)
*(Note: Replace the link above with a screenshot of your actual dashboard)*

---

## 🏗 System Architecture

The application follows a modern, containerized microservices architecture. It separates the AI processing engine (Python) from the application logic (Node.js), using a shared PostgreSQL database for persistence.

![System Architecture Diagram](./assets/architecture_diagram.png)
*(Note: Place your Mermaid diagram screenshot or exported image here)*

### **Flow Overview:**
1.  **Frontend (Next.js):** Manages UI state, user authentication, and optimistic updates.
2.  **AI Engine (FastAPI):** Receives the prompt + schema, handles rate limiting (exponential backoff), and communicates with Google Gemini.
3.  **Data Layer (PostgreSQL):** Stores user history, saved queries, and user profiles via Prisma ORM.
4.  **Sync Engine:** A dedicated logic flow that detects when a Guest user logs in and automatically pushes their local history to the persistent database.

---

## ✨ Key Features

* **Schema-Aware Generation:** Paste your `CREATE TABLE` scripts, and the AI generates SQL specifically for your database structure.
* **Hybrid "Guest" & "Pro" Modes:**
    * **Guest:** No login required. History saved to LocalStorage. Limited to 2 queries.
    * **Pro:** Persistent database storage, unlimited queries, and cross-device history synchronization.
* **Smart Synchronization:** Seamlessly migrates your guest queries to your account immediately upon sign-up/login.
* **Resilient AI Layer:** Built-in exponential backoff to handle API rate limits gracefully without crashing.
* **Premium UI/UX:** A minimalist, "Pro Workspace" aesthetic with distraction-free inputs and syntax highlighting.

---

## 🛠 Tech Stack

### **Frontend**
* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS, Framer Motion
* **State Management:** Zustand
* **Icons:** Lucide React

### **Backend & AI**
* **API Framework:** FastAPI (Python)
* **AI Model:** Google Gemini 1.5 Flash
* **Orchestration:** Uvicorn

### **Database & DevOps**
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Containerization:** Docker & Docker Compose

---

## 🚀 Getting Started

The easiest way to run the entire stack is using **Docker Compose**.

### **Prerequisites**
* Docker & Docker Compose installed.
* A Google Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/)).

### **1. Clone the Repository**
```bash
git clone [https://github.com/yourusername/nlp2sql.git](https://github.com/yourusername/nlp2sql.git)
cd nlp2sql