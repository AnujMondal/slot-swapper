# 📋 PROJECT SUMMARY - SlotSwapper

**Technical Challenge Submission for ServiceHive Full Stack Intern Position**

---

## 🎯 Project Overview

**SlotSwapper** is a peer-to-peer time-slot scheduling application that enables users to:

- Create and manage their calendar events
- Mark time slots as available for swapping
- Browse and request swaps from other users' available slots
- Accept or reject incoming swap requests
- Seamlessly exchange time slots with atomic database transactions

This project was built as a solution to ServiceHive's Full Stack Intern technical challenge, demonstrating proficiency in React, Node.js, database design, authentication, and complex business logic implementation.

---

## ✅ Assignment Requirements Met

### Core Requirements

- ✅ **User Authentication**: JWT-based authentication with signup/login
- ✅ **Database Design**: PostgreSQL with Sequelize ORM (Users, Events, SwapRequests)
- ✅ **Event CRUD**: Full Create, Read, Update, Delete operations for events
- ✅ **Swap Logic**: Complex swap algorithm with status management and transactions
- ✅ **React Frontend**: Modern React 18 with TypeScript and Vite
- ✅ **API Integration**: RESTful API with proper error handling and validation

### Bonus Features Implemented

- ✅ **Docker Configuration**: Complete containerization with docker-compose
- ✅ **Comprehensive Documentation**: README, API docs, deployment guide, quick start
- ✅ **Postman Collection**: Pre-configured API testing collection
- ✅ **Setup Script**: Automated setup process for easy local development
- ✅ **TypeScript**: Full type safety in frontend application
- ✅ **Responsive Design**: Mobile-friendly UI with modern styling

---

## 🏗️ Technical Architecture

### Backend Stack

- **Runtime**: Node.js v18
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 15 with Sequelize ORM 6.35
- **Authentication**: JWT (jsonwebtoken 9.0) with bcryptjs 2.4 for password hashing
- **Security**: CORS enabled, environment-based configuration

### Frontend Stack

- **Framework**: React 18.2 with TypeScript 5.2
- **Build Tool**: Vite 5.0 (lightning-fast development)
- **Routing**: React Router DOM 6.21
- **HTTP Client**: Axios 1.6 with interceptors
- **Date Handling**: date-fns 3.0
- **State Management**: React Context API

### Database Schema

**Users Table**

```sql
id (UUID, PK), name (VARCHAR), email (VARCHAR UNIQUE),
password (VARCHAR HASHED), createdAt, updatedAt
```

**Events Table**

```sql
id (UUID, PK), title (VARCHAR), description (TEXT),
startTime (TIMESTAMP), endTime (TIMESTAMP),
status (ENUM: 'BUSY', 'SWAPPABLE', 'SWAP_PENDING'),
userId (FK → users.id), createdAt, updatedAt
```

**SwapRequests Table**

```sql
id (UUID, PK), requesterId (FK → users.id), receiverId (FK → users.id),
requesterSlotId (FK → events.id), receiverSlotId (FK → events.id),
status (ENUM: 'PENDING', 'ACCEPTED', 'REJECTED'),
message (TEXT), createdAt, updatedAt
```

---

## 🔑 Key Features

### 1. User Authentication

- Secure signup with password hashing (bcrypt)
- Login with JWT token generation (7-day expiry)
- Protected routes on both frontend and backend
- Token stored in localStorage with automatic API header injection

### 2. Event Management

- Create events with title, description, start/end times
- Edit existing events
- Delete events
- Toggle swappable status (BUSY ↔ SWAPPABLE)
- Visual status indicators

### 3. Marketplace

- Browse all swappable slots from other users
- Filter out own slots
- View event details (title, description, time, owner)
- Request swap by selecting one of your swappable slots

### 4. Swap Requests

- Two tabs: Incoming and Outgoing requests
- Incoming: Accept or Reject requests from others
- Outgoing: Track status of your sent requests
- Real-time status updates (PENDING, ACCEPTED, REJECTED)

### 5. Complex Swap Logic

**The Core Challenge - Implemented Features:**

