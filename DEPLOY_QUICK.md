# 🚀 Quick Deployment Guide

## Step 1: Push to GitHub

### Create a new repository on GitHub:

1. Go to https://github.com/new
2. Name it: `slotswapper`
3. Keep it public (or private if you prefer)
4. **Don't** initialize with README (we already have one)
5. Click "Create repository"

### Push your code:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/slotswapper.git

# Push to GitHub
git push -u origin main
```

**Or use the automated script:**

```bash
./deploy.sh
```

---

## Step 2: Deploy Backend (Choose One)

### Option A: Deploy to Render (Recommended - Free Tier)

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `slotswapper-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Add Environment Variables**:
     ```
     NODE_ENV=production
     PORT=10000
     JWT_SECRET=your-super-secret-key-make-it-very-long-and-random-at-least-32-characters
     JWT_EXPIRES_IN=7d
     ```
5. Add PostgreSQL Database:
   - Click "New +" → "PostgreSQL"
   - Name it `slotswapper-db`
   - Copy the **Internal Database URL**
6. Go back to your web service → Environment
   - Add `DATABASE_URL` with the internal database URL
7. Click "Create Web Service"
8. **Copy your backend URL**: `https://slotswapper-api.onrender.com`

### Option B: Deploy to Railway

1. Go to https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add PostgreSQL: Click "+ New" → "Database" → "PostgreSQL"
5. Add environment variables (same as above)
6. Deploy backend from `backend` folder

---

## Step 3: Deploy Frontend (Choose One)

### Option A: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Set environment variable
echo "VITE_API_URL=https://your-backend-url.onrender.com" > .env.production

# Deploy
vercel --prod
```

**Or use Vercel Dashboard:**

1. Go to https://vercel.com
2. Import your GitHub repository
3. Framework Preset: Vite
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
8. Deploy!

### Option B: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

Set environment variable `VITE_API_URL` in Netlify dashboard.

---

## Step 4: Post-Deployment Checklist

- [ ] Backend is accessible at your deployment URL
- [ ] Frontend is accessible and loads properly
- [ ] Test signup/login functionality
- [ ] Create a test event
- [ ] Mark event as swappable
- [ ] Test swap functionality (open incognito for 2nd user)
- [ ] Check database is persisting data

---

## 🎯 Quick Commands

### Push updates to GitHub:

```bash
git add .
git commit -m "Your commit message"
git push
```

### Rebuild and redeploy:

- **Render**: Auto-deploys on git push
- **Vercel**: Auto-deploys on git push
- **Netlify**: Auto-deploys on git push

---

## 🔧 Environment Variables Reference

### Backend (Production)

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
```

### Frontend (Production)

```env
VITE_API_URL=https://your-backend-url.com
```

---

## 🆘 Troubleshooting

### Backend deployment fails:

- Check build logs for errors
- Ensure all dependencies are in `package.json`
- Verify DATABASE_URL is correct
- Make sure JWT_SECRET is set

### Frontend can't connect to backend:

- Check `VITE_API_URL` is set correctly
- Verify backend CORS allows frontend domain
- Check browser console for errors

### Database connection fails:

- Use **Internal Database URL** for Render
- Check database credentials
- Ensure database is running

---

## 📱 Mobile Testing

After deployment, test on mobile:

1. Open deployed frontend URL on mobile browser
2. Test all features
3. Check responsive design

---

## 🎉 You're Done!

Your SlotSwapper app is now live! Share your frontend URL with others.

Example URLs:

- **Frontend**: https://slotswapper.vercel.app
- **Backend API**: https://slotswapper-api.onrender.com

---

## 📝 Update README

Don't forget to update your README.md with:

- Live demo links
- Screenshots
- Any special setup instructions

---

For detailed deployment options, see [DEPLOYMENT.md](./DEPLOYMENT.md)
