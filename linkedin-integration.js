// LinkedIn Integration for CV Builder

// LinkedIn OAuth Configuration
const LINKEDIN_CONFIG = {
    clientId: 'YOUR_LINKEDIN_CLIENT_ID', // ⚠️ IMPORTANT: Replace this with your actual LinkedIn Client ID
    redirectUri: 'http://localhost:3000/callback', // Backend OAuth handler
    frontendUri: 'http://localhost:8888', // Frontend URL
    scope: 'r_liteprofile r_emailaddress',
    state: generateRandomState(),
    useBackend: false // Set to true if you have the backend server running
};

// Check if client ID is configured
if (LINKEDIN_CONFIG.clientId === 'YOUR_LINKEDIN_CLIENT_ID') {
    console.warn('⚠️ LinkedIn Client ID not configured! Please follow these steps:');
    console.warn('1. Go to https://www.linkedin.com/developers/apps');
    console.warn('2. Create an app and get your Client ID');
    console.warn('3. Replace YOUR_LINKEDIN_CLIENT_ID in linkedin-integration.js');
}

// Generate random state for OAuth security
function generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Initialize LinkedIn Integration
function initLinkedInIntegration() {
    // Add LinkedIn import button to the form
    const linkedInButton = document.createElement('button');
    linkedInButton.type = 'button';
    linkedInButton.id = 'linkedinImport';
    linkedInButton.className = 'btn-primary';
    linkedInButton.innerHTML = `
        <svg style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
        Import from LinkedIn
    `;
    linkedInButton.style.marginTop = '10px';
    linkedInButton.style.background = 'linear-gradient(to right, #0077b5, #0e76a8)';
    
    // Add button after the test data button
    const testButton = document.getElementById('fillTestData');
    if (testButton && testButton.parentNode) {
        testButton.parentNode.insertBefore(linkedInButton, testButton.nextSibling);
    }
    
    // Add click handler
    linkedInButton.addEventListener('click', startLinkedInAuth);
    
    // Check if we're returning from LinkedIn OAuth
    checkLinkedInCallback();
}

