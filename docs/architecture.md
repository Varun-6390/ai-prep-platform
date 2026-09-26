# AI Prep Architecture

## Runtime flow

```text
React/Vite
   |
   v
Express API (modular monolith)
   |
   +--> Auth / validation / rate limiting / request tracing
   |
   +--> Interview Service
          |
          +--> Redis cache
          +--> Redis-backed RAG embeddings/context cache
          +--> Gemini LLM
          +--> MongoDB persistence
```

## AI request lifecycle

1. Authenticate the user.
2. Validate the multipart request and PDF type/size.
3. Extract resume text.
4. Build a deterministic cache key from resume + self description + job description.
5. Return a cached report when available.
6. Retrieve the most relevant interview knowledge chunks using Gemini embeddings with lexical fallback.
7. Inject retrieved context into the LLM prompt.
8. Ask Gemini for JSON-only output.
9. Validate the response with Zod before persistence.
10. Persist the report in MongoDB and cache it in Redis.

## Why this design

- **Modular monolith:** keeps deployment simple while enforcing service boundaries.
- **Redis:** reduces repeated LLM calls, stores RAG embeddings/context and can support session/rate-limit workloads.
- **RAG:** grounds generation in curated interview knowledge instead of relying only on model memory.
- **Zod:** prevents malformed LLM output from leaking into the database or UI.
- **Request IDs:** make slow AI calls and production failures traceable.
- **Central error handling:** keeps API responses consistent and avoids leaking stack traces.
- **MongoDB:** remains the source of truth for durable user and interview data.
