// 🚀 AGMP Application Controller - Professional Demo Platform
// Main application controller that orchestrates all modules

class AGMPApplication {
    constructor() {
        this.modules = {};
        this.initialized = false;
        this.currentPage = this.getCurrentPage();
    }

    // 🎯 Initialize the entire application
    async init() {
        if (this.initialized) return;

        try {
            console.log('🌍 Initializing AGMP Platform...');
            
            // Initialize core modules
            await this.initializeModules();
            
            // Setup page-specific functionality
            this.initializePageSpecific();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            this.initialized = true;
            console.log('✅ AGMP Platform initialized successfully');
            
            // Trigger initialization complete event
            this.dispatchEvent('agmp:initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize AGMP Platform:', error);
            this.handleInitializationError(error);
        }
    }

    // 🔧 Initialize all modules
    async initializeModules() {
        const moduleInitPromises = [];

        // Initialize Navigation Module
        if (window.NavigationModule) {
            moduleInitPromises.push(
                Promise.resolve().then(() => {
                    try {
                        NavigationModule.init();
                        this.modules.navigation = NavigationModule;
                        console.log('✅ Navigation Module initialized');
                    } catch (error) {
                        console.warn('⚠️ Navigation Module failed to initialize:', error);
                    }
                })
            );
        }

        // Initialize Animation Module
        if (window.AnimationModule) {
            moduleInitPromises.push(
                Promise.resolve().then(() => {
                    try {
                        AnimationModule.init();
                        this.modules.animations = AnimationModule;
                        console.log('✅ Animation Module initialized');
                    } catch (error) {
                        console.warn('⚠️ Animation Module failed to initialize:', error);
                    }
                })
            );
        }

        // Initialize Data Manager
        if (window.DataManager) {
            moduleInitPromises.push(
                Promise.resolve().then(async () => {
                    try {
                        await DataManager.init();
                        this.modules.dataManager = DataManager;
                        console.log('✅ Data Manager initialized');
                    } catch (error) {
                        console.warn('⚠️ Data Manager failed to initialize:', error);
                    }
                })
            );
        }

        // Initialize Map Manager (only on pages with maps, but not geodata-inventory)
        if (document.getElementById('map') && window.MapManager && !document.getElementById('categorySelect')) {
            moduleInitPromises.push(
                Promise.resolve().then(() => {
                    try {
                        MapManager.init();
                        this.modules.mapManager = MapManager;
                        console.log('✅ Map Manager initialized');
                    } catch (error) {
                        console.warn('⚠️ Map Manager failed to initialize:', error);
                    }
                })
            );
        }

        // Wait for all modules to initialize
        await Promise.allSettled(moduleInitPromises);
    }

    // 📄 Initialize page-specific functionality
    initializePageSpecific() {
        switch (this.currentPage) {
            case 'index.html':
            case '':
                this.initializeHomePage();
                break;
            case 'geodata-inventory.html':
                this.initializeInventoryPage();
                break;
            case 'african-projects.html':
                this.initializeProjectsPage();
                break;
            case 'geodata-platforms.html':
                this.initializePlatformsPage();
                break;
            case 'about.html':
                this.initializeAboutPage();
                break;
            case 'contact.html':
                this.initializeContactPage();
                break;
        }
    }

    // 🏠 Initialize home page
    initializeHomePage() {
        console.log('🏠 Initializing Home Page');
        
        // Setup hero section interactions
        this.setupHeroInteractions();
        
        // Initialize map if present
        if (this.modules.mapManager) {
            this.modules.mapManager.init();
        }
    }

    // 📊 Initialize inventory page
    initializeInventoryPage() {
        console.log('📊 Initializing Inventory Page');
        
        if (this.modules.dataManager) {
            this.loadInventoryData();
        }
    }

    // 🏗️ Initialize projects page
    initializeProjectsPage() {
        console.log('🏗️ Initializing Projects Page');
        
        if (this.modules.dataManager) {
            this.loadProjectsData();
        }
    }

    // 🛠️ Initialize platforms page
    initializePlatformsPage() {
        console.log('🛠️ Initializing Platforms Page');
        
        if (this.modules.dataManager) {
            this.loadPlatformsData();
        }
    }

    // ℹ️ Initialize about page
    initializeAboutPage() {
        console.log('ℹ️ Initializing About Page');
        
        // Setup about page specific animations
        this.setupAboutAnimations();
    }

    // 📧 Initialize contact page
    initializeContactPage() {
        console.log('📧 Initializing Contact Page');
        
        // Setup contact form
        this.setupContactForm();
    }

