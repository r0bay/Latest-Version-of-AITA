# Render Deployment Checklist

## ✅ Files Ready for Deployment

1. **Procfile** - Contains `web: gunicorn app:app` ✓
2. **requirements.txt** - All dependencies including gunicorn ✓
3. **runtime.txt** - Python 3.12.6 specified ✓
4. **render.yaml** - Optional configuration file for easier setup ✓
5. **app.py** - Configured for production (debug=False, reads PORT from env) ✓

## 📋 Deployment Steps on Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Render will auto-detect settings from `render.yaml` OR manually configure:
   - **Name:** `random-aita` (or your preferred name)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Build Command:** (leave empty)
   - **Start Command:** `gunicorn app:app`
   - **Python Version:** `3.12.6` (or 3.11+)
6. **Add Environment Variables** (required):
   - `REDDIT_CLIENT_ID` - Your Reddit API client ID
   - `REDDIT_CLIENT_SECRET` - Your Reddit API client secret
   - `SESSION_SECRET` - Random string (e.g., generate with `openssl rand -hex 32`)
7. Click "Create Web Service"
8. Render will provide HTTPS URL (e.g., `https://random-aita.onrender.com`)

## 🔍 Verification

After deployment, test these endpoints:
- `https://your-app.onrender.com/health` - Should return "ok"
- `https://your-app.onrender.com/` - Should load the main page
- `https://your-app.onrender.com/api/random` - Should return a random post

## ⚠️ Important Notes

- Render sets the `PORT` environment variable automatically - your app reads this correctly
- The app will fail to start if `REDDIT_CLIENT_ID` or `REDDIT_CLIENT_SECRET` are missing (this is intentional)
- Free tier on Render may spin down after inactivity - first request after spin-down may be slow
- Database (SQLite) is stored in temp directory - data may be lost on restart (this is fine for vote tracking)

## 🚀 After Deployment

Once you have your Render URL, update `capacitor.config.json`:
```json
{
  "server": {
    "url": "https://your-app.onrender.com",
    "cleartext": false
  }
}
```

