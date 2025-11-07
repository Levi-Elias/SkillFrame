// LinkedIn OAuth Backend Server
// This handles the secure OAuth flow with LinkedIn API

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors({
    origin: ['http://localhost:8888', 'http://localhost:8080', 'http://127.0.0.1:8888'],
    credentials: true
}));

app.use(express.json());

// LinkedIn OAuth configuration
const LINKEDIN_CONFIG = {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    redirectUri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/callback',
    scope: 'r_liteprofile r_emailaddress'
};

// OAuth callback endpoint
app.get('/callback', async (req, res) => {
    const { code, state, error } = req.query;
    
    if (error) {
        return res.status(400).json({ error: error });
    }
    
    if (!code) {
        return res.status(400).json({ error: 'Authorization code missing' });
    }
    
    try {
        // Exchange authorization code for access token
        const tokenResponse = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            null,
            {
                params: {
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: LINKEDIN_CONFIG.redirectUri,
                    client_id: LINKEDIN_CONFIG.clientId,
                    client_secret: LINKEDIN_CONFIG.clientSecret
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        const accessToken = tokenResponse.data.access_token;
        
        // Fetch user profile
        const profileResponse = await axios.get(
            'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        // Fetch user email
        const emailResponse = await axios.get(
            'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        // Fetch user positions (work experience)
        let positions = [];
        try {
            const positionsResponse = await axios.get(
                'https://api.linkedin.com/v2/positions?q=members&projection=(elements*(company,title,description,startDate,endDate))',
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
            positions = positionsResponse.data.elements || [];
        } catch (err) {
            console.log('Could not fetch positions:', err.message);
        }
        
        // Parse profile data
        const profile = profileResponse.data;
        const email = emailResponse.data.elements[0]?.['handle~']?.emailAddress || '';
        
        // Get profile picture URL
        let profilePictureUrl = '';
        if (profile.profilePicture && profile.profilePicture['displayImage~']) {
            const images = profile.profilePicture['displayImage~'].elements;
            if (images && images.length > 0) {
                // Get the largest image
                const largestImage = images[images.length - 1];
                profilePictureUrl = largestImage.identifiers[0].identifier;
            }
        }
        
        // Format the response
        const userData = {
            firstName: profile.localizedFirstName,
            lastName: profile.localizedLastName,
            email: email,
            profilePicture: profilePictureUrl,
            positions: positions.map(pos => ({
                title: pos.title,
                company: pos.company,
                description: pos.description,
                startDate: pos.startDate ? `${pos.startDate.year}-${String(pos.startDate.month).padStart(2, '0')}` : '',
                endDate: pos.endDate ? `${pos.endDate.year}-${String(pos.endDate.month).padStart(2, '0')}` : ''
            }))
        };
        
        // Redirect back to frontend with data
        const frontendUrl = 'http://localhost:8888';
        const encodedData = encodeURIComponent(JSON.stringify(userData));
        res.redirect(`${frontendUrl}?linkedin_data=${encodedData}`);
        
    } catch (error) {
        console.error('LinkedIn OAuth error:', error);
        res.status(500).json({ 
            error: 'Failed to authenticate with LinkedIn',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'LinkedIn OAuth server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`LinkedIn OAuth server running on http://localhost:${PORT}`);
    console.log('Make sure to set the following environment variables:');
    console.log('- LINKEDIN_CLIENT_ID');
    console.log('- LINKEDIN_CLIENT_SECRET');
    console.log('- LINKEDIN_REDIRECT_URI (optional, defaults to http://localhost:3000/callback)');
});

module.exports = app;
