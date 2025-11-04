# SlotSwapper API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Sign Up

Create a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**

- `name`: Required, 2-100 characters
- `email`: Required, valid email format, must be unique
- `password`: Required, minimum 6 characters

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing fields or email already exists
- `500 Internal Server Error`: Server error

---

### 2. Log In

Authenticate and receive a JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

### 3. Get Current User

Get the authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

---

## Event Endpoints

### 4. Get My Events

Get all events for the authenticated user.

**Endpoint:** `GET /api/events`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Team Meeting",
      "description": "Weekly sync with the team",
      "startTime": "2024-01-16T10:00:00.000Z",
      "endTime": "2024-01-16T11:00:00.000Z",
      "status": "SWAPPABLE",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "title": "Doctor Appointment",
      "description": null,
      "startTime": "2024-01-17T14:00:00.000Z",
      "endTime": "2024-01-17T15:00:00.000Z",
      "status": "BUSY",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

---

### 5. Get Single Event

Get a specific event by ID (must belong to authenticated user).

**Endpoint:** `GET /api/events/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Team Meeting",
    "description": "Weekly sync with the team",
    "startTime": "2024-01-16T10:00:00.000Z",
    "endTime": "2024-01-16T11:00:00.000Z",
    "status": "SWAPPABLE",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `404 Not Found`: Event not found or doesn't belong to user

---

### 6. Create Event

Create a new calendar event.

**Endpoint:** `POST /api/events`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "Team Meeting",
  "description": "Weekly sync with the team",
  "startTime": "2024-01-16T10:00:00.000Z",
  "endTime": "2024-01-16T11:00:00.000Z",
  "status": "BUSY"
}
```

**Field Requirements:**

- `title`: Required
- `description`: Optional
- `startTime`: Required, ISO 8601 date string
- `endTime`: Required, ISO 8601 date string (must be after startTime)
- `status`: Optional, defaults to "BUSY". Valid values: "BUSY", "SWAPPABLE"

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Event created successfully.",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Team Meeting",
    "description": "Weekly sync with the team",
    "startTime": "2024-01-16T10:00:00.000Z",
    "endTime": "2024-01-16T11:00:00.000Z",
    "status": "BUSY",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing required fields or invalid dates

---

### 7. Update Event

Update an existing event.

**Endpoint:** `PUT /api/events/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body (all fields optional):**

```json
{
  "title": "Updated Team Meeting",
  "description": "Updated description",
  "startTime": "2024-01-16T11:00:00.000Z",
  "endTime": "2024-01-16T12:00:00.000Z",
  "status": "SWAPPABLE"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Event updated successfully.",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Updated Team Meeting",
    "description": "Updated description",
    "startTime": "2024-01-16T11:00:00.000Z",
    "endTime": "2024-01-16T12:00:00.000Z",
    "status": "SWAPPABLE",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Cannot update event with pending swap, or invalid data
- `404 Not Found`: Event not found or doesn't belong to user

---

### 8. Delete Event

Delete an event.

**Endpoint:** `DELETE /api/events/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Event deleted successfully."
}
```

**Error Responses:**

- `400 Bad Request`: Cannot delete event with pending swap
- `404 Not Found`: Event not found or doesn't belong to user

---

## Swap Endpoints

### 9. Get Swappable Slots

Get all slots from other users that are marked as SWAPPABLE.

**Endpoint:** `GET /api/swappable-slots`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "title": "Focus Block",
      "description": "Deep work time",
      "startTime": "2024-01-17T14:00:00.000Z",
      "endTime": "2024-01-17T16:00:00.000Z",
      "status": "SWAPPABLE",
      "userId": "550e8400-e29b-41d4-a716-446655440099",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "owner": {
        "id": "550e8400-e29b-41d4-a716-446655440099",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  ]
}
```

---

### 10. Create Swap Request

Request to swap your slot with another user's slot.

**Endpoint:** `POST /api/swap-request`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "mySlotId": "660e8400-e29b-41d4-a716-446655440001",
  "theirSlotId": "770e8400-e29b-41d4-a716-446655440003",
  "message": "Would love to swap! This works better for me."
}
```

**Field Requirements:**

