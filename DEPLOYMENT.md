# Deploying Gratify Pro to Vercel

This guide explains how to deploy both the frontend and backend components of Gratify Pro to Vercel.

## Prerequisites

1. A Vercel account (sign up at vercel.com)
2. The Vercel CLI installed (optional, but recommended):
   ```
   npm install -g vercel
   ```
3. Git repository with your code

## Frontend Deployment

The frontend is a Next.js application that can be deployed directly to Vercel:

1. **Configuration**: 
   - A `vercel.json` file has already been created in the frontend directory
   - This file includes settings for build commands and API proxying

2. **Deploy via Vercel Dashboard**:
   - Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
   - Go to [vercel.com/new](https://vercel.com/new) and import your project
   - Select the repository and configure as follows:
     - Framework Preset: Next.js
     - Root Directory: `frontend`
     - Build Command: `npm run build` (should be auto-detected)
     - Output Directory: `.next` (should be auto-detected)
   - Click "Deploy"

3. **Deploy via Vercel CLI**:
   - Navigate to the frontend directory
   - Run `vercel login` if you haven't already
   - Run `vercel` and follow the prompts
   - For production deployment, use `vercel --prod`

## Backend Deployment

The backend is a FastAPI application that requires a few adjustments for serverless deployment:

1. **Configuration**:
   - A `vercel.json` file has already been created in the backend directory
   - A `requirements-vercel.txt` file contains dependencies for Vercel

2. **Deploy via Vercel Dashboard**:
   - Push your code to a Git repository
   - Go to [vercel.com/new](https://vercel.com/new) and import your project
   - Select the repository and configure as follows:
     - Framework Preset: Other
     - Root Directory: `backend`
     - Build Command: Leave as default
     - Output Directory: Leave as default
   - Set Environment Variables if needed (any secrets from .env files)
   - Click "Deploy"

3. **Deploy via Vercel CLI**:
   - Navigate to the backend directory
   - Run `vercel login` if you haven't already
   - Run `vercel` and follow the prompts
   - For production deployment, use `vercel --prod`

## Connecting Frontend and Backend

Once both are deployed:

1. Get the URL of your deployed backend (e.g., `https://api-gratify-pro.vercel.app`)
2. Update the frontend's API proxy in `frontend/vercel.json` to point to this URL:
   ```json
   "rewrites": [
     {
       "source": "/api/:path*",
       "destination": "https://your-backend-url.vercel.app/:path*"
     }
   ]
   ```
3. Redeploy the frontend to apply these changes

## Environment Variables

Set these in the Vercel project settings:

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: URL of your backend API (if not using the proxy)

### Backend Environment Variables
- Add any variables from your `.env` file that contain secrets or configuration

## Monitoring and Logs

- Access logs and deployment status from the Vercel dashboard
- For each deployment, you can view build logs, function logs, and overall status
- Set up alerts for failed deployments or errors

## Troubleshooting

- **CORS Issues**: Ensure the backend's CORS settings include your frontend URL
- **Build Failures**: Check the build logs for specific errors
- **Function Timeouts**: Vercel serverless functions have execution limits (try to keep API responses quick)
- **Package Size Limits**: If deployment fails due to size, consider optimizing dependencies

## Custom Domains

To use a custom domain:
1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your domain and follow the verification steps 