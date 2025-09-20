// 🧭 Navigation Module - Professional Navigation System
// Handles all navigation-related functionality for the AGMP platform

const NavigationModule = {
    // 🎯 Initialize navigation system
    init() {
        this.setupSmoothScrolling();
        this.setupLanguageDropdown();
        this.setupActiveNavigation();
        this.setupMobileNavigation();
    },

    // 🌊 Smooth scrolling for anchor links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    // 🌍 Language dropdown functionality
    setupLanguageDropdown() {
        const dropdownToggle = document.getElementById('languageDropdown');
        const dropdownMenu = dropdownToggle?.nextElementSibling;

        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', function (e) {
                e.preventDefault();
                dropdownMenu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function (e) {
                if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });

            // Handle language selection
            dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const selectedLang = this.textContent;
                    dropdownToggle.textContent = selectedLang;
                    dropdownMenu.classList.remove('show');
                    
                    // Here you could add actual language switching logic
                    console.log(`Language switched to: ${selectedLang}`);
                });
            });
        }
    },

    // 🎯 Active navigation highlighting
    setupActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    // 📱 Mobile navigation enhancements
    setupMobileNavigation() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            // Close mobile menu when clicking on a link
            navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        navbarCollapse.classList.remove('show');
                    }
                });
            });

            // Add animation to mobile menu toggle
            navbarToggler.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        }
    },

    // 🔄 Update navigation state
    updateActiveState(pageName) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === pageName) {
                link.classList.add('active');
            }
        });
    }
};

// Export for use in other modules
window.NavigationModule = NavigationModule;
