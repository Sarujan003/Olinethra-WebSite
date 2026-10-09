# Frontend

React frontend built with Vite.

## Requirements

- Node.js and npm
- Firebase web app configuration

## Setup

From this directory, install all frontend runtime and development packages listed in `package.json` (the lockfile keeps installs reproducible):

```powershell
npm install
```

Run this command again whenever dependencies change. `npm ci` can be used instead for a clean install that follows `package-lock.json` exactly.

The frontend runtime packages are:

- `@tailwindcss/vite`
- `firebase`
- `lucide-react`
- `react`
- `react-dom`
- `react-router-dom`
- `tailwindcss`

The frontend development packages are `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `oxlint`, and `vite`. `npm install` installs both lists.

Create a `.env` file in `frontend/` with the Firebase web app values:

```dotenv
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:5000
```

Replace the example values with the values from your Firebase project. Do not commit real credentials.

## Run locally

Start the Vite development server:

```powershell
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Other commands

```powershell
npm run build    # Build production files into dist/
npm run preview  # Preview the production build locally
npm run lint     # Run Oxlint
```
