// ULTIMATE PORTFOLIO EFFECTS AND LIVE PREVIEW

// Initialize portfolio effects when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioEffects();
    initScrollAnimations();
    initParallaxEffect();
    initMouseEffects();
    initFloatingNav();
    initTimelineAnimations();
    initLoadingScreen();
    initSmoothScroll();
    init3DCards();
    initBackgroundShapes();
});

// Loading Screen
function initLoadingScreen() {
    const loader = document.createElement('div');
    loader.className = 'portfolio-loader';
    loader.innerHTML = '<div class="loader-text">Loading Portfolio...</div>';
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.animation = 'fadeOutLoader 0.5s ease-out forwards';
        setTimeout(() => loader.remove(), 500);
    }, 2000);
}

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Add scroll reveal classes to elements
    document.querySelectorAll('.cv-section').forEach((section, index) => {
        if (index % 3 === 0) {
            section.classList.add('scroll-reveal');
        } else if (index % 3 === 1) {
            section.classList.add('scroll-reveal-left');
        } else {
            section.classList.add('scroll-reveal-right');
        }
        observer.observe(section);
    });
    
    document.querySelectorAll('.work-item, .project-item, .education-item').forEach(item => {
        item.classList.add('scroll-reveal-scale');
        observer.observe(item);
    });
}

// Parallax Scrolling Effect
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Parallax for header
        const header = document.querySelector('.cv-header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
            header.style.opacity = 1 - scrolled / 500;
        }
    });
}

// Mouse Effects
function initMouseEffects() {
    // Custom Cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 20 + 'px';
        cursor.style.top = e.clientY - 20 + 'px';
    });
    
    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-card, .skill-tag');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    // Mouse Trail Effect
    let mouseTrailEnabled = false;
    document.addEventListener('mousemove', (e) => {
        if (!mouseTrailEnabled) return;
        
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.left = e.clientX - 10 + 'px';
        trail.style.top = e.clientY - 10 + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 1000);
    });
    
    // Toggle mouse trail with key press
    document.addEventListener('keypress', (e) => {
        if (e.key === 't') {
            mouseTrailEnabled = !mouseTrailEnabled;
        }
    });
}

// Floating Navigation Dots
function initFloatingNav() {
    const nav = document.createElement('div');
    nav.className = 'floating-nav';
    
    const sections = document.querySelectorAll('.cv-section');
    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        dot.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        nav.appendChild(dot);
    });
    
    document.body.appendChild(nav);
    
    // Update active dot on scroll
    const updateActiveDot = () => {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        sections.forEach((section, index) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const dots = document.querySelectorAll('.nav-dot');
            
            if (scrollPos >= top && scrollPos <= top + height) {
                dots.forEach(d => d.classList.remove('active'));
                dots[index]?.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveDot);
    updateActiveDot();
}

// Timeline Animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.work-item, .education-item');
    
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        
        // Add timeline dot
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            left: 50%;
            top: 0;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            transform: translateX(-50%);
            z-index: 2;
        `;
        item.style.position = 'relative';
        item.appendChild(dot);
    });
}

// Smooth Scroll with Progress Bar
function initSmoothScroll() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 10000;
        transition: width 0.2s;
    `;
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// 3D Card Tilt Effect
function init3DCards() {
    const cards = document.querySelectorAll('.portfolio-card, .work-item, .project-item');
    
    cards.forEach(card => {
        card.classList.add('tilt-card');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Animated Background Shapes
function initBackgroundShapes() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
    
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'bg-shape';
        shape.style.cssText = `
            width: ${200 + Math.random() * 300}px;
            height: ${200 + Math.random() * 300}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${i * 2}s;
            z-index: -1;
        `;
        document.body.appendChild(shape);
    }
}

// Particle Background
function initParticleBackground() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
    
    const header = document.querySelector('.cv-header');
    if (header) {
        header.style.position = 'relative';
        header.appendChild(container);
    }
}

// Initialize Portfolio Effects
function initPortfolioEffects() {
    initParticleBackground();
    
    // Add typing effect to title
    const title = document.querySelector('.title');
    if (title) {
        title.classList.add('typing-text');
    }
    
    // Add gradient animation to headings
    document.querySelectorAll('h1, h2').forEach(heading => {
        heading.classList.add('gradient-text-animated');
    });
    
    // Skill bars animation
    const skills = document.querySelectorAll('.skill-tag');
    skills.forEach((skill, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'skill-bar';
        const progress = document.createElement('div');
        progress.className = 'skill-progress';
        progress.style.width = (70 + Math.random() * 30) + '%';
        progress.style.animationDelay = index * 0.1 + 's';
        wrapper.appendChild(progress);
        skill.parentNode.insertBefore(wrapper, skill.nextSibling);
    });
    
    // Page transition effect
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    setTimeout(() => transition.remove(), 1000);
    
    // Add smooth reveal to all sections
    document.querySelectorAll('.cv-section').forEach((section, index) => {
        section.style.animationDelay = `${index * 0.2}s`;
    });
}

// Live Preview Enhancement
function enhanceLivePreview() {
    const preview = document.querySelector('.cv-preview');
    if (!preview) return;
    
    // Add glass morphism effect
    preview.style.cssText += `
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.18);
    `;
    
    // Animate preview updates
    const observer = new MutationObserver(() => {
        preview.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            preview.style.animation = '';
        }, 300);
    });
    
    observer.observe(preview, { childList: true, subtree: true });
}

// Initialize enhanced preview
enhanceLivePreview();

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'p' to toggle preview
    if (e.key === 'p' && e.ctrlKey) {
        e.preventDefault();
        const preview = document.querySelector('.preview-section');
        if (preview) {
            preview.style.display = preview.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    // Press 'f' for fullscreen preview
    if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        const preview = document.querySelector('.cv-preview');
        if (preview) {
            if (!document.fullscreenElement) {
                preview.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }
    
    // Press 'r' to refresh preview
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        if (typeof generateCVPreview === 'function') {
            generateCVPreview();
        }
    }
});

// Export function for external use
window.initPortfolioEffects = initPortfolioEffects;
window.enhanceLivePreview = enhanceLivePreview;
