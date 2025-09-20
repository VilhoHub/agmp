// 🛡️ Fallback Script - Error Prevention and Basic Functionality
// This script provides basic functionality if the modular system fails to load

(function() {
    'use strict';
    
    console.log('🛡️ Fallback script loaded');
    
    // Prevent errors from missing functions
    window.addEventListener('error', function(e) {
        console.warn('Caught error:', e.message);
        // Don't let errors break the page
        e.preventDefault();
    });
    
    // Basic smooth scrolling
    document.addEventListener('DOMContentLoaded', function() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Basic button hover effects
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Basic language dropdown
        const languageDropdown = document.getElementById('languageDropdown');
        if (languageDropdown) {
            const dropdownMenu = languageDropdown.nextElementSibling;
            if (dropdownMenu) {
                languageDropdown.addEventListener('click', function(e) {
                    e.preventDefault();
                    dropdownMenu.classList.toggle('show');
                });
                
                document.addEventListener('click', function(e) {
                    if (!languageDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
                        dropdownMenu.classList.remove('show');
                    }
                });
            }
        }
        
        // Basic counter animation for stats (avoid conflicts with other systems)
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length > 0 && !window.AGMP && !window.geodataInventory) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.textContent.replace(/\D/g, ''));
                        if (target && target > 0) {
                            let current = 0;
                            const increment = target / 50;
                            
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    counter.textContent = counter.textContent.includes('+') ? target + '+' : target;
                                    clearInterval(timer);
                                } else {
                                    counter.textContent = Math.floor(current);
                                }
                            }, 30);
                        }
                        
                        observer.unobserve(counter);
                    }
                });
            });
            
            statNumbers.forEach(counter => observer.observe(counter));
        }
        
        console.log('✅ Fallback functionality initialized');
    });
    
})();
