# Build Error Fix

## Issue
Build command `cd client && npm run build` is failing in Vercel.

## Solution Applied

Updated `vercel.json` to explicitly define:
- `buildCommand`: Runs npm install and build in the client directory
- `outputDirectory`: Points to client/build
- `installCommand`: Ensures dependencies are installed

## Alternative: Configure in Vercel Dashboard

If the build still fails, configure these settings directly in Vercel:

1. Go to your project → **Settings** → **General**
2. Under **Build & Development Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (or `/`)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `cd client && npm install`

## Common Build Errors

### 1. Missing Dependencies
- **Fix**: Ensure `package.json` has all dependencies
- **Check**: Look for "Module not found" errors in build logs

### 2. Syntax Errors
- **Fix**: Check for JavaScript/JSX syntax errors
- **Check**: Look for "Unexpected token" errors

### 3. Environment Variables
- **Note**: Environment variables are available at build time
- **Fix**: Set `REACT_APP_API_URL` in Vercel environment variables

### 4. Memory Issues
- **Fix**: Vercel should handle this automatically, but if needed, add to `package.json`:
  ```json
  "scripts": {
    "build": "NODE_OPTIONS=--max_old_space_size=4096 react-scripts build"
  }
  ```

## Next Steps

1. Commit and push the updated `vercel.json`
2. Redeploy in Vercel
3. Check build logs for specific error messages
4. If it still fails, share the specific error from build logs

