# CI/CD Pipeline Setup and Testing Guide

This guide provides complete instructions for setting up and testing the GitHub Actions CI/CD pipeline.

## Prerequisites

1. GitHub account
2. Docker Hub account (or GitHub Container Registry)
3. (Optional) Staging server with SSH access
4. (Optional) Kubernetes cluster

## Step 1: Set Up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### Required Secrets:

1. **DOCKER_USERNAME**
   - Your Docker Hub username
   - Example: `myusername`

2. **DOCKER_PASSWORD**
   - Your Docker Hub password or access token
   - For better security, use a Docker Hub access token instead of password
   - Create token: Docker Hub → Account Settings → Security → New Access Token

### Optional Secrets (for Staging Deployment):

3. **STAGING_HOST**
   - IP address or domain of your staging server
   - Example: `192.168.1.100` or `staging.example.com`

4. **STAGING_USER**
   - SSH username for staging server
   - Example: `deploy`

5. **STAGING_SSH_KEY**
   - Private SSH key for accessing staging server
   - Generate with: `ssh-keygen -t rsa -b 4096 -C "github-actions"`
   - Copy the private key content (including `-----BEGIN` and `-----END` lines)

### Optional Secrets (for Kubernetes Deployment):

6. **KUBE_CONFIG**
   - Base64 encoded Kubernetes config file
   - Encode with: `cat ~/.kube/config | base64`
   - Or use service account token method

## Step 2: Push Code to GitHub

1. Initialize git repository (if not already done):
```bash
cd habit-tracker
git init
git add .
git commit -m "Initial commit with CI/CD pipeline"
```

2. Create a GitHub repository and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
git branch -M main
git push -u origin main
```

## Step 3: Install Backend Test Dependencies

Before the pipeline runs, install test dependencies locally:

```bash
cd backend
npm install
```

This will install `jest` and `supertest` for backend testing.

## Step 4: Test the Pipeline Locally (Optional)

### Test Frontend Build:
```bash
npm install --legacy-peer-deps
npm test -- --watchAll=false
npm run build
```

### Test Backend Build:
```bash
cd backend
npm install
npm test
```

### Test Docker Builds:
```bash
# Build frontend
docker build -f Dockerfile.frontend -t habit-tracker-frontend:test .

# Build backend
docker build -f backend/Dockerfile -t habit-tracker-backend:test ./backend

# Build database
docker build -f database/Dockerfile -t habit-tracker-db:test ./database
```

## Step 5: Trigger the Pipeline

### Method 1: Push to Main Branch
```bash
git add .
git commit -m "Trigger CI/CD pipeline"
git push origin main
```

### Method 2: Create a Pull Request
1. Create a new branch:
```bash
git checkout -b feature/test-pipeline
git add .
git commit -m "Test CI/CD pipeline"
git push origin feature/test-pipeline
```

2. Go to GitHub → Pull Requests → New Pull Request
3. Create PR from your branch to `main`

## Step 6: Monitor Pipeline Execution

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. You'll see the pipeline running with these stages:
   - ✅ Build & Test Frontend
   - ✅ Build & Test Backend
   - ✅ Build & Push Docker Images (only on push, not PR)
   - ✅ Deploy to Staging (only on main/master branch)
   - ✅ Deploy to Kubernetes (only on main/master branch, if configured)

## Step 7: Verify Pipeline Results

### Check Test Results:
- Click on any job to see detailed logs
- Frontend tests should show coverage report
- Backend tests should pass

### Check Docker Images:
1. Go to Docker Hub → Your repositories
2. You should see:
   - `habit-tracker-frontend:latest`
   - `habit-tracker-backend:latest`
   - `habit-tracker-db:latest`

### Verify Image Tags:
Images are tagged with:
- `latest` (for main/master branch)
- `main-<sha>` (commit SHA)
- Branch name (for other branches)

## Step 8: Test Staging Deployment (If Configured)

1. SSH into your staging server:
```bash
ssh deploy@staging.example.com
```

2. Check if containers are running:
```bash
cd /opt/habit-tracker
docker-compose ps
```

3. Test the application:
```bash
curl http://localhost:3000
curl http://localhost:5000/health
```

## Step 9: Test Kubernetes Deployment (If Configured)

1. Verify deployments:
```bash
kubectl get deployments
kubectl get services
kubectl get pods
```

2. Check logs:
```bash
kubectl logs -f deployment/habit-tracker-frontend
kubectl logs -f deployment/habit-tracker-backend
```

## Troubleshooting

### Pipeline Fails at "Build & Test Frontend"
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check test files for errors

### Pipeline Fails at "Build & Test Backend"
- Ensure PostgreSQL service is running in GitHub Actions
- Check backend test files
- Verify environment variables

### Docker Build Fails
- Check Dockerfile syntax
- Verify all required files exist
- Check Docker Hub credentials in secrets

### Deployment Fails
- Verify SSH key is correct
- Check staging server accessibility
- Verify Kubernetes config is valid

## Pipeline Screenshot Requirements

To capture a successful pipeline screenshot:

1. Go to Actions tab
2. Click on a completed workflow run
3. Take screenshot showing:
   - All jobs with green checkmarks ✅
   - Job names visible
   - Duration/timing information
   - Branch name and commit SHA

## Customization Options

### Change Docker Registry
Edit `.github/workflows/ci-cd.yml`:
- Replace `docker.io` with `ghcr.io` for GitHub Container Registry
- Update image names accordingly

### Add More Test Stages
Add new jobs in the workflow file:
```yaml
lint-code:
  name: Lint Code
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm run lint
```

### Modify Deployment Strategy
- Update deployment steps in `deploy-staging` or `deploy-k8s` jobs
- Add rollback mechanisms
- Add notification steps (Slack, email, etc.)

## Next Steps

1. Set up production environment
2. Add security scanning (Snyk, Trivy)
3. Add performance testing
4. Set up monitoring and alerting
5. Configure branch protection rules


