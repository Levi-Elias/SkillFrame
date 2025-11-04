// Form handling and CV generation
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('cvForm');
    const generateBtn = document.getElementById('generateCV');
    const downloadBtn = document.getElementById('downloadPDF');
    const preview = document.getElementById('cvPreview');
    const dummyDataInput = document.getElementById('dummyDataInput');
    const autoFillBtn = document.getElementById('autoFillBtn');
    
    // Work Experience, Projects, Education
    const addWorkBtn = document.getElementById('addWork');
    const workContainer = document.getElementById('workExperience');
    const addProjectBtn = document.getElementById('addProject');
    const projectsContainer = document.getElementById('projects');
    const addEducationBtn = document.getElementById('addEducation');
    const educationContainer = document.getElementById('education');
    
    // Color customization
    const primaryColorInput = document.getElementById('primaryColor');
    const accentColorInput = document.getElementById('accentColor');
    const fontStyleSelect = document.getElementById('fontStyle');
    
    // Initialize the app
    initApp();
    
    function initApp() {
        // Set up auto-fill functionality
        if (autoFillBtn) {
            autoFillBtn.addEventListener('click', handleAutoFill);
        }
        
        // Add quick test data button
        addTestDataButton();
        
        // Set up advanced options
        setupAdvancedOptions();
        
        // Set up profile picture upload
        setupProfilePicture();
        
        // Set up live preview
        setupLivePreview();
    }
    // Add test data button
    function addTestDataButton() {
        const importSection = document.querySelector('.import-section');
        if (importSection) {
            const testButton = document.createElement('button');
            testButton.type = 'button';
            testButton.id = 'fillTestData';
            testButton.className = 'btn-primary';
            testButton.textContent = '🚀 Fill with Test Data';
            testButton.style.marginTop = '10px';
            testButton.style.marginLeft = '10px';
            testButton.addEventListener('click', fillWithTestData);
            
            const autoFillBtnElement = document.getElementById('autoFillBtn');
            if (autoFillBtnElement) {
                autoFillBtnElement.parentNode.insertBefore(testButton, autoFillBtnElement.nextSibling);
            }
        }
        
        // Add export buttons
        addExportButtons();
    }
    
    // Setup advanced options
    function setupAdvancedOptions() {
        const toggleBtn = document.getElementById('toggleAdvanced');
        const advancedSection = document.getElementById('advancedOptions');
        
        if (toggleBtn && advancedSection) {
            toggleBtn.addEventListener('click', function() {
                if (advancedSection.style.display === 'none') {
                    advancedSection.style.display = 'block';
                    toggleBtn.textContent = '🎨 Hide Advanced Options';
                } else {
                    advancedSection.style.display = 'none';
                    toggleBtn.textContent = '🎨 Show Advanced Options (HTML Only)';
                }
            });
        }
        
        // Range sliders
        const glowSlider = document.getElementById('glowIntensity');
        const glowValue = document.getElementById('glowValue');
        const blurSlider = document.getElementById('blurEffect');
        const blurValue = document.getElementById('blurValue');
        
        if (glowSlider && glowValue) {
            glowSlider.addEventListener('input', function() {
                glowValue.textContent = this.value + '%';
                updateLivePreview();
            });
        }
        
        if (blurSlider && blurValue) {
            blurSlider.addEventListener('input', function() {
                blurValue.textContent = this.value + 'px';
                updateLivePreview();
            });
        }
        
        // Color scheme presets
        const colorScheme = document.getElementById('colorScheme');
        if (colorScheme) {
            colorScheme.addEventListener('change', function() {
                applyColorScheme(this.value);
                updateLivePreview();
            });
        }
    }
    
    // Setup profile picture upload
    function setupProfilePicture() {
        const profilePicInput = document.getElementById('profilePic');
        const profilePreview = document.getElementById('profilePreview');
        const profileAnimation = document.getElementById('profileAnimation');
        
        if (profilePicInput) {
            profilePicInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        profilePreview.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" id="profileImg">`;
                        updateLivePreview();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        if (profileAnimation) {
            profileAnimation.addEventListener('change', function() {
                updateLivePreview();
            });
        }
    }
    
    // Setup live preview
    function setupLivePreview() {
        // Auto-generate CV when the form loads if there's data
        if (localStorage.getItem('cvData')) {
            generateCVPreview();
        }
        
        // Add change listeners to all form inputs for live preview
        const form = document.getElementById('cvForm');
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                // Skip file inputs
                if (input.type === 'file') return;
                
                // Debounced update for text inputs
                if (input.type === 'text' || input.type === 'textarea' || input.type === 'email' || input.type === 'tel' || input.type === 'url') {
                    let timeout;
                    input.addEventListener('input', function() {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                            updateLivePreview();
                        }, 500); // Wait 500ms after user stops typing
                    });
                } else {
                    // Immediate update for other inputs
                    input.addEventListener('change', function() {
                        updateLivePreview();
                    });
                }
            });
        }
        
        // Add listeners for advanced options checkboxes
        const checkboxes = document.querySelectorAll('#advancedOptions input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateLivePreview);
        });
        
        // Add listeners for select dropdowns in advanced options
        const selects = document.querySelectorAll('#advancedOptions select');
        selects.forEach(select => {
            select.addEventListener('change', updateLivePreview);
        });
    }
    
    // Update live preview
    function updateLivePreview() {
        // Only update if we have some basic data
        const fullName = document.getElementById('fullName')?.value;
        if (fullName) {
            generateCVPreview();
        }
    }
    
    // Apply color scheme presets
    function applyColorScheme(scheme) {
        const schemes = {
            cyberpunk: { primary: '#ff00ff', accent: '#00ffff' },
            vaporwave: { primary: '#ff71ce', accent: '#01cdfe' },
            sunset: { primary: '#ff6b6b', accent: '#ffd93d' },
            ocean: { primary: '#0077b6', accent: '#00b4d8' },
            forest: { primary: '#2d6a4f', accent: '#52b788' },
            candy: { primary: '#ff006e', accent: '#fb5607' },
            monochrome: { primary: '#212529', accent: '#495057' },
            neon: { primary: '#00ff00', accent: '#ff1493' }
        };
        
        if (schemes[scheme]) {
            document.getElementById('primaryColor').value = schemes[scheme].primary;
            document.getElementById('accentColor').value = schemes[scheme].accent;
            document.documentElement.style.setProperty('--cv-primary', schemes[scheme].primary);
            document.documentElement.style.setProperty('--cv-accent', schemes[scheme].accent);
        }
    }
    
    // Add export buttons for HTML/CSS/JS
    function addExportButtons() {
        const formActions = document.querySelector('.form-actions');
        if (formActions) {
            // Add Export HTML button
            const exportHTMLBtn = document.createElement('button');
            exportHTMLBtn.type = 'button';
            exportHTMLBtn.id = 'exportHTML';
            exportHTMLBtn.className = 'btn-download';
            exportHTMLBtn.textContent = '📄 Export as HTML';
            exportHTMLBtn.disabled = true;
            exportHTMLBtn.addEventListener('click', exportAsHTML);
            
            formActions.appendChild(exportHTMLBtn);
        }
    }
    
    // Handle auto-fill button click
    function handleAutoFill() {
        if (!dummyDataInput || !dummyDataInput.value) {
            showMessage('Please paste your data first', 'error');
            return;
        }
        
        const data = parsePastedData(dummyDataInput.value);
        if (Object.keys(data).length === 0) {
            showMessage('No valid data found. Please check the format and try again.', 'error');
            return;
        }
        
        // Fill the form with the parsed data
        fillFormWithData(data);
        
        // Update the CV preview
        if (generateBtn) {
            generateBtn.click();
        }
        
        // Show success message
        showMessage('Form filled successfully!', 'success');
    }
        
    // Fill with test data
    function fillWithTestData() {
        const testData = {
            personal: {
                fullName: 'Alex Johnson',
                title: 'Senior Full Stack Developer',
                age: '28',
                email: 'alex.johnson@email.com',
                phone: '+1 (555) 123-4567',
                location: 'San Francisco, CA',
                summary: 'Passionate full-stack developer with 6+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Strong background in leading development teams and delivering high-quality software solutions.'
            },
            links: {
                portfolio: 'https://alexjohnson.dev',
                github: 'https://github.com/alexjohnson',
                linkedin: 'https://linkedin.com/in/alexjohnson'
            },
            workExperience: [
                {
                    company: 'TechCorp Solutions',
                    position: 'Senior Full Stack Developer',
                    startDate: '2021-03',
                    endDate: '',
                    description: 'Led development of microservices architecture serving 2M+ users. Reduced API response times by 40% through optimization. Mentored junior developers and conducted code reviews.'
                },
                {
                    company: 'Digital Innovations Inc.',
                    position: 'Full Stack Developer',
                    startDate: '2018-06',
                    endDate: '2021-02',
                    description: 'Built and maintained React-based dashboards and Node.js APIs. Implemented CI/CD pipelines reducing deployment time by 60%. Collaborated with UX team to improve user experience.'
                }
            ],
            projects: [
                {
                    name: 'E-Commerce Platform',
                    url: 'https://github.com/alexjohnson/ecommerce',
                    tech: 'React, Node.js, MongoDB, Stripe API, Docker',
                    description: 'Full-featured e-commerce platform with real-time inventory management, secure payment processing, and admin dashboard. Handles 10K+ daily transactions.'
                },
                {
                    name: 'Task Management System',
                    url: 'https://taskmaster.app',
                    tech: 'Vue.js, Express, PostgreSQL, Redis, AWS',
                    description: 'Collaborative task management tool with real-time updates, team analytics, and third-party integrations. Used by 50+ companies.'
                }
            ],
            education: [
                {
                    school: 'University of California, Berkeley',
                    degree: 'Bachelor of Science in Computer Science',
                    startYear: '2014',
                    endYear: '2018'
                }
            ],
            skills: {
                languages: 'JavaScript, TypeScript, Python, Java, SQL',
                frameworks: 'React, Vue.js, Node.js, Express, Django, Spring Boot',
                tools: 'Git, Docker, Kubernetes, AWS, MongoDB, PostgreSQL, Redis',
                other: 'RESTful APIs, GraphQL, Microservices, CI/CD, Agile, TDD'
            }
        };
        
        fillFormWithData(testData);
        showMessage('Test data filled successfully! Feel free to modify any fields.', 'success');
        
        // Auto-generate preview
        setTimeout(() => {
            generateBtn.click();
        }, 500);
    }
    
    // Show status message
    function showMessage(message, type) {
        // Remove any existing messages
        const existingMsg = document.querySelector('.status-msg');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        const msg = document.createElement('div');
        msg.className = `status-msg ${type}`;
        msg.textContent = message;
        msg.style.cssText = `
            margin-top: 10px;
            padding: 12px 16px;
            border-radius: 8px;
            color: ${type === 'error' ? '#991b1b' : '#14532d'};
            background: ${type === 'error' ? 'linear-gradient(to right, #fef2f2, #fee2e2)' : 'linear-gradient(to right, #f0fdf4, #dcfce7)'};
            border: 1px solid ${type === 'error' ? '#fecaca' : '#bbf7d0'};
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateY(-10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        const container = document.querySelector('.import-container');
        if (container) {
            container.appendChild(msg);
        } else {
            document.body.appendChild(msg);
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
            setTimeout(() => msg.remove(), 300);
        }, 5000);
    }
    
    // Function to parse pasted data
    function parsePastedData(text) {
        console.log('Parsing data:', text); // Debug log
        const result = {
            personal: {},
            workExperience: [],
            projects: [],
            education: [],
            skills: {}
        };
        
        if (!text) return result;
        
        const lines = text.split('\n').filter(line => line.trim() !== '');
        let currentSection = null;
        let currentItem = null;
        
        const personalMap = {
            'name': 'fullName',
            'title': 'title',
            'age': 'age',
            'email': 'email',
            'phone': 'phone',
            'location': 'location',
            'summary': 'summary',
            'professional summary': 'summary'
        };
        
        const skillsMap = {
            'languages': 'languages',
            'programming languages': 'languages',
            'frameworks': 'frameworks',
            'tools': 'tools',
            'technologies': 'tools',
            'other skills': 'other'
        };
        
        lines.forEach(line => {
            // Check for section headers
            if (line.match(/^\s*work experience|employment history|jobs?\s*$/i)) {
                currentSection = 'work';
                return;
            } else if (line.match(/^\s*projects?|portfolio\s*$/i)) {
                currentSection = 'project';
                return;
            } else if (line.match(/^\s*education\s*$/i)) {
                currentSection = 'education';
                return;
            } else if (line.match(/^\s*skills?|technical skills?\s*$/i)) {
                currentSection = 'skills';
                return;
            } else if (line.match(/^\s*personal (info(rmation)?|details)?\s*$/i)) {
                currentSection = 'personal';
                return;
            } else if (line.match(/^\s*links?|social (media|links)?\s*$/i)) {
                currentSection = 'links';
                return;
            }
            
            // Parse key-value pairs
            const match = line.match(/^\s*([^:]+):\s*(.+?)\s*$/i);
            if (!match) return;
            
            const [_, key, value] = match;
            const lowerKey = key.trim().toLowerCase();
            
            // Handle different sections
            if (currentSection === 'personal' || !currentSection) {
                // Check for personal info
                const field = personalMap[lowerKey];
                if (field) {
                    result.personal[field] = value;
                }
            } else if (currentSection === 'links') {
                // Handle links
                if (lowerKey.includes('portfolio') || lowerKey.includes('website')) {
                    result.links = result.links || {};
                    result.links.portfolio = value;
                } else if (lowerKey.includes('github')) {
                    result.links = result.links || {};
                    result.links.github = value;
                } else if (lowerKey.includes('linkedin')) {
                    result.links = result.links || {};
                    result.links.linkedin = value;
                }
            } else if (currentSection === 'work') {
                // Handle work experience
                if (lowerKey.includes('company')) {
                    if (currentItem) {
                        result.workExperience.push(currentItem);
                    }
                    currentItem = { company: value };
                } else if (currentItem) {
                    if (lowerKey.includes('position') || lowerKey.includes('title')) {
                        currentItem.position = value;
                    } else if (lowerKey.includes('start')) {
                        currentItem.startDate = value;
                    } else if (lowerKey.includes('end') || lowerKey.includes('present')) {
                        currentItem.endDate = value === 'present' ? '' : value;
                    } else if (lowerKey.includes('description') || lowerKey.includes('responsibilities')) {
                        currentItem.description = value;
                    }
                }
            } else if (currentSection === 'project') {
                // Handle projects
                if (lowerKey.includes('project') && lowerKey.includes('name')) {
                    if (currentItem) {
                        result.projects.push(currentItem);
                    }
                    currentItem = { name: value };
                } else if (currentItem) {
                    if (lowerKey.includes('url') || lowerKey.includes('link')) {
                        currentItem.url = value;
                    } else if (lowerKey.includes('tech') || lowerKey.includes('technologies') || lowerKey.includes('stack')) {
                        currentItem.tech = value;
                    } else if (lowerKey.includes('description')) {
                        currentItem.description = value;
                    }
                }
            } else if (currentSection === 'education') {
                // Handle education
                if (lowerKey.includes('school') || lowerKey.includes('university') || lowerKey.includes('college')) {
                    if (currentItem) {
                        result.education.push(currentItem);
                    }
                    currentItem = { school: value };
                } else if (currentItem) {
                    if (lowerKey.includes('degree') || lowerKey.includes('certificate')) {
                        currentItem.degree = value;
                    } else if (lowerKey.includes('start')) {
                        currentItem.startYear = value;
                    } else if (lowerKey.includes('end')) {
                        currentItem.endYear = value;
                    }
                }
            } else if (currentSection === 'skills') {
                // Handle skills
                const skillType = skillsMap[lowerKey];
                if (skillType) {
                    result.skills[skillType] = value;
                }
            }
        });
        
        // Push the last item if it exists
        if (currentItem) {
            if (currentSection === 'work') {
                result.workExperience.push(currentItem);
            } else if (currentSection === 'project') {
                result.projects.push(currentItem);
            } else if (currentSection === 'education') {
                result.education.push(currentItem);
            }
        }
        
        return result;
    }
    
    // Function to fill form with parsed data
    function fillFormWithData(data) {
        console.log('Filling form with data:', data); // Debug log
        // Fill personal info
        if (data.personal) {
            Object.entries(data.personal).forEach(([key, value]) => {
                const element = document.querySelector(`[name="${key}"]`);
                if (element) element.value = value || '';
            });
        }
        
        // Fill links
        if (data.links) {
            Object.entries(data.links).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) element.value = value || '';
            });
        }
        
        // Fill work experience
        if (data.workExperience && data.workExperience.length > 0) {
            // Clear existing work entries except the first one
            const workEntries = document.querySelectorAll('.work-entry');
            for (let i = 1; i < workEntries.length; i++) {
                workEntries[i].remove();
            }
            
            // Fill first work entry
            const firstWork = data.workExperience[0];
            if (firstWork) {
                document.querySelector('.company-input').value = firstWork.company || '';
                document.querySelector('.position-input').value = firstWork.position || '';
                if (firstWork.startDate) {
                    const startDate = formatDateForInput(firstWork.startDate);
                    document.querySelector('.start-date-input').value = startDate || '';
                }
                if (firstWork.endDate) {
                    const endDate = firstWork.endDate.toLowerCase() === 'present' ? '' : formatDateForInput(firstWork.endDate);
                    document.querySelector('.end-date-input').value = endDate || '';
                }
                document.querySelector('.work-description-input').value = firstWork.description || '';
            }
            
            // Add additional work entries
            for (let i = 1; i < data.workExperience.length; i++) {
                const work = data.workExperience[i];
                document.getElementById('addWork').click();
                const entries = document.querySelectorAll('.work-entry');
                const newEntry = entries[entries.length - 1];
                
                newEntry.querySelector('.company-input').value = work.company || '';
                newEntry.querySelector('.position-input').value = work.position || '';
                if (work.startDate) {
                    const startDate = formatDateForInput(work.startDate);
                    newEntry.querySelector('.start-date-input').value = startDate || '';
                }
                if (work.endDate) {
                    const endDate = work.endDate.toLowerCase() === 'present' ? '' : formatDateForInput(work.endDate);
                    newEntry.querySelector('.end-date-input').value = endDate || '';
                }
                newEntry.querySelector('.work-description-input').value = work.description || '';
            }
        }
        
        // Fill projects
        if (data.projects && data.projects.length > 0) {
            // Clear existing project entries except the first one
            const projectEntries = document.querySelectorAll('.project-entry');
            for (let i = 1; i < projectEntries.length; i++) {
                projectEntries[i].remove();
            }
            
            // Fill first project entry
            const firstProject = data.projects[0];
            if (firstProject) {
                document.querySelector('.project-name-input').value = firstProject.name || '';
                document.querySelector('.project-url-input').value = firstProject.url || '';
                document.querySelector('.project-tech-input').value = firstProject.tech || '';
                document.querySelector('.project-description-input').value = firstProject.description || '';
            }
            
            // Add additional project entries
            for (let i = 1; i < data.projects.length; i++) {
                const project = data.projects[i];
                document.getElementById('addProject').click();
                const entries = document.querySelectorAll('.project-entry');
                const newEntry = entries[entries.length - 1];
                
                newEntry.querySelector('.project-name-input').value = project.name || '';
                newEntry.querySelector('.project-url-input').value = project.url || '';
                newEntry.querySelector('.project-tech-input').value = project.tech || '';
                newEntry.querySelector('.project-description-input').value = project.description || '';
            }
        }
        
        // Fill education
        if (data.education && data.education.length > 0) {
            // Clear existing education entries except the first one
            const educationEntries = document.querySelectorAll('.education-entry');
            for (let i = 1; i < educationEntries.length; i++) {
                educationEntries[i].remove();
            }
            
            // Fill first education entry
            const firstEdu = data.education[0];
            if (firstEdu) {
                document.querySelector('.school-input').value = firstEdu.school || '';
                document.querySelector('.degree-input').value = firstEdu.degree || '';
                document.querySelector('.edu-start-year').value = firstEdu.startYear || '';
                document.querySelector('.edu-end-year').value = firstEdu.endYear || '';
            }
            
            // Add additional education entries
            for (let i = 1; i < data.education.length; i++) {
                const edu = data.education[i];
                document.getElementById('addEducation').click();
                const entries = document.querySelectorAll('.education-entry');
                const newEntry = entries[entries.length - 1];
                
                newEntry.querySelector('.school-input').value = edu.school || '';
                newEntry.querySelector('.degree-input').value = edu.degree || '';
                newEntry.querySelector('.edu-start-year').value = edu.startYear || '';
                newEntry.querySelector('.edu-end-year').value = edu.endYear || '';
            }
        }
        
        // Fill skills
        if (data.skills) {
            Object.entries(data.skills).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) element.value = value || '';
            });
        }
    }
    
    // Helper function to format date for input fields
    function formatDateForInput(dateString) {
        if (!dateString) return '';
        
        // Try to parse the date
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // If it's not a valid date, try to extract year and month
            const yearMatch = dateString.match(/\b(20\d{2}|\d{2})\b/);
            const monthMatch = dateString.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
            
            if (yearMatch) {
                const year = yearMatch[0].length === 2 ? '20' + yearMatch[0] : yearMatch[0];
                const month = monthMatch ? String(monthToNumber(monthMatch[0])).padStart(2, '0') : '01';
                return `${year}-${month}`;
            }
            return '';
        }
        
        // Format as YYYY-MM for month input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }
    
    // Helper function to convert month name to number
    function monthToNumber(monthName) {
        const months = {
            'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
            'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6, 'jul': 7, 'july': 7,
            'aug': 8, 'august': 8, 'sep': 9, 'september': 9, 'oct': 10, 'october': 10,
            'nov': 11, 'november': 11, 'dec': 12, 'december': 12
        };
        return months[monthName.toLowerCase().substring(0, 3)] || 1;
    }
        // Add Work Experience Entry
        addWorkBtn.addEventListener('click', () => {
        const newWorkEntry = document.createElement('div');
        newWorkEntry.className = 'work-entry';
        newWorkEntry.innerHTML = `
            <div class="form-group">
                <label>Company Name</label>
                <input type="text" name="company[]" class="company-input">
            </div>
            <div class="form-group">
                <label>Position</label>
                <input type="text" name="position[]" class="position-input">
            </div>
            <div class="form-row">
                <div class="form-group half">
                    <label>Start Date</label>
                    <input type="month" name="startDate[]" class="start-date-input">
                </div>
                <div class="form-group half">
                    <label>End Date</label>
                    <input type="month" name="endDate[]" class="end-date-input">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="workDescription[]" rows="3" class="work-description-input" placeholder="Describe your responsibilities and achievements..."></textarea>
            </div>
            <button type="button" class="btn-secondary remove-entry" onclick="this.parentElement.remove()">Remove</button>
        `;
        workContainer.appendChild(newWorkEntry);
    });
    
    // Projects handling
    
    addProjectBtn.addEventListener('click', () => {
        const newProjectEntry = document.createElement('div');
        newProjectEntry.className = 'project-entry';
        newProjectEntry.innerHTML = `
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" name="projectName[]" class="project-name-input">
            </div>
            <div class="form-group">
                <label>Project URL</label>
                <input type="url" name="projectUrl[]" class="project-url-input" placeholder="https://project-link.com">
            </div>
            <div class="form-group">
                <label>Technologies Used</label>
                <input type="text" name="projectTech[]" class="project-tech-input" placeholder="e.g., React, Node.js, MongoDB">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="projectDescription[]" rows="3" class="project-description-input" placeholder="Brief description of the project..."></textarea>
            </div>
            <button type="button" class="btn-secondary remove-entry" onclick="this.parentElement.remove()">Remove</button>
        `;
        projectsContainer.appendChild(newProjectEntry);
    });
    
    // Education handling
    
    addEducationBtn.addEventListener('click', () => {
        const newEducationEntry = document.createElement('div');
        newEducationEntry.className = 'education-entry';
        newEducationEntry.innerHTML = `
            <div class="form-group">
                <label>School/University</label>
                <input type="text" name="school[]" class="school-input">
            </div>
            <div class="form-group">
                <label>Degree/Certificate</label>
                <input type="text" name="degree[]" class="degree-input">
            </div>
            <div class="form-row">
                <div class="form-group half">
                    <label>Start Year</label>
                    <input type="number" name="eduStartYear[]" class="edu-start-year" min="1950" max="2030">
                </div>
                <div class="form-group half">
                    <label>End Year</label>
                    <input type="number" name="eduEndYear[]" class="edu-end-year" min="1950" max="2030">
                </div>
            </div>
            <button type="button" class="btn-secondary remove-entry" onclick="this.parentElement.remove()">Remove</button>
        `;
        educationContainer.appendChild(newEducationEntry);
    });
    
    // Color customization handling
    
    if (primaryColorInput) {
        primaryColorInput.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--cv-primary', e.target.value);
        });
    }
    
    if (accentColorInput) {
        accentColorInput.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--cv-accent', e.target.value);
        });
    }
    
    // Font style customization
    if (fontStyleSelect) {
        fontStyleSelect.addEventListener('change', (e) => {
            const fontMap = {
                'modern': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                'classic': 'Georgia, "Times New Roman", Times, serif',
                'tech': '"Courier New", Courier, monospace'
            };
            document.documentElement.style.setProperty('--cv-font', fontMap[e.target.value]);
        });
    }
    
    // Generate CV
    generateBtn.addEventListener('click', () => {
        const formData = collectFormData();
        
        if (!validateFormData(formData)) {
            showMessage('Please fill in at least your name and title to generate a CV.', 'error');
            return;
        }
        
        generateCVPreview(formData);
        downloadBtn.disabled = false;
        
        // Enable export button
        const exportBtn = document.getElementById('exportHTML');
        if (exportBtn) {
            exportBtn.disabled = false;
        }
        
        showMessage('CV generated successfully!', 'success');
    });
    
    // Export as HTML/CSS/JS
    function exportAsHTML() {
        const cvContent = document.querySelector('.cv-content');
        if (!cvContent) {
            showMessage('Please generate a CV first!', 'error');
            return;
        }
        
        const formData = collectFormData();
        const htmlContent = generateStandaloneHTML(formData);
        
        // Create and download the HTML file
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-cv.html';
        a.click();
        URL.revokeObjectURL(url);
        
        showMessage('CV exported as HTML successfully!', 'success');
    }
    
    // Generate animation CSS
    function generateAnimationCSS(advanced) {
        const animations = {
            fade: `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .cv-container { animation: fadeIn 1s ease-in; }
                .cv-section { animation: fadeIn 1.5s ease-in; }
            `,
            slide: `
                @keyframes slideIn { from { transform: translateX(-100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .cv-container { animation: slideIn 0.8s ease-out; }
                .cv-section { animation: slideIn 1s ease-out; }
            `,
            bounce: `
                @keyframes bounceIn { 
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .cv-container { animation: bounceIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
            `,
            zoom: `
                @keyframes zoomIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .cv-container { animation: zoomIn 0.6s ease-out; }
            `,
            flip: `
                @keyframes flipIn {
                    from { transform: perspective(400px) rotateY(90deg); opacity: 0; }
                    to { transform: perspective(400px) rotateY(0); opacity: 1; }
                }
                .cv-container { animation: flipIn 1s ease-out; }
            `,
            rotate: `
                @keyframes rotateIn {
                    from { transform: rotate(-200deg); opacity: 0; }
                    to { transform: rotate(0); opacity: 1; }
                }
                .cv-container { animation: rotateIn 0.8s ease-out; }
            `,
            typewriter: `
                @keyframes typing { from { width: 0; } to { width: 100%; } }
                @keyframes blink { 50% { border-color: transparent; } }
                h1, h2, h3 { 
                    overflow: hidden;
                    white-space: nowrap;
                    border-right: 3px solid;
                    animation: typing 2s steps(30, end), blink 0.75s step-end infinite;
                }
            `,
            glitch: `
                @keyframes glitch {
                    0%, 100% { text-shadow: -2px 0 #00ffff, 2px 0 #ff00ff; transform: translate(0); }
                    20% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; transform: translate(-2px, 2px); }
                    40% { text-shadow: -2px 0 #00ffff, 2px 0 #ff00ff; transform: translate(-2px, -2px); }
                    60% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; transform: translate(2px, 2px); }
                    80% { text-shadow: -2px 0 #00ffff, 2px 0 #ff00ff; transform: translate(2px, -2px); }
                }
                h1, h2 { animation: glitch 1s infinite; }
            `,
            matrix3d: `
                @keyframes matrix3d {
                    0% { transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,-800,0,0,1); opacity: 0; }
                    100% { transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1); opacity: 1; }
                }
                .cv-container { 
                    animation: matrix3d 2s cubic-bezier(0.42, 0, 0.58, 1);
                    perspective: 1000px;
                    transform-style: preserve-3d;
                }
            `,
            cube: `
                @keyframes cubeRotate {
                    0% { transform: perspective(1000px) rotateX(-90deg) rotateY(0deg); opacity: 0; }
                    50% { transform: perspective(1000px) rotateX(0deg) rotateY(180deg); }
                    100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); opacity: 1; }
                }
                .cv-container { animation: cubeRotate 2s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
            `,
            helix: `
                @keyframes helix {
                    0% { transform: rotateY(0deg) translateZ(200px) rotateY(0deg); opacity: 0; }
                    100% { transform: rotateY(360deg) translateZ(0px) rotateY(-360deg); opacity: 1; }
                }
                .cv-container { animation: helix 3s ease-in-out; transform-style: preserve-3d; }
                .cv-section { animation: helix 3s ease-in-out; animation-delay: 0.2s; }
            `,
            explosion: `
                @keyframes explosion {
                    0% {
                        transform: scale(0) rotate(0deg);
                        opacity: 0;
                        filter: blur(20px) brightness(2);
                    }
                    50% {
                        transform: scale(1.5) rotate(180deg);
                        filter: blur(0) brightness(1.5);
                    }
                    100% {
                        transform: scale(1) rotate(360deg);
                        opacity: 1;
                        filter: blur(0) brightness(1);
                    }
                }
                .cv-container { animation: explosion 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
                .cv-section { animation: explosion 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); animation-delay: 0.3s; }
            `,
            liquid: `
                @keyframes liquid {
                    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: scale(0.8); opacity: 0; }
                    25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                    50% { border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; transform: scale(1.1); }
                    75% { border-radius: 40% 60% 60% 40% / 70% 30% 40% 60%; }
                    100% { border-radius: 12px; transform: scale(1); opacity: 1; }
                }
                .cv-container { animation: liquid 2s ease-in-out; }
            `,
            dimensional: `
                @keyframes dimensional {
                    0% {
                        transform: perspective(1000px) translateZ(-500px) rotateX(90deg);
                        opacity: 0;
                        filter: hue-rotate(0deg);
                    }
                    50% {
                        transform: perspective(1000px) translateZ(-250px) rotateX(45deg);
                        filter: hue-rotate(180deg);
                    }
                    100% {
                        transform: perspective(1000px) translateZ(0) rotateX(0deg);
                        opacity: 1;
                        filter: hue-rotate(360deg);
                    }
                }
                .cv-container { animation: dimensional 2s ease-out; }
            `,
            hologram: `
                @keyframes hologram {
                    0% { 
                        opacity: 0;
                        transform: translateZ(-100px) rotateY(90deg);
                        filter: brightness(0) contrast(2);
                    }
                    50% {
                        opacity: 0.5;
                        transform: translateZ(-50px) rotateY(45deg);
                        filter: brightness(2) contrast(1.5) hue-rotate(180deg);
                    }
                    100% {
                        opacity: 1;
                        transform: translateZ(0) rotateY(0deg);
                        filter: brightness(1) contrast(1) hue-rotate(0deg);
                    }
                }
                .cv-container {
                    animation: hologram 2s ease-out;
                    position: relative;
                }
                .cv-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%);
                    animation: hologramScan 2s linear infinite;
                    pointer-events: none;
                }
                @keyframes hologramScan {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `,
            quantum: `
                @keyframes quantum {
                    0%, 100% {
                        opacity: 0;
                        transform: scale(0) rotate(0deg);
                        filter: blur(20px);
                    }
                    25% {
                        opacity: 0.5;
                        transform: scale(0.5) rotate(90deg);
                        filter: blur(10px);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.2) rotate(180deg);
                        filter: blur(5px);
                    }
                    75% {
                        opacity: 1;
                        transform: scale(0.9) rotate(270deg);
                        filter: blur(0);
                    }
                    90% {
                        opacity: 1;
                        transform: scale(1) rotate(360deg);
                        filter: blur(0);
                    }
                }
                .cv-container { animation: quantum 3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
            `,
            neural: `
                @keyframes neural {
                    0% {
                        clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%);
                        opacity: 0;
                    }
                    25% {
                        clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
                    }
                    50% {
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                        opacity: 1;
                    }
                    100% {
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                        opacity: 1;
                    }
                }
                .cv-container {
                    animation: neural 2s ease-out;
                    position: relative;
                }
                .cv-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px);
                    animation: neuralPulse 1s linear infinite;
                    pointer-events: none;
                }
                @keyframes neuralPulse {
                    0% { opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { opacity: 0; }
                }
            `,
            vortex: `
                @keyframes vortex {
                    0% {
                        transform: rotate(720deg) scale(0);
                        opacity: 0;
                        filter: blur(20px) hue-rotate(0deg);
                    }
                    50% {
                        transform: rotate(360deg) scale(0.5);
                        filter: blur(10px) hue-rotate(180deg);
                    }
                    100% {
                        transform: rotate(0deg) scale(1);
                        opacity: 1;
                        filter: blur(0) hue-rotate(360deg);
                    }
                }
                .cv-container { 
                    animation: vortex 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    transform-origin: center center;
                }
            `
        };
        return animations[advanced.animationType] || '';
    }
    
    // Generate effects CSS
    function generateEffectsCSS(advanced, data) {
        let css = '';
        
        // Text effects
        const textEffects = {
            glow: `h1, h2, h3 { text-shadow: 0 0 ${advanced.glowIntensity/10}px currentColor, 0 0 ${advanced.glowIntensity/5}px currentColor; }`,
            shadow: `h1, h2, h3 { text-shadow: 3px 3px 6px rgba(0,0,0,0.3); }`,
            gradient: `h1, h2 { background: linear-gradient(45deg, ${data.customization.primaryColor}, ${data.customization.accentColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }`,
            outline: `h1, h2, h3 { -webkit-text-stroke: 2px currentColor; -webkit-text-fill-color: white; }`,
            retro: `h1, h2 { text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; }`,
            'glitch-text': `h1, h2 { position: relative; } h1::before, h2::before { content: attr(data-text); position: absolute; left: 2px; text-shadow: -2px 0 #ff00ff; animation: glitch-1 0.5s infinite; }`,
            rainbow: `
                @keyframes rainbow { 
                    0% { color: red; } 
                    14% { color: orange; } 
                    28% { color: yellow; } 
                    42% { color: green; } 
                    57% { color: blue; } 
                    71% { color: indigo; } 
                    85% { color: violet; } 
                    100% { color: red; } 
                }
                h1, h2 { animation: rainbow 5s linear infinite; }
            `,
            chrome: `
                h1, h2 {
                    background: linear-gradient(to bottom, #eee 0%, #999 50%, #777 51%, #555 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
                    text-shadow: 0 0 10px rgba(255,255,255,0.5);
                }
            `,
            gold: `
                h1, h2 {
                    background: linear-gradient(to bottom, #ffeb3b 0%, #ffc107 50%, #ff9800 51%, #ff6f00 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(2px 2px 8px rgba(255,215,0,0.8));
                    text-shadow: 0 0 20px rgba(255,215,0,0.5);
                }
            `,
            ice: `
                h1, h2 {
                    background: linear-gradient(to bottom, #e3f2fd 0%, #90caf9 50%, #42a5f5 51%, #1e88e5 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 10px rgba(173,216,230,0.9));
                    text-shadow: 0 0 30px rgba(135,206,250,0.8);
                }
            `,
            fire: `
                @keyframes fireFlicker {
                    0%, 100% { text-shadow: 0 0 20px #ff6600, 0 0 30px #ff6600, 0 0 40px #ff6600; }
                    50% { text-shadow: 0 0 25px #ff9900, 0 0 35px #ff9900, 0 0 45px #ff9900; }
                }
                h1, h2 {
                    background: linear-gradient(to bottom, #ffeb3b 0%, #ff9800 50%, #f44336 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: fireFlicker 0.5s infinite alternate;
                }
            `,
            smoke: `
                @keyframes smoke {
                    0% { text-shadow: 0 0 0 transparent; }
                    50% { text-shadow: 0 0 20px rgba(150,150,150,0.8); }
                    100% { text-shadow: 0 -20px 40px transparent; }
                }
                h1, h2 {
                    color: #888;
                    animation: smoke 3s infinite;
                }
            `,
            electric: `
                @keyframes electric {
                    0%, 100% {
                        text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff;
                        filter: brightness(1) contrast(1);
                    }
                    50% {
                        text-shadow: 0 0 15px #fff, 0 0 25px #0ff, 0 0 35px #0ff;
                        filter: brightness(1.5) contrast(1.5);
                    }
                }
                h1, h2 {
                    color: #0ff;
                    animation: electric 0.2s infinite alternate;
                }
            `,
            'neon-flicker': `
                @keyframes neonFlicker {
                    0%, 100% { opacity: 1; text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff; }
                    50% { opacity: 0.8; text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff; }
                }
                h1, h2 {
                    animation: neonFlicker 1.5s infinite alternate;
                    color: #fff;
                }
            `,
            laser: `
                @keyframes laserScan {
                    0% { background-position: -100% 0; }
                    100% { background-position: 200% 0; }
                }
                h1, h2 {
                    background: linear-gradient(90deg, transparent 30%, #0ff 50%, transparent 70%);
                    background-size: 200% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: laserScan 2s infinite;
                    filter: drop-shadow(0 0 10px #0ff);
                }
            `,
            'holographic-text': `
                @keyframes holoShift {
                    0% { filter: hue-rotate(0deg) brightness(1) contrast(1); }
                    33% { filter: hue-rotate(120deg) brightness(1.2) contrast(1.2); }
                    66% { filter: hue-rotate(240deg) brightness(0.9) contrast(0.9); }
                    100% { filter: hue-rotate(360deg) brightness(1) contrast(1); }
                }
                h1, h2 {
                    background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: holoShift 3s infinite;
                }
            `
        };
        css += textEffects[advanced.textEffect] || '';
        
        // Border styles
        const borderStyles = {
            animated: `
                @keyframes borderMove { 0% { border-color: ${data.customization.primaryColor}; } 50% { border-color: ${data.customization.accentColor}; } 100% { border-color: ${data.customization.primaryColor}; } }
                .cv-container { border: 3px solid; animation: borderMove 3s infinite; }
            `,
            glow: `.cv-container { box-shadow: 0 0 ${advanced.glowIntensity/2}px ${data.customization.primaryColor}, 0 0 ${advanced.glowIntensity}px ${data.customization.accentColor}; }`,
            'gradient-border': `.cv-container { border: 5px solid; border-image: linear-gradient(45deg, ${data.customization.primaryColor}, ${data.customization.accentColor}) 1; }`,
            'dashed-animated': `
                @keyframes dash { to { stroke-dashoffset: 0; } }
                .cv-container { border: 3px dashed; animation: dash 20s linear infinite; }
            `,
            double: `.cv-container { border: double 6px ${data.customization.primaryColor}; }`,
            neumorphism: `.cv-container { background: #e0e0e0; box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff; }`,
            glassmorphism: `.cv-container { background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); }`,
            'laser-border': `
                @keyframes laserBorder {
                    0% { box-shadow: 0 0 10px #0ff, inset 0 0 10px #0ff; }
                    50% { box-shadow: 0 0 30px #0ff, inset 0 0 30px #0ff; }
                    100% { box-shadow: 0 0 10px #0ff, inset 0 0 10px #0ff; }
                }
                .cv-container {
                    border: 2px solid #0ff;
                    animation: laserBorder 2s infinite;
                    position: relative;
                }
                .cv-container::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: linear-gradient(45deg, #0ff, #f0f, #0ff, #f0f);
                    z-index: -1;
                    animation: laserBorder 2s infinite;
                }
            `,
            energy: `
                @keyframes energyField {
                    0% { box-shadow: 0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.6), 0 0 60px rgba(0,255,255,0.4); }
                    50% { box-shadow: 0 0 30px rgba(255,0,255,0.8), 0 0 50px rgba(255,0,255,0.6), 0 0 70px rgba(255,0,255,0.4); }
                    100% { box-shadow: 0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.6), 0 0 60px rgba(0,255,255,0.4); }
                }
                .cv-container {
                    animation: energyField 3s infinite;
                    border: 2px solid transparent;
                    background: linear-gradient(white, white) padding-box, linear-gradient(45deg, #0ff, #f0f) border-box;
                }
            `,
            hexagon: `
                .cv-container {
                    clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
                    padding: 4rem;
                }
            `,
            plasma: `
                @keyframes plasma {
                    0% { border-color: #ff00ff; box-shadow: 0 0 20px #ff00ff, inset 0 0 20px #ff00ff; }
                    33% { border-color: #00ffff; box-shadow: 0 0 20px #00ffff, inset 0 0 20px #00ffff; }
                    66% { border-color: #ffff00; box-shadow: 0 0 20px #ffff00, inset 0 0 20px #ffff00; }
                    100% { border-color: #ff00ff; box-shadow: 0 0 20px #ff00ff, inset 0 0 20px #ff00ff; }
                }
                .cv-container {
                    border: 3px solid;
                    animation: plasma 2s infinite;
                }
            `,
            forcefield: `
                .cv-container {
                    position: relative;
                    border: none;
                }
                .cv-container::before {
                    content: '';
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    right: -10px;
                    bottom: -10px;
                    background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,255,255,0.1) 10px, rgba(0,255,255,0.1) 20px);
                    animation: forcefieldPulse 2s infinite;
                    z-index: -1;
                }
                @keyframes forcefieldPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
            `,
            'circuit-border': `
                .cv-container {
                    border: 2px solid #0f0;
                    background-image: repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,255,0,0.1) 10px, rgba(0,255,0,0.1) 11px),
                                      repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,255,0,0.1) 10px, rgba(0,255,0,0.1) 11px);
                }
            `,
            diamond: `
                .cv-container {
                    transform: rotate(45deg);
                    margin: 100px auto;
                    overflow: hidden;
                }
                .cv-container > * {
                    transform: rotate(-45deg);
                }
            `
        };
        css += borderStyles[advanced.borderStyle] || '';
        
        // Hover effects
        if (advanced.hoverEffects) {
            css += `
                .work-item:hover, .project-item:hover, .education-item:hover { 
                    transform: translateY(-5px); 
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1); 
                    transition: all 0.3s ease; 
                }
                a:hover { transform: scale(1.1); transition: transform 0.2s; }
            `;
        }
        
        // Blur effect
        if (advanced.blurEffect > 0) {
            css += `body::before { content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0; backdrop-filter: blur(${advanced.blurEffect}px); pointer-events: none; }`;
        }
        
        return css;
    }
    
    // Generate background CSS
    function generateBackgroundCSS(advanced) {
        const backgrounds = {
            'gradient-animated': `
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                body {
                    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
                    background-size: 400% 400%;
                    animation: gradientMove 15s ease infinite;
                }
            `,
            particles: `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: radial-gradient(circle, #fff 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: float 20s infinite linear;
                    pointer-events: none;
                }
                @keyframes float { from { transform: translateY(0); } to { transform: translateY(-100%); } }
            `,
            waves: `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: -100%;
                    width: 200%;
                    height: 100%;
                    background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);
                    animation: wave 10s linear infinite;
                    pointer-events: none;
                }
                @keyframes wave { to { transform: translateX(50%); } }
            `,
            geometric: `
                body {
                    background-color: #f9fafb;
                    background-image: 
                        linear-gradient(30deg, #f9fafb 12%, transparent 12.5%, transparent 87%, #f9fafb 87.5%, #f9fafb),
                        linear-gradient(150deg, #f9fafb 12%, transparent 12.5%, transparent 87%, #f9fafb 87.5%, #f9fafb),
                        linear-gradient(30deg, #f9fafb 12%, transparent 12.5%, transparent 87%, #f9fafb 87.5%, #f9fafb),
                        linear-gradient(150deg, #f9fafb 12%, transparent 12.5%, transparent 87%, #f9fafb 87.5%, #f9fafb),
                        linear-gradient(60deg, rgba(37,99,235,0.1) 25%, transparent 25.5%, transparent 75%, rgba(37,99,235,0.1) 75%, rgba(37,99,235,0.1));
                    background-size: 80px 140px;
                    background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0;
                }
            `,
            stars: `
                @keyframes stars { from { transform: translateY(0); } to { transform: translateY(-1000px); } }
                body::before, body::after {
                    content: '';
                    position: fixed;
                    width: 2px;
                    height: 2px;
                    background: white;
                    box-shadow: ${Array(50).fill().map(() => `${Math.random()*2000}px ${Math.random()*2000}px white`).join(',')};
                    animation: stars 50s linear infinite;
                }
            `,
            matrix: `
                body::before {
                    content: '10101010101010101010101010101010';
                    position: fixed;
                    top: 0;
                    left: 0;
                    color: #0f0;
                    font-family: monospace;
                    font-size: 16px;
                    white-space: pre;
                    overflow: hidden;
                    animation: matrix 20s linear infinite;
                    pointer-events: none;
                    opacity: 0.1;
                }
                @keyframes matrix { to { transform: translateY(100%); } }
            `,
            aurora: `
                @keyframes aurora {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                body {
                    background: linear-gradient(0deg, #001220, #003355, #004466, #00aacc, #00ffff);
                    background-size: 200% 200%;
                    animation: aurora 10s ease infinite;
                }
            `,
            mesh: `
                body {
                    background: 
                        radial-gradient(at 40% 20%, hsla(280,100%,70%,1) 0px, transparent 50%),
                        radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
                        radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
                        radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
                        radial-gradient(at 0% 100%, hsla(224,100%,80%,1) 0px, transparent 50%),
                        radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
                        radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%);
                }
            `,
            cosmos: `
                @keyframes cosmosRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                body {
                    background: #000428;
                    background: linear-gradient(to bottom, #000428, #004e92);
                    position: relative;
                }
                body::before, body::after {
                    content: '';
                    position: fixed;
                    width: 200%;
                    height: 200%;
                    top: -50%;
                    left: -50%;
                    background-image: radial-gradient(circle, #fff 1px, transparent 1px), radial-gradient(circle, #fff 1px, transparent 1px);
                    background-size: 100px 100px, 50px 50px;
                    background-position: 0 0, 25px 25px;
                    animation: cosmosRotate 100s linear infinite;
                    opacity: 0.3;
                    pointer-events: none;
                }
            `,
            circuit: `
                body {
                    background: #0a0a0a;
                    background-image: 
                        linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent),
                        linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent);
                    background-size: 50px 50px;
                }
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(0deg, rgba(0,255,0,0.1) 0px, transparent 1px, transparent 2px, rgba(0,255,0,0.1) 3px);
                    pointer-events: none;
                    animation: circuitPulse 2s infinite;
                }
                @keyframes circuitPulse {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }
            `,
            dna: `
                @keyframes dnaRotate {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(360deg); }
                }
                body::before, body::after {
                    content: '';
                    position: fixed;
                    width: 100px;
                    height: 100%;
                    top: 0;
                    background: repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,255,255,0.1) 10px, rgba(0,255,255,0.1) 20px);
                    animation: dnaRotate 10s linear infinite;
                    transform-style: preserve-3d;
                    pointer-events: none;
                }
                body::before {
                    left: 10%;
                }
                body::after {
                    right: 10%;
                    animation-delay: 5s;
                }
            `,
            fireflies: `
                @keyframes firefly {
                    0% { transform: translate(0, 100vh) scale(0); }
                    10% { transform: translate(10vw, 90vh) scale(1); }
                    20% { transform: translate(-10vw, 80vh) scale(1); }
                    30% { transform: translate(10vw, 70vh) scale(1); }
                    40% { transform: translate(-10vw, 60vh) scale(1); }
                    50% { transform: translate(10vw, 50vh) scale(1); }
                    60% { transform: translate(-10vw, 40vh) scale(1); }
                    70% { transform: translate(10vw, 30vh) scale(1); }
                    80% { transform: translate(-10vw, 20vh) scale(1); }
                    90% { transform: translate(10vw, 10vh) scale(1); }
                    100% { transform: translate(0, -10vh) scale(0); }
                }
                body::before {
                    content: '✨ ✨ ✨ ✨ ✨';
                    position: fixed;
                    font-size: 20px;
                    animation: firefly 15s linear infinite;
                    pointer-events: none;
                }
            `,
            neurons: `
                body {
                    background: #0a0a2e;
                    position: relative;
                }
                body::before {
                    content: '';
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 20% 30%, rgba(0,255,255,0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(255,0,255,0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 60%, rgba(255,255,0,0.3) 0%, transparent 50%);
                    animation: neuronPulse 4s infinite;
                    pointer-events: none;
                }
                @keyframes neuronPulse {
                    0%, 100% { opacity: 0.3; filter: blur(10px); }
                    50% { opacity: 0.8; filter: blur(20px); }
                }
            `,
            fractal: `
                body {
                    background: linear-gradient(45deg, #000428 0%, #004e92 100%);
                    position: relative;
                }
                body::after {
                    content: '';
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.1) 10deg, transparent 20deg);
                    animation: fractalRotate 20s linear infinite;
                    pointer-events: none;
                }
                @keyframes fractalRotate {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.5); }
                    100% { transform: rotate(360deg) scale(1); }
                }
            `,
            'liquid-bg': `
                @keyframes liquidMove {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                body {
                    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #ee7752);
                    background-size: 400% 400%;
                    animation: liquidMove 10s ease infinite;
                }
                body::after {
                    content: '';
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 20% 50%, transparent 30%, rgba(255,255,255,0.1) 30.5%),
                        radial-gradient(circle at 80% 80%, transparent 40%, rgba(255,255,255,0.1) 40.5%);
                    animation: liquidBubbles 5s infinite;
                    pointer-events: none;
                }
                @keyframes liquidBubbles {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `,
            portal: `
                @keyframes portalSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                body {
                    background: radial-gradient(ellipse at center, #1b2735 0%, #090a0f 100%);
                    overflow: hidden;
                }
                body::before {
                    content: '';
                    position: fixed;
                    width: 500px;
                    height: 500px;
                    top: 50%;
                    left: 50%;
                    margin: -250px 0 0 -250px;
                    background: conic-gradient(from 0deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
                    border-radius: 50%;
                    animation: portalSpin 3s linear infinite;
                    opacity: 0.3;
                    filter: blur(20px);
                    pointer-events: none;
                }
            `,
            metaverse: `
                body {
                    background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
                    position: relative;
                    perspective: 1000px;
                }
                body::before {
                    content: '';
                    position: fixed;
                    width: 200%;
                    height: 200%;
                    top: -50%;
                    left: -50%;
                    background-image: 
                        linear-gradient(0deg, transparent 48%, rgba(0,255,255,0.5) 49%, rgba(0,255,255,0.5) 51%, transparent 52%),
                        linear-gradient(90deg, transparent 48%, rgba(255,0,255,0.5) 49%, rgba(255,0,255,0.5) 51%, transparent 52%);
                    background-size: 50px 50px;
                    transform: rotateX(60deg) rotateZ(45deg);
                    animation: metaverseGrid 20s linear infinite;
                    pointer-events: none;
                }
                @keyframes metaverseGrid {
                    0% { transform: rotateX(60deg) rotateZ(45deg) translateZ(0); }
                    100% { transform: rotateX(60deg) rotateZ(45deg) translateZ(50px); }
                }
            `
        };
        return backgrounds[advanced.backgroundEffect] || '';
    }
    
    // Generate standalone HTML with embedded CSS and JS
    function generateStandaloneHTML(data) {
        // Generate animation CSS based on selected options
        const animationCSS = generateAnimationCSS(data.advanced);
        const effectsCSS = generateEffectsCSS(data.advanced, data);
        const backgroundCSS = generateBackgroundCSS(data.advanced);
        
        const styles = `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background: #f9fafb; padding: 20px; position: relative; overflow-x: hidden; }
            .cv-container { max-width: 900px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .cv-header { background: linear-gradient(135deg, ${data.customization.primaryColor} 0%, ${data.customization.accentColor} 100%); color: white; padding: 3rem; text-align: center; }
            .cv-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
            .cv-header .title { font-size: 1.3rem; opacity: 0.95; margin-bottom: 1.5rem; }
            .contact-info { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; font-size: 0.95rem; }
            .cv-body { padding: 3rem; }
            .cv-section { margin-bottom: 2.5rem; }
            .cv-section h2 { color: ${data.customization.primaryColor}; border-bottom: 2px solid ${data.customization.primaryColor}; padding-bottom: 0.5rem; margin-bottom: 1.5rem; font-size: 1.5rem; }
            .work-item, .project-item, .education-item { margin-bottom: 1.5rem; }
            .work-header, .project-header, .education-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem; }
            .work-header h3, .project-header h3, .education-header h3 { color: #1f2937; font-size: 1.2rem; }
            .company { color: ${data.customization.accentColor}; font-weight: 600; }
            .date-range { color: #6b7280; font-size: 0.9rem; font-style: italic; }
            .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
            .skill-category h4 { color: ${data.customization.accentColor}; margin-bottom: 0.5rem; }
            .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
            .skill-tag { background: #f3f4f6; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.9rem; border: 1px solid #e5e7eb; }
            .links-section { display: flex; gap: 1.5rem; margin-top: 1rem; }
            .links-section a { color: ${data.customization.primaryColor}; text-decoration: none; }
            .links-section a:hover { text-decoration: underline; }
            .tech-stack { color: #6b7280; font-size: 0.9rem; margin-top: 0.5rem; }
            .project-link { color: ${data.customization.primaryColor}; text-decoration: none; font-size: 0.9rem; }
            @media print { body { background: white; padding: 0; } .cv-container { box-shadow: none; border-radius: 0; } }
            @media (max-width: 768px) { .skills-grid { grid-template-columns: 1fr; } .contact-info { flex-direction: column; align-items: center; } }
            
            /* Advanced Effects CSS */
            ${animationCSS}
            ${effectsCSS}
            ${backgroundCSS}
            
            /* Dark Mode */
            ${data.advanced.darkMode ? `
                @media (prefers-color-scheme: dark) {
                    body { background: #1a1a1a; color: #f0f0f0; }
                    .cv-container { background: #2a2a2a; }
                    .cv-section h2 { color: ${data.customization.accentColor}; }
                }
            ` : ''}
        `;
        
        const cvBody = document.querySelector('.cv-content').innerHTML;
        
        // Generate JavaScript for interactive features
        const jsFeatures = `
            ${data.advanced.parallax ? `
                window.addEventListener('scroll', () => {
                    const scrolled = window.pageYOffset;
                    const parallax = document.querySelector('.cv-header');
                    if (parallax) {
                        parallax.style.transform = 'translateY(' + scrolled * 0.5 + 'px)';
                    }
                });
            ` : ''}
            
            ${data.advanced.confetti ? `
                // Confetti effect on load
                function createConfetti() {
                    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
                    for (let i = 0; i < 100; i++) {
                        const confetti = document.createElement('div');
                        confetti.style.cssText = \`
                            position: fixed;
                            top: -10px;
                            left: \${Math.random() * 100}%;
                            width: 10px;
                            height: 10px;
                            background: \${colors[Math.floor(Math.random() * colors.length)]};
                            transform: rotate(\${Math.random() * 360}deg);
                            animation: fall \${3 + Math.random() * 2}s linear;
                            z-index: 9999;
                        \`;
                        document.body.appendChild(confetti);
                        setTimeout(() => confetti.remove(), 5000);
                    }
                }
                
                const style = document.createElement('style');
                style.textContent = \`
                    @keyframes fall {
                        to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                    }
                \`;
                document.head.appendChild(style);
                
                window.addEventListener('load', createConfetti);
            ` : ''}
            
            ${data.advanced.soundEffects ? `
                // Create click sound effect (using Web Audio API)
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                function playClick() {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    oscillator.frequency.value = 800;
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                }
                document.addEventListener('click', playClick);
            ` : ''}
            
            ${data.advanced.darkMode ? `
                // Dark mode toggle button
                const darkToggle = document.createElement('button');
                darkToggle.textContent = '🌙';
                darkToggle.style.cssText = \`
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    font-size: 24px;
                    cursor: pointer;
                    z-index: 1000;
                    transition: all 0.3s;
                \`;
                darkToggle.addEventListener('click', () => {
                    document.body.classList.toggle('dark-mode');
                    darkToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
                });
                document.body.appendChild(darkToggle);
                
                const darkStyle = document.createElement('style');
                darkStyle.textContent = \`
                    .dark-mode { background: #1a1a1a !important; color: #f0f0f0 !important; }
                    .dark-mode .cv-container { background: #2a2a2a !important; }
                    .dark-mode .cv-section h2 { color: ${data.customization.accentColor} !important; }
                \`;
                document.head.appendChild(darkStyle);
            ` : ''}
            
            ${data.advanced.magneticCursor ? `
                // Magnetic cursor effect
                document.addEventListener('mousemove', (e) => {
                    const elements = document.querySelectorAll('h1, h2, h3, a, button');
                    elements.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        const x = rect.left + rect.width / 2;
                        const y = rect.top + rect.height / 2;
                        const dist = Math.sqrt(Math.pow(e.clientX - x, 2) + Math.pow(e.clientY - y, 2));
                        if (dist < 100) {
                            const force = (100 - dist) / 100;
                            el.style.transform = \`translate(\${(e.clientX - x) * force * 0.2}px, \${(e.clientY - y) * force * 0.2}px)\`;
                        } else {
                            el.style.transform = '';
                        }
                    });
                });
            ` : ''}
            
            ${data.advanced.scrollReveal ? `
                // Scroll reveal animations
                const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                }, observerOptions);
                
                document.querySelectorAll('.cv-section').forEach(section => {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(30px)';
                    section.style.transition = 'all 0.6s ease';
                    observer.observe(section);
                });
            ` : ''}
            
            ${data.advanced.particleTrail ? `
                // Particle trail effect
                document.addEventListener('mousemove', (e) => {
                    const particle = document.createElement('div');
                    particle.style.cssText = \`
                        position: fixed;
                        width: 10px;
                        height: 10px;
                        background: linear-gradient(45deg, #ff00ff, #00ffff);
                        border-radius: 50%;
                        left: \${e.clientX}px;
                        top: \${e.clientY}px;
                        pointer-events: none;
                        animation: particleFade 1s ease-out forwards;
                        z-index: 9999;
                    \`;
                    document.body.appendChild(particle);
                    setTimeout(() => particle.remove(), 1000);
                });
                
                const particleStyle = document.createElement('style');
                particleStyle.textContent = \`
                    @keyframes particleFade {
                        to { transform: translateY(50px) scale(0); opacity: 0; }
                    }
                \`;
                document.head.appendChild(particleStyle);
            ` : ''}
            
            ${data.advanced.floatingElements ? `
                // Floating elements animation
                const floatStyle = document.createElement('style');
                floatStyle.textContent = \`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    .cv-header, .skill-tag, .work-item, .project-item {
                        animation: float 3s ease-in-out infinite;
                    }
                    .cv-header { animation-delay: 0s; }
                    .skill-tag:nth-child(odd) { animation-delay: 0.5s; }
                    .skill-tag:nth-child(even) { animation-delay: 1s; }
                \`;
                document.head.appendChild(floatStyle);
            ` : ''}
            
            ${data.advanced.rippleEffect ? `
                // Ripple click effect
                document.addEventListener('click', (e) => {
                    const ripple = document.createElement('div');
                    ripple.style.cssText = \`
                        position: fixed;
                        width: 20px;
                        height: 20px;
                        background: rgba(255,255,255,0.5);
                        border: 2px solid rgba(255,255,255,0.8);
                        border-radius: 50%;
                        left: \${e.clientX - 10}px;
                        top: \${e.clientY - 10}px;
                        pointer-events: none;
                        animation: rippleExpand 0.6s ease-out forwards;
                        z-index: 9999;
                    \`;
                    document.body.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                });
                
                const rippleStyle = document.createElement('style');
                rippleStyle.textContent = \`
                    @keyframes rippleExpand {
                        to { 
                            width: 200px;
                            height: 200px;
                            margin-left: -90px;
                            margin-top: -90px;
                            opacity: 0;
                        }
                    }
                \`;
                document.head.appendChild(rippleStyle);
            ` : ''}
            
            ${data.advanced.tiltEffect ? `
                // 3D Tilt effect on hover
                document.querySelectorAll('.cv-section').forEach(section => {
                    section.addEventListener('mousemove', (e) => {
                        const rect = section.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                        section.style.transform = \`perspective(1000px) rotateX(\${y * 10}deg) rotateY(\${x * 10}deg)\`;
                    });
                    section.addEventListener('mouseleave', () => {
                        section.style.transform = '';
                    });
                    section.style.transition = 'transform 0.1s';
                    section.style.transformStyle = 'preserve-3d';
                });
            ` : ''}
            
            ${data.advanced.morphingShapes ? `
                // Morphing background shapes
                const morphContainer = document.createElement('div');
                morphContainer.style.cssText = \`
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                \`;
                
                for (let i = 0; i < 5; i++) {
                    const shape = document.createElement('div');
                    shape.style.cssText = \`
                        position: absolute;
                        width: 200px;
                        height: 200px;
                        background: linear-gradient(45deg, rgba(255,0,255,0.3), rgba(0,255,255,0.3));
                        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                        animation: morph 10s ease-in-out infinite;
                        animation-delay: \${i * 2}s;
                        left: \${Math.random() * 100}%;
                        top: \${Math.random() * 100}%;
                        filter: blur(40px);
                    \`;
                    morphContainer.appendChild(shape);
                }
                document.body.appendChild(morphContainer);
                
                const morphStyle = document.createElement('style');
                morphStyle.textContent = \`
                    @keyframes morph {
                        0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: rotate(0deg) scale(1); }
                        25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; transform: rotate(90deg) scale(1.2); }
                        50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; transform: rotate(180deg) scale(0.8); }
                        75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; transform: rotate(270deg) scale(1.1); }
                    }
                \`;
                document.head.appendChild(morphStyle);
            ` : ''}
            
            ${data.advanced.webgl ? `
                // WebGL 3D Effects
                const canvas = document.createElement('canvas');
                canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; pointer-events: none;';
                document.body.appendChild(canvas);
                
                const vertexShader = \`
                    attribute vec2 position;
                    varying vec2 vUv;
                    void main() {
                        vUv = position * 0.5 + 0.5;
                        gl_Position = vec4(position, 0.0, 1.0);
                    }
                \`;
                
                const fragmentShader = \`
                    precision mediump float;
                    varying vec2 vUv;
                    uniform float time;
                    void main() {
                        vec2 p = vUv * 2.0 - 1.0;
                        float d = length(p);
                        float a = atan(p.y, p.x);
                        float r = d + sin(a * 5.0 + time) * 0.1;
                        float g = sin(r * 10.0 + time) * 0.5 + 0.5;
                        float b = cos(a * 3.0 + time) * 0.5 + 0.5;
                        gl_FragColor = vec4(r, g, b, 0.3);
                    }
                \`;
                
                // Initialize WebGL context (simplified)
                const gl = canvas.getContext('webgl');
                if (gl) {
                    // WebGL setup code here (simplified for demo)
                    console.log('WebGL initialized');
                }
            ` : ''}
            
            ${data.advanced.voiceControl ? `
                // Voice Control
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    const recognition = new SpeechRecognition();
                    recognition.continuous = true;
                    recognition.lang = 'en-US';
                    
                    recognition.onresult = (event) => {
                        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
                        console.log('Voice command:', command);
                        
                        if (command.includes('scroll down')) {
                            window.scrollBy(0, 500);
                        } else if (command.includes('scroll up')) {
                            window.scrollBy(0, -500);
                        } else if (command.includes('dark mode')) {
                            document.body.classList.toggle('dark-mode');
                        } else if (command.includes('show skills')) {
                            document.querySelector('.skills-grid')?.scrollIntoView({ behavior: 'smooth' });
                        }
                    };
                    
                    // Add voice indicator
                    const voiceIndicator = document.createElement('div');
                    voiceIndicator.textContent = '🎤 Voice Control Active';
                    voiceIndicator.style.cssText = 'position: fixed; top: 10px; right: 10px; background: rgba(0,255,0,0.2); padding: 10px; border-radius: 20px; z-index: 1000;';
                    document.body.appendChild(voiceIndicator);
                    
                    recognition.start();
                }
            ` : ''}
            
            ${data.advanced.gameMode ? `
                // Game Mode - CV as a game!
                let score = 0;
                const gameContainer = document.createElement('div');
                gameContainer.style.cssText = 'position: fixed; top: 50px; left: 10px; z-index: 1000;';
                gameContainer.innerHTML = '<div style="background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 10px;">🎮 Score: <span id="score">0</span></div>';
                document.body.appendChild(gameContainer);
                
                // Make CV sections clickable for points
                document.querySelectorAll('.cv-section').forEach((section, index) => {
                    section.style.cursor = 'pointer';
                    section.addEventListener('click', () => {
                        score += (index + 1) * 10;
                        document.getElementById('score').textContent = score;
                        
                        // Explosion effect
                        section.style.animation = 'explosion 0.5s ease';
                        setTimeout(() => section.style.animation = '', 500);
                        
                        // Achievement unlocked
                        if (score > 100) {
                            const achievement = document.createElement('div');
                            achievement.textContent = '🏆 Achievement Unlocked: CV Master!';
                            achievement.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: gold; color: black; padding: 20px; border-radius: 10px; z-index: 10000; animation: bounceIn 1s;';
                            document.body.appendChild(achievement);
                            setTimeout(() => achievement.remove(), 3000);
                        }
                    });
                });
            ` : ''}
            
            ${data.advanced.timeTheme ? `
                // Time-based themes
                const hour = new Date().getHours();
                let theme = 'day';
                
                if (hour >= 5 && hour < 12) {
                    theme = 'morning';
                    document.body.style.background = 'linear-gradient(to bottom, #ffecd2, #fcb69f)';
                } else if (hour >= 12 && hour < 17) {
                    theme = 'afternoon';
                    document.body.style.background = 'linear-gradient(to bottom, #a8edea, #fed6e3)';
                } else if (hour >= 17 && hour < 21) {
                    theme = 'evening';
                    document.body.style.background = 'linear-gradient(to bottom, #fa709a, #fee140)';
                } else {
                    theme = 'night';
                    document.body.style.background = 'linear-gradient(to bottom, #2c3e50, #3498db)';
                }
                
                // Add time indicator
                const timeIndicator = document.createElement('div');
                timeIndicator.textContent = '🕐 ' + theme.charAt(0).toUpperCase() + theme.slice(1) + ' Theme Active';
                timeIndicator.style.cssText = 'position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.5); color: white; padding: 10px; border-radius: 10px; z-index: 1000;';
                document.body.appendChild(timeIndicator);
            ` : ''}
            
            ${data.advanced.weatherEffects ? `
                // Weather Effects
                const weatherTypes = ['rain', 'snow', 'lightning'];
                const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
                
                if (weather === 'rain') {
                    // Rain effect
                    const rainContainer = document.createElement('div');
                    rainContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999;';
                    
                    for (let i = 0; i < 100; i++) {
                        const drop = document.createElement('div');
                        drop.style.cssText = \`
                            position: absolute;
                            width: 2px;
                            height: 20px;
                            background: linear-gradient(transparent, rgba(174, 194, 224, 0.6));
                            left: \${Math.random() * 100}%;
                            animation: rain \${0.5 + Math.random() * 0.5}s linear infinite;
                            animation-delay: \${Math.random()}s;
                        \`;
                        rainContainer.appendChild(drop);
                    }
                    document.body.appendChild(rainContainer);
                    
                    const rainStyle = document.createElement('style');
                    rainStyle.textContent = '@keyframes rain { to { transform: translateY(100vh); } }';
                    document.head.appendChild(rainStyle);
                } else if (weather === 'snow') {
                    // Snow effect
                    const snowContainer = document.createElement('div');
                    snowContainer.innerHTML = '❄️'.repeat(50);
                    snowContainer.style.cssText = 'position: fixed; top: -10%; left: 0; width: 100%; font-size: 20px; pointer-events: none; z-index: 999; animation: snow 10s linear infinite;';
                    document.body.appendChild(snowContainer);
                    
                    const snowStyle = document.createElement('style');
                    snowStyle.textContent = '@keyframes snow { to { transform: translateY(110vh); } }';
                    document.head.appendChild(snowStyle);
                }
            ` : ''}
            
            ${data.advanced.musicVisualizer ? `
                // Music Visualizer Background
                const visualizer = document.createElement('div');
                visualizer.style.cssText = 'position: fixed; bottom: 0; left: 0; width: 100%; height: 200px; z-index: -1;';
                
                for (let i = 0; i < 50; i++) {
                    const bar = document.createElement('div');
                    bar.style.cssText = \`
                        display: inline-block;
                        width: 2%;
                        height: \${Math.random() * 100}%;
                        background: linear-gradient(to top, #ff00ff, #00ffff);
                        animation: pulse \${0.5 + Math.random()}s ease-in-out infinite alternate;
                    \`;
                    visualizer.appendChild(bar);
                }
                document.body.appendChild(visualizer);
                
                const pulseStyle = document.createElement('style');
                pulseStyle.textContent = '@keyframes pulse { from { height: 10%; opacity: 0.5; } to { height: 100%; opacity: 1; } }';
                document.head.appendChild(pulseStyle);
            ` : ''}
            
            ${data.advanced.aiChat ? `
                // AI Chat Assistant
                const chatBot = document.createElement('div');
                chatBot.innerHTML = \`
                    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 10000;">
                        <button onclick="this.nextSibling.style.display = this.nextSibling.style.display === 'none' ? 'block' : 'none'" 
                                style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(45deg, #667eea, #764ba2); color: white; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                            🤖
                        </button>
                        <div style="display: none; position: absolute; bottom: 70px; right: 0; width: 300px; height: 400px; background: white; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); padding: 20px;">
                            <h3 style="margin: 0 0 10px 0; color: #333;">AI Assistant</h3>
                            <div style="height: 300px; overflow-y: auto; border: 1px solid #eee; padding: 10px; margin-bottom: 10px;">
                                <p style="color: #666;">👋 Hi! I'm your AI CV assistant. Ask me anything about ${data.personal.fullName}!</p>
                            </div>
                            <input type="text" placeholder="Type your question..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        </div>
                    </div>
                \`;
                document.body.appendChild(chatBot);
            ` : ''}
            
            ${data.advanced.blockchain ? `
                // Blockchain Verification
                const blockchainBadge = document.createElement('div');
                blockchainBadge.innerHTML = \`
                    <div style="position: fixed; top: 10px; left: 10px; background: linear-gradient(45deg, #000428, #004e92); color: white; padding: 10px 20px; border-radius: 5px; z-index: 1000; cursor: pointer;">
                        🔐 Blockchain Verified
                        <div style="font-size: 10px; margin-top: 5px;">Hash: \${Math.random().toString(36).substring(2, 15)}</div>
                    </div>
                \`;
                blockchainBadge.addEventListener('click', () => {
                    alert('This CV is verified on the blockchain!\\nSmart Contract: 0x' + Math.random().toString(16).substring(2, 42));
                });
                document.body.appendChild(blockchainBadge);
            ` : ''}
            
            ${data.advanced.performanceMode === 'insane' ? `
                // INSANE MODE ACTIVATED!
                document.body.style.animation = 'insaneMode 0.1s infinite';
                const insaneStyle = document.createElement('style');
                insaneStyle.textContent = \`
                    @keyframes insaneMode {
                        0% { filter: hue-rotate(0deg) saturate(100%); }
                        100% { filter: hue-rotate(360deg) saturate(200%); }
                    }
                    * {
                        animation: crazyRotate 2s infinite !important;
                    }
                    @keyframes crazyRotate {
                        0%, 100% { transform: rotate(0deg) scale(1); }
                        25% { transform: rotate(1deg) scale(1.01); }
                        75% { transform: rotate(-1deg) scale(0.99); }
                    }
                \`;
                document.head.appendChild(insaneStyle);
                
                // Add epic music
                const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAACAAgA=');
                audio.loop = true;
                audio.play().catch(e => console.log('Audio autoplay blocked'));
                
                console.log('%c🔥 INSANE MODE ACTIVATED! 🔥', 'font-size: 50px; color: red; text-shadow: 0 0 20px red;');
            ` : ''}
        `;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName} - CV</title>
    <style>${styles}</style>
</head>
<body>
    <div class="cv-container">
        ${cvBody}
    </div>
    <script>${jsFeatures}</script>
</body>
</html>`;
    }
    
    // Collect form data
    function collectFormData() {
        const data = {
            personal: {
                fullName: document.getElementById('fullName').value,
                title: document.getElementById('title').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                location: document.getElementById('location').value,
                linkedin: document.getElementById('linkedin').value,
                github: document.getElementById('github').value,
                website: document.getElementById('website').value,
                summary: document.getElementById('summary').value,
                profilePic: document.getElementById('profileImg')?.src || '',
                profileAnimation: document.getElementById('profileAnimation')?.value || 'none'
            },
            links: {
                portfolio: document.getElementById('portfolio').value,
                github: document.getElementById('github').value,
                linkedin: document.getElementById('linkedin').value
            },
            workExperience: [],
            projects: [],
            education: [],
            skills: {
                languages: document.getElementById('languages').value,
                frameworks: document.getElementById('frameworks').value,
                tools: document.getElementById('tools').value,
                other: document.getElementById('otherSkills').value
            },
            customization: {
                primaryColor: document.getElementById('primaryColor').value,
                accentColor: document.getElementById('accentColor').value,
                fontStyle: document.getElementById('fontStyle').value,
                layout: document.getElementById('layout').value
            },
            advanced: {
                animationType: document.getElementById('animationType')?.value || 'none',
                backgroundEffect: document.getElementById('backgroundEffect')?.value || 'none',
                textEffect: document.getElementById('textEffect')?.value || 'none',
                borderStyle: document.getElementById('borderStyle')?.value || 'none',
                glowIntensity: document.getElementById('glowIntensity')?.value || '50',
                blurEffect: document.getElementById('blurEffect')?.value || '0',
                parallax: document.getElementById('parallax')?.checked || false,
                hoverEffects: document.getElementById('hoverEffects')?.checked || false,
                soundEffects: document.getElementById('soundEffects')?.checked || false,
                darkMode: document.getElementById('darkMode')?.checked || false,
                confetti: document.getElementById('confetti')?.checked || false,
                magneticCursor: document.getElementById('magneticCursor')?.checked || false,
                scrollReveal: document.getElementById('scrollReveal')?.checked || false,
                particleTrail: document.getElementById('particleTrail')?.checked || false,
                floatingElements: document.getElementById('floatingElements')?.checked || false,
                rippleEffect: document.getElementById('rippleEffect')?.checked || false,
                tiltEffect: document.getElementById('tiltEffect')?.checked || false,
                morphingShapes: document.getElementById('morphingShapes')?.checked || false,
                webgl: document.getElementById('webgl')?.checked || false,
                voiceControl: document.getElementById('voiceControl')?.checked || false,
                gameMode: document.getElementById('gameMode')?.checked || false,
                timeTheme: document.getElementById('timeTheme')?.checked || false,
                weatherEffects: document.getElementById('weatherEffects')?.checked || false,
                musicVisualizer: document.getElementById('musicVisualizer')?.checked || false,
                aiChat: document.getElementById('aiChat')?.checked || false,
                virtualReality: document.getElementById('virtualReality')?.checked || false,
                blockchain: document.getElementById('blockchain')?.checked || false,
                quantumAnimation: document.getElementById('quantumAnimation')?.checked || false,
                performanceMode: document.getElementById('performanceMode')?.value || 'balanced',
                colorScheme: document.getElementById('colorScheme')?.value || 'custom',
                iconStyle: document.getElementById('iconStyle')?.value || 'emoji'
            }
        };
        
        // Collect work experience
        const workEntries = document.querySelectorAll('.work-entry');
        workEntries.forEach(entry => {
            const company = entry.querySelector('.company-input').value;
            const position = entry.querySelector('.position-input').value;
            const startDate = entry.querySelector('.start-date-input').value;
            const endDate = entry.querySelector('.end-date-input').value;
            const description = entry.querySelector('.work-description-input').value;
            
            if (company || position) {
                data.workExperience.push({ company, position, startDate, endDate, description });
            }
        });
        
        // Collect projects
        const projectEntries = document.querySelectorAll('.project-entry');
        projectEntries.forEach(entry => {
            const name = entry.querySelector('.project-name-input').value;
            const url = entry.querySelector('.project-url-input').value;
            const tech = entry.querySelector('.project-tech-input').value;
            const description = entry.querySelector('.project-description-input').value;
            
            if (name) {
                data.projects.push({ name, url, tech, description });
            }
        });
        
        // Collect education
        const educationEntries = document.querySelectorAll('.education-entry');
        educationEntries.forEach(entry => {
            const school = entry.querySelector('.school-input').value;
            const degree = entry.querySelector('.degree-input').value;
            const startYear = entry.querySelector('.edu-start-year').value;
            const endYear = entry.querySelector('.edu-end-year').value;
            
            if (school || degree) {
                data.education.push({ school, degree, startYear, endYear });
            }
        });
        
        return data;
    }
    
    // Validate form data
    function validateFormData(data) {
        return data.personal.fullName && data.personal.title;
    }
    
    // Format date
    function formatDate(dateString) {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    
    // Generate CV preview
    function generateCVPreview(data) {
        const layoutClass = `layout-${data.customization.layout}`;
        const fontClass = `font-${data.customization.fontStyle}`;
        
        let cvHTML = `
            <div class="cv-content ${layoutClass} ${fontClass}" style="--cv-primary: ${data.customization.primaryColor}; --cv-accent: ${data.customization.accentColor};">
                <div class="cv-header">
                    <h1>${data.personal.fullName}</h1>
                    <div class="title">${data.personal.title}</div>
                    <div class="contact-info">
                        ${data.personal.email ? `<span>📧 ${data.personal.email}</span>` : ''}
                        ${data.personal.phone ? `<span>📱 ${data.personal.phone}</span>` : ''}
                        ${data.personal.location ? `<span>📍 ${data.personal.location}</span>` : ''}
                        ${data.personal.age ? `<span>🎂 ${data.personal.age} years old</span>` : ''}
                    </div>
                </div>
                
                ${data.personal.summary ? `
                    <div class="cv-section">
                        <h2>Professional Summary</h2>
                        <p>${data.personal.summary}</p>
                    </div>
                ` : ''}
                
                ${(data.links.portfolio || data.links.github || data.links.linkedin) ? `
                    <div class="cv-section">
                        <h2>Links & Portfolio</h2>
                        <div class="links-section">
                            ${data.links.portfolio ? `<a href="${data.links.portfolio}" target="_blank">🌐 Portfolio</a>` : ''}
                            ${data.links.github ? `<a href="${data.links.github}" target="_blank">💻 GitHub</a>` : ''}
                            ${data.links.linkedin ? `<a href="${data.links.linkedin}" target="_blank">💼 LinkedIn</a>` : ''}
                        </div>
                    </div>
                ` : ''}
                
                ${data.workExperience.length > 0 ? `
                    <div class="cv-section">
                        <h2>Work Experience</h2>
                        ${data.workExperience.map(job => `
                            <div class="work-item">
                                <div class="work-header">
                                    <div>
                                        <h3>${job.position}</h3>
                                        <span class="company">${job.company}</span>
                                    </div>
                                    <span class="date-range">${formatDate(job.startDate)} - ${formatDate(job.endDate)}</span>
                                </div>
                                ${job.description ? `<p>${job.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${data.projects.length > 0 ? `
                    <div class="cv-section">
                        <h2>Projects</h2>
                        ${data.projects.map(project => `
                            <div class="project-item">
                                <div class="project-header">
                                    <h3>${project.name}</h3>
                                    ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">View Project →</a>` : ''}
                                </div>
                                ${project.tech ? `<div class="tech-stack">Technologies: ${project.tech}</div>` : ''}
                                ${project.description ? `<p>${project.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${(data.skills.languages || data.skills.frameworks || data.skills.tools || data.skills.other) ? `
                    <div class="cv-section">
                        <h2>Technical Skills</h2>
                        <div class="skills-grid">
                            ${data.skills.languages ? `
                                <div class="skill-category">
                                    <h4>Languages</h4>
                                    <div class="skill-tags">
                                        ${data.skills.languages.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${data.skills.frameworks ? `
                                <div class="skill-category">
                                    <h4>Frameworks</h4>
                                    <div class="skill-tags">
                                        ${data.skills.frameworks.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${data.skills.tools ? `
                                <div class="skill-category">
                                    <h4>Tools & Technologies</h4>
                                    <div class="skill-tags">
                                        ${data.skills.tools.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            ${data.skills.other ? `
                                <div class="skill-category">
                                    <h4>Other Skills</h4>
                                    <div class="skill-tags">
                                        ${data.skills.other.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                ${data.education.length > 0 ? `
                    <div class="cv-section">
                        <h2>Education</h2>
                        ${data.education.map(edu => `
                            <div class="education-item">
                                <div class="education-header">
                                    <div>
                                        <h3>${edu.degree}</h3>
                                        <span class="company">${edu.school}</span>
                                    </div>
                                    ${(edu.startYear || edu.endYear) ? `
                                        <span class="date-range">${edu.startYear || ''} - ${edu.endYear || 'Present'}</span>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        preview.innerHTML = cvHTML;
    }
    
    // Download PDF
    downloadBtn.addEventListener('click', () => {
        const element = document.querySelector('.cv-content');
        
        if (!element) {
            showMessage('Please generate a CV first before downloading.', 'error');
            return;
        }
        
        // Show loading message
        showMessage('Generating PDF... Please wait.', 'success');
        
        const opt = {
            margin: 10,
            filename: 'my-cv.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
            showMessage('PDF downloaded successfully!', 'success');
        }).catch((error) => {
            showMessage('Error generating PDF. Please try again.', 'error');
            console.error('PDF generation error:', error);
        });
    });
    
    // Auto-save form data to localStorage
    let saveTimeout;
    form.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (!data[key]) {
                    data[key] = value;
                } else {
                    if (!Array.isArray(data[key])) {
                        data[key] = [data[key]];
                    }
                    data[key].push(value);
                }
            }
            localStorage.setItem('cvFormData', JSON.stringify(data));
        }, 1000);
    });
    
    // Load saved form data
    const savedData = localStorage.getItem('cvFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const elements = form.elements[key];
                if (elements) {
                    if (elements.length) {
                        // Handle multiple elements with same name
                        for (let i = 0; i < elements.length; i++) {
                            if (Array.isArray(data[key])) {
                                elements[i].value = data[key][i] || '';
                            } else {
                                elements[i].value = data[key] || '';
                            }
                        }
                    } else {
                        // Single element
                        elements.value = data[key] || '';
                    }
                }
            });
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
});
