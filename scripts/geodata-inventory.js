// 🗺️ Geodata Inventory - Professional Interactive System
// Handles all functionality for the redesigned geodata inventory page

class GeodataInventory {
    constructor() {
        this.map = null;
        this.currentLayer = null;
        this.datasets = [];
        this.chart = null;
        this.fieldMappings = {
            mapping: {
                'Map Scales (25-50 K)': 'Geological Map Scales (25-50K)',
                'Map Scales (<50-100 K)': 'Geological Map Scales (50-100K)', 
                'Map Scales (100 -250 K)': 'Geological Map Scales (100-250K)',
                'Map Scales (500-1000 K)': 'Geological Map Scales (500K-1M)',
                'Map Scales (1 mio)': 'Geological Map Scales (1M)',
                'Map Scales (> 1000K)': 'Geological Map Scales (>1M)'
            },
            geophysics: {
                'Geophysics (Electromagnetic)': 'Geophysics (Electromagnetic)',
                'Geophysics (Magnetic)': 'Geophysics (Magnetic)',
                'Geophysics (Gravity)': 'Geophysics (Gravity)',
                'Geophysics (Seismic)': 'Geophysics (Seismic)',
                'Geophysics (Radiometric)': 'Geophysics (Radiometric)'
            },
            geochemistry: {
                'Geochemistry (Soil)': 'Geochemistry (Soil)',
                'Geochemistry (Stream)': 'Geochemistry (Stream)',
                'Geochemistry (Rock)': 'Geochemistry (Rock)',
                'Geochemistry (Water)': 'Geochemistry (Water)'
            },
            engineering: {
                'Engineering Mapping (Engineering Mapping)': 'Engineering Geology Mapping',
                'Engineering Mapping (Geohazard)': 'Engineering Geology (Geohazard)',
                'Engineering Mapping (Risk Assessment)': 'Engineering Geology (Risk Assessment)'
            },
            economic: {
                'Economic Geology (Ground Water Assessment)': 'Economic Geology (Groundwater)',
                'Economic Geology (Air Quality)': 'Economic Geology (Air Quality)',
                'Economic Geology (Risk Assessment)': 'Economic Geology (Risk Assessment)',
                'Mineral Resources': 'Mineral Resources'
            },
            hydrogeology: {
                'Hydrogeology': 'Hydrogeology',
                'Groundwater': 'Groundwater Assessment'
            }
        };
        
        this.regionMapping = {
            'Algeria': 'North Africa',
            'Egypt': 'North Africa',
            'Libya': 'North Africa',
            'Morocco': 'North Africa',
            'Tunisia': 'North Africa',
            'Sudan': 'North Africa',
            'Nigeria': 'West Africa',
            'Ghana': 'West Africa',
            'Senegal': 'West Africa',
            'Mali': 'West Africa',
            'Burkina Faso': 'West Africa',
            'Niger': 'West Africa',
            'Guinea': 'West Africa',
            'Sierra Leone': 'West Africa',
            'Liberia': 'West Africa',
            'Côte d\'Ivoire': 'West Africa',
            'Kenya': 'East Africa',
            'Ethiopia': 'East Africa',
            'Tanzania': 'East Africa',
            'Uganda': 'East Africa',
            'Rwanda': 'East Africa',
            'Burundi': 'East Africa',
            'Somalia': 'East Africa',
            'Djibouti': 'East Africa',
            'South Africa': 'Southern Africa',
            'Botswana': 'Southern Africa',
            'Namibia': 'Southern Africa',
            'Zimbabwe': 'Southern Africa',
            'Zambia': 'Southern Africa',
            'Malawi': 'Southern Africa',
            'Mozambique': 'Southern Africa',
            'Lesotho': 'Southern Africa',
            'Swaziland': 'Southern Africa',
            'Angola': 'Central Africa',
            'Democratic Republic of Congo': 'Central Africa',
            'Republic of Congo': 'Central Africa',
            'Cameroon': 'Central Africa',
            'Central African Republic': 'Central Africa',
            'Chad': 'Central Africa',
            'Gabon': 'Central Africa',
            'Equatorial Guinea': 'Central Africa'
        };
    }

