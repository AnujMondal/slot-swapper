# SlotSwapper

A peer-to-peer time-slot scheduling application that allows users to swap calendar events with each other.

## � Live Demo

- **Frontend**: [https://slot-swapper-psl-two.vercel.app](https://slot-swapper-psl-two.vercel.app)
- **Backend API**: [https://slot-swapper-r4uv.onrender.com](https://slot-swapper-r4uv.onrender.com)

## �📋 Overview

SlotSwapper is a full-stack web application where users can manage calendar events, mark them as swappable, browse slots from other users, request swaps, and automatically exchange ownership when swaps are accepted.

**Tech Stack**: React (TypeScript), Node.js/Express, PostgreSQL, JWT Authentication

## ✨ Features

- 🔐 JWT Authentication (signup/login)
- 📅 Event CRUD operations
- 🔄 Swap marketplace with filtering
- 💱 Atomic swap transactions
- 🎨 Modern responsive UI
- 📱 Mobile-friendly design

## 🏗️ Tech Stack

**Frontend**: React 18, TypeScript, Vite, React Router, Axios  
**Backend**: Node.js, Express, Sequelize ORM, JWT  
**Database**: PostgreSQL with UUID primary keys  
**DevOps**: Docker, Docker Compose

## 🚀 Quick Start

### Prerequisites
- Node.js v16+, PostgreSQL v12+, Docker (optional)

### Local Setup

```bash
# 1. Clone & setup database
git clone https://github.com/AnujMondal/slot-swapper.git
cd slot-swapper
createdb slotswapper

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials and JWT_SECRET
npm run dev  # Runs on http://localhost:5001

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

### Docker Setup

```bash
docker-compose up --build  # Access at http://localhost:3000
docker-compose down        # Stop services
```

## 📚 API Endpoints

**Base URL**: `http://localhost:5001/api`

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (Protected)

### Events
- `GET /events` - Get user's events (Protected)
- `POST /events` - Create event (Protected)
- `PUT /events/:id` - Update event (Protected)
- `DELETE /events/:id` - Delete event (Protected)

### Marketplace
- `GET /swaps/marketplace` - Get swappable slots (Protected)

### Swap Requests
- `GET /swaps/requests` - Get swap requests (Protected)
- `POST /swaps/requests` - Create swap request (Protected)
- `PUT /swaps/requests/:id/accept` - Accept swap (Protected)
- `PUT /swaps/requests/:id/reject` - Reject swap (Protected)

📖 **Detailed API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 📂 Project Structure

```
slotswapper/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── config/   # Database config
│   │   ├── models/   # Sequelize models
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # JWT auth
│   │   └── routes/   # API routes
│   └── Dockerfile
├── frontend/         # React/TypeScript app
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/    # Route pages
│   │   ├── context/  # Auth context
│   │   ├── utils/    # API client
│   │   └── styles/   # CSS files
│   └── Dockerfile
└── docker-compose.yml
```

## 🔒 Security Features

- Password hashing (bcrypt)
- JWT token authentication
- Protected API routes
- SQL injection prevention (Sequelize ORM)
- Input validation & sanitization

## 📝 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Detailed API endpoints
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment steps
- **[Quick Start](./QUICKSTART.md)** - Fast setup guide
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues & solutions

## 📄 License

MIT License - Created for ServiceHive Full Stack Intern technical assessment.

---

**Author**: Anuj Mondal  
**GitHub**: [github.com/AnujMondal](https://github.com/AnujMondal)  
**Date**: November 2025

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

**Author**: Anuj Mondal
**Date**: November 2025  
**Contact**: anujmondal2504@gmail.com

Thank you for reviewing my submission! I look forward to discussing the implementation and design decisions.
