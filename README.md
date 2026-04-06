# MailPilot AI

MailPilot AI is a production-ready AI email triage backend built with Node.js, Express.js, MongoDB, Mongoose, dotenv, cors, and the OpenAI API.

## Features

- Analyze incoming emails using `subject` and `body`
- Classify priority as `Urgent`, `Requires Action`, or `FYI`
- Generate a draft reply, task list, and calendar event suggestion
- Save every analyzed email in MongoDB
- Execute actions against saved email records
- View paginated email history

## Project Structure

```text
backend/
```

## Run Locally

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Deploy On Render

This repository includes a [render.yaml](/Users/gauravtripathi/agentic%20ai%20e-mailer/render.yaml) blueprint for deployment.

- Runtime: `Node`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`

Required environment variables on Render:

- `MONGODB_URI`
- `OPENAI_API_KEY`
- `CLIENT_URL`
- `OPENAI_MODEL`
- `OPENAI_REASONING_EFFORT`

## API Endpoints

- `GET /`
- `GET /health`
- `POST /api/emails/analyze`
- `POST /api/emails/execute-action`
- `POST /api/emails/:id/actions`
- `GET /api/emails/history`