    // 🎯 Initialize the inventory system
    async init() {
        try {
            console.log('🗺️ Initializing Geodata Inventory...');
            
            // Check if we're on the right page
            if (!document.getElementById('categorySelect')) {
                console.log('Not on geodata inventory page, skipping initialization');
                return;
            }
            
            await this.loadData();
            this.initializeMap();
            this.setupControls();
            this.populateCountryDropdown();
            this.setupEventListeners();
            
            console.log('✅ Geodata Inventory initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Geodata Inventory:', error);
            // Show user-friendly error message
            this.showErrorMessage('Failed to initialize the geodata inventory. Please refresh the page.');
        }
    }

    // 📊 Load dataset information
    async loadData() {
        try {
            const response = await fetch('data/datasets.json');
            this.datasets = await response.json();
            console.log(`📊 Loaded ${this.datasets.length} datasets`);
        } catch (error) {
            console.error('Failed to load datasets:', error);
            // Fallback data
            this.datasets = [
                {
                    Country: 'South Africa',
                    'Map Scales (25-50 K)': 'Yes',
                    'Geophysics (Magnetic)': 'Yes',
                    'Geochemistry (Soil)': 'Limited'
                }
            ];
        }
    }

    // 🗺️ Initialize the map
    initializeMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.warn('Map container not found');
            return;
        }

        // Check if map is already initialized
        if (this.map) {
            this.map.remove();
            this.map = null;
        }

        // Check if Leaflet has already initialized this container
        if (mapContainer._leaflet_id) {
            console.log('Removing existing Leaflet instance');
            delete mapContainer._leaflet_id;
        }

        // Clear any existing map instance
        mapContainer.innerHTML = '';

        try {
            this.map = L.map('map').setView([0, 20], 3);
            console.log('✅ Map initialized successfully');
        } catch (error) {
            console.error('Failed to initialize map:', error);
            throw error;
        }

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 6,
            minZoom: 2
        }).addTo(this.map);

        // Set Africa bounds
        const africaBounds = [[-35, -20], [40, 55]];
        this.map.setMaxBounds(africaBounds);
        this.map.fitBounds(africaBounds);
    }

    // 🎛️ Setup control dropdowns
    setupControls() {
        const categorySelect = document.getElementById('categorySelect');
        const fieldSelect = document.getElementById('fieldSelect');

        if (!categorySelect || !fieldSelect) return;

        // Category change handler
        categorySelect.addEventListener('change', (e) => {
            const category = e.target.value;
            this.populateFieldDropdown(category);
            
            if (!category) {
                this.resetVisualization();
            }
        });

        // Field change handler
        fieldSelect.addEventListener('change', (e) => {
            const field = e.target.value;
            if (field) {
                this.visualizeField(field);
            } else {
                this.resetVisualization();
            }
        });
    }

    // 📋 Populate field dropdown based on category
    populateFieldDropdown(category) {
        const fieldSelect = document.getElementById('fieldSelect');
        if (!fieldSelect) return;

        fieldSelect.innerHTML = '<option value="">Select a specific field</option>';
        
        if (category && this.fieldMappings[category]) {
            fieldSelect.disabled = false;
            
            Object.entries(this.fieldMappings[category]).forEach(([key, label]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = label;
                fieldSelect.appendChild(option);
            });
        } else {
            fieldSelect.disabled = true;
            fieldSelect.innerHTML = '<option value="">Choose category first</option>';
        }
    }

    // 🌍 Populate country dropdown
    populateCountryDropdown() {
        const countrySelect = document.getElementById('countrySelect');
        if (!countrySelect) {
            console.warn('Country select element not found');
            return;
        }

        try {
            // Get unique countries and sort them
            const countries = [...new Set(this.datasets.map(d => d.Country))].filter(Boolean).sort();
            
            countries.forEach(country => {
                if (country && typeof country === 'string') {
                    const option = document.createElement('option');
                    option.value = country;
                    option.textContent = country;
                    countrySelect.appendChild(option);
                }
            });
            
            console.log(`✅ Populated ${countries.length} countries in dropdown`);
        } catch (error) {
            console.error('Error populating country dropdown:', error);
        }
    }

    // 🎨 Visualize selected field on map
    async visualizeField(fieldName) {
        if (!this.map) return;

        // Update map title
        const mapTitle = document.getElementById('mapTitle');
        const mapSubtitle = document.getElementById('mapSubtitle');
        
        if (mapTitle) {
            mapTitle.innerHTML = `<i class="fas fa-map"></i> ${this.getFieldDisplayName(fieldName)}`;
        }
        if (mapSubtitle) {
            mapSubtitle.textContent = 'Data availability across African countries';
        }

        // Analyze data for this field
        const analysis = this.analyzeField(fieldName);
        this.updateChart(analysis);
        this.updateSummary(analysis);

        // Load and style map data
        try {
            const response = await fetch('data/africa_regions.geojson');
            const geoData = await response.json();
            
            // Remove existing layer
            if (this.currentLayer) {
                this.map.removeLayer(this.currentLayer);
            }

            // Add new layer with styling
            this.currentLayer = L.geoJSON(geoData, {
                style: (feature) => this.getCountryStyle(feature, fieldName),
                onEachFeature: (feature, layer) => this.onEachCountry(feature, layer, fieldName)
            }).addTo(this.map);

        } catch (error) {
            console.warn('Could not load GeoJSON data:', error);
        }
    }

    // 📊 Analyze field data
    analyzeField(fieldName) {
        const analysis = {
            available: 0,
            limited: 0,
            none: 0,
            countries: {
                available: [],
                limited: [],
                none: []
            }
        };

        this.datasets.forEach(dataset => {
            const value = dataset[fieldName];
            const country = dataset.Country;
            
            if (value === 'Yes') {
                analysis.available++;
                analysis.countries.available.push(country);
            } else if (value === 'Limited' || value === 'Partial') {
                analysis.limited++;
                analysis.countries.limited.push(country);
            } else {
                analysis.none++;
                analysis.countries.none.push(country);
            }
        });

        return analysis;
    }

    // 🎨 Get country styling based on data availability
    getCountryStyle(feature, fieldName) {
        const countryName = feature.properties.NAME || feature.properties.name;
        const dataset = this.datasets.find(d => d.Country === countryName);
        
        if (!dataset) {
            return {
                fillColor: '#cccccc',
                weight: 1,
                opacity: 1,
                color: '#999999',
                fillOpacity: 0.7
            };
        }

        const value = dataset[fieldName];
        let fillColor = '#cccccc';
        
        if (value === 'Yes') {
            fillColor = '#4CAF50'; // Green for available
        } else if (value === 'Limited' || value === 'Partial') {
            fillColor = '#FF9800'; // Orange for limited
        } else {
            fillColor = '#F44336'; // Red for not available
        }

        return {
            fillColor: fillColor,
            weight: 2,
            opacity: 1,
            color: '#ffffff',
            fillOpacity: 0.8
        };
    }

    // 🖱️ Handle country interactions
    onEachCountry(feature, layer, fieldName) {
        const countryName = feature.properties.NAME || feature.properties.name;
        const dataset = this.datasets.find(d => d.Country === countryName);
        
        let popupContent = `<div class="map-popup">
            <h5>${countryName}</h5>`;
        
        if (dataset) {
            const value = dataset[fieldName];
            const status = value === 'Yes' ? 'Available' : 
                          value === 'Limited' ? 'Limited' : 'Not Available';
            
            popupContent += `
                <p><strong>${this.getFieldDisplayName(fieldName)}:</strong></p>
                <p class="status-${value?.toLowerCase()}">${status}</p>
            `;
        } else {
            popupContent += '<p>No data available</p>';
        }
        
        popupContent += '</div>';
        
        layer.bindPopup(popupContent);

        // Hover effects
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 1
                });
            },
            mouseout: (e) => {
                if (this.currentLayer) {
                    this.currentLayer.resetStyle(e.target);
                }
            }
        });
    }

    // 📈 Update chart visualization
    updateChart(analysis) {
        const canvas = document.getElementById('dataChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        // Create new chart
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Available', 'Limited', 'Not Available'],
                datasets: [{
                    data: [analysis.available, analysis.limited, analysis.none],
                    backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    // 📊 Update data summary
    updateSummary(analysis) {
        const availableCount = document.getElementById('availableCount');
        const limitedCount = document.getElementById('limitedCount');
        const noneCount = document.getElementById('noneCount');

        if (availableCount) availableCount.textContent = analysis.available;
        if (limitedCount) limitedCount.textContent = analysis.limited;
        if (noneCount) noneCount.textContent = analysis.none;
    }

    // 🔄 Reset visualization
    resetVisualization() {
        const mapTitle = document.getElementById('mapTitle');
        const mapSubtitle = document.getElementById('mapSubtitle');
        
        if (mapTitle) {
            mapTitle.innerHTML = '<i class="fas fa-map"></i> Select a data field to visualize';
        }
        if (mapSubtitle) {
            mapSubtitle.textContent = 'Interactive visualization of geospatial metadata availability';
        }

        // Remove map layer
        if (this.currentLayer && this.map) {
            this.map.removeLayer(this.currentLayer);
            this.currentLayer = null;
        }

        // Clear chart
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        // Reset summary
        this.updateSummary({ available: '-', limited: '-', none: '-' });
    }

    // 🏛️ Show country analysis
    showCountryAnalysis(countryName) {
        const dataset = this.datasets.find(d => d.Country === countryName);
        if (!dataset) return;

        // Show analysis section
        const analysisSection = document.getElementById('countryAnalysis');
        const noSelectionState = document.getElementById('noCountrySelected');
        
        if (analysisSection) analysisSection.style.display = 'grid';
        if (noSelectionState) noSelectionState.style.display = 'none';

        // Update country info
        const countryNameEl = document.getElementById('countryName');
        const countryRegion = document.getElementById('countryRegion');
        
        if (countryNameEl) countryNameEl.textContent = countryName;
        if (countryRegion) countryRegion.textContent = this.regionMapping[countryName] || 'Africa';

        // Calculate statistics
        const stats = this.calculateCountryStats(dataset);
        
        // Update stat cards
        const availableDatasets = document.getElementById('availableDatasets');
        const partialDatasets = document.getElementById('partialDatasets');
        const missingDatasets = document.getElementById('missingDatasets');
        
        if (availableDatasets) availableDatasets.textContent = stats.available;
        if (partialDatasets) partialDatasets.textContent = stats.limited;
        if (missingDatasets) missingDatasets.textContent = stats.missing;

        // Generate data matrix
        this.generateDataMatrix(dataset);
    }

    // 📊 Calculate country statistics
    calculateCountryStats(dataset) {
        let available = 0, limited = 0, missing = 0;
        
        Object.entries(dataset).forEach(([key, value]) => {
            if (key === 'Country') return;
            
            if (value === 'Yes') available++;
            else if (value === 'Limited' || value === 'Partial') limited++;
            else missing++;
        });

        return { available, limited, missing };
    }

    // 📋 Generate data availability matrix
    generateDataMatrix(dataset) {
        const matrixContainer = document.getElementById('dataMatrix');
        if (!matrixContainer) return;

        let matrixHTML = '<div class="matrix-grid">';
        
        Object.entries(this.fieldMappings).forEach(([category, fields]) => {
            matrixHTML += `<div class="matrix-category">
                <h5>${this.getCategoryDisplayName(category)}</h5>
                <div class="matrix-fields">`;
            
            Object.entries(fields).forEach(([fieldKey, fieldLabel]) => {
                const value = dataset[fieldKey];
                const statusClass = value === 'Yes' ? 'available' : 
                                  value === 'Limited' ? 'limited' : 'missing';
                
                matrixHTML += `
                    <div class="matrix-field ${statusClass}">
                        <span class="field-name">${fieldLabel}</span>
                        <span class="field-status">${value || 'No'}</span>
                    </div>`;
            });
            
            matrixHTML += '</div></div>';
        });
        
        matrixHTML += '</div>';
        matrixContainer.innerHTML = matrixHTML;
    }

    // 🎛️ Setup event listeners
    setupEventListeners() {
        // Country selection
        const countrySelect = document.getElementById('countrySelect');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => {
                const country = e.target.value;
                if (country) {
                    this.showCountryAnalysis(country);
                } else {
                    this.hideCountryAnalysis();
                }
            });
        }

        // Map controls
        const resetView = document.getElementById('resetView');
        const fullscreen = document.getElementById('fullscreen');
        const downloadMap = document.getElementById('downloadMap');

        if (resetView) {
            resetView.addEventListener('click', () => {
                if (this.map) {
                    const africaBounds = [[-35, -20], [40, 55]];
                    this.map.fitBounds(africaBounds);
                }
            });
        }

        if (fullscreen) {
            fullscreen.addEventListener('click', () => {
                const mapContainer = document.getElementById('map');
                if (mapContainer) {
                    if (mapContainer.requestFullscreen) {
                        mapContainer.requestFullscreen();
                    }
                }
            });
        }

        if (downloadMap) {
            downloadMap.addEventListener('click', () => {
                alert('Map download functionality would be implemented here');
            });
        }
    }

    // 🏛️ Hide country analysis
    hideCountryAnalysis() {
        const analysisSection = document.getElementById('countryAnalysis');
        const noSelectionState = document.getElementById('noCountrySelected');
        
        if (analysisSection) analysisSection.style.display = 'none';
        if (noSelectionState) noSelectionState.style.display = 'block';
    }

    // 🏷️ Helper methods for display names
    getFieldDisplayName(fieldKey) {
        for (const category of Object.values(this.fieldMappings)) {
            if (category[fieldKey]) {
                return category[fieldKey];
            }
        }
        return fieldKey;
    }

    getCategoryDisplayName(categoryKey) {
        const names = {
            mapping: 'Geological Mapping',
            geophysics: 'Geophysics',
            geochemistry: 'Geochemistry',
            engineering: 'Engineering Geology',
            economic: 'Economic Geology',
            hydrogeology: 'Hydrogeology'
        };
        return names[categoryKey] || categoryKey;
    }

    // 🚨 Show error message to user
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
            <button type="button" class="btn-close" style="float: right; background: none; border: none; font-size: 1.2rem; cursor: pointer;" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on geodata-inventory page
    if (document.getElementById('categorySelect')) {
        window.geodataInventory = new GeodataInventory();
        window.geodataInventory.init();
    }
});

