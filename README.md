# OutBox - Email Job Scheduler

A production-grade email scheduler service with a Next.js dashboard, built for the ReachInbox assignment.

## 🚀 Features

### Backend
- **Reliable Scheduling**: Uses BullMQ + Redis for persistent job scheduling (No cron jobs)
- **Rate Limiting**: Redis-backed per-sender and global hourly limits
- **Configurable Concurrency**: Worker concurrency set via environment variable
- **Delay Between Emails**: Minimum 2 seconds between sends (configurable)
- **Fault Tolerance**: Survives server restarts; jobs recover automatically
- **Idempotency**: Prevents duplicate sends via status checks

### Frontend
- **Google OAuth Login**: Real authentication with NextAuth
- **Dashboard**: View scheduled and sent emails with status badges
- **Compose Modal**: CSV file upload, schedule time, delay settings
- **Real-time Updates**: Zustand state management with API integration

## 🛠 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, TypeScript, NextAuth, Zustand
- **Backend**: Express.js, BullMQ, Redis, PostgreSQL, Prisma, Nodemailer
- **Infrastructure**: Docker Compose (Redis, Postgres)

---

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### 1. Setup Infrastructure

Start Redis and PostgreSQL:

```bash
docker compose up -d
```

### 2. Backend Setup

```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Backend runs on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Dashboard runs on `http://localhost:3000`

### 4. Environment Variables

#### Server (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/outbox"
REDIS_HOST="localhost"
REDIS_PORT="6379"
PORT=4000
WORKER_CONCURRENCY=5
MAX_EMAILS_PER_HOUR_PER_SENDER=50
GLOBAL_MAX_EMAILS_PER_HOUR=200
MIN_DELAY_BETWEEN_EMAILS=2000
```

#### Client (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🏗 Architecture

### Scheduling Flow

```
User Request → API → PostgreSQL (save job) → BullMQ Queue (with delay) → Worker → Ethereal SMTP
```

1. **API Request**: User submits via `POST /api/schedule` or `POST /api/schedule/bulk`
2. **Database**: Job saved to PostgreSQL with status `SCHEDULED`
3. **Queue**: Job added to BullMQ with calculated delay
4. **Worker**: Picks up job when delay expires
   - Checks idempotency (skip if already SENT)
   - Checks rate limits (delay if exceeded)
   - Sends email via Ethereal
   - Updates status to `SENT`

### Rate Limiting Implementation

```
Rate Limit Key: ratelimit:sender:{userId}:{hourWindow}
```

- **Per-sender limit**: 50 emails/hour (configurable)
- **Global limit**: 200 emails/hour (configurable)
- **Storage**: Redis with 2-hour expiry
- **Exceeded behavior**: Job delayed to next hour window (not dropped)

### Concurrency & Delays

- **Worker Concurrency**: 5 parallel jobs (configurable via `WORKER_CONCURRENCY`)
- **Delay Between Emails**: 2000ms minimum (configurable via `MIN_DELAY_BETWEEN_EMAILS`)
- **BullMQ Limiter**: Additional throttling at 100 jobs/second

### Persistence & Recovery

1. **Redis**: Stores delayed jobs in queue
2. **PostgreSQL**: Source of truth for job status
3. **On Restart**: `recoverPendingJobs()` syncs Postgres → Redis
   - Finds `SCHEDULED` and `PROCESSING` jobs
   - Resets `PROCESSING` → `SCHEDULED`
   - Re-adds to queue if not already present

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/schedule` | Schedule single email |
| POST | `/api/schedule/bulk` | Schedule multiple emails |
| GET | `/api/emails` | Get all emails |
| GET | `/api/emails/scheduled` | Get scheduled emails |
| GET | `/api/emails/sent` | Get sent emails |
| GET | `/api/rate-limits` | Get current rate limit status |

---

## ✅ Features Implemented

### Backend
- [x] BullMQ delayed jobs (no cron)
- [x] PostgreSQL persistence
- [x] Redis-backed rate limiting
- [x] Configurable concurrency
- [x] Delay between emails
- [x] Restart recovery
- [x] Idempotency checks
- [x] Bulk email scheduling

### Frontend
- [x] Google OAuth login
- [x] Dashboard with tabs
- [x] Compose modal
- [x] CSV file parsing
- [x] Loading states
- [x] Empty states
- [x] API integration

---

## ⚠️ Assumptions & Trade-offs

1. **Ethereal Email**: Uses test accounts for demo; preview URLs shown in logs
2. **Rate Limit on Exceed**: Jobs delayed to next hour (preserves order within batch)
3. **Single Worker**: For demo; can scale to multiple workers
4. **Google OAuth**: Requires valid credentials; fallback demo available

---

## 📹 Demo Video

*Recording instructions:*
1. Show login with Google
2. Compose and schedule an email
3. View scheduled/sent tables
4. Restart server and verify job still sends