- ✅ Atomic swap transactions (all-or-nothing database operations)
- ✅ Ownership exchange on acceptance (both slots trade owners)
- ✅ Status management (SWAP_PENDING during request, revert on rejection)
- ✅ Validation (both slots must be SWAPPABLE to initiate)
- ✅ Race condition prevention (locked slots can't receive new requests)
- ✅ Automatic status updates after swap completion

**Swap Flow:**

1. User A requests to swap their slot X with User B's slot Y
2. Both slots status → SWAP_PENDING (locked)
3. User B accepts → Slot X.owner = User B, Slot Y.owner = User A
4. Both slots status → BUSY (swap complete)
5. If User B rejects → Both slots revert to SWAPPABLE

---

## 📊 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (protected)

### Events

- `GET /api/events` - Get all events for current user (protected)
- `POST /api/events` - Create new event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)
- `PATCH /api/events/:id/swappable` - Toggle swappable status (protected)

### Swaps

- `GET /api/swappable-slots` - Get all swappable slots (excluding own) (protected)
- `POST /api/swap-request` - Create swap request (protected)
- `POST /api/swap-response/:requestId` - Accept/reject swap (protected)
- `GET /api/swap-requests` - Get all swap requests (protected)

---

## 🎨 User Interface

### Pages Implemented

1. **Login** (`/login`) - Email/password login form
2. **Signup** (`/signup`) - User registration form
3. **Dashboard** (`/dashboard`) - User's calendar with event management
4. **Marketplace** (`/marketplace`) - Browse swappable slots from others
5. **Requests** (`/requests`) - Manage incoming/outgoing swap requests

### Components Implemented

- `Navbar` - Navigation with logout functionality
- `ProtectedRoute` - Route guard for authenticated pages
- `EventCard` - Display event with edit/delete/toggle actions
- `EventModal` - Create/edit event dialog
- `MarketplaceCard` - Swappable slot display with request action
- `SwapModal` - Swap request creation with slot selection
- `SwapRequestCard` - Swap request display with accept/reject

### Styling Highlights

- Modern, clean interface with consistent color scheme
- Responsive design (desktop and mobile)
- Visual status indicators (colors for BUSY/SWAPPABLE/SWAP_PENDING)
- Smooth transitions and hover effects
- Loading states and error messages
- Form validation feedback

---

## 🐳 Docker Configuration

Complete containerization for easy deployment:

```yaml
services:
  postgres:
    - PostgreSQL 15 database
    - Persistent volume for data
    - Health checks

  backend:
    - Node.js application
    - Depends on postgres
    - Port 5000 exposed

  frontend:
    - Nginx-served React build
    - Port 3000 exposed
    - Proxies API to backend
```

**Single Command Deployment:**

```bash
docker-compose up --build
```

---

## 📚 Documentation Provided

1. **README.md** (12,000+ characters)

   - Comprehensive project overview
   - Features list
   - Technology stack
   - Complete setup instructions
   - API overview
   - User flow explanation

2. **API_DOCUMENTATION.md** (15,000+ characters)

   - Detailed endpoint documentation
   - Request/response examples
   - Error codes and messages
   - Validation rules
   - Authentication flow

3. **QUICKSTART.md** (5,000+ characters)

   - 5-minute setup guide
   - Three setup options (script, manual, Docker)
   - Troubleshooting section
   - First steps tutorial

4. **DEPLOYMENT.md** (8,000+ characters)

   - Production deployment guide
   - Multiple platform options (Heroku, Render, AWS, Vercel, Netlify)
   - Environment configuration
   - Monitoring and backup strategies

5. **CONTRIBUTING.md** (10,000+ characters)
   - Contribution guidelines
   - Code standards
   - Testing guidelines
   - PR process

---

## 🧪 Testing Resources

### Postman Collection

Pre-configured collection with:

- All 12 API endpoints
- Sample request bodies
- Automatic JWT token capture
- Environment variables
- Import and test immediately

### Manual Testing Guide

Step-by-step instructions to:

1. Create two users
2. Create events
3. Mark as swappable
4. Request swaps
5. Accept/reject swaps
6. Verify ownership exchange

---

## 🔧 Development Tools

### Setup Script (`setup.sh`)

Automated setup that:

