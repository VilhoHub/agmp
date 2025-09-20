// 📊 Data Manager Module - Professional Data Handling System
// Handles all data-related functionality for the AGMP platform

const DataManager = {
    cache: new Map(),
    loadingStates: new Map(),

    // 🎯 Initialize data management system
    init() {
        this.setupDataLoading();
        this.setupErrorHandling();
        this.preloadCriticalData();
    },

    // 🔄 Setup data loading infrastructure
    setupDataLoading() {
        // Create loading indicator system
        this.createLoadingIndicators();
    },

    // ⚡ Preload critical data for better performance
    async preloadCriticalData() {
        const criticalFiles = [
            'data/datasets.json',
            'data/projects.json',
            'data/platforms.json'
        ];

        const loadPromises = criticalFiles.map(file => this.loadData(file));
        
        try {
            await Promise.all(loadPromises);
            console.log('✅ Critical data preloaded successfully');
        } catch (error) {
            console.warn('⚠️ Some critical data failed to preload:', error);
        }
    },

    // 📥 Generic data loading with caching
    async loadData(url, useCache = true) {
        // Check cache first
        if (useCache && this.cache.has(url)) {
            return this.cache.get(url);
        }

        // Check if already loading
        if (this.loadingStates.has(url)) {
            return this.loadingStates.get(url);
        }

        // Start loading
        const loadingPromise = this.fetchWithRetry(url)
            .then(data => {
                this.cache.set(url, data);
                this.loadingStates.delete(url);
                return data;
            })
            .catch(error => {
                this.loadingStates.delete(url);
                throw error;
            });

        this.loadingStates.set(url, loadingPromise);
        return loadingPromise;
    },

    // 🔄 Fetch with retry logic
    async fetchWithRetry(url, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return await response.json();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    },

    // 📊 Load and process datasets
    async loadDatasets() {
        try {
            const data = await this.loadData('data/datasets.json');
            return this.processDatasets(data);
        } catch (error) {
            console.error('Failed to load datasets:', error);
            return this.getFallbackDatasets();
        }
    },

    // 🏗️ Load and process projects
    async loadProjects() {
        try {
            const data = await this.loadData('data/projects.json');
            return this.processProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
            return this.getFallbackProjects();
        }
    },

    // 🛠️ Load and process platforms
    async loadPlatforms() {
        try {
            const data = await this.loadData('data/platforms.json');
            return this.processPlatforms(data);
        } catch (error) {
            console.error('Failed to load platforms:', error);
            return this.getFallbackPlatforms();
        }
    },

    // 🔧 Process datasets for display
    processDatasets(rawData) {
        if (!Array.isArray(rawData)) return [];
        
        return rawData.map(dataset => ({
            ...dataset,
            id: this.generateId(dataset.Country || 'unknown'),
            processed: true,
            displayName: dataset.Country || 'Unknown Country'
        }));
    },

    // 🔧 Process projects for display
    processProjects(rawData) {
        if (!Array.isArray(rawData)) return [];
        
        return rawData.map(project => ({
            ...project,
            id: this.generateId(project['Initiative/Item Name'] || 'unknown'),
            processed: true,
            displayName: project['Initiative/Item Name'] || 'Unknown Project',
            status: project.Status || 'Unknown',
            category: project['Thematic Area (Geoscientific)'] || 'General'
        }));
    },

    // 🔧 Process platforms for display
    processPlatforms(rawData) {
        if (!Array.isArray(rawData)) return [];
        
        return rawData.map(platform => ({
            ...platform,
            id: this.generateId(platform.name || 'unknown'),
            processed: true,
            displayName: platform.name || 'Unknown Platform'
        }));
    },

    // 🆔 Generate unique IDs
    generateId(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    },

    // 🔍 Search functionality
    searchData(data, query, fields = []) {
        if (!query || !Array.isArray(data)) return data;
        
        const searchTerm = query.toLowerCase();
        
        return data.filter(item => {
            // Search in specified fields or all string fields
            const fieldsToSearch = fields.length > 0 ? fields : Object.keys(item);
            
            return fieldsToSearch.some(field => {
                const value = item[field];
                return typeof value === 'string' && 
                       value.toLowerCase().includes(searchTerm);
            });
        });
    },

    // 📈 Filter data by criteria
    filterData(data, filters) {
        if (!Array.isArray(data) || !filters) return data;
        
        return data.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true; // Skip empty filters
                
                const itemValue = item[key];
                if (typeof itemValue === 'string') {
                    return itemValue.toLowerCase().includes(value.toLowerCase());
                }
                return itemValue === value;
            });
        });
    },

    // 📊 Get data statistics
    getDataStats(data) {
        if (!Array.isArray(data)) return {};
        
        return {
            total: data.length,
            processed: data.filter(item => item.processed).length,
            categories: [...new Set(data.map(item => item.category).filter(Boolean))],
            lastUpdated: new Date().toISOString()
        };
    },

    // 🎨 Create loading indicators
    createLoadingIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .data-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                background: var(--gradient-background);
                border-radius: 12px;
                margin: 1rem 0;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid var(--shadow-light);
                border-top: 4px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .data-error {
                background: #ffebee;
                color: #c62828;
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
                margin: 1rem 0;
            }
        `;
        document.head.appendChild(style);
    },

    // 🚨 Setup error handling
    setupErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showErrorMessage('An unexpected error occurred while loading data.');
        });
    },

    // 💾 Fallback data for offline/error scenarios
    getFallbackDatasets() {
        return [
            {
                Country: 'South Africa',
                id: 'south-africa',
                processed: true,
                displayName: 'South Africa',
                'Map Scales (25-50 K)': 'Yes',
                'Economic Geology': 'Yes',
                'Geophysics': 'Yes'
            },
            {
                Country: 'Nigeria',
                id: 'nigeria',
                processed: true,
                displayName: 'Nigeria',
                'Map Scales (25-50 K)': 'Yes',
                'Economic Geology': 'Yes',
                'Geophysics': 'Limited'
            }
        ];
    },

    getFallbackProjects() {
        return [
            {
                'Initiative/Item Name': 'Africa Array',
                id: 'africa-array',
                processed: true,
                displayName: 'Africa Array',
                Status: 'Active',
                category: 'Geophysics'
            }
        ];
    },

    getFallbackPlatforms() {
        return [
            {
                name: 'ArcGIS',
                id: 'arcgis',
                processed: true,
                displayName: 'ArcGIS'
            }
        ];
    },

    // 📢 Show loading state
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="data-loading">
                    <div class="loading-spinner"></div>
                    <span style="margin-left: 1rem;">Loading data...</span>
                </div>
            `;
        }
    },

    // ❌ Show error message
    showErrorMessage(message, containerId) {
        const container = containerId ? document.getElementById(containerId) : null;
        const errorHtml = `
            <div class="data-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button class="btn btn-secondary btn-sm" onclick="location.reload()">
                    Retry
                </button>
            </div>
        `;
        
        if (container) {
            container.innerHTML = errorHtml;
        } else {
            console.error(message);
        }
    },

    // 🗑️ Clear cache
    clearCache() {
        this.cache.clear();
        console.log('Data cache cleared');
    }
};

// Export for use in other modules
window.DataManager = DataManager;
