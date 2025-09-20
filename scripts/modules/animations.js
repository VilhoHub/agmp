// ✨ Animation Module - Professional Animation System
// Handles all visual animations and interactions for the AGMP platform

const AnimationModule = {
    // 🎯 Initialize all animations
    init() {
        this.setupScrollAnimations();
        this.setupButtonInteractions();
        this.setupParallaxEffects();
        this.setupFloatingShapes();
        this.setupMobileInteractions();
    },

    // 🌊 Scroll-triggered animations using Intersection Observer
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Trigger counter animation when hero stats come into view
                    if (entry.target.classList.contains('hero-stats')) {
                        setTimeout(() => this.animateCounters(), 500);
                    }
                }
            });
        }, observerOptions);

        // Add scroll animations to elements
        const animatedElements = document.querySelectorAll('.modern-card, .hero-stats, section');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    },

    // 🎯 Animated counters for statistics
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = counter.textContent.includes('+') ? target + '+' : target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 20);
        });
    },

    // 🚀 Enhanced button interactions with ripple effects
    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.btn-primary');
        
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            btn.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    },

    // 🎪 Parallax effects for depth
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('header');
            
            if (header) {
                header.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    },

    // 🎨 Dynamic floating background shapes
    setupFloatingShapes() {
        const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)'];
        
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.cssText = `
                position: fixed;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                opacity: 0.1;
                border-radius: ${Math.random() > 0.5 ? '50%' : '10px'};
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                animation: floatAround ${Math.random() * 10 + 10}s infinite linear;
                pointer-events: none;
                z-index: -1;
            `;
            document.body.appendChild(shape);
        }
    },

    // 📱 Mobile-friendly touch interactions
    setupMobileInteractions() {
        if ('ontouchstart' in window) {
            document.querySelectorAll('.modern-card').forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                });
                
                card.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                });
            });
        }
    }
};

// Add required CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes floatAround {
        0% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(100px, -100px) rotate(90deg); }
        50% { transform: translate(-50px, -200px) rotate(180deg); }
        75% { transform: translate(-150px, -50px) rotate(270deg); }
        100% { transform: translate(0, 0) rotate(360deg); }
    }
    
    @keyframes ripple {
        to { transform: scale(2); opacity: 0; }
    }
`;
document.head.appendChild(animationStyles);

// Export for use in other modules
window.AnimationModule = AnimationModule;
