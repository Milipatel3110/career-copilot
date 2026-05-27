# CareerCopilot AI

> An AI-powered career intelligence platform for everyone — not just CS students.

**Live Demo → [career-copilot-zeta.vercel.app](https://career-copilot-zeta.vercel.app)**

---

## Overview

CareerCopilot AI is a full-stack platform that helps job seekers at every stage of their career journey. Upload your resume, browse live job listings, analyze your fit for any role, practice interviews, build a career roadmap, and generate tailored cover letters — all powered by AI.

Built with Next.js 16, Groq's Llama 3.3 70B, and the Adzuna Jobs API. Every AI response streams in real time.

---

## Features

| Feature | Description |
|---|---|
| **Resume X-Ray** | Upload your PDF resume — get a full AI analysis with strengths, ATS keywords, and rewrite suggestions |
| **Smart Job Board** | Live job listings from Adzuna across 50+ countries with search, filters (Remote, Senior, Entry Level, Full-time, Part-time), and pagination |
| **Job Match Engine** | Paste any job description → get a match score, skills gap analysis, and tactical advice on how to position yourself |
| **Mock Interviewer** | AI conducts a full interview for any role, asks follow-up questions, and gives feedback on every answer |
| **Career Roadmap Builder** | Enter your current role and target role → get a step-by-step learning and experience roadmap |
| **Cover Letter Forge** | Generate a professional cover letter in Professional, Enthusiastic, or Concise tone — with or without your resume |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **AI:** Groq API — Llama 3.3 70B Versatile (real-time streaming)
- **Jobs API:** Adzuna (50+ countries, all industries)
- **PDF Parsing:** unpdf (server-side)
- **UI:** Tailwind CSS v4 + Framer Motion
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Groq API key](https://console.groq.com) — free tier available
- [Adzuna API credentials](https://developer.adzuna.com) — free tier available

### Installation

```bash
git clone https://github.com/Milipatel3110/career-copilot.git
cd career-copilot
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── (app)/              # App pages
│   │   ├── dashboard/
│   │   ├── resume/         # Resume X-Ray
│   │   ├── jobs/           # Smart Job Board
│   │   ├── match/          # Job Match Engine
│   │   ├── interview/      # Mock Interviewer
│   │   ├── roadmap/        # Career Roadmap
│   │   └── cover-letter/   # Cover Letter Forge
│   ├── api/                # API route handlers
│   └── page.tsx            # Landing page
├── components/
│   └── Sidebar.tsx
└── lib/
    ├── gemini.ts           # Groq streaming client
    └── adzuna.ts           # Adzuna API wrapper
```

---

## Deployment

Deploy instantly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Milipatel3110/career-copilot)

Set the three environment variables in the Vercel dashboard during setup.

---

## License

MIT — free to fork and build on.

---

*Built by [Mili Patel](https://github.com/Milipatel3110)*
