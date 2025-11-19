# Troubleshooting "invalid_client" Error

The `invalid_client` error means Microsoft Entra ID rejected your authentication request. Here are the most common causes and fixes:

## 1. Redirect URI Mismatch (Most Common!)

**The redirect URI in Azure must EXACTLY match what NextAuth.js uses.**

### NextAuth.js redirect URI format:
- **Development**: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
- **Production**: `https://yourdomain.com/api/auth/callback/microsoft-entra-id`

### How to fix in Azure Portal:
1. Go to your app registration in Azure Portal
2. Click **"Authentication"** in the left menu
3. Under **"Platform configurations"**, click **"Add a platform"** → **"Web"**
4. Add BOTH redirect URIs:
   - `http://localhost:3000/api/auth/callback/microsoft-entra-id` (for dev)
   - `https://your-production-domain.com/api/auth/callback/microsoft-entra-id` (for prod)
5. Make sure **"ID tokens"** is checked under "Implicit grant and hybrid flows"
6. Click **"Configure"** and **"Save"**

## 2. Client Secret Issues

- Make sure you're using the **Value** (not the Secret ID)
- Check if the secret has expired
- Create a new secret if needed and update `.env.local`

## 3. Environment Variables

Make sure your `.env.local` file has:
```bash
AUTH_SECRET=your-generated-secret
AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID=your-client-id
AUTH_MICROSOFT_ENTRA_ID_SECRET=your-client-secret-value
AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=your-tenant-id
```

## 4. Tenant ID Format

The Tenant ID should be:
- A GUID format (e.g., `12345678-1234-1234-1234-123456789abc`)
- Or `common` for multi-tenant (not recommended for org apps)
- Or `organizations` for any org account

## 5. Check Azure App Registration Status

Make sure your app registration:
- Status is **Active**
- Has **Web** platform added
- Redirect URIs are correctly configured (see #1)

## Quick Checklist:
- ✅ Redirect URI matches exactly (including protocol, port, path)
- ✅ Client Secret Value (not ID) is correct and not expired
- ✅ Client ID is correct
- ✅ Tenant ID is correct
- ✅ Environment variables are loaded (restart dev server after changes)

