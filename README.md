# SlotSwapper

A peer-to-peer time-slot scheduling application that allows users to swap calendar events with each other.

## 📋 Overview

SlotSwapper is a full-stack web application where users can:

- Manage their calendar events
- Mark events as "swappable"
- Browse swappable slots from other users
- Request to swap their slots with others
- Accept or reject incoming swap requests
- Automatically exchange slot ownership when swaps are accepted

Built with **React** (TypeScript) on the frontend and **Node.js/Express** with **PostgreSQL** on the backend, featuring JWT authentication and a complete swap management system.

## 🏗️ Architecture

### Technology Stack

**Frontend:**

- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- date-fns for date formatting
- Vite as build tool

**Backend:**

- Node.js with Express
- PostgreSQL database
- Sequelize ORM
- JWT for authentication
- bcryptjs for password hashing

**DevOps:**

- Docker & Docker Compose for containerization
- PostgreSQL 15 Alpine

### Database Schema

The application uses three main tables:

1. **users**

   - id (UUID, Primary Key)
   - name (STRING)
   - email (STRING, Unique)
   - password (STRING, Hashed)
   - createdAt, updatedAt (TIMESTAMPS)

2. **events** (Calendar Slots)

   - id (UUID, Primary Key)
   - title (STRING)
   - description (TEXT, Optional)
   - startTime (DATE)
   - endTime (DATE)
   - status (ENUM: 'BUSY', 'SWAPPABLE', 'SWAP_PENDING')
   - userId (UUID, Foreign Key → users)
   - createdAt, updatedAt (TIMESTAMPS)

3. **swap_requests**
   - id (UUID, Primary Key)
   - requesterId (UUID, Foreign Key → users)
   - receiverId (UUID, Foreign Key → users)
   - requesterSlotId (UUID, Foreign Key → events)
   - receiverSlotId (UUID, Foreign Key → events)
   - status (ENUM: 'PENDING', 'ACCEPTED', 'REJECTED')
   - message (TEXT, Optional)
   - createdAt, updatedAt (TIMESTAMPS)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Docker & Docker Compose (optional, for containerized setup)

### Option 1: Local Setup (Without Docker)

#### 1. Clone the Repository

```bash
cd "Service Hive"
cd slotswapper
```

#### 2. Set Up PostgreSQL Database

Create a PostgreSQL database named `slotswapper`:

```bash
# Using psql
createdb slotswapper

# Or using SQL
psql -U postgres
CREATE DATABASE slotswapper;
```

#### 3. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your database credentials
# Make sure to set:
# - DB_HOST=localhost
# - DB_PORT=5432
# - DB_NAME=slotswapper
# - DB_USER=your_postgres_user
# - DB_PASSWORD=your_postgres_password
# - JWT_SECRET=your-secret-key

# Start the backend server
npm run dev
```

The backend API will be available at `http://localhost:5000`

#### 4. Set Up Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Option 2: Docker Setup (Recommended)

#### 1. Prerequisites

Ensure Docker and Docker Compose are installed on your system.

#### 2. Start All Services

From the project root directory:

```bash
docker-compose up --build
```

This will:

- Start PostgreSQL database on port 5432
- Start backend API on port 5000
- Start frontend on port 3000

#### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

#### 4. Stop Services

```bash
docker-compose down
```

To remove volumes as well:

```bash
docker-compose down -v
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Sign Up

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Log In

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

### Event (Calendar Slot) Endpoints

All event endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

#### Get My Events

```http
GET /api/events

Response: 200 OK
{
  "success": true,
  "count": 2,
  "data": [ ... ]
}
```

#### Get Single Event

```http
GET /api/events/:id

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

#### Create Event

```http
POST /api/events
Content-Type: application/json

{
  "title": "Team Meeting",
  "description": "Weekly sync",
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T11:00:00.000Z",
  "status": "BUSY"
}

Response: 201 Created
{
  "success": true,
  "message": "Event created successfully.",
  "data": { ... }
}
```

#### Update Event

```http
PUT /api/events/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "SWAPPABLE"
}

Response: 200 OK
{
  "success": true,
  "message": "Event updated successfully.",
  "data": { ... }
}
```

#### Delete Event

```http
DELETE /api/events/:id

Response: 200 OK
{
  "success": true,
  "message": "Event deleted successfully."
}
```

### Swap Endpoints

#### Get Swappable Slots

