# LinkedIn Integration Guide

## Overview
The SkillFrame CV Builder includes LinkedIn integration to automatically import your professional profile data directly into the CV builder form.

## Features
- Import personal information (name, title, email, location)
- Import profile picture
- Import work experience with descriptions
- Import education history
- Import and categorize skills
- Automatic preview generation after import

## Setup Options

### Option 1: Demo Mode (No Setup Required)
Simply click the "Import from LinkedIn" button to see the feature in action with demo data. This requires no configuration and demonstrates how the integration works.

### Option 2: Frontend-Only Mode (Simple Setup)
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Get your Client ID
4. Edit `linkedin-integration.js`:
   - Replace `YOUR_LINKEDIN_CLIENT_ID` with your actual Client ID
5. The integration will use simulated data for demonstration

### Option 3: Full Backend Integration (Production Ready)
For real LinkedIn OAuth with actual profile data:

#### Prerequisites
- Node.js installed
- LinkedIn Developer App with Client ID and Client Secret

#### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your LinkedIn credentials:
   ```
   LINKEDIN_CLIENT_ID=your_client_id_here
   LINKEDIN_CLIENT_SECRET=your_client_secret_here
   LINKEDIN_REDIRECT_URI=http://localhost:3000/callback
   PORT=3000
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

6. In `linkedin-integration.js`, set:
   ```javascript
   useBackend: true
   ```

#### LinkedIn App Configuration
1. In your LinkedIn app settings, add these redirect URLs:
   - `http://localhost:3000/callback` (for backend)
   - `http://localhost:8888` (for frontend)

2. Add required scopes:
   - `r_liteprofile`
   - `r_emailaddress`

## How to Use

### Using Demo Mode
1. Open the CV Builder
2. Click "Import from LinkedIn" button
3. Demo data will be automatically filled
4. Modify any fields as needed
5. Generate your CV

### Using Real LinkedIn Integration
1. Ensure backend server is running (if using Option 3)
2. Click "Import from LinkedIn" button
3. You'll be redirected to LinkedIn login
4. Authorize the application
5. Your profile data will be imported automatically
6. Review and modify the imported data
7. Generate your CV

## Data Imported
- **Personal Info**: Name, professional title, email, location
- **Profile Picture**: LinkedIn profile photo
- **Work Experience**: Company names, positions, dates, descriptions
- **Education**: Schools, degrees, years
- **Skills**: Automatically categorized into:
  - Programming Languages
  - Frameworks
  - Tools & Technologies
  - Other Skills

## Troubleshooting

### "LinkedIn Integration Not Configured" Message
- Ensure you've replaced `YOUR_LINKEDIN_CLIENT_ID` in `linkedin-integration.js`
- Or use the demo mode for testing

### Backend Connection Issues
- Verify backend server is running on port 3000
- Check `.env` file has correct credentials
- Ensure CORS is properly configured

### OAuth Errors
- Verify redirect URIs match in LinkedIn app settings
- Check Client ID and Secret are correct
- Ensure required scopes are enabled

### Data Not Importing
- Check browser console for errors
- Verify all container elements exist in HTML
- Ensure script loading order is correct

## Security Notes
- Never commit your Client Secret to version control
- Use environment variables for sensitive data
- Always validate state parameter in OAuth flow
- Consider implementing rate limiting in production

## Advanced Configuration

### Custom Redirect URIs
Edit in `linkedin-integration.js`:
```javascript
redirectUri: 'your-custom-backend-url/callback',
frontendUri: 'your-frontend-url'
```

### Custom OAuth Scopes
Modify the scope in configuration:
```javascript
scope: 'r_liteprofile r_emailaddress w_member_social'
```

### Using with Different Ports
Update both frontend and backend configurations to match your setup.

## Support
For issues or questions about the LinkedIn integration:
1. Check this guide first
2. Review browser console for error messages
3. Verify all setup steps were completed
4. Test with demo mode to isolate issues
