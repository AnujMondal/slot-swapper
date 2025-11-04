# DEPLOYMENT.md

## Deployment Guide for SlotSwapper

This guide covers how to deploy SlotSwapper to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Monitoring](#monitoring)

---

## Prerequisites

- Node.js 16+ installed
- PostgreSQL 12+ database
- Domain name (optional, for production)
- SSL certificate (recommended for production)

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=slotswapper
DB_USER=your-db-user
DB_PASSWORD=your-secure-db-password

# JWT
JWT_SECRET=your-very-long-random-secret-key-at-least-32-characters
JWT_EXPIRES_IN=7d
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=https://your-api-domain.com
```

---

## Database Setup

### Option 1: Managed PostgreSQL (Recommended)

Use a managed PostgreSQL service:

- **AWS RDS**
- **Heroku Postgres**
- **DigitalOcean Managed Databases**
- **Azure Database for PostgreSQL**

### Option 2: Self-Hosted PostgreSQL

1. Install PostgreSQL on your server
2. Create the database:

```bash
createdb slotswapper
```

3. Update connection details in backend `.env`

---

## Backend Deployment

### Option 1: Deploy to Heroku

1. Install Heroku CLI
2. Login to Heroku:

```bash
heroku login
```

3. Create a new Heroku app:

```bash
cd backend
heroku create slotswapper-api
```

4. Add PostgreSQL addon:

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

5. Set environment variables:

```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_EXPIRES_IN=7d
heroku config:set NODE_ENV=production
```

6. Deploy:

```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Option 2: Deploy to Render

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables in Render dashboard

### Option 3: Deploy to AWS EC2

1. Launch EC2 instance (Ubuntu recommended)
2. SSH into instance
3. Install Node.js and PostgreSQL
4. Clone repository
5. Install dependencies: `npm install`
6. Use PM2 for process management:

```bash
npm install -g pm2
pm2 start src/server.js --name slotswapper-api
pm2 startup
pm2 save
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
cd frontend
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL

### Option 2: Deploy to Netlify

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Build the frontend:

```bash
cd frontend
npm run build
```

3. Deploy:

```bash
netlify deploy --prod --dir=dist
```

4. Set environment variables in Netlify dashboard

### Option 3: Deploy to AWS S3 + CloudFront

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Upload to S3:

```bash
aws s3 sync dist/ s3://your-bucket-name
```

3. Configure CloudFront distribution
4. Set up custom domain and SSL certificate

---

## Docker Deployment

### Deploy to Any Cloud Provider

1. Build and push Docker images:

```bash
# Build images
docker-compose build

# Tag images
docker tag slotswapper-backend:latest your-registry/slotswapper-backend:latest
docker tag slotswapper-frontend:latest your-registry/slotswapper-frontend:latest

# Push to registry
docker push your-registry/slotswapper-backend:latest
docker push your-registry/slotswapper-frontend:latest
```

2. Deploy using docker-compose on your server:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Deploy to AWS ECS

1. Create ECR repositories
2. Push images to ECR
3. Create ECS cluster
4. Create task definitions
5. Create services
6. Configure load balancer

### Deploy to Kubernetes

1. Create Kubernetes manifests:

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: slotswapper-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: slotswapper-backend
  template:
    metadata:
      labels:
        app: slotswapper-backend
    spec:
      containers:
        - name: backend
          image: your-registry/slotswapper-backend:latest
          ports:
            - containerPort: 5000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: slotswapper-secrets
                  key: database-url
```

2. Apply manifests:

```bash
kubectl apply -f k8s/
```

---

## Monitoring

### Application Monitoring

1. **Error Tracking**: Use Sentry

```bash
npm install @sentry/node
```

2. **Logging**: Use Winston or Pino

```bash
npm install winston
```

3. **Performance Monitoring**: Use New Relic or DataDog

### Database Monitoring

- Monitor connection pool usage
- Set up alerts for slow queries
- Regular backups (automated)

### Infrastructure Monitoring

- CPU and memory usage
- Disk space
- Network traffic
- SSL certificate expiration

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Backup Strategy

### Database Backups

Set up automated daily backups:

```bash
# Backup script
#!/bin/bash
BACKUP_DIR=/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql
```

### Application Backups

- Keep version control updated
- Regular Docker image snapshots
- Configuration files backup

---

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate installed
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Error tracking configured
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Documentation updated
- [ ] Team notified

---

## Rollback Strategy

In case of deployment issues:

1. **Docker**: Rollback to previous image

```bash
docker-compose down
docker-compose up -d --scale backend=0
docker-compose up -d
```

2. **Heroku**: Rollback release

```bash
heroku rollback
```

3. **Kubernetes**: Rollback deployment

```bash
kubectl rollout undo deployment/slotswapper-backend
```

---

## Performance Optimization

1. Enable gzip compression
2. Use CDN for static assets
3. Implement caching (Redis)
4. Database connection pooling
5. Load balancing for high traffic

---

For questions or issues, please refer to the main README.md or create an issue in the repository.
