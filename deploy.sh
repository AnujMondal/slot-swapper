#!/bin/bash

# SlotSwapper - Quick Deployment Script
# This script helps you deploy to GitHub and provides deployment instructions

echo "🚀 SlotSwapper Deployment Helper"
echo "================================"
echo ""

# Check if git remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✓ Git remote 'origin' already configured"
    git remote -v
else
    echo "❌ No git remote found"
    echo ""
    echo "Please create a new repository on GitHub, then run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/slotswapper.git"
    echo ""
    read -p "Enter your GitHub repository URL (or press Enter to skip): " REPO_URL
    
    if [ -n "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        echo "✓ Remote added successfully"
    else
        echo "⏭️  Skipping remote configuration"
    fi
fi

echo ""
echo "📤 Pushing to GitHub..."
echo ""

# Push to GitHub
if git remote get-url origin > /dev/null 2>&1; then
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "🌐 Your repository is now available at:"
        git remote get-url origin | sed 's/\.git$//'
    else
        echo ""
        echo "❌ Push failed. You may need to authenticate or check your repository URL."
        echo ""
        echo "If you're using HTTPS, you might need a Personal Access Token:"
        echo "https://github.com/settings/tokens"
        echo ""
        echo "Or switch to SSH:"
        echo "git remote set-url origin git@github.com:YOUR_USERNAME/slotswapper.git"
    fi
else
    echo "⏭️  Skipping push (no remote configured)"
fi

echo ""
echo "🎯 Next Steps for Deployment:"
echo "=============================="
echo ""
echo "1. Backend Deployment (Choose one):"
echo "   • Render: https://render.com"
echo "     - Connect GitHub repo"
echo "     - Select 'backend' folder"
echo "     - Build: npm install"
echo "     - Start: npm start"
echo ""
echo "   • Heroku: heroku create && heroku git:remote -a YOUR_APP_NAME"
echo "     - Add PostgreSQL: heroku addons:create heroku-postgresql"
echo "     - Set env vars: heroku config:set JWT_SECRET=your-secret"
echo "     - Deploy: git subtree push --prefix backend heroku main"
echo ""
echo "2. Frontend Deployment (Choose one):"
echo "   • Vercel: npm i -g vercel && cd frontend && vercel --prod"
echo "   • Netlify: npm i -g netlify-cli && cd frontend && netlify deploy --prod"
echo ""
echo "3. Set Environment Variables:"
echo "   Backend:"
echo "     - JWT_SECRET=<random-string>"
echo "     - DB_HOST=<postgres-host>"
echo "     - DB_USER=<postgres-user>"
echo "     - DB_PASSWORD=<postgres-password>"
echo "     - DB_NAME=slotswapper"
echo ""
echo "   Frontend:"
echo "     - VITE_API_URL=<backend-url>"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