```http
GET /api/swappable-slots
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "...",
      "title": "Focus Block",
      "startTime": "...",
      "endTime": "...",
      "status": "SWAPPABLE",
      "owner": {
        "id": "...",
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    },
    ...
  ]
}
```

#### Create Swap Request

```http
POST /api/swap-request
Authorization: Bearer {token}
Content-Type: application/json

{
  "mySlotId": "uuid-of-my-slot",
  "theirSlotId": "uuid-of-their-slot",
  "message": "Would love to swap!"
}

Response: 201 Created
{
  "success": true,
  "message": "Swap request created successfully.",
  "data": { ... }
}
```

#### Respond to Swap Request

```http
POST /api/swap-response/:requestId
Authorization: Bearer {token}
Content-Type: application/json

{
  "accept": true
}

Response: 200 OK
{
  "success": true,
  "message": "Swap request accepted. Slots have been exchanged.",
  "data": { ... }
}
```

#### Get My Swap Requests

```http
GET /api/swap-requests?type=incoming
GET /api/swap-requests?type=outgoing
GET /api/swap-requests  # Get both
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "count": 3,
  "data": {
    "incoming": [ ... ],
    "outgoing": [ ... ]
  }
}
```

## 🎨 Features Implemented

### Core Features

✅ **User Authentication**

- Sign up with name, email, and password
- Login with email and password
- JWT-based session management
- Password hashing with bcrypt
- Protected routes on frontend

✅ **Calendar Management**

- Create, read, update, and delete events
- Each event has: title, description, start time, end time, and status
- Three status types: BUSY, SWAPPABLE, SWAP_PENDING
- Mark events as swappable

✅ **Swap Logic** (Core Technical Challenge)

- Browse all swappable slots from other users
- Request to swap your slot with another user's slot
- Accept or reject incoming swap requests
- Automatic slot ownership exchange on acceptance
- Transaction-based swap operations for data consistency
- Prevents simultaneous swaps of the same slot

✅ **Frontend UI/UX**

- Responsive design for all screen sizes
- Dashboard to view and manage your events
- Marketplace to browse available swappable slots
- Requests page showing incoming and outgoing swap requests
- Real-time status updates after actions
- Modal dialogs for creating/editing events and requesting swaps
- Clean, modern UI with intuitive navigation

### Additional Features

✅ **Security**

- Password validation (minimum 6 characters)
- JWT token expiration
- Token validation on all protected routes
- SQL injection protection via Sequelize ORM
- CORS configuration

✅ **Data Validation**

- Server-side validation for all inputs
- Date validation (end time must be after start time)
- Email format validation
- Required field validation

✅ **Error Handling**

- Comprehensive error messages
- User-friendly error displays
- Transaction rollbacks on failures

✅ **Code Quality**

- TypeScript for type safety
- Modular code structure
- RESTful API design
- Clean separation of concerns

## 📁 Project Structure

