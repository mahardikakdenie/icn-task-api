---

# 🚀 ICN Task Board – Backend (NestJS)

A robust backend API for a **Kanban-style Task Board** featuring **AI-powered suggestions**, **automated email notifications**, and **daily task summaries**. Built with **NestJS** and integrated with **Supabase** for authentication, database, and serverless functions.

## 📦 Core Features

- ✅ **Authentication**: Secure login & registration via Supabase Auth (JWT)
- ✅ **Task Management**: Full CRUD operations for tasks with status tracking (`Todo`, `In Progress`, `Done`)
- ✅ **AI Task Suggestions**: `/ai/suggest` endpoint powered by OpenAI (with graceful fallback to mock responses)
- ✅ **Email Webhook**: Sends notification on task creation  
  → Uses **Nodemailer** if SMTP credentials provided  
  → Falls back to **`email_logs` table** in Supabase (as permitted by requirements)
- ✅ **Protected Routes**: All sensitive endpoints secured via JWT verification
- ✅ **Modular Architecture**: Clean, scalable structure following NestJS best practices

---

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **AI Integration**: OpenAI API (`gpt-3.5-turbo`)
- **Email**: Nodemailer (SMTP) with Supabase DB fallback
- **Tooling**: ESLint, Prettier, Jest (for optional testing)

---

## 📁 Project Structure

```
src/
├── auth/              # JWT guard & auth utilities
├── task/              # Task CRUD + email webhook
├── ai/                # AI suggestion service & controller
├── supabase/          # Supabase client wrapper
├── mailer/            # Email service (SMTP + mock)
├── app.module.ts
└── main.ts
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js ≥ 18.x
- [Supabase](https://supabase.com/) account (Free tier is sufficient)
- (Optional) [OpenAI API Key](https://platform.openai.com/api-keys) or [Resend](https://resend.com) for email

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd icn-task-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Populate `.env` with values from:
   - **Supabase**: Project Dashboard → Settings → API
   - **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - **SMTP** (optional): Resend, SendGrid, or similar

4. **Run the development server**
   ```bash
   npm run start:dev
   ```
   The API will be available at: `http://localhost:3001`

---

## 🔑 Environment Variables

See `.env.example` for the required configuration. Example:

```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_JWT_SECRET=eyJhbGci...

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# Email (optional)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=re_...
```

> 💡 **Note**:  
> - If `OPENAI_API_KEY` is omitted, the AI endpoint returns **mock suggestions**.  
> - If SMTP is not configured, emails are **logged to the `email_logs` table** in Supabase.

---

## 📡 API Endpoints

| Method | Endpoint             | Description                        | Auth Required |
|--------|----------------------|------------------------------------|---------------|
| POST   | `/auth/login`        | Authenticate user                  | ❌            |
| POST   | `/tasks`             | Create new task + send notification| ✅            |
| GET    | `/ai/suggest`        | Get 3 AI-generated task suggestions| ✅            |

> All authenticated endpoints require:  
> `Authorization: Bearer <access_token>`  
> (Token obtained via Supabase Auth)

---

## 🧪 Testing (Optional)

Run unit tests with:
```bash
npm run test
```

---

## 📤 Deployment

Deploy to any Node.js-compatible platform:

- **[Render](https://render.com)**
- **[Railway](https://railway.app)**
- **VPS** (via `npm run build` + PM2)

Example `render.yaml`:
```yaml
services:
  - type: web
    name: icn-task-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_ANON_KEY
        sync: false
      # Add all required env vars
```

---

## 📊 Frontend Integration

The frontend (Next.js) consumes this API using:
```ts
fetch('http://localhost:3001/tasks', {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});
```
Where `accessToken` is retrieved from Supabase session:
```ts
const { data: { session } } = await supabase.auth.getSession();
```

---

## 📝 Important Notes

- **No `/register` endpoint**: User registration is handled directly via Supabase SDK in the frontend.
- **Daily Summary Cron Job**: Implemented via **Supabase Edge Function** (located in `/supabase/functions/daily-summary`), triggered by **GitHub Actions** (due to Supabase Free tier limitations).
- **OpenAI Fallback**: Mock responses are used when API quota is exhausted — this complies with test requirements.
- **Email Logging**: All email attempts (successful or mocked) are traceable in the `email_logs` table.

---

## 🌟 Final Remarks

Thank you for reviewing my submission. I’ve designed this solution to be **clean, maintainable, and production-ready**, while strictly adhering to the technical test specifications. I’m excited about the opportunity to contribute to your team and would welcome the chance to discuss this implementation further.

---

---

> 💡 **Note on OpenAI**:  
> Due to OpenAI's $5 credit expiration, the AI endpoint uses **mock responses**. The code structure is ready for real OpenAI integration — just add a valid `OPENAI_API_KEY`.

---

> ✨ **Happy coding!**  
> — Mahardika Kessuma Denie
