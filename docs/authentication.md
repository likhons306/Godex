# Authentication

This document outlines the authentication mechanism used in the Godex application.

## GitHub OAuth with NextAuth.js

Godex uses [NextAuth.js](https://next-auth.js.org/) to handle authentication. We have implemented a GitHub OAuth flow, allowing users to sign in with their GitHub accounts.

### Configuration

The NextAuth.js configuration is located in `server/auth.js`. It uses the `GitHubProvider` to connect to the GitHub OAuth application.

The following environment variables are required for the GitHub provider to function correctly:

-   `GITHUB_ID`: The client ID of the GitHub OAuth application.
-   `GITHUB_SECRET`: The client secret of the GitHub OAuth application.
-   `NEXTAUTH_URL`: The canonical URL of the deployed application.
-   `NEXTAUTH_SECRET`: A secret key used to sign the NextAuth.js JWT.

These variables should be stored in a `.env` file in the root of the project.

### API Routes

The NextAuth.js API routes are handled by the Express server in `server/api.js`. The following route is used to catch all authentication requests:

```javascript
app.all('/api/auth/*', (req, res) => {
  NextAuth(req, res, authOptions);
});
```

This ensures that all requests to `/api/auth/*` are handled by the NextAuth.js library, which manages the entire OAuth flow.