// Start LinkedIn OAuth flow
function startLinkedInAuth() {
    // Check if client ID is configured
    if (LINKEDIN_CONFIG.clientId === 'YOUR_LINKEDIN_CLIENT_ID') {
        // If no client ID configured, use simulated data
        showMessage('Using demo LinkedIn data. To use real LinkedIn data, configure your Client ID.', 'info');
        
        // Simulate the OAuth flow with demo data
        setTimeout(async () => {
            const demoData = await simulateLinkedInAPI('demo');
            processLinkedInData(demoData);
        }, 1000);
        return;
    }
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${LINKEDIN_CONFIG.clientId}&` +
        `redirect_uri=${encodeURIComponent(LINKEDIN_CONFIG.redirectUri)}&` +
        `scope=${encodeURIComponent(LINKEDIN_CONFIG.scope)}&` +
        `state=${LINKEDIN_CONFIG.state}`;
    
    // Save state to localStorage for verification
    localStorage.setItem('linkedin_oauth_state', LINKEDIN_CONFIG.state);
    
    // Redirect to LinkedIn
    window.location.href = authUrl;
}

// Check if we're returning from LinkedIn OAuth
function checkLinkedInCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const linkedinData = urlParams.get('linkedin_data');
    
    // Check if we have data from backend
    if (linkedinData) {
        try {
            const data = JSON.parse(decodeURIComponent(linkedinData));
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Process the LinkedIn data
            processLinkedInData(data);
            return;
        } catch (err) {
            console.error('Error parsing LinkedIn data:', err);
        }
    }
    
    if (error) {
        showMessage(`LinkedIn authorization failed: ${error}`, 'error');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    }
    
    if (code && state) {
        // Only handle in frontend if not using backend
        if (!LINKEDIN_CONFIG.useBackend) {
            // Verify state matches
            const savedState = localStorage.getItem('linkedin_oauth_state');
            if (state !== savedState) {
                showMessage('Security error: State mismatch', 'error');
                return;
            }
            
            // Clean up
            localStorage.removeItem('linkedin_oauth_state');
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Exchange code for access token and get profile
            fetchLinkedInProfile(code);
        }
    }
}

// Process LinkedIn data (from backend or simulated)
function processLinkedInData(data) {
    // Fill form with LinkedIn data
    fillFormWithLinkedInData(data);
    
    showMessage('LinkedIn profile imported successfully!', 'success');
    
    // Auto-generate preview
    setTimeout(() => {
        updateLivePreview();
    }, 500);
}

// Fetch LinkedIn profile data
async function fetchLinkedInProfile(code) {
    showMessage('Fetching LinkedIn profile...', 'info');
    
    try {
        // In production, this should be done on a backend server
        // For demo purposes, we'll simulate the data
        // Real implementation would exchange code for token on backend
        
        // Simulated LinkedIn profile data (replace with actual API call)
        const profileData = await simulateLinkedInAPI(code);
        
        processLinkedInData(profileData);
        
    } catch (error) {
        console.error('LinkedIn fetch error:', error);
        showMessage('Failed to fetch LinkedIn profile', 'error');
    }
}

// Simulate LinkedIn API response (replace with actual backend call)
async function simulateLinkedInAPI(code) {
    // In production, make a call to your backend which handles the OAuth flow
    // Backend should exchange code for access token and fetch profile data
    
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return simulated LinkedIn profile data
    return {
        firstName: 'Sarah',
        lastName: 'Williams',
        headline: 'Full Stack Developer | React & Node.js Expert',
        email: 'sarah.williams@example.com',
        profilePicture: 'https://via.placeholder.com/200x200/667eea/ffffff?text=SW',
        location: 'New York, NY',
        summary: 'Innovative Full Stack Developer with 7+ years of experience building scalable web applications. ' +
                 'Expert in React, Node.js, and cloud technologies. Passionate about creating efficient solutions ' +
                 'and mentoring development teams. Strong track record of delivering high-quality projects on time.',
        positions: [
            {
                title: 'Senior Full Stack Developer',
                company: 'Tech Innovations Inc.',
                startDate: '2021-01',
                endDate: null,
                description: 'Leading development of enterprise SaaS platform using React and Node.js. ' +
                            'Architected microservices handling 5M+ requests daily. ' +
                            'Mentored team of 6 developers and improved deployment efficiency by 40%.'
            },
            {
                title: 'Full Stack Developer',
                company: 'Digital Solutions Ltd.',
                startDate: '2018-06',
                endDate: '2020-12',
                description: 'Developed responsive web applications using modern JavaScript frameworks. ' +
                            'Implemented RESTful APIs and optimized database queries for better performance. ' +
                            'Collaborated with UX team to improve user experience.'
            }
        ],
        skills: [
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
            'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git',
            'GraphQL', 'Redux', 'Next.js', 'CI/CD', 'Agile'
        ],
        education: [
            {
                school: 'Massachusetts Institute of Technology',
                degree: 'Bachelor of Science in Computer Science',
                startYear: '2013',
                endYear: '2017'
            }
        ]
    };
}

// Helper function to add work entry
function addWorkEntry() {
    const addWorkBtn = document.getElementById('addWork');
    if (addWorkBtn) {
        addWorkBtn.click();
    }
}

// Helper function to add education entry  
function addEducationEntry() {
    const addEducationBtn = document.getElementById('addEducation');
    if (addEducationBtn) {
        addEducationBtn.click();
    }
}

// Fill form with LinkedIn data
function fillFormWithLinkedInData(data) {
    // Personal Information
    if (data.firstName && data.lastName) {
        document.getElementById('fullName').value = `${data.firstName} ${data.lastName}`;
    }
    
    if (data.headline) {
        document.getElementById('title').value = data.headline;
    }
    
    if (data.email) {
        document.getElementById('email').value = data.email;
    }
    
    if (data.location) {
        document.getElementById('location').value = data.location;
    }
    
    if (data.summary) {
        document.getElementById('summary').value = data.summary;
    }
    
    // Profile Picture
    if (data.profilePicture) {
        const profilePreview = document.getElementById('profilePreview');
        if (profilePreview) {
            profilePreview.innerHTML = `<img src="${data.profilePicture}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" id="profileImg">`;
        }
    }
    
    // Work Experience
    if (data.positions && data.positions.length > 0) {
        // Clear existing entries
        const workContainer = document.getElementById('workExperience');
        if (workContainer) {
            // Remove existing entries
            const existingEntries = workContainer.querySelectorAll('.work-entry');
            existingEntries.forEach(entry => entry.remove());
            
            data.positions.forEach(position => {
                addWorkEntry();
                const entries = document.querySelectorAll('.work-entry');
                const lastEntry = entries[entries.length - 1];
                
                if (lastEntry) {
                    const companyInput = lastEntry.querySelector('.company-input');
                    const positionInput = lastEntry.querySelector('.position-input');
                    const startDateInput = lastEntry.querySelector('.start-date-input');
                    const endDateInput = lastEntry.querySelector('.end-date-input');
                    const descriptionInput = lastEntry.querySelector('.work-description-input');
                    
                    if (companyInput) companyInput.value = position.company || '';
                    if (positionInput) positionInput.value = position.title || '';
                    if (startDateInput) startDateInput.value = position.startDate || '';
                    if (endDateInput) endDateInput.value = position.endDate || '';
                    if (descriptionInput) descriptionInput.value = position.description || '';
                }
            });
        }
    }
    
    // Skills
    if (data.skills && data.skills.length > 0) {
        // Categorize skills
        const programmingLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift'];
        const frameworks = ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Next.js', 'Nuxt.js'];
        const tools = ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'];
        
        const languages = data.skills.filter(skill => programmingLanguages.some(lang => skill.toLowerCase().includes(lang.toLowerCase())));
        const frameworkSkills = data.skills.filter(skill => frameworks.some(fw => skill.toLowerCase().includes(fw.toLowerCase())));
        const toolSkills = data.skills.filter(skill => tools.some(tool => skill.toLowerCase().includes(tool.toLowerCase())));
        const otherSkills = data.skills.filter(skill => 
            !languages.includes(skill) && !frameworkSkills.includes(skill) && !toolSkills.includes(skill)
        );
        
        if (languages.length > 0) {
            document.getElementById('languages').value = languages.join(', ');
        }
        if (frameworkSkills.length > 0) {
            document.getElementById('frameworks').value = frameworkSkills.join(', ');
        }
        if (toolSkills.length > 0) {
            document.getElementById('tools').value = toolSkills.join(', ');
        }
        if (otherSkills.length > 0) {
            document.getElementById('otherSkills').value = otherSkills.join(', ');
        }
    }
    
    // Education
    if (data.education && data.education.length > 0) {
        const educationContainer = document.getElementById('education');
        if (educationContainer) {
            // Remove existing entries
            const existingEntries = educationContainer.querySelectorAll('.education-entry');
            existingEntries.forEach(entry => entry.remove());
            
            data.education.forEach(edu => {
                addEducationEntry();
                const entries = document.querySelectorAll('.education-entry');
                const lastEntry = entries[entries.length - 1];
                
                if (lastEntry) {
                    const schoolInput = lastEntry.querySelector('.school-input');
                    const degreeInput = lastEntry.querySelector('.degree-input');
                    const startYearInput = lastEntry.querySelector('.edu-start-year');
                    const endYearInput = lastEntry.querySelector('.edu-end-year');
                    
                    if (schoolInput) schoolInput.value = edu.school || '';
                    if (degreeInput) degreeInput.value = edu.degree || '';
                    if (startYearInput) startYearInput.value = edu.startYear || '';
                    if (endYearInput) endYearInput.value = edu.endYear || '';
                }
            });
        }
    }
    
    // Also set some cool advanced options
    document.getElementById('animationType').value = 'liquid';
    document.getElementById('backgroundEffect').value = 'particles';
    document.getElementById('profileAnimation').value = 'pulse';
    
    // Update preview
    updateLivePreview();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the main script.js to set up the DOM
    setTimeout(initLinkedInIntegration, 100);
});

// Export for use in other scripts
window.LinkedInIntegration = {
    init: initLinkedInIntegration,
    startAuth: startLinkedInAuth,
    checkCallback: checkLinkedInCallback,
    addWorkEntry: addWorkEntry,
    addEducationEntry: addEducationEntry
};