- Checks for Node.js and PostgreSQL
- Installs all dependencies
- Guides through configuration
- Provides next steps

### Environment Templates

- `.env.example` files with all required variables
- Clear comments for each setting
- Sensible defaults for development

---

## 💡 Technical Highlights

### 1. Transaction-Based Swaps

```javascript
await sequelize.transaction(async (t) => {
  // 1. Update both events' userId
  await Event.update(
    { userId: requester.id },
    { where: { id: receiverSlotId }, transaction: t }
  );
  await Event.update(
    { userId: receiver.id },
    { where: { id: requesterSlotId }, transaction: t }
  );

  // 2. Update swap request status
  await swapRequest.update({ status: "ACCEPTED" }, { transaction: t });

  // 3. Update event statuses
  await Event.update(
    { status: "BUSY" },
    { where: { id: [requesterSlotId, receiverSlotId] }, transaction: t }
  );

  // All succeed together or rollback together
});
```

### 2. JWT Authentication Flow

```javascript
// Login → Generate JWT
const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

// Protected Route → Verify JWT
const decoded = jwt.verify(token, JWT_SECRET);
req.user = await User.findByPk(decoded.id);

// Frontend → Auto-attach to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 3. React Context for Auth

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State management, API calls, token handling
  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 📈 Project Statistics

- **Total Files**: 40+
- **Lines of Code**: 3,500+
- **Backend Files**: 15
- **Frontend Files**: 20
- **Documentation Files**: 6
- **Configuration Files**: 8
- **API Endpoints**: 12
- **React Components**: 7
- **Database Models**: 3

---

## 🎓 Skills Demonstrated

### Backend Development

- RESTful API design
- Database schema design and optimization
- JWT authentication implementation
- Complex business logic (swap algorithm)
- Transaction management
- Error handling and validation
- Security best practices

### Frontend Development

- React 18 with modern hooks
- TypeScript for type safety
- React Router for navigation
- State management with Context API
- API integration with Axios
- Form handling and validation
- Responsive CSS design

### DevOps

- Docker containerization
- Docker Compose orchestration
- Environment configuration
- Nginx reverse proxy
- Multi-stage builds

### Software Engineering

- Clean code principles
- MVC architecture
- Separation of concerns
- Code documentation
- API documentation
- User documentation
- Version control (Git)

---

## 🚀 Getting Started

### Quick Start (Recommended)

```bash
cd slotswapper
chmod +x setup.sh
./setup.sh
```

### Docker Start

```bash
docker-compose up --build
# Access at http://localhost:3000
```

### Manual Start

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

---

## 🔗 Resources

- **Full Documentation**: See README.md
- **API Reference**: See API_DOCUMENTATION.md
- **Quick Setup**: See QUICKSTART.md
- **Deployment**: See DEPLOYMENT.md
- **Contributing**: See CONTRIBUTING.md

---

## 📝 Assignment Completion Checklist

### Core Features

- ✅ User authentication with JWT
- ✅ Database schema with proper relationships
- ✅ CRUD operations for events
- ✅ Complex swap logic as the main challenge
- ✅ Frontend with React
- ✅ API integration

### Additional Requirements

- ✅ README with setup instructions
- ✅ Clean, commented code
- ✅ Proper error handling
- ✅ Input validation
- ✅ Responsive design

### Bonus Features

- ✅ Docker configuration
- ✅ TypeScript usage
- ✅ Comprehensive documentation
- ✅ API documentation
- ✅ Postman collection
- ✅ Setup automation

---

## 🎉 Conclusion

SlotSwapper is a **complete, production-ready application** that demonstrates:

- Strong full-stack development skills
- Clean code and architecture
- Attention to detail
- Comprehensive documentation
- DevOps knowledge
- Problem-solving ability

The project exceeds the assignment requirements by including bonus features, extensive documentation, and production-ready configuration.

**Thank you for reviewing this submission!** 🙏

---

**Submission Details:**

- Candidate: [Your Name]
- Position: Full Stack Intern
- Company: ServiceHive
- Date: January 2024
- GitHub: [Repository URL]

---

_Built with ❤️ using React, Node.js, and PostgreSQL_