    // 🎭 Setup hero section interactions
    setupHeroInteractions() {
        const heroStats = document.querySelectorAll('.stat-item');
        
        if (heroStats.length > 0) {
            heroStats.forEach((stat, index) => {
                stat.style.animationDelay = `${index * 0.2}s`;
                
                stat.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1) translateY(-5px)';
                });
                
                stat.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1) translateY(0)';
                });
            });
        }
    }

    // 📊 Load inventory data
    async loadInventoryData() {
        try {
            const datasets = await this.modules.dataManager.loadDatasets();
            this.displayInventoryData(datasets);
        } catch (error) {
            console.error('Failed to load inventory data:', error);
        }
    }

    // 🏗️ Load projects data
    async loadProjectsData() {
        try {
            const projects = await this.modules.dataManager.loadProjects();
            this.displayProjectsData(projects);
        } catch (error) {
            console.error('Failed to load projects data:', error);
        }
    }

    // 🛠️ Load platforms data
    async loadPlatformsData() {
        try {
            const platforms = await this.modules.dataManager.loadPlatforms();
            this.displayPlatformsData(platforms);
        } catch (error) {
            console.error('Failed to load platforms data:', error);
        }
    }

    // 📊 Display inventory data
    displayInventoryData(datasets) {
        const container = document.getElementById('datasets-container');
        if (!container || !datasets.length) return;

        container.innerHTML = datasets.map(dataset => `
            <div class="modern-card dataset-card" data-country="${dataset.Country}">
                <h4 class="gradient-text">${dataset.displayName}</h4>
                <div class="dataset-info">
                    <span class="badge bg-primary">Maps Available</span>
                    <span class="badge bg-secondary">Geophysics Data</span>
                </div>
            </div>
        `).join('');
    }

    // 🏗️ Display projects data
    displayProjectsData(projects) {
        const container = document.getElementById('projects-container');
        if (!container || !projects.length) return;

        container.innerHTML = projects.map(project => `
            <div class="modern-card project-card">
                <h4 class="gradient-text">${project.displayName}</h4>
                <p class="project-status">Status: ${project.status}</p>
                <p class="project-category">Category: ${project.category}</p>
            </div>
        `).join('');
    }

    // 🛠️ Display platforms data
    displayPlatformsData(platforms) {
        const container = document.getElementById('platforms-container');
        if (!container || !platforms.length) return;

        container.innerHTML = platforms.map(platform => `
            <div class="modern-card platform-card">
                <h4 class="gradient-text">${platform.displayName}</h4>
                <p>Professional geospatial analysis platform</p>
            </div>
        `).join('');
    }

    // 🎨 Setup about page animations
    setupAboutAnimations() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }

    // 📧 Setup contact form
    setupContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmission(form);
        });
    }

    // 📨 Handle contact form submission
    handleContactSubmission(form) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'var(--secondary-color)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 1500);
    }

    // 🌐 Setup global event listeners
    setupGlobalEvents() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Page hidden - pausing animations');
            } else {
                console.log('Page visible - resuming animations');
            }
        });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 16); // ~60fps
        });
    }

    // 📏 Handle window resize
    handleResize() {
        if (this.modules.mapManager && this.modules.mapManager.map) {
            this.modules.mapManager.map.invalidateSize();
        }
    }

    // 📜 Handle scroll events
    handleScroll() {
        // Update navigation active state based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                const sectionId = section.getAttribute('id');
                this.updateActiveNavigation(sectionId);
            }
        });
    }

    // 🎯 Update active navigation
    updateActiveNavigation(sectionId) {
        if (this.modules.navigation) {
            this.modules.navigation.updateActiveState(`#${sectionId}`);
        }
    }

    // 📄 Get current page name
    getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    // 🎪 Dispatch custom events
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // ❌ Handle initialization errors
    handleInitializationError(error) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'initialization-error';
        errorContainer.innerHTML = `
            <div class="error-content">
                <h3>⚠️ Platform Initialization Error</h3>
                <p>Some features may not work correctly. Please refresh the page.</p>
                <button onclick="location.reload()" class="btn btn-primary">
                    Refresh Page
                </button>
            </div>
        `;
        
        errorContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            text-align: center;
        `;
        
        document.body.appendChild(errorContainer);
    }

    // 🔧 Get module instance
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    // 📊 Get application status
    getStatus() {
        return {
            initialized: this.initialized,
            currentPage: this.currentPage,
            modules: Object.keys(this.modules),
            timestamp: new Date().toISOString()
        };
    }
}

// Create global application instance
window.AGMP = new AGMPApplication();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AGMP.init());
} else {
    window.AGMP.init();
}

// Add fade-in-up animation CSS
const appStyles = document.createElement('style');
appStyles.textContent = `
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .initialization-error .error-content {
        background: var(--dark-color);
        padding: 2rem;
        border-radius: 16px;
        max-width: 400px;
    }
`;
document.head.appendChild(appStyles);

console.log('🚀 AGMP Application Controller loaded');
