// 🗺️ Map Manager Module - Professional Mapping System
// Handles all map-related functionality for the AGMP platform

const MapManager = {
    map: null,
    currentLayer: null,
    markers: [],

    // 🎯 Initialize map system
    init() {
        this.setupMap();
        this.setupMapControls();
        this.loadMapData();
        this.setupMapInteractions();
    },

    // 🌍 Setup main Leaflet map
    setupMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        this.map = L.map('map', {
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false
        }).setView([0, 20], 3);

        // Add monochrome tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 5,
            minZoom: 3,
            className: 'map-monochrome'
        }).addTo(this.map);

        // Set Africa bounds
        const africaBounds = [[-35.5, -17.5], [37.5, 51.5]];
        this.map.setMaxBounds(africaBounds);
    },

    // 🎮 Setup map controls
    setupMapControls() {
        if (!this.map) return;

        // Add custom zoom controls
        const zoomControl = L.control.zoom({
            position: 'topright'
        });
        this.map.addControl(zoomControl);
    },

    // 📊 Load and display map data
    async loadMapData() {
        if (!this.map) return;

        try {
            // Load Africa GeoJSON data
            const response = await fetch('data/africa_countries.geojson');
            const geoData = await response.json();

            // Add countries layer with styling
            this.currentLayer = L.geoJSON(geoData, {
                style: this.getCountryStyle,
                onEachFeature: this.onEachCountry.bind(this)
            }).addTo(this.map);

        } catch (error) {
            console.warn('Could not load map data:', error);
            this.addFallbackMarkers();
        }
    },

    // 🎨 Country styling function - Monochrome
    getCountryStyle(feature) {
        return {
            fillColor: '#888888',
            weight: 1,
            opacity: 0.8,
            color: '#555555',
            dashArray: '',
            fillOpacity: 0.4
        };
    },

    // 🖱️ Country interaction handlers - No country names displayed
    onEachCountry(feature, layer) {
        const countryName = feature.properties.NAME || feature.properties.name || 'Unknown';
        
        // Popup content without country name
        const popupContent = `
            <div class="map-popup">
                <h5 class="gradient-text">African Region</h5>
                <p>Click to explore geoscience data for this region</p>
                <button class="btn btn-primary btn-sm" onclick="MapManager.exploreCountry('${countryName}')">
                    Explore Data
                </button>
            </div>
        `;

        layer.bindPopup(popupContent);

        // Hover effects
        layer.on({
            mouseover: this.highlightCountry,
            mouseout: this.resetHighlight.bind(this),
            click: () => this.exploreCountry(countryName)
        });
    },

    // ✨ Country highlight effects - Monochrome
    highlightCountry(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 2,
            color: '#333333',
            dashArray: '',
            fillOpacity: 0.7
        });
        layer.bringToFront();
    },

    resetHighlight(e) {
        if (this.currentLayer) {
            this.currentLayer.resetStyle(e.target);
        }
    },

    // 🔍 Country exploration handler
    exploreCountry(countryName) {
        console.log(`Exploring data for: ${countryName}`);
        
        // Create impressive modal or redirect
        const modal = document.createElement('div');
        modal.className = 'country-modal';
        modal.innerHTML = `
            <div class="modal-content modern-card">
                <h3 class="gradient-text">${countryName} Geoscience Data</h3>
                <p>Comprehensive geoscience metadata available for ${countryName}</p>
                <div class="data-preview">
                    <div class="stat-item-small">
                        <h4>25+</h4>
                        <p>Datasets</p>
                    </div>
                    <div class="stat-item-small">
                        <h4>5</h4>
                        <p>Projects</p>
                    </div>
                    <div class="stat-item-small">
                        <h4>3</h4>
                        <p>Platforms</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        View Full Data
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);
    },


    // 🎯 Add fallback markers if GeoJSON fails
    addFallbackMarkers() {
        if (!this.map) return;

        const majorCities = [
            { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
            { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
            { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, country: 'South Africa' },
            { name: 'Nairobi', lat: -1.2921, lng: 36.8219, country: 'Kenya' },
            { name: 'Casablanca', lat: 33.5731, lng: -7.5898, country: 'Morocco' }
        ];

        majorCities.forEach(city => {
            const marker = L.marker([city.lat, city.lng])
                .addTo(this.map)
                .bindPopup(`
                    <div class="map-popup">
                        <h5 class="gradient-text">${city.name}, ${city.country}</h5>
                        <p>Major geoscience data hub</p>
                    </div>
                `);
            
            this.markers.push(marker);
        });
    },

    // 🔄 Update map data
    updateMapData(newData) {
        if (this.currentLayer) {
            this.map.removeLayer(this.currentLayer);
        }
        
        this.currentLayer = L.geoJSON(newData, {
            style: this.getCountryStyle,
            onEachFeature: this.onEachCountry.bind(this)
        }).addTo(this.map);
    },

    // 🎯 Focus on specific region
    focusRegion(bounds) {
        if (this.map && bounds) {
            this.map.fitBounds(bounds, { padding: [20, 20] });
        }
    }
};

// Add required CSS for map popups and monochrome effect
const mapStyles = document.createElement('style');
mapStyles.textContent = `
    /* Monochrome map tiles */
    .map-monochrome {
        filter: grayscale(100%) contrast(120%) brightness(110%);
    }
    
    .map-popup {
        text-align: center;
        min-width: 200px;
    }
    
    .map-popup h5 {
        margin-bottom: 0.5rem;
    }
    
    .country-modal .modal-content {
        max-width: 500px;
        padding: 2rem;
        text-align: center;
    }
    
    .data-preview {
        display: flex;
        justify-content: space-around;
        margin: 1.5rem 0;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(mapStyles);

// Export for use in other modules
window.MapManager = MapManager;