- `mySlotId`: Required, UUID of your SWAPPABLE slot
- `theirSlotId`: Required, UUID of another user's SWAPPABLE slot
- `message`: Optional, message to the other user

**Validation:**

- Both slots must exist and be SWAPPABLE
- `mySlotId` must belong to you
- `theirSlotId` must belong to another user
- Neither slot can have another pending swap

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Swap request created successfully.",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440004",
    "requesterId": "550e8400-e29b-41d4-a716-446655440000",
    "receiverId": "550e8400-e29b-41d4-a716-446655440099",
    "requesterSlotId": "660e8400-e29b-41d4-a716-446655440001",
    "receiverSlotId": "770e8400-e29b-41d4-a716-446655440003",
    "status": "PENDING",
    "message": "Would love to swap! This works better for me.",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z",
    "requester": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "receiver": {
      "id": "550e8400-e29b-41d4-a716-446655440099",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "requesterSlot": { ... },
    "receiverSlot": { ... }
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid slots, slots not swappable, or pending swap exists
- `403 Forbidden`: Trying to swap your own slot
- `404 Not Found`: One or both slots not found

---

### 11. Respond to Swap Request

Accept or reject an incoming swap request.

**Endpoint:** `POST /api/swap-response/:requestId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "accept": true
}
```

**Field Requirements:**

- `accept`: Required, boolean (true to accept, false to reject)

**Behavior:**

- **If accepted**: Slots exchange ownership, both set to BUSY, request marked ACCEPTED
- **If rejected**: Both slots set back to SWAPPABLE, request marked REJECTED

**Success Response (200 OK) - Accepted:**

```json
{
  "success": true,
  "message": "Swap request accepted. Slots have been exchanged.",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440004",
    "status": "ACCEPTED",
    ...
  }
}
```

**Success Response (200 OK) - Rejected:**

```json
{
  "success": true,
  "message": "Swap request rejected. Slots are now available again.",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440004",
    "status": "REJECTED",
    ...
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing accept field or swap already processed
- `403 Forbidden`: Not authorized to respond (not the receiver)
- `404 Not Found`: Swap request not found

---

### 12. Get My Swap Requests

Get all swap requests involving the authenticated user.

**Endpoint:** `GET /api/swap-requests`

**Query Parameters:**

- `type` (optional): Filter by type
  - `incoming`: Only requests you received
  - `outgoing`: Only requests you sent
  - Omit for both

**Headers:** `Authorization: Bearer <token>`

**Example:** `GET /api/swap-requests?type=incoming`

**Success Response (200 OK) - All:**

```json
{
  "success": true,
  "count": 5,
  "data": {
    "incoming": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440004",
        "status": "PENDING",
        "message": "Would love to swap!",
        "createdAt": "2024-01-15T12:00:00.000Z",
        "requester": {
          "id": "...",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "receiver": {
          "id": "...",
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "requesterSlot": {
          "id": "...",
          "title": "Team Meeting",
          "startTime": "2024-01-16T10:00:00.000Z",
          "endTime": "2024-01-16T11:00:00.000Z"
        },
        "receiverSlot": {
          "id": "...",
          "title": "Focus Block",
          "startTime": "2024-01-17T14:00:00.000Z",
          "endTime": "2024-01-17T16:00:00.000Z"
        }
      }
    ],
    "outgoing": [
      ...
    ]
  }
}
```

**Success Response (200 OK) - Filtered:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440004",
      "status": "PENDING",
      ...
    }
  ]
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode only)"
}
```

## Status Codes

- `200 OK`: Successful GET, PUT, DELETE, or POST (non-creation)
- `201 Created`: Successful POST (resource creation)
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized for this resource
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Notes

### Event Status Flow

```
BUSY ←→ SWAPPABLE → SWAP_PENDING → BUSY (after accepted)
                   ↓
                SWAPPABLE (after rejected)
```

### Swap Request Status Flow

```
PENDING → ACCEPTED (slots exchanged)
       ↓
       REJECTED (slots restored)
```

### Important Constraints

1. You cannot swap your own slots
2. You cannot create swap requests if either slot has a pending swap
3. You cannot update or delete events with SWAP_PENDING status
4. Only the receiver can respond to a swap request
5. Swap requests can only be responded to once (PENDING status)

---

**Last Updated:** November 2025
