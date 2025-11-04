# Contributing to SlotSwapper

Thank you for your interest in contributing to SlotSwapper! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Commit Messages](#commit-messages)
7. [Pull Request Process](#pull-request-process)
8. [Project Structure](#project-structure)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/slotswapper.git
cd slotswapper
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/slotswapper.git
```

### Local Setup

1. Follow the [QUICKSTART.md](QUICKSTART.md) guide to set up the project
2. Create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

---

## Development Workflow

### 1. Update Your Fork

Before starting new work, sync with upstream:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/add-notification-system
# or
git checkout -b fix/swap-request-bug
# or
git checkout -b docs/update-api-docs
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 3. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Manual testing
npm run dev
```

### 5. Commit Your Changes

Follow the commit message guidelines (see below):

```bash
git add .
git commit -m "feat: add email notification for swap requests"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### Backend (Node.js/Express)

#### Style Guide

- Use ES6+ features (arrow functions, async/await, destructuring)
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Maximum line length: 100 characters

#### Example:

```javascript
// Good
const createEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const event = await Event.create({
      title,
      description,
      startTime,
      endTime,
      userId: req.user.id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Bad
const createEvent = (req, res) => {
  Event.create({
    title: req.body.title,
    description: req.body.description,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    userId: req.user.id,
  })
    .then((event) => {
      res.status(201).json(event);
    })
    .catch((error) => {
      res.status(500).json({ error: "Server error" });
    });
};
```

#### Best Practices

- Use async/await instead of callbacks
- Implement proper error handling
- Validate user input
- Use transactions for related database operations
- Add JSDoc comments for functions
- Keep functions small and focused

### Frontend (React/TypeScript)

#### Style Guide

- Use functional components with hooks
- Use TypeScript for type safety
- Use 2 spaces for indentation
- Use PascalCase for component names
- Use camelCase for functions and variables

#### Example:

```typescript
// Good
interface EventCardProps {
  event: Event;
  onToggleSwappable: (id: string) => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onToggleSwappable,
  onEdit,
  onDelete,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      {/* ... */}
    </div>
  );
};

// Bad
const eventcard = (props) => {
  return (
    <div className="event-card">
      <h3>{props.event.title}</h3>
    </div>
  );
};
```

#### Best Practices

- Define proper TypeScript interfaces
- Use React hooks appropriately
- Implement proper loading and error states
- Keep components focused and reusable
- Use Context API for global state
- Memoize expensive computations with useMemo
- Use useCallback for callback functions

### CSS

- Use CSS modules or scoped styles
- Follow BEM naming convention
- Mobile-first responsive design
- Use CSS variables for theming

```css
/* Good */
.event-card {
  padding: 1rem;
  border-radius: 8px;
}

.event-card__title {
  font-size: 1.25rem;
  font-weight: 600;
}

.event-card__description {
  color: var(--text-secondary);
}

/* Bad */
.ec {
  padding: 1rem;
}
```

---

## Testing Guidelines

### Backend Testing

Use Jest for backend testing:

```javascript
describe("Event Controller", () => {
  describe("createEvent", () => {
    it("should create a new event with valid data", async () => {
      const eventData = {
        title: "Test Event",
        startTime: "2024-01-20T10:00:00Z",
        endTime: "2024-01-20T11:00:00Z",
      };

      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${token}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(eventData.title);
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });
});
```

### Frontend Testing

Use Jest + React Testing Library:

```typescript
describe("EventCard", () => {
  it("renders event information correctly", () => {
    const event = {
      id: "1",
      title: "Test Event",
      description: "Test Description",
      startTime: "2024-01-20T10:00:00Z",
      endTime: "2024-01-20T11:00:00Z",
      status: "BUSY",
    };

    render(<EventCard event={event} />);

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("calls onToggleSwappable when toggle is clicked", () => {
    const onToggle = jest.fn();
    const event = {
      /* ... */
    };

    render(<EventCard event={event} onToggleSwappable={onToggle} />);

    fireEvent.click(screen.getByRole("switch"));

    expect(onToggle).toHaveBeenCalledWith(event.id);
  });
});
```

---

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(swap): add email notification for swap requests

Implemented email notifications that are sent when:
- A new swap request is received
- A swap request is accepted
- A swap request is rejected

Closes #123

---

fix(auth): prevent duplicate user registration

Added unique constraint check before user creation to prevent
race condition during simultaneous registration attempts.

Fixes #456

---

docs(api): update swap request endpoint documentation

Added missing parameters and response codes to the
POST /api/swap-request endpoint documentation.
```

---

## Pull Request Process

### Before Submitting

1. ✅ Update your branch with latest upstream changes
2. ✅ Run all tests and ensure they pass
3. ✅ Test manually in both development and production modes
4. ✅ Update documentation if needed
5. ✅ Ensure code follows style guidelines
6. ✅ Write clear commit messages

### PR Title Format

Follow the same format as commit messages:

```
feat(swap): add email notification for swap requests
```

### PR Description Template

```markdown
## Description

Brief description of what this PR does

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- Added email notification service
- Updated swap controller to send emails
- Added email templates

## Testing Done

- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Tested on different browsers

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing

## Related Issues

Closes #123
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Delete your feature branch after merge

---

## Project Structure

Understanding the project structure helps you navigate and contribute effectively:

```
slotswapper/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   └── database.js  # Sequelize configuration
│   │   ├── controllers/     # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   └── swapController.js
│   │   ├── middleware/      # Express middleware
│   │   │   └── auth.js      # JWT authentication
│   │   ├── models/          # Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── SwapRequest.js
│   │   │   └── index.js     # Model associations
│   │   ├── routes/          # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   └── swapRoutes.js
│   │   └── server.js        # Express app setup
│   ├── tests/               # Backend tests
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventModal.tsx
│   │   │   ├── MarketplaceCard.tsx
│   │   │   ├── SwapModal.tsx
│   │   │   └── SwapRequestCard.tsx
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Marketplace.tsx
│   │   │   └── Requests.tsx
│   │   ├── styles/          # CSS files
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/           # Utility functions
│   │   │   └── api.ts       # Axios configuration
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── tests/               # Frontend tests
│   └── package.json
│
├── docs/                    # Additional documentation
├── .gitignore
├── docker-compose.yml
├── README.md
├── API_DOCUMENTATION.md
├── DEPLOYMENT.md
├── QUICKSTART.md
└── CONTRIBUTING.md (this file)
```

---

## Feature Request Guidelines

### Before Requesting

1. Check if the feature already exists
2. Check if there's an open issue for it
3. Think about how it fits with project goals

### Creating a Feature Request

Use this template:

```markdown
## Feature Description

Clear description of the feature

## Problem It Solves

What problem does this feature solve?

## Proposed Solution

How should this feature work?

## Alternatives Considered

What other solutions did you consider?

## Additional Context

Any mockups, examples, or additional info
```

---

## Bug Report Guidelines

### Before Reporting

1. Check if the bug is already reported
2. Try to reproduce the bug
3. Check if it's been fixed in the latest version

### Creating a Bug Report

Use this template:

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior

What should happen?

## Actual Behavior

What actually happens?

## Environment

- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 120]
- Node.js version: [e.g., 18.17.0]

## Screenshots

If applicable

## Additional Context

Any other relevant information
```

---

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search closed issues
3. Ask in discussions
4. Reach out to maintainers

---

Thank you for contributing to SlotSwapper! 🎉
