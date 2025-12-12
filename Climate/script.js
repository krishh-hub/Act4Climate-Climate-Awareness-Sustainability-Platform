// =============================================
// ECOVISION PRO - COMPLETE APPLICATION SCRIPT
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initDashboard();
    initFootprintCalculator();
    initAISolutions();
    initDisasterTracker();
    initCommunity();
    updateCurrentDate();
});

// =====================
// CORE FUNCTIONALITY
// =====================

function initTabNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Show selected tab
    document.querySelector(`.${tabName}-tab`).style.display = 'block';
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item[data-tab="${tabName}"]`).classList.add('active');
}

function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', options);
}

// =====================
// DASHBOARD TAB
// =====================

function initDashboard() {
    // Map layer switching
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const layer = this.getAttribute('data-layer');
            updateMapLayer(layer);
        });
    });

    // Refresh button
    document.querySelector('.refresh-btn').addEventListener('click', refreshDashboard);
}

function updateMapLayer(layer) {
    console.log(`Switched to ${layer} map layer`);
    // In a real app, you'd fetch new map data here
}

function refreshDashboard() {
    const btn = document.querySelector('.refresh-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing';
    
    // Simulate API call
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
        animateValue(document.getElementById('co2-level'), 419, 421, 1000);
    }, 1500);
}

// =====================
// FOOTPRINT CALCULATOR
// =====================

function initFootprintCalculator() {
    document.getElementById('footprintForm').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateFootprint();
    });
}

function calculateFootprint() {
    // Get inputs
    const inputs = {
        electricity: parseFloat(document.getElementById('electricity').value) || 0,
        carTravel: parseFloat(document.getElementById('carTravel').value) || 0,
        meatMeals: parseFloat(document.getElementById('meatMeals').value) || 0,
        flights: parseFloat(document.getElementById('flights').value) || 0
    };

    // Emission factors (kg CO₂)
    const factors = {
        electricity: 0.5,   // per kWh
        carTravel: 0.2,     // per km
        meatMeals: 3.0,     // per meal
        flights: 0.25       // per flight hour
    };

    // Calculate
    const results = {
        electricity: inputs.electricity * factors.electricity,
        transport: inputs.carTravel * factors.carTravel,
        diet: inputs.meatMeals * factors.meatMeals,
        flights: inputs.flights * factors.flights
    };
    results.total = Object.values(results).reduce((sum, val) => sum + val, 0);

    // Display results
    updateFootprintResults(results);
}

function updateFootprintResults(data) {
    // Update metrics
    document.getElementById('electricityEmissions').textContent = `${data.electricity.toFixed(1)} kg`;
    document.getElementById('transportEmissions').textContent = `${data.transport.toFixed(1)} kg`;
    document.getElementById('dietEmissions').textContent = `${data.diet.toFixed(1)} kg`;
    document.getElementById('flightEmissions').textContent = `${data.flights.toFixed(1)} kg`;
    document.getElementById('totalCO2').textContent = `${data.total.toFixed(1)} kg CO₂`;
    
    // Set rating
    const rating = document.getElementById('footprintRating');
    if (data.total < 200) {
        rating.textContent = "LOW";
        rating.style.background = "#27ae60";
    } else if (data.total < 500) {
        rating.textContent = "MODERATE";
        rating.style.background = "#f39c12";
    } else {
        rating.textContent = "HIGH";
        rating.style.background = "#e74c3c";
    }
    
    // Animate comparison
    const yourPercentage = Math.min((data.total / 700) * 100, 100);
    document.querySelector('.chart-bar.yours').style.width = `${yourPercentage}%`;
    
    // Show results
    document.getElementById('footprintResults').style.display = 'block';
}

// =====================
// AI SOLUTIONS TAB
// =====================

function initAISolutions() {
    document.querySelectorAll('.solution-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const solution = this.closest('.solution-card').querySelector('h3').textContent;
            alert(`Launching: ${solution}`);
        });
    });
}

// =====================
// DISASTER TRACKER
// =====================

function initDisasterTracker() {
    // Filter disasters
    document.getElementById('disaster-filter').addEventListener('change', function() {
        const filter = this.value;
        filterDisasters(filter);
    });

    // Disaster tooltips
    document.querySelectorAll('.marker').forEach(marker => {
        marker.addEventListener('click', function() {
            const event = this.getAttribute('data-event');
            alert(`Showing details for: ${event}`);
        });
    });
}

function filterDisasters(filter) {
    console.log(`Filtering disasters by: ${filter}`);
    // Real app would filter the displayed disasters
}

// =====================
// COMMUNITY TAB
// =====================

function initCommunity() {
    // Feed filter
    document.querySelectorAll('.feed-filter button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.feed-filter button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterFeed(this.textContent);
        });
    });

    // Post interactions
    document.querySelectorAll('.post-actions button').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('i').className.split(' ')[1];
            handlePostAction(this.closest('.post'), action);
        });
    });
}

function filterFeed(filter) {
    console.log(`Showing ${filter} posts`);
}

function handlePostAction(post, action) {
    console.log(`${action} on post`);
    // Real app would update likes/comments via API
}

// =====================
// UTILITIES
// =====================

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// Initialize tab navigation
initTabNavigation();