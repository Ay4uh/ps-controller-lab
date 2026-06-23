# Project-Specific Rules for AntiGravity Agent

## Code Delivery and Deployment Rule
* **Automatic Deployment on Push**: The repository is configured to build and deploy to Cloudflare Pages (`ay5uh.com`) automatically via GitHub Actions whenever changes are pushed to the `main` branch.
* **Commit and Push Instruction**: For every task that involves modifying the code, database configurations, front-end assets, or backend logic:
  1. Verify the changes locally.
  2. Stage and commit all changes.
  3. Push the commits directly to the remote origin `main` branch (`git push origin main`).
  4. Ensure the deployment pipeline is kicked off so that the user can see the results live on the website.
