# Sinai Spark Global — Backend & AI Chatbot Requirements Specification

This document outlines the technical architecture, functional specifications, API designs, and AI chatbot requirements for the **Sinai Spark Global** web platform.

---

## 1. Executive Summary & Objectives

The backend infrastructure and AI assistant aim to transform Sinai Spark Global’s web presence from a static marketing showcase into an **intelligent lead acquisition, client onboarding, and automated advisory ecosystem**.

### Key Goals:

- **Zero Lead Leakage**: Instant ingestion of contact forms, consultation requests, and whitepaper downloads into CRM and team notifications (Email + WhatsApp).
- **24/7 AI-Powered Advisory**: An intelligent, bilingual AI consultant capable of answering complex foreign investment queries (Saudi MISA, GCC, India NRI) and qualifying high-value leads.
- **Enterprise-Grade Security & Performance**: Sub-second API response times, spam filtering, rate limiting, and FEMA/Saudi regulatory data compliance.

---

## 2. Backend Architecture & Core Services

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Next.js Web Frontend                             │
│                  (Floating AI Chatbot · Forms · Research)                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON / Streaming
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    API Gateway & Route Handlers (/api/*)                    │
│      [Rate Limiting: Upstash] · [Spam Filter: Turnstile] · [Auth: NextAuth] │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│    Leads & CRM    │   AI Chat & RAG   │  Research Access  │   Consultation  │
│      Handler      │      Engine       │     Delivery      │     Booking     │
└─────────┬─────────┴─────────┬─────────┴─────────┬─────────┴────────┬────────┘
          │                   │                   │                  │
┌─────────▼─────────┐ ┌───────▼─────────┐ ┌───────▼────────┐ ┌───────▼────────┐
│ PostgreSQL / Prisma│ │ Vector DB (pgvec│ │  Email & SMS   │ │ Calendar Sync  │
│ (Leads, Logs, CMS)│ │ / Pinecone RAG) │ │ (Resend/Twilio)│ │ (Cal.com / API)│
└───────────────────┘ └─────────────────┘ └────────────────┘ └────────────────┘
```

---

## 3. Core Functional Backend Modules

### 3.1. Lead Capture & Consultation Routing Engine

- **Endpoints**:
  - `POST /api/contact`: Handles the general consultation form.
  - `POST /api/leads/india`: Specialized NRI lead capture with company type and investment size.
- **Workflow**:
  1. Validate payload against Zod schema (`apps/web/lib/contact-schema.ts`).
  2. Verify Cloudflare Turnstile token to prevent bot submissions.
  3. Store lead in PostgreSQL database.
  4. Send immediate notification email to the internal BD/Sales team via **Resend** / **SendGrid**.
  5. Send automated confirmation email + calendar invite link to the prospective client.
  6. Trigger webhook to CRM (HubSpot, Salesforce, or Zoho CRM).
  7. _(Optional)_ Send automated WhatsApp alert to the on-duty Business Development Manager via WhatsApp Cloud API / Twilio.

### 3.2. Research Reports & Whitepaper Gating

- **Endpoints**:
  - `POST /api/research/download`: Collects user credentials (Name, Work Email, Company, Market of Interest) before granting access.
- **Workflow**:
  1. Store lead with tag `source: research_whitepaper`.
  2. Generate signed temporary S3/Cloudflare R2 download URL (valid for 15 minutes) or email download link.
  3. Track whitepaper download analytics by market.

### 3.3. Database Schema (PostgreSQL via Prisma / Drizzle)

```prisma
model Lead {
  id            String       @id @default(uuid())
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  fullName      String
  email         String
  phone         String?
  country       String?
  serviceType   String
  companyName   String?
  message       String?
  source        String       // "contact_form", "india_landing", "ai_chatbot", "whitepaper"
  status        LeadStatus   @default(NEW) // NEW, CONTACTED, QUALIFIED, CLOSED
  metadata      Json?        // Target budget, timeframe, specific entity type
  chatSessionId String?      // Linked chatbot conversation if lead originated from AI
}

model ChatSession {
  id          String        @id @default(uuid())
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  userEmail   String?
  userPhone   String?
  userName    String?
  language    String        @default("en")
  market      String?       // "Saudi Arabia", "India", "UAE", etc.
  qualified   Boolean       @default(false)
  messages    ChatMessage[]
}

model ChatMessage {
  id        String      @id @default(uuid())
  sessionId String
  session   ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  role      String      // "user", "assistant", "system"
  content   String
  createdAt DateTime    @default(now())
}
```

---

## 4. AI Chatbot Requirements ("Sinai Spark AI Advisor")

### 4.1. Persona, Role & Guardrails

- **Identity**: Senior Corporate Expansion Advisor at Sinai Spark Global.
- **Tone**: Highly professional, confident, consultative, reassuring, and concise (plain English & modern standard Arabic).
- **Knowledge Scope**:
  - **Saudi Arabia (Flagship)**: MISA investment licensing, Commercial Registration (CR), 100% foreign ownership rules, SAGIA/MISA capital requirements, Regional Headquarters (RHQ) program, Iqama/PRO procedures.
  - **India NRI Desk**: Private Limited, LLP, and OPC formation for Gulf-based NRIs, FEMA compliance, online incorporation process (7–10 days), repatriation of profits.
  - **UAE & Bahrain**: Freezone vs. Mainland setup, corporate tax, Golden Visa requirements.
- **Strict Guardrails**:
  - Never quote binding legal guarantees or fixed government processing times beyond official guidance.
  - Clarify that information constitutes business advisory, not formal courtroom representation.
  - Actively identify high-intent prospects and smoothly guide them to submit their details or book a consultation.

### 4.2. Chatbot User Experience (UI/UX)

- **Positioning**: Floating luxury circular widget at bottom-right of the screen matching the brand theme (`#CCA24C` gold trim, deep corporate navy background).
- **Features**:
  - **Streaming Responses**: Ultra-fast token streaming (Vercel AI SDK).
  - **Suggested Quick Chips**: e.g., _"How do I get a MISA license?"_, _"NRI company setup in India"_, _"Costs & timelines"_, _"Book consultation"_.
  - **In-Chat Lead Capture Form**: Inline micro-form (Name, Email, WhatsApp) within the chat stream when the user requests a human callback or quote.
  - **Direct WhatsApp Escalation**: Instant one-click handoff button: _"Chat with our Senior Advisor on WhatsApp"_.
  - **Mobile Responsive**: Fullscreen responsive sheet on mobile with keyboard-aware height.

### 4.3. RAG Architecture (Retrieval-Augmented Generation)

```
┌────────────────────────────────────────────────────────┐
│                   Knowledge Base Docs                  │
│ (Sinai Spark Specs · Saudi MISA Laws · NRI FEMA Guides)│
└───────────────────────────┬────────────────────────────┘
                            │ Chunking & Embeddings (text-embedding-3-small)
┌───────────────────────────▼────────────────────────────┐
│          Vector Store (Supabase pgvector / Pinecone)   │
└───────────────────────────┬────────────────────────────┘
                            │ Vector Similarity Search (Top-K = 4)
┌───────────────────────────▼────────────────────────────┐
│                    LLM System Prompt                   │
│      + User Query + Retrieved Regulatory Context       │
│           (OpenAI GPT-4o / Claude 3.5 Sonnet)          │
└───────────────────────────┬────────────────────────────┘
                            │ Streaming Output
┌───────────────────────────▼────────────────────────────┐
│                     Client UI Widget                   │
└────────────────────────────────────────────────────────┘
```

---

## 5. Security, Compliance & Rate Limiting

1. **Spam & Abuse Protection**:
   - Cloudflare Turnstile token validation on all public POST endpoints.
   - Upstash Redis Rate Limiting: Max 5 chat queries per minute per IP, max 3 contact submissions per hour per IP.
2. **Data Privacy & GDPR/Saudi PDPL Compliance**:
   - All user data encrypted at rest (AES-256) and in transit (TLS 1.3).
   - No sensitive client financial or passport data stored in plaintext chat logs.
3. **Failover & Reliability**:
   - Serverless route handlers with 10-second execution timeouts.
   - Fallback error state with direct WhatsApp link if AI service provider experiences downtime.

---

## 6. Recommended Technology Stack

| Component              | Recommended Technology                  | Rationale                                                      |
| ---------------------- | --------------------------------------- | -------------------------------------------------------------- |
| **Framework**          | Next.js 16 (App Router)                 | Native full-stack support, Server Actions, Route Handlers      |
| **AI Orchestration**   | Vercel AI SDK (`ai` / `@ai-sdk/openai`) | First-class React hook streaming (`useChat`), tool calling     |
| **LLM Model**          | OpenAI GPT-4o / Claude 3.5 Sonnet       | Unmatched multilingual Arabic/English nuance & legal reasoning |
| **Vector Database**    | Supabase pgvector / Pinecone            | Scalable, low latency, seamless PostgreSQL integration         |
| **Database ORM**       | Prisma / Drizzle with PostgreSQL        | Type-safe queries, migration management                        |
| **Email Gateway**      | Resend                                  | Modern React-email templates, 99.9% delivery rate              |
| **CRM Integration**    | HubSpot / Webhook / Zapier              | Seamless sales team handover                                   |
| **Spam / Bot Defense** | Cloudflare Turnstile                    | Invisible, user-friendly CAPTCHA alternative                   |

---

## 7. Implementation Roadmap & Milestones

- **Phase 1: Backend Foundation (Week 1)**
  - Database schema & Prisma setup on Supabase/Neon PostgreSQL.
  - Contact & Consultation API route handlers with Resend email delivery.
  - Cloudflare Turnstile and Upstash rate-limiting integration.
- **Phase 2: Knowledge Ingestion & RAG Pipeline (Week 2)**
  - Curate official Sinai Spark knowledge docs (Saudi MISA, licenses, fees, NRI guidelines).
  - Vector embeddings generation and search pipeline indexing.
- **Phase 3: AI Chatbot Frontend & Streaming (Week 3)**
  - Build luxury floating chat widget in `@workspace/ui` with Framer Motion animations.
  - Connect Next.js `/api/chat` streaming endpoint.
  - Implement in-chat lead capture & WhatsApp handoff triggers.
- **Phase 4: Testing, Security Audit & Launch (Week 4)**
  - Comprehensive prompt injection testing and regulatory accuracy evaluation.
  - End-to-end integration tests (Vitest + Playwright).
  - Production deployment to Vercel.
