// 🌍 African Projects - Professional Interactive System
// Handles all functionality for the African geoscience projects page

class AfricanProjects {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilters = {
            search: '',
            category: 'all',
            status: 'all',
            country: 'all'
        };
    }

    // 🎯 Initialize the projects system
    async init() {
        try {
            console.log('🌍 Initializing African Projects...');
            
            // Check if we're on the right page
            if (!document.getElementById('project-grid')) {
                console.log('Not on African projects page, skipping initialization');
                return;
            }
            
            await this.loadProjects();
            this.setupFilters();
            this.setupEventListeners();
            this.renderProjects();
            
            console.log('✅ African Projects initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize African Projects:', error);
            this.showErrorMessage('Failed to load projects. Please refresh the page.');
        }
    }

    // 📊 Load projects data
    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawProjects = await response.json();
            
            // Transform the data to match our expected format
            this.projects = rawProjects.map(project => ({
                title: project["Initiative/Item Name"] || "Untitled Project",
                description: project["Abstract"] || "No description available",
                category: this.mapThematicAreaToCategory(project["Thematic Area (Geoscientific)"] || ""),
                status: this.mapStatusToStandard(project["Status"] || ""),
                country: this.extractCountryFromOrganization(project["Lead Organization(s)"] || ""),
                startDate: project["Start Date"] || "Unknown",
                endDate: project["End Date"] || "Unknown",
                budget: "Not specified",
                organization: project["Lead Organization(s)"] || "Unknown Organization",
                participants: [],
                website: project["Website/Link"] || "",
                initiativeType: project["Initiative type"] || "Project"
            }));
            
            this.filteredProjects = [...this.projects];
            console.log(`📊 Loaded ${this.projects.length} projects`);
        } catch (error) {
            console.warn('Failed to load projects data, using fallback:', error);
            // Fallback data for demo purposes
            this.projects = [
                {
                    title: "West African Geological Survey",
                    description: "Comprehensive geological mapping across West African countries to identify mineral resources and geological hazards.",
                    category: "geological",
                    status: "ongoing",
                    country: "Multi-country",
                    startDate: "2023-01-15",
                    endDate: "2025-12-31",
                    budget: "$2.5M",
                    organization: "African Union Commission",
                    participants: ["Ghana", "Nigeria", "Senegal", "Mali"]
                },
                {
                    title: "East African Rift System Study",
                    description: "Advanced seismic monitoring and analysis of the East African Rift System for earthquake prediction and volcanic activity assessment.",
                    category: "seismic",
                    status: "ongoing",
                    country: "Kenya",
                    startDate: "2022-06-01",
                    endDate: "2024-05-31",
                    budget: "$1.8M",
                    organization: "University of Nairobi",
                    participants: ["Kenya", "Ethiopia", "Tanzania"]
                },
                {
                    title: "Sahara Groundwater Assessment",
                    description: "Large-scale hydrogeological study to map and assess groundwater resources across the Sahara region.",
                    category: "hydrology",
                    status: "completed",
                    country: "Algeria",
                    startDate: "2020-03-01",
                    endDate: "2023-02-28",
                    budget: "$3.2M",
                    organization: "UNESCO",
                    participants: ["Algeria", "Libya", "Egypt", "Sudan"]
                },
                {
                    title: "Southern Africa Mining Impact Study",
                    description: "Environmental and geological impact assessment of mining activities across Southern African countries.",
                    category: "geological",
                    status: "upcoming",
                    country: "South Africa",
                    startDate: "2024-04-01",
                    endDate: "2026-03-31",
                    budget: "$4.1M",
                    organization: "SADC Mining Sector",
                    participants: ["South Africa", "Botswana", "Namibia", "Zimbabwe"]
                }
            ];
            this.filteredProjects = [...this.projects];
        }
    }

    // 🔄 Data transformation helpers
    mapThematicAreaToCategory(thematicArea) {
        if (!thematicArea || typeof thematicArea !== 'string') return 'general';
        
        const area = thematicArea.toLowerCase();
        if (area.includes('geophysics') || area.includes('geological') || area.includes('geology')) return 'geological';
        if (area.includes('groundwater') || area.includes('hydro')) return 'hydrology';
        if (area.includes('seismic') || area.includes('earthquake')) return 'seismic';
        if (area.includes('mineral') || area.includes('mining') || area.includes('copper') || area.includes('gold') || area.includes('iron')) return 'mining';
        if (area.includes('climate') || area.includes('environmental')) return 'environmental';
        if (area.includes('geothermal') || area.includes('energy')) return 'energy';
        if (area.includes('research') || area.includes('information')) return 'research';
        return 'general';
    }

    mapStatusToStandard(status) {
        if (!status || typeof status !== 'string') return 'unknown';
        
        const statusLower = status.toLowerCase();
        if (statusLower.includes('active') || statusLower.includes('ongoing')) return 'ongoing';
        if (statusLower.includes('inactive') || statusLower.includes('completed')) return 'completed';
        if (statusLower.includes('planned') || statusLower.includes('upcoming')) return 'upcoming';
        return 'ongoing'; // Default to ongoing for active projects
    }

    extractCountryFromOrganization(organization) {
        if (!organization || typeof organization !== 'string') return 'Multi-country';
        
        // Simple country extraction - could be enhanced
        const countries = [
            'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Tanzania', 'Uganda', 'Zambia', 
            'Zimbabwe', 'Botswana', 'Namibia', 'Morocco', 'Algeria', 'Egypt', 'Ethiopia',
            'Gabon', 'Mali', 'Senegal', 'Chad', 'Niger', 'Burkina Faso', 'Ivory Coast',
            'Cameroon', 'Angola', 'Mozambique', 'Madagascar', 'Tunisia', 'Libya', 'Sudan'
        ];
        
        for (const country of countries) {
            if (organization.includes(country)) {
                return country;
            }
        }
        
        // Check for continental organizations
        if (organization.includes('African') || organization.includes('Africa')) {
            return 'Multi-country';
        }
        
        return 'International';
    }

    // 🎛️ Setup filter controls
    setupFilters() {
        // Populate country filter
        const countryFilter = document.getElementById('country-filter');
        if (countryFilter) {
            const countries = [...new Set(this.projects.map(p => p.country))]
                .filter(country => country && typeof country === 'string')
                .sort();
            
            countries.forEach(country => {
                if (country && typeof country === 'string') {
                    const option = document.createElement('option');
                    option.value = country.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = country;
                    countryFilter.appendChild(option);
                }
            });
        }

        // Update stats
        this.updateStats();
    }

    // 📊 Update project statistics
    updateStats() {
        const totalProjects = this.projects.length;
        const ongoingProjects = this.projects.filter(p => p.status === 'ongoing').length;
        const completedProjects = this.projects.filter(p => p.status === 'completed').length;
        const upcomingProjects = this.projects.filter(p => p.status === 'upcoming').length;

        // Update stat displays
        const totalEl = document.getElementById('totalProjects');
        const ongoingEl = document.getElementById('ongoingProjects');
        const completedEl = document.getElementById('completedProjects');
        const upcomingEl = document.getElementById('upcomingProjects');

        if (totalEl) totalEl.textContent = totalProjects;
        if (ongoingEl) ongoingEl.textContent = ongoingProjects;
        if (completedEl) completedEl.textContent = completedProjects;
        if (upcomingEl) upcomingEl.textContent = upcomingProjects;
    }

    // 🎛️ Setup event listeners
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.applyFilters();
            });
        }

        // Country filter
        const countryFilter = document.getElementById('country-filter');
        if (countryFilter) {
            countryFilter.addEventListener('change', (e) => {
                this.currentFilters.country = e.target.value;
                this.applyFilters();
            });
        }

        // Clear filters button
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    // 🔍 Apply current filters
    applyFilters() {
        this.filteredProjects = this.projects.filter(project => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const title = (project.title || '').toLowerCase();
                const description = (project.description || '').toLowerCase();
                const organization = (project.organization || '').toLowerCase();
                
                if (!title.includes(searchTerm) && 
                    !description.includes(searchTerm) && 
                    !organization.includes(searchTerm)) {
                    return false;
                }
            }

            // Category filter
            if (this.currentFilters.category !== 'all' && 
                project.category !== this.currentFilters.category) {
                return false;
            }

            // Status filter
            if (this.currentFilters.status !== 'all' && 
                project.status !== this.currentFilters.status) {
                return false;
            }

            // Country filter
            if (this.currentFilters.country !== 'all' && project.country) {
                const countryMatch = project.country.toLowerCase().replace(/\s+/g, '-');
                if (countryMatch !== this.currentFilters.country) {
                    return false;
                }
            }

            return true;
        });

        this.renderProjects();
        this.updateFilterStats();
    }

    // 🔄 Clear all filters
    clearAllFilters() {
        this.currentFilters = {
            search: '',
            category: 'all',
            status: 'all',
            country: 'all'
        };

        // Reset form elements
        const searchInput = document.getElementById('search');
        const categoryFilter = document.getElementById('category-filter');
        const statusFilter = document.getElementById('status-filter');
        const countryFilter = document.getElementById('country-filter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        if (countryFilter) countryFilter.value = 'all';

        this.filteredProjects = [...this.projects];
        this.renderProjects();
        this.updateFilterStats();
    }

    // 📊 Update filter statistics
    updateFilterStats() {
        const resultCount = document.getElementById('resultCount');
        if (resultCount) {
            resultCount.textContent = `${this.filteredProjects.length} project${this.filteredProjects.length !== 1 ? 's' : ''} found`;
        }
    }

    // 🎨 Render projects grid
    renderProjects() {
        const projectGrid = document.getElementById('project-grid');
        if (!projectGrid) return;

        if (this.filteredProjects.length === 0) {
            projectGrid.innerHTML = `
                <div class="no-projects-state">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No Projects Found</h3>
                        <p>Try adjusting your search criteria or clearing filters</p>
                        <button class="btn btn-primary" onclick="window.africanProjects.clearAllFilters()">
                            <i class="fas fa-refresh"></i> Clear Filters
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        const projectsHTML = this.filteredProjects.map(project => this.createProjectCard(project)).join('');
        projectGrid.innerHTML = projectsHTML;

        // Add animation to cards
        this.animateCards();
    }

    // 🎴 Create individual project card
    createProjectCard(project) {
        const statusClass = this.getStatusClass(project.status);
        const categoryIcon = this.getCategoryIcon(project.category);
        
        return `
            <div class="project-card modern-card" data-category="${project.category}" data-status="${project.status}">
                <div class="project-header">
                    <div class="project-category">
                        <i class="${categoryIcon}"></i>
                        <span>${this.formatCategory(project.category)}</span>
                    </div>
                    <div class="project-status ${statusClass}">
                        ${this.formatStatus(project.status)}
                    </div>
                </div>
                
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-details">
                        <div class="detail-item">
                            <i class="fas fa-building"></i>
                            <span>${project.organization}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${project.country}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatDateRange(project.startDate, project.endDate)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-dollar-sign"></i>
                            <span>${project.budget}</span>
                        </div>
                    </div>
                    
                    ${project.participants ? `
                        <div class="project-participants">
                            <strong>Participating Countries:</strong>
                            <div class="participant-tags">
                                ${project.participants.map(country => `<span class="participant-tag">${country}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="project-footer">
                    <button class="btn btn-outline-primary btn-sm" onclick="window.africanProjects.showProjectDetails('${project.title}')">
                        <i class="fas fa-info-circle"></i> View Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="window.africanProjects.contactProject('${project.title}')">
                        <i class="fas fa-envelope"></i> Contact
                    </button>
                </div>
            </div>
        `;
    }

    // 🎨 Helper methods for styling
    getStatusClass(status) {
        const classes = {
            'ongoing': 'status-ongoing',
            'completed': 'status-completed',
            'upcoming': 'status-upcoming'
        };
        return classes[status] || 'status-unknown';
    }

    getCategoryIcon(category) {
        const icons = {
            'geological': 'fas fa-mountain',
            'hydrology': 'fas fa-tint',
            'seismic': 'fas fa-wave-square',
            'environmental': 'fas fa-leaf',
            'mining': 'fas fa-gem',
            'energy': 'fas fa-bolt',
            'research': 'fas fa-microscope',
            'general': 'fas fa-project-diagram'
        };
        return icons[category] || 'fas fa-project-diagram';
    }

    formatCategory(category) {
        if (!category || typeof category !== 'string') return 'General';
        
        const categoryMap = {
            'geological': 'Geological',
            'hydrology': 'Hydrology',
            'seismic': 'Seismic Studies',
            'mining': 'Mining & Resources',
            'environmental': 'Environmental',
            'energy': 'Energy',
            'research': 'Research',
            'general': 'General'
        };
        
        return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    formatStatus(status) {
        const formatted = {
            'ongoing': 'Ongoing',
            'completed': 'Completed',
            'upcoming': 'Upcoming'
        };
        return formatted[status] || status;
    }

    formatDateRange(startDate, endDate) {
        const start = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        const end = new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        return `${start} - ${end}`;
    }

    // ✨ Animate cards on render
    animateCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 📋 Show project details modal
    showProjectDetails(projectTitle) {
        const project = this.projects.find(p => p.title === projectTitle);
        if (!project) return;

        // Create modal content
        const modalContent = `
            <div class="project-modal-overlay" onclick="this.remove()">
                <div class="project-modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>${project.title}</h2>
                        <button class="modal-close" onclick="this.closest('.project-modal-overlay').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="project-full-details">
                            <p><strong>Description:</strong> ${project.description}</p>
                            <p><strong>Organization:</strong> ${project.organization}</p>
                            <p><strong>Location:</strong> ${project.country}</p>
                            <p><strong>Duration:</strong> ${this.formatDateRange(project.startDate, project.endDate)}</p>
                            <p><strong>Budget:</strong> ${project.budget}</p>
                            <p><strong>Status:</strong> ${this.formatStatus(project.status)}</p>
                            ${project.participants ? `<p><strong>Participating Countries:</strong> ${project.participants.join(', ')}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalContent);
    }

    // 📧 Contact project
    contactProject(projectTitle) {
        alert(`Contact functionality for "${projectTitle}" would be implemented here. This would typically open a contact form or redirect to an email.`);
    }

    // 🚨 Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            padding: 1rem;
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        errorDiv.innerHTML = `
            <strong>Error:</strong> ${message}
            <button type="button" style="float: right; background: none; border: none; font-size: 1.2rem; cursor: pointer;" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on African projects page
    if (document.getElementById('project-grid')) {
        window.africanProjects = new AfricanProjects();
        window.africanProjects.init();
    }
});

// Legacy support for inline functions
function filterProjects() {
    if (window.africanProjects) {
        window.africanProjects.applyFilters();
    }
}
