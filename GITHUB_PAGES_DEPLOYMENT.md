# Deploying the Tournament App to GitHub Pages

This guide will walk you through the process of deploying your Tournament application to GitHub Pages at https://inter2025.tenimaleta.com.

## Prerequisites

- A GitHub account with access to the repository at https://github.com/tenimaleta/inter-2025
- Git installed on your local machine
- Node.js and npm installed on your local machine

## Step 1: Push Your Code to GitHub

If the repository doesn't exist yet, create it on GitHub and push your code:

```bash
# Initialize git repository if not already done
git init

# Add the remote repository
git remote add origin https://github.com/tenimaleta/inter-2025.git

# Add all files
git add .

# Commit the files
git commit -m "Initial commit for GitHub Pages deployment"

# Push to GitHub
git push -u origin main  # Use your main branch name if different
```

## Step 2: Configure GitHub Repository Settings

1. Go to your repository on GitHub: https://github.com/tenimaleta/inter-2025
2. Navigate to Settings > Pages
3. Under "Source", select "GitHub Actions" (this will be used by our workflow)
4. Save your settings

## Step 3: Deploy Using GitHub Actions

The repository is already configured with a GitHub Actions workflow that will automatically deploy your app to GitHub Pages whenever you push to the main branch.

To trigger the deployment manually:

1. Go to your repository on GitHub
2. Navigate to Actions tab
3. Select the "Deploy to GitHub Pages" workflow
4. Click "Run workflow" and select the branch you want to deploy from
5. Click the green "Run workflow" button

## Step 4: Deploy Manually (Alternative Method)

If you prefer to deploy manually without using GitHub Actions:

```bash
# Install dependencies if you haven't already
npm install

# Deploy to GitHub Pages
npm run deploy
```

This will build your application and push it to the `gh-pages` branch of your repository.

## Step 5: Verify Deployment

After the deployment (either via GitHub Actions or manual), wait a few minutes and then visit:

https://inter2025.tenimaleta.com

Your tournament application should now be live on GitHub Pages!

## Troubleshooting

### If the site doesn't load correctly:

1. Check if there are any console errors in your browser (F12 > Console)
2. Verify that the base URL in `vite.config.ts` is set to `/`
3. Check GitHub Actions logs for any deployment errors

### API Connection Issues:

If your app can't connect to the API:
1. Verify that your frontend is using the correct API URL: `https://demo-api.tenimaleta.com/api`
2. Check that the API server is running and accessible
3. Check for CORS issues in the browser console

## Updating Your Deployment

To update your GitHub Pages site after making changes:

1. Commit and push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Update app features"
   git push
   ```

2. GitHub Actions will automatically redeploy your site

## Notes on Environment Configuration

- Remember that GitHub Pages hosts static content only
- Your API server must be hosted separately (as you've done on your VPS)
- Keep sensitive information out of your client-side code

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions) 