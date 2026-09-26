# AI Prep — AI Interview Intelligence Platform

AI Prep is an AI-powered interview preparation platform that analyzes a candidate's resume against a target job description and generates a personalized interview preparation report.

The project was refactored from separate frontend and backend repositories into a **single-repository modular monolith** with a React frontend and Node.js/Express backend.

The focus is on building a maintainable and production-oriented application rather than simply adding features.

---

## ✨ Key Capabilities

- Resume PDF upload and text extraction
- Resume and job-description analysis
- AI-generated interview preparation reports
- Technical and behavioral interview questions
- Candidate skill-gap identification
- Personalized preparation plan
- RAG-based contextual generation
- Structured AI responses with schema validation
- Interview report persistence
- Response caching
- Authentication and protected APIs
- Centralized error handling
- Request IDs and structured logging
- Rate limiting and security headers
- Environment-based configuration
- Graceful handling of optional Redis availability

---

## 🏗️ Architecture

AI Prep follows a **modular monolith architecture**.

```text
                    ┌─────────────────────┐
                    │     React + Vite     │
                    │      Frontend        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │     Modular API     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
          MongoDB           Redis            Gemini
       Persistent Data      Caching          LLM / AI
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                         RAG Pipeline
```

### Why a modular monolith?

The application is intentionally kept as a modular monolith instead of being split into microservices.

This provides:

- simpler deployment
- easier local development
- lower operational complexity
- clear module boundaries
- easier debugging
- a straightforward path to extracting services later if required

For the current scale of the application, a modular monolith provides a better balance between maintainability and complexity.

---

# 🤖 AI Analysis Pipeline

The interview analysis pipeline combines RAG with structured LLM generation.

```text
Resume PDF
    │
    ▼
PDF Text Extraction
    │
    ▼
Resume + Job Description
    │
    ▼
Cache Lookup ───────────────► Redis
    │
    │ Cache Miss
    ▼
RAG Retrieval
    │
    ▼
Relevant Knowledge Context
    │
    ▼
Prompt Construction
    │
    ▼
Gemini
    │
    ▼
Structured JSON Response
    │
    ▼
Zod Validation
    │
    ▼
MongoDB
    │
    ▼
API Response
```

### RAG

The system retrieves relevant knowledge from a curated interview-preparation knowledge base before generating the final response.

Instead of sending only the resume and job description to the LLM, the system provides additional relevant context.

This helps make the generated questions and preparation recommendations more grounded and consistent.

The RAG layer is intentionally kept small and modular so that the knowledge source can later be replaced by a larger vector database or ingestion pipeline without changing the interview service contract.

---

# 🧠 Structured AI Generation

LLM output is treated as **untrusted external data**.

The application uses Gemini structured generation together with Zod validation.

```text
Gemini
   │
   ▼
Structured JSON
   │
   ▼
Zod Schema Validation
   │
   ├── Valid ──────► Application
   │
   └── Invalid ────► Controlled Error
```

This prevents malformed AI responses from being persisted in the database.

The generated report contains:

- Match score
- Technical questions
- Behavioral questions
- Skill gaps
- Preparation plan
- Report title

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- JavaScript

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## AI

- Google Gemini
- RAG
- Embeddings
- Structured JSON generation
- Zod schema validation

## Infrastructure & Engineering

- Redis
- Docker Compose
- Helmet
- CORS
- Rate limiting
- Structured logging
- Request IDs
- Environment-based configuration

---

# 📁 Repository Structure

```text
ai-prep-platform/
│
├── apps/
│   ├── web/
│   │   └── # React + Vite frontend
│   │
│   └── api/
│       └── # Express API
│           ├── controllers/
│           ├── middleware/
│           ├── models/
│           ├── routes/
│           ├── services/
│           ├── rag/
│           ├── utils/
│           └── ...
│
├── packages/
│   └── shared/
│
├── docs/
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

- Node.js 20+
- npm
- MongoDB
- Google Gemini API key

Redis is optional for local development.

---

## 1. Clone the repository

```bash
git clone https://github.com/Varun-6390/ai-prep-platform.git
cd ai-prep-platform
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure the backend

Create:

```text
apps/api/.env
```

using:

```text
apps/api/.env.example
```

Configure the required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Optional Redis configuration:

```env
REDIS_URL=redis://localhost:6379
```

