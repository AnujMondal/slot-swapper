#!/bin/bash

# SlotSwapper Setup Script

echo "🚀 SlotSwapper Setup Script"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI not found. Make sure PostgreSQL is installed and running."
    echo "   You can also use Docker to run PostgreSQL."
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Make sure PostgreSQL is running"
echo "   2. Create a database named 'slotswapper'"
echo "   3. Update backend/.env with your database credentials"
echo "   4. Start the backend: cd backend && npm run dev"
echo "   5. Start the frontend: cd frontend && npm run dev"
echo ""
echo "   OR use Docker:"
echo "   docker-compose up --build"
echo ""
echo "🎉 Happy coding!"