```
slotswapper/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database connection
│   │   ├── models/
│   │   │   ├── User.js              # User model
│   │   │   ├── Event.js             # Event model
│   │   │   ├── SwapRequest.js       # SwapRequest model
│   │   │   └── index.js             # Model associations
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   ├── eventController.js   # Event CRUD
│   │   │   └── swapController.js    # Swap logic
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth routes
│   │   │   ├── eventRoutes.js       # Event routes
│   │   │   └── swapRoutes.js        # Swap routes
│   │   └── server.js                # Express server
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.tsx        # Event display
│   │   │   ├── EventModal.tsx       # Create/edit event
│   │   │   ├── MarketplaceCard.tsx  # Slot display
│   │   │   ├── SwapModal.tsx        # Swap request dialog
│   │   │   ├── SwapRequestCard.tsx  # Request display
│   │   │   ├── Navbar.tsx           # Navigation
│   │   │   └── ProtectedRoute.tsx   # Auth guard
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Auth state
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx        # My events
│   │   │   ├── Marketplace.tsx      # Browse slots
│   │   │   └── Requests.tsx         # Swap requests
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Marketplace.css
│   │   │   ├── Navbar.css
│   │   │   └── Requests.css
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types
│   │   ├── utils/
│   │   │   └── api.ts               # Axios instance
│   │   ├── App.tsx                  # Main component
│   │   ├── main.tsx                 # Entry point
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 💡 Design Decisions

### Backend Architecture

1. **Sequelize ORM**: Chosen for its excellent PostgreSQL support, built-in validation, and automatic migration capabilities.

2. **Transaction-Based Swaps**: All swap operations use database transactions to ensure data consistency. If any step fails, the entire operation rolls back.

3. **Status Management**: Events have three states to prevent race conditions:

   - `BUSY`: Regular event, not available for swapping
   - `SWAPPABLE`: Available for others to request
   - `SWAP_PENDING`: Currently involved in a pending swap request

4. **JWT Authentication**: Stateless authentication allows for easy horizontal scaling.

### Frontend Architecture

1. **Context API**: Used for global auth state management instead of Redux for simplicity.

2. **TypeScript**: Ensures type safety and better developer experience.

3. **Component-Based**: Reusable components for cards, modals, and forms.

4. **Responsive Design**: Mobile-first approach with flexbox and grid layouts.

### Security Considerations

1. Password hashing with bcrypt (10 salt rounds)
2. JWT tokens with expiration
3. Protected API routes
4. Input validation on both frontend and backend
5. Parameterized queries via Sequelize to prevent SQL injection

## 🧪 Testing the Application

### Test Scenario

1. **Create Two Users:**

   - Sign up as User A (e.g., alice@example.com)
   - Sign up as User B (e.g., bob@example.com)

2. **Create Events:**

   - As User A: Create "Team Meeting" on Tuesday 10:00-11:00 AM
   - As User B: Create "Focus Block" on Wednesday 2:00-3:00 PM

3. **Mark as Swappable:**

   - User A: Mark "Team Meeting" as swappable
   - User B: Mark "Focus Block" as swappable

4. **Request Swap:**

   - User A: Browse marketplace, see User B's slot
   - User A: Request swap offering their "Team Meeting"

5. **Accept Swap:**

   - User B: Go to Requests page, see incoming request
   - User B: Accept the swap

6. **Verify:**
   - User A now owns "Focus Block" (Wednesday slot)
   - User B now owns "Team Meeting" (Tuesday slot)
   - Both slots are marked as BUSY

## 🚧 Challenges Faced

1. **Swap Transaction Complexity**: Ensuring atomic swaps where both slots exchange ownership simultaneously required careful transaction management.

2. **Race Conditions**: Preventing multiple users from requesting the same slot simultaneously by implementing the `SWAP_PENDING` status.

3. **State Synchronization**: Keeping frontend state in sync with backend changes, especially after swap acceptances.

4. **Date Handling**: Managing timezones and date formats between frontend (JavaScript Date), backend (Sequelize DATE), and database (PostgreSQL TIMESTAMP).

## 🔮 Future Enhancements (Beyond MVP)

- [ ] Real-time notifications using WebSockets
- [ ] Email notifications for swap requests
- [ ] Calendar view visualization
- [ ] Recurring events support
- [ ] Swap history tracking
- [ ] User profiles with avatars
- [ ] Search and filter functionality
- [ ] Integration tests
- [ ] Deployment to cloud (AWS/Heroku/Vercel)

## 📝 API Endpoint Summary

| Method | Endpoint                        | Description             | Auth Required |
| ------ | ------------------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/signup`              | Register new user       | No            |
| POST   | `/api/auth/login`               | Login user              | No            |
| GET    | `/api/auth/me`                  | Get current user        | Yes           |
| GET    | `/api/events`                   | Get my events           | Yes           |
| GET    | `/api/events/:id`               | Get single event        | Yes           |
| POST   | `/api/events`                   | Create event            | Yes           |
| PUT    | `/api/events/:id`               | Update event            | Yes           |
| DELETE | `/api/events/:id`               | Delete event            | Yes           |
| GET    | `/api/swappable-slots`          | Get all swappable slots | Yes           |
| POST   | `/api/swap-request`             | Create swap request     | Yes           |
| POST   | `/api/swap-response/:requestId` | Accept/reject swap      | Yes           |
| GET    | `/api/swap-requests`            | Get my swap requests    | Yes           |

## 🤝 Contributing

This is a technical challenge project, but suggestions and feedback are welcome!

## 📄 License

This project is created as a technical assessment for ServiceHive Full Stack Intern position.

---

**Author**: Your Name  
**Date**: November 2025  
**Contact**: your.email@example.com

Thank you for reviewing my submission! I look forward to discussing the implementation and design decisions.