---

## 4. Start Redis (Optional)

If Docker is installed:

```bash
docker compose up -d redis
```

Redis is used for caching and RAG-related acceleration.

If Redis is unavailable, the application gracefully continues without Redis-based caching.

---

## 5. Configure the frontend

Create:

```text
apps/web/.env
```

using:

```text
apps/web/.env.example
```

Configure the backend API URL if required:

```env
VITE_API_URL=http://localhost:3000
```

---

## 6. Start the application

From the repository root:

```bash
npm run dev
```

The applications will be available at:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:3000

Health Check:
http://localhost:3000/health
```

---

# 🔐 Security & Reliability

The backend includes several production-oriented safeguards.

### Input Validation

API requests are validated before reaching application services.

Invalid requests return appropriate client errors instead of being treated as server failures.

### Authentication

Protected resources require valid JWT authentication.

### Rate Limiting

API rate limiting helps prevent excessive requests.

### Security Headers

Helmet is used to configure common HTTP security headers.

### CORS

Cross-origin requests are restricted through environment-based configuration.

### File Validation

Uploaded resume files are validated before processing.

PDFs are processed in memory without unnecessarily persisting uploaded files to disk.

### Error Handling

Application errors are handled through centralized error middleware.

Errors expose safe information to clients while detailed information can be logged internally.

### Request Tracing

Each request receives a request ID, making it easier to trace failures across the API.

Example:

```text
requestId: req_a84b6b0e976bb4d6
```

---

# ⚡ Caching Strategy

AI generation can be expensive and relatively slow.

The application therefore uses a cache-first approach:

```text
Request
   │
   ▼
Generate Cache Key
   │
   ▼
Redis
   │
   ├── HIT ──────► Return cached report
   │
   └── MISS
          │
          ▼
        RAG
          │
          ▼
       Gemini
          │
          ▼
       MongoDB
          │
          ▼
        Redis
          │
          ▼
       Response
```

This reduces unnecessary AI calls when the same analysis is requested repeatedly.

Redis is treated as an acceleration layer rather than a hard dependency.

---

# 📊 API Design

The backend follows a layered structure:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model / External Service
```

This keeps business logic out of route handlers and makes individual components easier to test and maintain.

---

# 🧪 Error Handling

The API uses structured application errors.

Example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data"
  }
}
```

Typical error categories include:

```text
400  Validation Error
401  Authentication Error
404  Resource Not Found
422  Processing Error
429  Rate Limit
502  AI Provider / AI Schema Error
503  External Service Unavailable
```

---

# 📚 RAG Knowledge Base

The current knowledge base is intentionally small and curated for the interview-preparation workflow.

The retrieval layer is isolated from the main interview-generation service.

This allows the system to evolve toward:

```text
Current:
Curated Knowledge Base
        ↓
Embedding / Retrieval
        ↓
Gemini

Future:
Document Ingestion
        ↓
Chunking
        ↓
Embedding
        ↓
Vector Database
        ↓
Semantic Retrieval
        ↓
Gemini
```

without requiring a redesign of the core interview-generation API.

---

# 🌱 Future Improvements

The current architecture intentionally avoids unnecessary complexity.

Potential future improvements include:

- Dedicated vector database
- Automated knowledge-base ingestion
- Background job processing
- Distributed caching
- AI evaluation/observability
- Automated test coverage
- CI/CD pipeline
- Containerized production deployment
- Horizontal API scaling

These are intentionally outside the current scope to keep the application simple and maintainable.

---

# 🎯 Engineering Philosophy

The project follows a few core principles:

**Simple before complex**

Use the simplest architecture that solves the current problem.

**AI output is untrusted**

Validate LLM responses before they reach the database.

**External dependencies should fail gracefully**

Redis and AI services should not cause uncontrolled application failures.

**Separate business logic from infrastructure**

Services contain business logic while controllers and routes handle HTTP concerns.

**Design for evolution**

The current modular monolith provides clear boundaries for future scaling without prematurely introducing microservices.

---

# 👨‍💻 Author

**Varun Sharma**

B.Tech — Computer Science & Engineering

Lucknow, India

- GitHub: https://github.com/Varun-6390
- LinkedIn: https://www.linkedin.com/

---

## License

This project is intended for educational, portfolio, and demonstration purposes.