// Add CSS for matrix and popup styling
const matrixStyles = document.createElement('style');
matrixStyles.textContent = `
    .matrix-grid {
        display: grid;
        gap: 1.5rem;
    }
    
    .matrix-category h5 {
        margin: 0 0 1rem 0;
        color: var(--primary-color);
        font-weight: 600;
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }
    
    .matrix-fields {
        display: grid;
        gap: 0.5rem;
    }
    
    .matrix-field {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
    }
    
    .matrix-field.available {
        background: #e8f5e8;
        border-left: 4px solid #4CAF50;
    }
    
    .matrix-field.limited {
        background: #fff3e0;
        border-left: 4px solid #FF9800;
    }
    
    .matrix-field.missing {
        background: #ffebee;
        border-left: 4px solid #F44336;
    }
    
    .field-name {
        font-weight: 500;
    }
    
    .field-status {
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
    }
    
    .map-popup {
        text-align: center;
        min-width: 200px;
    }
    
    .map-popup h5 {
        margin: 0 0 1rem 0;
        color: var(--primary-color);
    }
    
    .status-yes { color: #4CAF50; font-weight: 600; }
    .status-limited { color: #FF9800; font-weight: 600; }
    .status-no { color: #F44336; font-weight: 600; }
`;
document.head.appendChild(matrixStyles);
