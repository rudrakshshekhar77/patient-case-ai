# SwasthyaSathi - AI-Powered Patient Case-Taking System

An end-to-end system where patients register, complete a case-taking
questionnaire (with voice input), and upload medical documents. AI
extracts document content and generates a structured clinical summary
for doctors to review, edit, and confirm.

## Features
- Patient registration & login (Supabase Auth)
- Case-taking questionnaire with voice input (Web Speech API)
- Medical document upload with AI-powered text extraction
- AI-generated clinical case summaries (Google Gemini)
- Doctor dashboard to review, edit, and confirm cases

## Tech Stack
- Next.js (React), TypeScript, Tailwind CSS
- Supabase (Database + Auth + Storage)
- Google Gemini API (document reading + summarization)
- Vercel (Deployment)

## Live Demo
[apna Vercel URL yahan daalo]

## Local Setup
1. Clone the repo
2. `npm install`
3. Create `.env.local` with Supabase and Gemini keys
4. `npm run dev`

## Team
Rudraksh Shekhar