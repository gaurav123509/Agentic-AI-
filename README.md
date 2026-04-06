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

## API Endpoints

- `GET /`
- `GET /health`
- `POST /api/emails/analyze`
- `POST /api/emails/execute-action`
- `POST /api/emails/:id/actions`
- `GET /api/emails/history`
