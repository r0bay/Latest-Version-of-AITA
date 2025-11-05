# Quick Deployment Guide for App Store Submission

## Option 1: Railway (Recommended - Easiest)

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Once deployed, go to Settings → Variables and add:
   - `REDDIT_CLIENT_ID` = (your Reddit client ID)
   - `REDDIT_CLIENT_SECRET` = (your Reddit client secret)
   - `SESSION_SECRET` = (any random string, e.g., `openssl rand -hex 32`)
6. Railway will automatically provide HTTPS URL (e.g., `https://your-app.up.railway.app`)

## Option 2: Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Settings:
   - Name: `random-aita` (or any name)
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: (leave empty)
   - Build Command: (leave empty)
   - Start Command: `gunicorn app:app`
   - Python Version: `3.11` or `3.12`
6. Add Environment Variables:
   - `REDDIT_CLIENT_ID`
   - `REDDIT_CLIENT_SECRET`
   - `SESSION_SECRET`
7. Click "Create Web Service"
8. Render will provide HTTPS URL (e.g., `https://random-aita.onrender.com`)

## Option 3: Heroku (Requires CLI)

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set env vars: `heroku config:set REDDIT_CLIENT_ID=... REDDIT_CLIENT_SECRET=... SESSION_SECRET=...`
5. Deploy: `git push heroku main`
6. URL will be: `https://your-app-name.herokuapp.com`

## After Deployment

Once you have your HTTPS URL, share it and I'll update `capacitor.config.json` with it!

