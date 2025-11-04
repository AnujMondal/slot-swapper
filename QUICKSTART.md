# 🚀 QuickStart Guide - SlotSwapper

Get SlotSwapper running on your local machine in 5 minutes!

## Prerequisites Check

Before you begin, make sure you have:

- ✅ Node.js (v16 or higher) - Check with `node --version`
- ✅ PostgreSQL (v12 or higher) - Check with `psql --version`
- ✅ npm or yarn package manager

---

## Option 1: Quick Setup with Script (Recommended)

The fastest way to get started:

```bash
# Make setup script executable (Mac/Linux)
chmod +x setup.sh

# Run the setup script
./setup.sh
```

The script will:

- Check prerequisites
- Install all dependencies
- Guide you through configuration

---

## Option 2: Manual Setup

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Database

```bash
# Create PostgreSQL database
createdb slotswapper

# Or using psql
psql -U postgres
CREATE DATABASE slotswapper;
\q
```

### Step 3: Configure Environment

```bash
# Backend configuration
cd backend
cp .env.example .env

# Edit .env file with your database credentials
# Required fields:
# - DB_HOST (usually: localhost)
# - DB_USER (your PostgreSQL username)
# - DB_PASSWORD (your PostgreSQL password)
# - JWT_SECRET (any random string, e.g., "mysecretkey123")
```

### Step 4: Start the Application

```bash
# Terminal 1: Start Backend
cd backend
npm run dev
# Backend runs on http://localhost:5000

# Terminal 2: Start Frontend
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Option 3: Docker Setup (Easiest - No Local Installation)

If you have Docker installed:

```bash
# Start all services with one command
docker-compose up --build

# Access the application:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## 🎯 First Steps After Setup

### 1. Create Your Account

- Open http://localhost:5173 in your browser
- Click "Sign Up"
- Enter your name, email, and password

### 2. Create Your First Event

- After login, you'll see your Dashboard
- Click "Add New Event"
- Fill in: Title, Description, Start Time, End Time
- Click "Create Event"

### 3. Make It Swappable

- Find your event card
- Toggle the "Swappable" switch to ON
- The event status changes from "Busy" to "Swappable"

### 4. Test Swap Feature

- Open a new incognito window
- Create a second user account
- Create an event and mark it as swappable
- Go to "Marketplace" tab
- You'll see the first user's swappable slot
- Click "Request Swap" and select your slot

### 5. Accept/Reject Swap

- Switch back to first user
- Go to "Requests" tab → "Incoming"
- You'll see the swap request
- Click "Accept" or "Reject"

---

## 🧪 Test with Postman (Optional)

We've included a Postman collection for API testing:

1. Open Postman
2. Import `SlotSwapper.postman_collection.json`
3. Start with "Auth" folder → "Signup"
4. Then "Login" (JWT token is auto-saved)
5. Test all other endpoints

---

## 🐛 Troubleshooting

### Backend won't start?

```bash
# Check if PostgreSQL is running
brew services list  # Mac
sudo service postgresql status  # Linux

# Check if port 5000 is available
lsof -i :5000  # Mac/Linux
```

### Frontend won't start?

```bash
# Check if port 5173 is available
lsof -i :5173  # Mac/Linux

# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection error?

- Verify PostgreSQL is running
- Check credentials in `backend/.env`
- Ensure database `slotswapper` exists

### CORS errors in browser?

- Ensure backend is running on port 5000
- Check `frontend/src/utils/api.ts` has correct baseURL
- Restart both servers

---

## 📁 Project Structure Overview

```
slotswapper/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── config/         # Database config
│   └── .env               # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # State management
│   │   ├── utils/          # API utilities
│   │   └── types/          # TypeScript types
│   └── .env               # API URL config
│
└── docker-compose.yml      # Docker configuration
```

---

## 🎓 Next Steps

- Read the full [README.md](README.md) for detailed features
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review the code and customize to your needs!

---

## 💡 Tips

1. **Use two different browsers** (or incognito) to test swap functionality
2. **Check browser console** for any frontend errors
3. **Check terminal logs** for backend errors
4. **Use Postman collection** to understand API flow
5. **Read the assignment requirements** to understand the problem being solved

---

## 📞 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the error messages carefully
3. Ensure all prerequisites are met
4. Check the full README.md for more details

---

Happy Coding! 🎉
