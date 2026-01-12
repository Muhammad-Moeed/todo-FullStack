# Deployment Fix - Invalid Origin Error

## Problem
After deployment, getting "Invalid origin" error when trying to login/signup.

## Solution

### Step 1: Update Environment Variables

In your deployment platform (Vercel, Netlify, etc.), set these environment variables:

```env
# Your production domain (REQUIRED - must match your actual deployment URL exactly)
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-domain.com

# Trusted origins (OPTIONAL - comma-separated if multiple)
# If not set, the system will auto-detect based on BETTER_AUTH_URL
BETTER_AUTH_TRUSTED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Database (should already be set)
DATABASE_URL=postgresql://...

# Secret (should already be set)
BETTER_AUTH_SECRET=your-secret-key
```

### ⚠️ IMPORTANT: For Vercel Deployments

If you're using Vercel, you might have dynamic preview URLs. In that case:

1. **For Production Domain:**
   ```env
   BETTER_AUTH_URL=https://your-app.vercel.app
   NEXT_PUBLIC_BETTER_AUTH_URL=https://your-app.vercel.app
   ```

2. **For Preview Deployments (if needed):**
   The code now automatically trusts origins that match your base domain pattern. However, if you still get errors, add:
   ```env
   BETTER_AUTH_TRUSTED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
   ```
   Note: Wildcards might not work - better to use explicit list or let auto-detection handle it.

### Step 2: For Vercel Deployment

If using Vercel, the URL might be dynamic. Update environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   - `BETTER_AUTH_URL` = Your production domain (e.g., `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_BETTER_AUTH_URL` = Same as above
   - `BETTER_AUTH_TRUSTED_ORIGINS` = `https://your-app.vercel.app,https://your-custom-domain.com`

### Step 3: For Custom Domain

If you have a custom domain:

```env
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
BETTER_AUTH_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Step 4: Redeploy

After updating environment variables:
1. Redeploy your application
2. Clear browser cache
3. Try login/signup again

## What Changed

1. **Added `trustedOrigins`** - Better Auth now knows which origins to trust
2. **Added CORS headers** - API routes now properly handle cross-origin requests
3. **Dynamic origin handling** - Better Auth can handle requests from different origins

## Testing

1. **Check Environment Variables**:
   - Verify all variables are set in deployment platform
   - Make sure URLs match your actual domain

2. **Test Login**:
   - Go to your deployed app
   - Try to login
   - Should work without "Invalid origin" error

3. **Check Console**:
   - Browser console should not show origin errors
   - Network tab should show successful requests

## Common Issues

### Issue: Still getting "Invalid origin"

**Solution**: 
- Make sure `BETTER_AUTH_URL` matches your actual domain exactly (including https://)
- Check `BETTER_AUTH_TRUSTED_ORIGINS` includes your domain
- Clear browser cache and cookies

### Issue: Works locally but not in production

**Solution**:
- Environment variables might not be set in deployment platform
- Check deployment logs for environment variable errors
- Make sure `NEXT_PUBLIC_BETTER_AUTH_URL` is set (required for client-side)

### Issue: Multiple domains (preview deployments)

**Solution**:
- Add all domains to `BETTER_AUTH_TRUSTED_ORIGINS` (comma-separated)
- Or use wildcard pattern if supported by your deployment platform
