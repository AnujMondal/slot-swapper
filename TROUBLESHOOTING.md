# 🔧 Troubleshooting Guide - SlotSwapper

Common issues and their solutions when setting up and running SlotSwapper.

---

## 📑 Table of Contents

1. [Installation Issues](#installation-issues)
2. [Database Issues](#database-issues)
3. [Backend Issues](#backend-issues)
4. [Frontend Issues](#frontend-issues)
5. [Docker Issues](#docker-issues)
6. [API/Network Issues](#apinetwork-issues)
7. [Authentication Issues](#authentication-issues)
8. [Common Errors](#common-errors)

---

## Installation Issues

### Issue: `npm install` fails

**Symptoms:**

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clear npm cache:**

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Use legacy peer deps:**

```bash
npm install --legacy-peer-deps
```

3. **Update npm:**

```bash
npm install -g npm@latest
```

4. **Check Node.js version:**

```bash
node --version  # Should be 16 or higher
```

### Issue: `Permission denied` during npm install

**Solution:**

```bash
# Fix npm permissions (Mac/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

---

## Database Issues

### Issue: `database "slotswapper" does not exist`

**Symptoms:**

```
SequelizeConnectionError: database "slotswapper" does not exist
```

**Solutions:**

1. **Create the database:**

```bash
# Using createdb command
createdb slotswapper

# Or using psql
psql -U postgres
CREATE DATABASE slotswapper;
\q
```

2. **Verify database exists:**

```bash
psql -U postgres -c "\l" | grep slotswapper
```

### Issue: PostgreSQL not running

**Symptoms:**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

**Mac:**

```bash
# Start PostgreSQL
brew services start postgresql@15

# Check status
brew services list

# If not installed
brew install postgresql@15
```

**Linux:**

```bash
# Start PostgreSQL
sudo service postgresql start

# Check status
sudo service postgresql status

# Enable auto-start
sudo systemctl enable postgresql
```

**Windows:**

```bash
# Start PostgreSQL service
net start postgresql-x64-15

# Or use pgAdmin
```

### Issue: Authentication failed for user

**Symptoms:**

```
SequelizeConnectionError: password authentication failed for user "postgres"
```

**Solutions:**

1. **Reset PostgreSQL password:**

```bash
# Mac/Linux
psql -U postgres
ALTER USER postgres PASSWORD 'newpassword';
\q

# Update backend/.env
DB_PASSWORD=newpassword
```

2. **Check pg_hba.conf:**

```bash
# Find config file
psql -U postgres -c "SHOW hba_file;"

# Edit the file (change 'md5' to 'trust' temporarily)
# Then restart PostgreSQL
```

### Issue: Too many connections

**Symptoms:**

```
Error: remaining connection slots are reserved
```

**Solution:**

```bash
# Increase max_connections in postgresql.conf
psql -U postgres
ALTER SYSTEM SET max_connections = 100;
SELECT pg_reload_conf();
\q
```

---

## Backend Issues

### Issue: Backend won't start

**Symptoms:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Kill process on port 5000:**

```bash
# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Or change port in backend/src/server.js
const PORT = process.env.PORT || 5001;
```

2. **Check if backend is already running:**

```bash
ps aux | grep node
```

### Issue: JWT_SECRET not defined

**Symptoms:**

```
Error: JWT_SECRET is not defined in environment variables
```

**Solution:**

```bash
# Add to backend/.env
JWT_SECRET=your-very-long-random-secret-key-at-least-32-characters

# Or generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Issue: Models not syncing

**Symptoms:**

```
Error: relation "users" does not exist
```

**Solutions:**

1. **Force sync (CAUTION: Drops all tables):**

```javascript
// In backend/src/server.js (development only!)
await sequelize.sync({ force: true });
```

2. **Drop and recreate database:**

```bash
dropdb slotswapper
createdb slotswapper
npm run dev  # Tables will be created automatically
```

### Issue: CORS errors even with CORS enabled

**Symptoms:**

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**

```javascript
// In backend/src/server.js
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
```

---

## Frontend Issues

### Issue: Frontend won't start

**Symptoms:**

```
Error: Port 5173 is already in use
```

**Solution:**

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or edit vite.config.ts to use different port
export default defineConfig({
  server: { port: 3001 }
})
```

### Issue: TypeScript errors during build

**Symptoms:**

```
error TS2307: Cannot find module './types'
```

**Solutions:**

1. **Reinstall dependencies:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

2. **Check tsconfig.json:**

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: API calls return 404

**Symptoms:**

```
GET http://localhost:5173/api/events 404 (Not Found)
```

**Solution:**

```typescript
// Check frontend/src/utils/api.ts
const api = axios.create({
  baseURL: "http://localhost:5000", // Backend URL, not frontend!
});
```

### Issue: White screen after build

**Symptoms:**

- Production build shows blank page
- Console shows 404 errors for assets

**Solution:**

```typescript
// In vite.config.ts
export default defineConfig({
  base: "/", // Or your deployment base path
  build: {
    outDir: "dist",
  },
});
```

---

## Docker Issues

### Issue: Docker Compose fails to start

**Symptoms:**

```
ERROR: The Compose file is invalid
```

**Solutions:**

1. **Check Docker version:**

```bash
docker --version  # Should be 20.10+
docker-compose --version  # Should be 2.0+
```

2. **Validate docker-compose.yml:**

```bash
docker-compose config
```

### Issue: Database connection fails in Docker

**Symptoms:**

```
Backend can't connect to PostgreSQL container
```

**Solution:**

```yaml
# In backend/.env (when using Docker)
DB_HOST=postgres  # Use service name, not 'localhost'
DB_PORT=5432
DB_NAME=slotswapper
DB_USER=postgres
DB_PASSWORD=postgres123
```

### Issue: Port already in use

**Symptoms:**

```
ERROR: for backend  Cannot start service backend: Ports are not available
```

**Solution:**

```bash
# Stop conflicting services
docker-compose down

# Or change ports in docker-compose.yml
ports:
  - "5001:5000"  # Change external port
```

### Issue: Images won't build

**Symptoms:**

```
ERROR: failed to solve: failed to compute cache key
```

**Solutions:**

1. **Clean Docker cache:**

```bash
docker system prune -a
docker volume prune
```

2. **Rebuild without cache:**

```bash
docker-compose build --no-cache
docker-compose up
```

### Issue: Container exits immediately

**Symptoms:**

```
backend_1 exited with code 1
```

**Solution:**

```bash
# Check logs
docker-compose logs backend

# Check if dependencies are installed
docker-compose exec backend ls node_modules

# Rebuild if needed
docker-compose build backend
```

---

## API/Network Issues

### Issue: API returns 401 Unauthorized

**Symptoms:**

```
{
  "error": "No token provided"
}
```

**Solutions:**

1. **Check if token is stored:**

```javascript
// In browser console
console.log(localStorage.getItem("token"));
```

2. **Check API interceptor:**

```typescript
// frontend/src/utils/api.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

3. **Login again:**

- Token might have expired (7-day expiry)
- Clear localStorage and login again

### Issue: API returns 500 Internal Server Error

**Symptoms:**

```
{
  "error": "Server error"
}
```

**Solutions:**

1. **Check backend logs:**

```bash
# Look for error stack trace in terminal where backend is running
```

2. **Check database connection:**

```bash
# Verify PostgreSQL is running and accessible
psql -U postgres -d slotswapper -c "SELECT 1;"
```

3. **Check for missing fields:**

- Ensure all required fields are sent in request
- Check API_DOCUMENTATION.md for required fields

### Issue: Requests timeout

**Symptoms:**

```
Error: timeout of 5000ms exceeded
```

**Solution:**

```typescript
// Increase timeout in frontend/src/utils/api.ts
const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000, // 10 seconds
});
```

---

## Authentication Issues

### Issue: Can't login after signup

**Symptoms:**

- Signup succeeds but login fails
- "Invalid credentials" error

**Solutions:**

1. **Check password hashing:**

```javascript
// In User model - ensure beforeCreate hook exists
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});
```

2. **Verify user exists:**

```bash
psql -U postgres -d slotswapper
SELECT id, email FROM users;
\q
```

3. **Check password comparison:**

```javascript
// In authController.js
const isMatch = await user.comparePassword(password);
```

### Issue: Token expired immediately

**Symptoms:**

- Login works but immediately logged out
- Token seems invalid right after generation

**Solution:**

```javascript
// Check JWT_EXPIRES_IN in backend/.env
JWT_EXPIRES_IN=7d  # Not '7' or '7days'

// Verify token generation
const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);
```

### Issue: Can't access protected routes

**Symptoms:**

- Redirected to login even after successful login

**Solution:**

```typescript
// Check AuthContext in frontend
const { user, loading } = useAuth();

if (loading) {
  return <div>Loading...</div>; // Important!
}

if (!user) {
  return <Navigate to="/login" />;
}
```

---

## Common Errors

### Error: `bcrypt` installation fails

**Solution:**

```bash
# Install build tools
# Mac:
xcode-select --install

# Ubuntu/Debian:
sudo apt-get install build-essential

# Then reinstall
npm rebuild bcrypt
```

### Error: `Sequelize` connection refused

**Solution:**

```bash
# Check all connection parameters
psql "postgresql://postgres:password@localhost:5432/slotswapper"

# If it works, update backend/.env accordingly
```

### Error: React `useState` not updating

**Solution:**

```typescript
// Always create new object/array
setEvents([...events, newEvent]); // Good
setEvents(events.push(newEvent)); // Bad
```

### Error: Event times not displaying correctly

**Solution:**

```typescript
// Use consistent date format
import { format } from "date-fns";

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "PPpp");
};
```

---

## 🆘 Still Having Issues?

If none of the above solutions work:

1. **Check all environment variables**

   ```bash
   # Backend
   cat backend/.env

   # Frontend
   cat frontend/.env
   ```

2. **Verify all services are running**

   ```bash
   # PostgreSQL
   pg_isready

   # Backend
   curl http://localhost:5000/api/auth/me

   # Frontend
   curl http://localhost:5173
   ```

3. **Start fresh**

   ```bash
   # Stop everything
   docker-compose down
   pkill -f node

   # Clean everything
   rm -rf backend/node_modules backend/package-lock.json
   rm -rf frontend/node_modules frontend/package-lock.json

   # Recreate database
   dropdb slotswapper
   createdb slotswapper

   # Reinstall and restart
   cd backend && npm install && npm run dev &
   cd frontend && npm install && npm run dev
   ```

4. **Check system resources**

   ```bash
   # Disk space
   df -h

   # Memory
   free -m  # Linux
   vm_stat  # Mac
   ```

5. **Review logs carefully**
   - Backend terminal output
   - Frontend browser console
   - PostgreSQL logs
   - Docker logs (if using Docker)

---

## 📝 Debugging Tips

### Enable Verbose Logging

**Backend:**

```javascript
// In backend/src/server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Body:", req.body);
  console.log("Headers:", req.headers);
  next();
});
```

**Frontend:**

```typescript
// In frontend/src/utils/api.ts
api.interceptors.request.use((config) => {
  console.log("Request:", config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Error:", error.response || error);
    return Promise.reject(error);
  }
);
```

### Test API with cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get events (replace TOKEN)
curl http://localhost:5000/api/events \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔍 Additional Resources

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Sequelize Docs: https://sequelize.org/docs/
- Express.js Docs: https://expressjs.com/
- React Docs: https://react.dev/
- Vite Docs: https://vitejs.dev/
- Docker Docs: https://docs.docker.com/

---

**Remember:** Most issues are caused by:

1. Environment variables not set correctly
2. Services not running (PostgreSQL, backend, frontend)
3. Port conflicts
4. Outdated dependencies
5. Missing database or tables

Always check these first! 🔍
