# Backend

Backend API functions for the Olinethra project. The `api/` directory contains Vercel serverless endpoints for projects and inquiries. `server.js` is currently empty, so `npm start` does not start a local API server yet.

## Requirements

- Node.js and npm
- A Firebase service account with access to the project's Firestore database
- Vercel CLI to run the API functions locally

## Setup

From this directory, install the backend runtime packages listed in `package.json` (the lockfile keeps installs reproducible):

```powershell
npm install
```

Run this command again whenever backend dependencies change. For a clean install matching `package-lock.json`, use `npm ci` instead.

The backend packages installed by this command are:

- `cors`
- `dotenv`
- `express`
- `firebase-admin`

The `dev` script also uses `nodemon`; install it as a development dependency if you want to run that script:

```powershell
npm install --save-dev nodemon
```

Create a `.env` file in `backend/`:

```dotenv
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nreplace_with_your_private_key\n-----END PRIVATE KEY-----\n"
```

Use the values from your Firebase service account. Keep this file private and do not commit service account credentials.

## Run the API locally with Vercel

The API functions live in `api/`, so run the Vercel development server from the project root (one directory above `backend/`). Vercel CLI is a separate tool and is not a backend package; run it through `npx` (which fetches it if needed), then start the server:

```powershell
cd ..
npx vercel dev
```

Vercel serves the functions under `/api`, for example `/api/projects` and `/api/inquiries`. The root `vercel.json` configures the project deployment. Ensure the backend environment variables are available to the Vercel process.

## Existing npm scripts

```powershell
npm run dev    # Runs nodemon server.js; server.js is currently empty
npm start      # Runs node server.js; server.js is currently empty
```

These scripts are placeholders until a standalone Express server is implemented. The API functions are currently intended to run through Vercel.
