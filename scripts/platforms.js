// 🛰️ Geospatial Platforms - Professional Interactive System
// Handles all functionality for the geospatial platforms page

class GeospatialPlatforms {
    constructor() {
        this.platforms = [];
        this.filteredPlatforms = [];
        this.currentFilters = {
            search: '',
            category: 'all',
            provider: 'all',
            region: 'all'
        };
        this.currentView = 'grid';
    }

    // 🎯 Initialize the platforms system
    async init() {
        try {
            console.log('🛰️ Initializing Geospatial Platforms...');
            
            // Check if we're on the right page
            if (!document.getElementById('platforms-grid')) {
                console.log('Not on geospatial platforms page, skipping initialization');
                return;
            }
            
            await this.loadPlatforms();
            this.setupFilters();
            this.setupEventListeners();
            this.renderPlatforms();
            
            console.log('✅ Geospatial Platforms initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Geospatial Platforms:', error);
            this.showErrorMessage('Failed to load platforms. Please refresh the page.');
        }
    }

    // 📊 Load platforms data
    async loadPlatforms() {
        try {
            const response = await fetch('data/platforms.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawPlatforms = await response.json();
            
            // Transform the data to match our expected format
            this.platforms = rawPlatforms.map(platform => ({
                name: platform["Topic/Website"] || "Unnamed Platform",
                description: platform["What is on the Website"] || "No description available",
                provider: platform["Powered by"] || "Unknown Provider",
                url: this.cleanUrl(platform["Available Link "] || ""),
                logo: platform["Logos"] || "",
                category: this.categorizePlatform(platform["Topic/Website"], platform["What is on the Website"]),
                region: this.extractRegion(platform["Topic/Website"], platform["What is on the Website"]),
                features: this.extractFeatures(platform["What is on the Website"] || ""),
                type: this.determinePlatformType(platform["What is on the Website"] || "")
            }));
            
            this.filteredPlatforms = [...this.platforms];
            console.log(`📊 Loaded ${this.platforms.length} platforms`);
        } catch (error) {
            console.warn('Failed to load platforms data, using fallback:', error);
            // Fallback data for demo purposes
            this.platforms = [
                {
                    name: "Africa GeoPortal",
                    description: "A comprehensive platform offering geospatial tools and datasets focused on Africa, including OpenStreetMap data and satellite imagery.",
                    provider: "Esri",
                    url: "https://www.africageoportal.com/",
                    logo: "assets/Africa_GeoPortal.png",
                    category: "geoportal",
                    region: "continental",
                    features: ["OpenStreetMap", "Satellite Imagery", "Thematic Maps"],
                    type: "Data Platform"
                },
                {
                    name: "Digital Earth Africa",
                    description: "Provides open satellite data processed for immediate analysis, supporting sustainable development across Africa.",
                    provider: "Digital Earth Africa",
                    url: "https://www.digitalearthafrica.org/",
                    logo: "assets/Digital_Earth_Africa.png",
                    category: "satellite",
                    region: "continental",
                    features: ["Landsat Data", "Sentinel Data", "Analysis Ready"],
                    type: "Satellite Platform"
                }
            ];
            this.filteredPlatforms = [...this.platforms];
        }
    }

    // 🔄 Data transformation helpers
    categorizePlatform(name, description) {
        const nameDesc = (name + " " + description).toLowerCase();
        
        if (nameDesc.includes('geoportal') || nameDesc.includes('portal')) return 'geoportal';
        if (nameDesc.includes('satellite') || nameDesc.includes('landsat') || nameDesc.includes('sentinel')) return 'satellite';
        if (nameDesc.includes('earth observation') || nameDesc.includes('remote sensing')) return 'earth-observation';
        if (nameDesc.includes('gis') || nameDesc.includes('arcgis')) return 'gis';
        if (nameDesc.includes('data') && nameDesc.includes('open')) return 'open-data';
        if (nameDesc.includes('survey') || nameDesc.includes('mapping')) return 'surveying';
        if (nameDesc.includes('weather') || nameDesc.includes('climate') || nameDesc.includes('meteorological')) return 'climate';
        
        return 'general';
    }

    extractRegion(name, description) {
        const nameDesc = (name + " " + description).toLowerCase();
        
        // Country-specific
        if (nameDesc.includes('nigeria')) return 'nigeria';
        if (nameDesc.includes('malawi')) return 'malawi';
        if (nameDesc.includes('namibia')) return 'namibia';
        if (nameDesc.includes('south africa')) return 'south-africa';
        
        // Regional
        if (nameDesc.includes('west africa') || nameDesc.includes('western africa')) return 'west-africa';
        if (nameDesc.includes('east africa') || nameDesc.includes('eastern africa')) return 'east-africa';
        if (nameDesc.includes('southern africa')) return 'southern-africa';
        
        // Continental or Global
        if (nameDesc.includes('africa') || nameDesc.includes('african')) return 'continental';
        
        return 'global';
    }

    extractFeatures(description) {
        const features = [];
        const desc = description.toLowerCase();
        
        if (desc.includes('satellite')) features.push('Satellite Data');
        if (desc.includes('openstreetmap') || desc.includes('osm')) features.push('OpenStreetMap');
        if (desc.includes('landsat')) features.push('Landsat');
        if (desc.includes('sentinel')) features.push('Sentinel');
        if (desc.includes('gis')) features.push('GIS Tools');
        if (desc.includes('analysis')) features.push('Data Analysis');
        if (desc.includes('download')) features.push('Data Download');
        if (desc.includes('training')) features.push('Training');
        if (desc.includes('api')) features.push('API Access');
        
        return features.length > 0 ? features : ['Data Access'];
    }

    determinePlatformType(description) {
        const desc = description.toLowerCase();
        
        if (desc.includes('portal') || desc.includes('platform')) return 'Data Platform';
        if (desc.includes('satellite') || desc.includes('earth observation')) return 'Satellite Platform';
        if (desc.includes('gis') || desc.includes('mapping')) return 'GIS Platform';
        if (desc.includes('training') || desc.includes('education')) return 'Educational Platform';
        if (desc.includes('network') || desc.includes('connect')) return 'Network Platform';
        
        return 'Geospatial Platform';
    }

    cleanUrl(url) {
        if (!url || typeof url !== 'string') return '';
        
        // Clean up common URL issues
        url = url.trim();
        if (url.startsWith('A Data Platform For Africa:')) {
            return 'https://dunia.catalysts.africa/';
        }
        if (!url.startsWith('http')) {
            return 'https://' + url;
        }
        
        return url;
    }

    // 🎛️ Setup filter controls
    setupFilters() {
        // Populate provider filter
        const providerFilter = document.getElementById('provider-filter');
        if (providerFilter) {
            const providers = [...new Set(this.platforms.map(p => p.provider))]
                .filter(provider => provider && typeof provider === 'string')
                .sort();
            
            providers.forEach(provider => {
                if (provider && typeof provider === 'string') {
                    const option = document.createElement('option');
                    option.value = provider.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = provider;
                    providerFilter.appendChild(option);
                }
            });
        }

        // Update stats
        this.updateStats();
    }

    // 📊 Update platform statistics
    updateStats() {
        const totalPlatforms = this.platforms.length;
        const continentalPlatforms = this.platforms.filter(p => p.region === 'continental').length;
        const satellitePlatforms = this.platforms.filter(p => p.category === 'satellite').length;
        const geoportals = this.platforms.filter(p => p.category === 'geoportal').length;

        // Update stat displays
        const totalEl = document.getElementById('totalPlatforms');
        const continentalEl = document.getElementById('continentalPlatforms');
        const satelliteEl = document.getElementById('satellitePlatforms');
        const geoportalEl = document.getElementById('geoportalPlatforms');

        if (totalEl) totalEl.textContent = totalPlatforms;
        if (continentalEl) continentalEl.textContent = continentalPlatforms;
        if (satelliteEl) satelliteEl.textContent = satellitePlatforms;
        if (geoportalEl) geoportalEl.textContent = geoportals;
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

        // Provider filter
        const providerFilter = document.getElementById('provider-filter');
        if (providerFilter) {
            providerFilter.addEventListener('change', (e) => {
                this.currentFilters.provider = e.target.value;
                this.applyFilters();
            });
        }

        // Region filter
        const regionFilter = document.getElementById('region-filter');
        if (regionFilter) {
            regionFilter.addEventListener('change', (e) => {
                this.currentFilters.region = e.target.value;
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

        // View toggle buttons
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        if (gridView) {
            gridView.addEventListener('click', () => {
                this.currentView = 'grid';
                this.updateViewButtons();
                this.renderPlatforms();
            });
        }
        
        if (listView) {
            listView.addEventListener('click', () => {
                this.currentView = 'list';
                this.updateViewButtons();
                this.renderPlatforms();
            });
        }
    }

    // 🔍 Apply current filters
    applyFilters() {
        this.filteredPlatforms = this.platforms.filter(platform => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const name = (platform.name || '').toLowerCase();
                const description = (platform.description || '').toLowerCase();
                const provider = (platform.provider || '').toLowerCase();
                
                if (!name.includes(searchTerm) && 
                    !description.includes(searchTerm) && 
                    !provider.includes(searchTerm)) {
                    return false;
                }
            }

            // Category filter
            if (this.currentFilters.category !== 'all' && 
                platform.category !== this.currentFilters.category) {
                return false;
            }

            // Provider filter
            if (this.currentFilters.provider !== 'all' && platform.provider) {
                const providerMatch = platform.provider.toLowerCase().replace(/\s+/g, '-');
                if (providerMatch !== this.currentFilters.provider) {
                    return false;
                }
            }

            // Region filter
            if (this.currentFilters.region !== 'all' && 
                platform.region !== this.currentFilters.region) {
                return false;
            }

            return true;
        });

        this.renderPlatforms();
        this.updateFilterStats();
    }

    // 🔄 Clear all filters
    clearAllFilters() {
        this.currentFilters = {
            search: '',
            category: 'all',
            provider: 'all',
            region: 'all'
        };

        // Reset form elements
        const searchInput = document.getElementById('search');
        const categoryFilter = document.getElementById('category-filter');
        const providerFilter = document.getElementById('provider-filter');
        const regionFilter = document.getElementById('region-filter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';
        if (providerFilter) providerFilter.value = 'all';
        if (regionFilter) regionFilter.value = 'all';

        this.filteredPlatforms = [...this.platforms];
        this.renderPlatforms();
        this.updateFilterStats();
    }

    // 📊 Update filter statistics
    updateFilterStats() {
        const resultCount = document.getElementById('resultCount');
        if (resultCount) {
            resultCount.textContent = `${this.filteredPlatforms.length} platform${this.filteredPlatforms.length !== 1 ? 's' : ''} found`;
        }
    }

    // 🎨 Update view buttons
    updateViewButtons() {
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        if (gridView && listView) {
            gridView.classList.toggle('active', this.currentView === 'grid');
            listView.classList.toggle('active', this.currentView === 'list');
        }
    }

    // 🎨 Render platforms
    renderPlatforms() {
        const platformsGrid = document.getElementById('platforms-grid');
        if (!platformsGrid) return;

        if (this.filteredPlatforms.length === 0) {
            platformsGrid.innerHTML = `
                <div class="no-platforms-state">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No Platforms Found</h3>
                        <p>Try adjusting your search criteria or clearing filters</p>
                        <button class="btn btn-primary" onclick="window.geospatialPlatforms.clearAllFilters()">
                            <i class="fas fa-refresh"></i> Clear Filters
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Apply view class
        platformsGrid.className = `platforms-grid-redesigned ${this.currentView}-view`;

        const platformsHTML = this.filteredPlatforms.map(platform => 
            this.currentView === 'grid' ? 
            this.createPlatformCard(platform) : 
            this.createPlatformListItem(platform)
        ).join('');
        
        platformsGrid.innerHTML = platformsHTML;

        // Add animation to cards
        this.animateCards();
    }

    // 🎴 Create platform card (grid view)
    createPlatformCard(platform) {
        const categoryIcon = this.getCategoryIcon(platform.category);
        const regionBadge = this.getRegionBadge(platform.region);
        
        return `
            <div class="platform-card modern-card" data-category="${platform.category}" data-region="${platform.region}">
                <div class="platform-header">
                    <div class="platform-logo">
                        ${platform.logo ? 
                            `<img src="${platform.logo}" alt="${platform.name}" onerror="this.style.display='none'">` :
                            `<div class="logo-placeholder"><i class="${categoryIcon}"></i></div>`
                        }
                    </div>
                    <div class="platform-badges">
                        ${regionBadge}
                        <span class="platform-type">${platform.type}</span>
                    </div>
                </div>
                
                <div class="platform-content">
                    <h3 class="platform-title">${platform.name}</h3>
                    <p class="platform-description">${this.truncateText(platform.description, 120)}</p>
                    
                    <div class="platform-details">
                        <div class="detail-item">
                            <i class="fas fa-building"></i>
                            <span>${platform.provider}</span>
                        </div>
                        <div class="detail-item">
                            <i class="${categoryIcon}"></i>
                            <span>${this.formatCategory(platform.category)}</span>
                        </div>
                    </div>
                    
                    ${platform.features.length > 0 ? `
                        <div class="platform-features">
                            <strong>Key Features:</strong>
                            <div class="feature-tags">
                                ${platform.features.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                                ${platform.features.length > 3 ? `<span class="feature-tag more">+${platform.features.length - 3} more</span>` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="platform-footer">
                    <button class="btn btn-outline-primary btn-sm" onclick="window.geospatialPlatforms.showPlatformDetails('${platform.name.replace(/'/g, "\\'")}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    ${platform.url ? `
                        <a href="${platform.url}" target="_blank" class="btn btn-primary btn-sm">
                            <i class="fas fa-external-link-alt"></i> Visit Platform
                        </a>
                    ` : `
                        <button class="btn btn-secondary btn-sm" disabled>
                            <i class="fas fa-link-slash"></i> No Link
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    // 📋 Create platform list item (list view)
    createPlatformListItem(platform) {
        const categoryIcon = this.getCategoryIcon(platform.category);
        const regionBadge = this.getRegionBadge(platform.region);
        
        return `
            <div class="platform-list-item modern-card" data-category="${platform.category}" data-region="${platform.region}">
                <div class="list-item-content">
                    <div class="list-item-header">
                        <div class="platform-logo-small">
                            ${platform.logo ? 
                                `<img src="${platform.logo}" alt="${platform.name}" onerror="this.style.display='none'">` :
                                `<div class="logo-placeholder-small"><i class="${categoryIcon}"></i></div>`
                            }
                        </div>
                        <div class="platform-info">
                            <h4 class="platform-title">${platform.name}</h4>
                            <p class="platform-provider">${platform.provider} • ${this.formatCategory(platform.category)}</p>
                        </div>
                        <div class="platform-badges">
                            ${regionBadge}
                            <span class="platform-type">${platform.type}</span>
                        </div>
                    </div>
                    
                    <p class="platform-description">${this.truncateText(platform.description, 200)}</p>
                    
                    ${platform.features.length > 0 ? `
                        <div class="platform-features-inline">
                            ${platform.features.slice(0, 4).map(feature => `<span class="feature-tag-small">${feature}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="list-item-actions">
                    <button class="btn btn-outline-primary btn-sm" onclick="window.geospatialPlatforms.showPlatformDetails('${platform.name.replace(/'/g, "\\'")}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    ${platform.url ? `
                        <a href="${platform.url}" target="_blank" class="btn btn-primary btn-sm">
                            <i class="fas fa-external-link-alt"></i> Visit
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // 🎨 Helper methods
    getCategoryIcon(category) {
        const icons = {
            'geoportal': 'fas fa-globe',
            'satellite': 'fas fa-satellite',
            'earth-observation': 'fas fa-eye',
            'gis': 'fas fa-map',
            'open-data': 'fas fa-database',
            'surveying': 'fas fa-ruler-combined',
            'climate': 'fas fa-cloud-sun',
            'general': 'fas fa-layer-group'
        };
        return icons[category] || 'fas fa-layer-group';
    }

    getRegionBadge(region) {
        const badges = {
            'continental': '<span class="region-badge continental">Continental</span>',
            'global': '<span class="region-badge global">Global</span>',
            'west-africa': '<span class="region-badge regional">West Africa</span>',
            'east-africa': '<span class="region-badge regional">East Africa</span>',
            'southern-africa': '<span class="region-badge regional">Southern Africa</span>',
            'nigeria': '<span class="region-badge country">Nigeria</span>',
            'malawi': '<span class="region-badge country">Malawi</span>',
            'namibia': '<span class="region-badge country">Namibia</span>',
            'south-africa': '<span class="region-badge country">South Africa</span>'
        };
        return badges[region] || '<span class="region-badge other">Other</span>';
    }

    formatCategory(category) {
        const formatted = {
            'geoportal': 'GeoPortal',
            'satellite': 'Satellite Data',
            'earth-observation': 'Earth Observation',
            'gis': 'GIS Platform',
            'open-data': 'Open Data',
            'surveying': 'Surveying & Mapping',
            'climate': 'Climate & Weather',
            'general': 'General Platform'
        };
        return formatted[category] || category;
    }

    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    // ✨ Animate cards on render
    animateCards() {
        const cards = document.querySelectorAll('.platform-card, .platform-list-item');
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

    // 📋 Show platform details modal
    showPlatformDetails(platformName) {
        const platform = this.platforms.find(p => p.name === platformName);
        if (!platform) return;

        const modalContent = `
            <div class="platform-modal-overlay" onclick="this.remove()">
                <div class="platform-modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>${platform.name}</h2>
                        <button class="modal-close" onclick="this.closest('.platform-modal-overlay').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="platform-full-details">
                            <div class="detail-section">
                                <h4>Description</h4>
                                <p>${platform.description}</p>
                            </div>
                            
                            <div class="detail-section">
                                <h4>Platform Information</h4>
                                <p><strong>Provider:</strong> ${platform.provider}</p>
                                <p><strong>Type:</strong> ${platform.type}</p>
                                <p><strong>Category:</strong> ${this.formatCategory(platform.category)}</p>
                                <p><strong>Coverage:</strong> ${this.getRegionBadge(platform.region).replace(/<[^>]*>/g, '')}</p>
                            </div>
                            
                            ${platform.features.length > 0 ? `
                                <div class="detail-section">
                                    <h4>Key Features</h4>
                                    <ul>
                                        ${platform.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${platform.url ? `
                                <div class="detail-section">
                                    <h4>Access Platform</h4>
                                    <a href="${platform.url}" target="_blank" class="btn btn-primary">
                                        <i class="fas fa-external-link-alt"></i> Visit ${platform.name}
                                    </a>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalContent);
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
    // Only initialize on geospatial platforms page
    if (document.getElementById('platforms-grid')) {
        window.geospatialPlatforms = new GeospatialPlatforms();
        window.geospatialPlatforms.init();
    }
});

// Legacy support for inline functions
function filterPlatforms() {
    if (window.geospatialPlatforms) {
        window.geospatialPlatforms.applyFilters();
    }
}
