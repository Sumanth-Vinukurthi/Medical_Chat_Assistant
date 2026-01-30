
# 🏥 Medical Chat Assistant
---

* **Right click on README.md file and select open Preview for better readability.**

---
Medical Chat Assistant is an AI-powered Retrieval-Augmented Generation (RAG) web application that allows users to ask medical questions and receive responses grounded in uploaded medical documents.

The system supports:

* Secure user registration & login
* Role-based access (Admin / User)
* Medical document upload (Admin only)
* Vector search over document embeddings
* LLM-powered conversational answering
* React frontend + FastAPI backend

This project is designed as a scalable foundation for medical knowledge assistants, internal hospital knowledge bases, and clinical document search systems.

---

## 🧠 Architecture Overview

Frontend (React) **→**  FastAPI Backend **→** Vector Database (Embeddings Search) **→** LLM Agent (RAG pipeline, LangChain)

Users ask questions → system retrieves relevant chunks → LLM summarizes and answers.

---

## 🚀 Available APIs

### 1. Registration API

```
POST /register
```

Registers a new user with role support.

Request body:

```
{
  "username": "...",
  "password": "...",
  "role": "user/admin"
}
```

---

### 2. Login API

```
POST /login
```

Validates user credentials and returns role.

Used for frontend session control and role-based UI rendering.

---

### 3. Master Chat API (Conversation)

```
POST /chat
```

Receives a user query → retrieves relevant document chunks → LLM answers using RAG pipeline.

Request:

```
{
  "query": "What is paracetamol used for?"
}
```

---

### 4. File Upload API

```
POST /chat/file
```

Admin-only endpoint to upload documents.

Accepts:

* title (string)
* file (optional UploadFile)

Documents are chunked, embedded, and stored for future retrieval.
As of now only **.txt** files can be uploaded, try with **"medical_document.txt"** file attatched in Backend folder.

---
## 🗄 Database Requirements

### PostgreSQL Setup

* PostgreSQL **17.7-2 (recommended) or above**
* pgAdmin (comes bundled with PostgreSQL)

Install PostgreSQL normally and ensure pgAdmin is available.

---

### pgvector Extension

This project uses PostgreSQL as a vector database via **pgvector**.

Follow Github installation guide:

👉 [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)

After installation, enable pgvector inside PostgreSQL:

```sql
CREATE EXTENSION vector;
```

---

### Database Creation

Create database:

```
Name: medical_assistant
Password: root
```

You can create it using pgAdmin or SQL:

```sql
CREATE DATABASE medical_assistant;
```

Make sure backend connection string matches this database in **database.py** file Backend.

---



## ⚙️ Backend Setup

### Requirements

* Python **3.12.x or above**

### Steps

```
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

If using an external LLM provider:

Create `.env` file:

```
api_key=your_api_key_here
```

Then start server:

```
uvicorn main:app --reload --port 7000
```

Backend runs on:

```
http://127.0.0.1:7000
```

---

## 🎨 Frontend Setup

### Requirements

* Node.js **24.x or above**

### Steps

```
cd Frontend/app
npm install
npm install react-router-dom formik yup axios
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔐 Role System

* **Admin** → can upload medical documents
* **User** → chat access only

Frontend hides admin features automatically based on role returned from login API.

---

## 📦 Features

✔ Retrieval-Augmented Generation (RAG)
✔ Document embedding search
✔ Role-based UI rendering
✔ File upload system
✔ FastAPI backend
✔ React modern UI
✔ Admin-only controls
✔ Medical knowledge assistant workflow

---

## 🧪 Example Flow

1. Admin registers
2. Admin uploads medical documents
3. Users login
4. Users ask questions
5. System retrieves relevant knowledge
6. LLM summarizes and answers

---

## ⚠️ Disclaimer

This system is an informational assistant.
It does **not** replace licensed medical professionals.

---

---