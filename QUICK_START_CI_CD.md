# Quick Start: CI/CD Pipeline Setup

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Backend Test Dependencies
```bash
cd backend
npm install
```

### Step 2: Set Up GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Add these secrets:
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password/token

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

### Step 4: Check Pipeline
- Go to **Actions** tab in GitHub
- Watch the pipeline run
- All stages should show ✅ when complete

## 📋 Pipeline Stages

1. **Build & Test Frontend** - Installs deps, runs tests, builds React app
2. **Build & Test Backend** - Installs deps, runs tests with PostgreSQL
3. **Build & Push Docker Images** - Builds and pushes 3 images to Docker Hub
4. **Deploy to Staging** (optional) - Deploys to staging server
5. **Deploy to Kubernetes** (optional) - Deploys to K8s cluster

## ✅ Testing the Pipeline

### Test Locally First:
```bash
# Frontend
npm install --legacy-peer-deps
npm test -- --watchAll=false
npm run build

# Backend
cd backend
npm install
npm test
```

### Trigger Pipeline:
- **Push to main/master** → Full pipeline (build, test, push, deploy)
- **Create Pull Request** → Build and test only (no push/deploy)

## 📸 Screenshot Requirements

For submission, capture:
1. Go to **Actions** tab
2. Click on a completed workflow
3. Screenshot should show:
   - All jobs with ✅ green checkmarks
   - Job names visible
   - Branch and commit info

## 🔧 Troubleshooting

**Pipeline fails at tests?**
- Run tests locally first: `npm test` and `cd backend && npm test`
- Check test files for errors

**Docker push fails?**
- Verify Docker Hub credentials in GitHub Secrets
- Check image names match your Docker Hub username

**Need help?**
- See full guide: `DEPLOYMENT_GUIDE.md`


