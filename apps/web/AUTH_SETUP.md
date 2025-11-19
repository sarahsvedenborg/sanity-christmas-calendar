# Entra ID (Azure AD) SSO Authentication Setup

This application uses NextAuth.js v5 with Microsoft Entra ID (formerly Azure AD) for single sign-on authentication.

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# NextAuth.js Secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your-secret-key-here

# Microsoft Entra ID App Registration Details
AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID=your-client-id
AUTH_MICROSOFT_ENTRA_ID_SECRET=your-client-secret
AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=your-tenant-id
```

## Setting up Microsoft Entra ID App Registration

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Click "New registration"
3. Name your app (e.g., "Christmas Calendar")
4. Set redirect URI to: `http://localhost:3000/api/auth/callback/microsoft-entra-id` (for dev)
5. For production, add: `https://yourdomain.com/api/auth/callback/microsoft-entra-id`
6. Copy the **Application (client) ID** → `AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID`
7. Copy the **Directory (tenant) ID** → `AUTH_MICROSOFT_ENTRA_ID_TENANT_ID`
8. **To get the Client Secret (`AUTH_MICROSOFT_ENTRA_ID_SECRET`):**
   - In your app registration, go to **"Certificates & secrets"** in the left menu
   - Click **"New client secret"**
   - Add a description (e.g., "Christmas Calendar App Secret")
   - Choose an expiration period (recommended: 24 months)
   - Click **"Add"**
   - **⚠️ IMPORTANT**: Copy the **Value** column immediately - it's only shown once!
   - This value is your `AUTH_MICROSOFT_ENTRA_ID_SECRET`
   - Note: The "Secret ID" shown in the list is NOT the secret value you need
   - If you lose the value, you'll need to create a new secret

## How It Works

- **Public pages**: All visitors can view the calendar, blog posts, definitions, and answers
- **Protected pages**: The `/progresjon` page requires authentication
- **Middleware**: Automatically redirects unauthenticated users to the sign-in page when accessing `/progresjon`
- **User progress**: Fetched based on the authenticated user's email address from Entra ID

## Features

- ✅ SSO login with Microsoft Entra ID
- ✅ Protected progress page (requires login)
- ✅ Automatic redirect to sign-in when accessing protected routes
- ✅ Logout functionality in navbar
- ✅ User progress fetched by authenticated email

