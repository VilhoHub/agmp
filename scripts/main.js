document.addEventListener('DOMContentLoaded', function () {
    // Smooth Scroll for Section Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });


    // Language Dropdown Fix
    const dropdownToggle = document.getElementById('languageDropdown');
    const dropdownMenu = dropdownToggle.nextElementSibling;

    dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function (e) {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Leaflet Map
    var map = L.map('map', {
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false
    }).setView([0, 20], 3);

    // Add Custom Tile Layer (Better Styling)
    L.tileLayer('https://tiles.wmflabs.org/humanitarian/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 5,
        minZoom: 3
    }).addTo(map);

    // Define Africa's Bounds
    var africaBounds = [[-35.5, -17.5], [37.5, 51.5]];
    map.setMaxBounds(africaBounds);

    // **Dataset Field Mapping (Restored from Old Code)**
    const fieldMappings = {
        "25_50K": "Geological Map Scales (25-50K)",
        "1mio": "Geological Map Scales (1 mio)",
        "Engineerin": "Engineering Geology in Mapping",
        "Geohazard_": "Engineering Geology (Geohazard)",
        "Soil_GEOCH": "Geochemistry (Soil)",
        "Gravity_GE": "Geophyics (Gravity)",
        "MINERAL RE": "Mineral Resources",
        "HYDROGEOLO": "Hydrogeology",
        "Energy_GEO": "Geothermal (Energy)",
        "Medical Ge": "Medical Geology",
    };

    let geojsonLayer;

    fetch('data/africa_regions.geojson')
        .then(response => response.json())
        .then(data => {
            geojsonLayer = L.geoJSON(data, {
                style: feature => ({
                    fillColor: "white",
                    weight: 1,
                    color: 'black',
                    fillOpacity: 0.5
                }),
                onEachFeature: (feature, layer) => {
                    layer.on({
                        click: function (e) {
                            map.fitBounds(e.target.getBounds());
                        }
                    });
                }
            }).addTo(map);
        });

    // **Map Legend**
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<div class="legend-item"><span class="legend-box available"></span> Available Data</div>';
        return div;
    };
    legend.addTo(map);

    // **Sidebar Content & Category Interaction**
    const sidebar = document.querySelector(".sidebar-content");
    Object.keys(fieldMappings).forEach(category => {
        let categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category");
        categoryDiv.innerText = fieldMappings[category];

        // **Hover Effect to Highlight Map Regions**
        categoryDiv.addEventListener("mouseover", function () {
            geojsonLayer.eachLayer(layer => {
                if (layer.feature.properties[category] === "Yes") {
                    layer.setStyle({ fillColor: "#2e7d32", fillOpacity: 0.8 });
                }
            });
        });

        categoryDiv.addEventListener("mouseout", function () {
            geojsonLayer.eachLayer(layer => {
                layer.setStyle({ fillColor: "white", fillOpacity: 0.5 });
            });
        });

        sidebar.appendChild(categoryDiv);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Handle Contact Form Submission
    document.getElementById('contact-form').addEventListener('submit', function (e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            alert(`Thank you, ${name}! Your message has been received.`);
            this.reset();
        } else {
            alert("Please fill out all fields.");
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    async function loadPlatforms() {
        try {
            const response = await fetch('data/platforms.json'); // ✅ Correct path
            const platforms = await response.json();
            displayPlatforms(platforms);
        } catch (error) {
            console.error("🚨 Error loading platform data:", error);
        }
    }

    function displayPlatforms(platforms) {
        const container = document.getElementById("platforms-grid");
        container.innerHTML = ""; 

        platforms.forEach(platform => {
            // Extract correct fields from JSON
            const name = platform["Topic/Website"];
            const description = platform["What is on the Website"];
            const url = platform["Available Link "]?.trim(); // Ensure valid URL
            const logoSrc = platform["Logos"] ? platform["Logos"].replace("assests", "assets") : "images/default-logo.png"; // Fix incorrect folder name

            // Create platform card
            const platformItem = document.createElement("div");
            platformItem.classList.add("platform-item");
            platformItem.innerHTML = `
                <img src="${logoSrc}" alt="${name}" class="platform-logo">
                <h4>${name}</h4>
                <p>${description}</p>
                <a href="${url}" target="_blank" class="btn btn-primary">Visit Platform</a>
            `;

            container.appendChild(platformItem);
        });
    }

    loadPlatforms();
});

document.addEventListener("DOMContentLoaded", function () {
    async function loadProjects() {
        try {
            const response = await fetch('data/projects.json'); // ✅ Load project JSON
            const projects = await response.json();
            displayProjects(projects);
        } catch (error) {
            console.error("🚨 Error loading projects:", error);
        }
    }

    function displayProjects(projects) {
        const container = document.getElementById("project-grid");
        container.innerHTML = ""; 

        projects.forEach(project => {
            const projectItem = document.createElement("article");
            projectItem.classList.add("project-card");

            projectItem.innerHTML = `
                <h3>${project["Initiative/Item Name"]}</h3>
                <p class="dates"><strong>Start:</strong> ${project["Start Date"]} | <strong>End:</strong> ${project["End Date"]}</p>
                <p class="description">${project["Abstract"] || "No description available."}</p>
                <div class="footer">
                    <div class="details">
                        <p><strong>Status:</strong> ${project["Status"]}</p>
                        <p><strong>Category:</strong> ${project["Thematic Area (Geoscientific)"]}</p>
                    </div>
                    ${project["Website/Link"] ? `<a href="${project["Website/Link"]}" target="_blank" class="view-project-button">View Project</a>` : ""}
                </div>
            `;

            container.appendChild(projectItem);
        });
    }

    loadProjects();
});

