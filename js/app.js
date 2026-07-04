/* ========================================
   VibeCast - Lifestyle Weather Companion
   Weather API + Dynamic Content
   ======================================== */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    GEO_API: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
    DEFAULT_CITY: 'Karachi',
};

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
    temperature: document.getElementById('temperature'),
    weatherBadge: document.getElementById('weather-badge'),
    weatherBadgeIcon: document.getElementById('weather-badge-icon'),
    weatherBadgeText: document.getElementById('weather-badge-text'),
    vibeTitle: document.getElementById('vibe-title'),
    vibeDescription: document.getElementById('vibe-description'),
    windSpeed: document.getElementById('wind-speed'),
    humidity: document.getElementById('humidity'),
    uvIndex: document.getElementById('uv-index'),
    outfitSubtitle: document.getElementById('outfit-subtitle'),
    outfitGrid: document.getElementById('outfit-grid'),
    spfTip: document.getElementById('spf-tip'),
    foodBadge: document.getElementById('food-badge'),
    foodTitle: document.getElementById('food-title'),
    foodDescription: document.getElementById('food-description'),
    foodImage: document.getElementById('food-image'),
    weekendGrid: document.getElementById('weekend-grid'),
    searchBtn: document.getElementById('search-btn'),
    locationBtn: document.getElementById('location-btn'),
    locationModal: document.getElementById('location-modal'),
    modalClose: document.getElementById('modal-close'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
};

// ============================================
// WEATHER CODES
// ============================================
const WEATHER_CODES = {
    0: { condition: 'Clear Sky', icon: 'wb_sunny', mood: 'Sunshine Day', badge: 'CLEAR SKY', bg: 'weather-gradient' },
    1: { condition: 'Mainly Clear', icon: 'wb_sunny', mood: 'Perfect Day', badge: 'MAINLY CLEAR', bg: 'weather-gradient' },
    2: { condition: 'Partly Cloudy', icon: 'partly_cloudy_day', mood: 'Picnic Perfect', badge: 'PARTLY SUNNY', bg: 'weather-gradient' },
    3: { condition: 'Overcast', icon: 'cloud', mood: 'Cozy Vibes', badge: 'OVERCAST', bg: 'weather-gradient' },
    45: { condition: 'Foggy', icon: 'foggy', mood: 'Mysterious Morning', badge: 'FOGGY', bg: 'weather-gradient' },
    48: { condition: 'Rime Fog', icon: 'foggy', mood: 'Mysterious Vibes', badge: 'FOGGY', bg: 'weather-gradient' },
    51: { condition: 'Light Drizzle', icon: 'rainy_light', mood: 'Gentle Rain', badge: 'LIGHT DRIZZLE', bg: 'weather-gradient-rain' },
    53: { condition: 'Moderate Drizzle', icon: 'rainy', mood: 'Drizzle Day', badge: 'DRIZZLE', bg: 'weather-gradient-rain' },
    55: { condition: 'Dense Drizzle', icon: 'rainy_heavy', mood: 'Stay Cozy', badge: 'HEAVY DRIZZLE', bg: 'weather-gradient-rain' },
    61: { condition: 'Slight Rain', icon: 'rainy_light', mood: 'Rainy Day', badge: 'LIGHT RAIN', bg: 'weather-gradient-rain' },
    63: { condition: 'Moderate Rain', icon: 'rainy', mood: 'Pakora Weather', badge: 'RAIN', bg: 'weather-gradient-rain' },
    65: { condition: 'Heavy Rain', icon: 'rainy_heavy', mood: 'Stay Inside', badge: 'HEAVY RAIN', bg: 'weather-gradient-rain' },
    71: { condition: 'Slight Snow', icon: 'weather_snowy', mood: 'Winter Wonderland', badge: 'LIGHT SNOW', bg: 'weather-gradient-snow' },
    73: { condition: 'Moderate Snow', icon: 'weather_snowy', mood: 'Snow Day!', badge: 'SNOW', bg: 'weather-gradient-snow' },
    75: { condition: 'Heavy Snow', icon: 'weather_snowy', mood: 'Bundle Up!', badge: 'HEAVY SNOW', bg: 'weather-gradient-snow' },
    80: { condition: 'Light Showers', icon: 'rainy_light', mood: 'Shower Time', badge: 'SHOWERS', bg: 'weather-gradient-rain' },
    81: { condition: 'Moderate Showers', icon: 'rainy', mood: 'Carry Umbrella', badge: 'SHOWERS', bg: 'weather-gradient-rain' },
    82: { condition: 'Violent Showers', icon: 'rainy_heavy', mood: 'Stay Dry!', badge: 'STORM', bg: 'weather-gradient-rain' },
    95: { condition: 'Thunderstorm', icon: 'thunderstorm', mood: 'Thunder & Lightning', badge: 'THUNDERSTORM', bg: 'weather-gradient-rain' },
    96: { condition: 'Thunderstorm with Hail', icon: 'thunderstorm', mood: 'Stay Safe!', badge: 'SEVERE STORM', bg: 'weather-gradient-rain' },
};

// ============================================
// OUTFIT DATA (Weather-Based)
// ============================================
const OUTFIT_DATA = {
    hot: [
        { name: 'Linen Shirt', desc: 'Keep it light and breezy in the midday sun.', tag: 'Breathable', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop' },
        { name: 'Oversized Sunglasses', desc: 'Protect your eyes with a touch of elegance.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop' },
        { name: 'Breathable Chinos', desc: 'Versatile comfort for city strolls or park sits.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=300&fit=crop' },
    ],
    warm: [
        { name: 'Cotton Polo', desc: 'Classic style for a warm afternoon.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1625910513413-5fc428e4d14d?w=400&h=300&fit=crop' },
        { name: 'Canvas Sneakers', desc: 'Walk comfortable all day long.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop' },
        { name: 'Baseball Cap', desc: 'Stay shaded and stylish.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=300&fit=crop' },
    ],
    cool: [
        { name: 'Light Jacket', desc: 'Perfect layer for cooler evenings.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop' },
        { name: 'Denim Jeans', desc: 'Classic comfort for any occasion.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop' },
        { name: 'Ankle Boots', desc: 'Step out in style.', tag: 'Style', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' },
    ],
    cold: [
        { name: 'Wool Sweater', desc: 'Stay warm without sacrificing style.', tag: 'Warm', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a00?w=400&h=300&fit=crop' },
        { name: 'Puffer Jacket', desc: 'Maximum warmth for cold days.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1544923246-77307dd270c8?w=400&h=300&fit=crop' },
        { name: 'Knit Scarf', desc: 'Keep your neck warm and cozy.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop' },
    ],
    rainy: [
        { name: 'Rain Jacket', desc: 'Stay dry in style.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=300&fit=crop' },
        { name: 'Waterproof Boots', desc: 'Walk through puddles worry-free.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=300&fit=crop' },
        { name: 'Compact Umbrella', desc: 'Never leave home without it.', tag: 'Must Have', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop' },
    ],
};

// ============================================
// FOOD DATA (Weather-Based)
// ============================================
const FOOD_DATA = {
    hot: {
        badge: 'HOT DAY PICK',
        title: 'Mango Gelato & Iced Matcha',
        desc: 'There is no better pairing for a hot day than the tropical sweetness of mango balanced by the earthy, cool notes of iced matcha. Light, refreshing, and photogenic.',
        img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=450&fit=crop',
    },
    warm: {
        badge: 'WARM DAY PICK',
        title: 'Acai Bowl & Fresh Juice',
        desc: 'Start your day right with a refreshing acai bowl topped with fresh fruits and granola. Pair it with a cold-pressed juice for the ultimate wellness combo.',
        img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=450&fit=crop',
    },
    cool: {
        badge: 'COOL DAY PICK',
        title: 'Hot Chai Latte & Pastry',
        desc: 'Warm up with a perfectly spiced chai latte paired with a freshly baked croissant. The ideal comfort combo for a breezy afternoon.',
        img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=450&fit=crop',
    },
    cold: {
        badge: 'COLD DAY PICK',
        title: 'Tomato Soup & Grilled Cheese',
        desc: 'The ultimate comfort food pairing. Rich, creamy tomato soup with a crispy, cheesy grilled sandwich. Warmth in every bite.',
        img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=450&fit=crop',
    },
    rainy: {
        badge: 'RAINY DAY PICK',
        title: 'Pakoras & Hot Chai',
        desc: 'Crispy, golden pakoras with a steaming cup of masala chai. The perfect combination to watch the rain from your window.',
        img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=450&fit=crop',
    },
};

// ============================================
// WEEKEND ACTIVITIES (Weather-Based)
// ============================================
const WEEKEND_ACTIVITIES = {
    clear: ['Rooftop Drinks', 'Beach Trip', 'Hiking Adventure'],
    cloudy: ['Museum Visit', 'Shopping Mall', 'Art Gallery'],
    rainy: ['Indoor Museum', 'Coffee Shop', 'Movie Night'],
    cold: ['Ski Trip', 'Hot Springs', 'Cozy Cafe'],
    stormy: ['Indoor Gaming', 'Book Store', 'Spa Day'],
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getTemperatureCategory(tempC) {
    if (tempC >= 30) return 'hot';
    if (tempC >= 22) return 'warm';
    if (tempC >= 15) return 'cool';
    return 'cold';
}

function getWeatherCategory(code) {
    if ([0, 1].includes(code)) return 'clear';
    if ([2, 3, 45, 48].includes(code)) return 'cloudy';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rainy';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'cold';
    if ([95, 96, 99].includes(code)) return 'stormy';
    return 'clear';
}

function getUVLabel(uv) {
    if (uv <= 2) return 'Low (' + Math.round(uv) + ')';
    if (uv <= 5) return 'Moderate (' + Math.round(uv) + ')';
    if (uv <= 7) return 'High (' + Math.round(uv) + ')';
    return 'Very High (' + Math.round(uv) + ')';
}

function formatDay(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function getWeatherIcon(code) {
    const info = WEATHER_CODES[code];
    return info ? info.icon : 'cloud';
}

function getWeatherCondition(code) {
    const info = WEATHER_CODES[code];
    return info ? info.condition : 'Unknown';
}

// ============================================
// API FUNCTIONS
// ============================================

async function searchCity(query) {
    const url = `${CONFIG.GEO_API}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results;
        }
        return [];
    } catch (error) {
        console.error('Geocoding error:', error);
        return [];
    }
}

async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max',
        timezone: 'auto',
        forecast_days: 7,
    });
    const url = `${CONFIG.WEATHER_API}?${params.toString()}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateHero(data, cityName) {
    const current = data.current;
    const weatherInfo = WEATHER_CODES[current.weather_code] || WEATHER_CODES[0];
    const tempC = current.temperature_2m;
    const tempF = Math.round((tempC * 9/5) + 32);
    const tempCategory = getTemperatureCategory(tempC);
    const isNight = current.is_day === 0;

    // Temperature
    DOM.temperature.textContent = `${tempF}°F`;

    // Weather badge
    DOM.weatherBadgeIcon.textContent = isNight ? 'night_clear' : weatherInfo.icon;
    DOM.weatherBadgeText.textContent = isNight ? 'CLEAR NIGHT' : weatherInfo.badge;

    // Vibe title and description
    const vibes = {
        hot: { title: "Today's Vibe: Beach Day Paradise", desc: "The sun is blazing and the vibes are immaculate. Perfect for outdoor adventures and staying cool." },
        warm: { title: "Today's Vibe: Golden Hour Magic", desc: "Warm breezes and sunshine create the perfect atmosphere for a memorable day out." },
        cool: { title: "Today's Vibe: Cozy Afternoon", desc: "The crisp air invites you to layer up and enjoy a comfortable, refreshing day." },
        cold: { title: "Today's Vibe: Winter Wonderland", desc: "Bundle up and embrace the cold. Hot drinks and warm moments await." },
    };

    const weatherVibes = {
        rainy: { title: "Today's Vibe: Rainy Day Retreat", desc: "The pitter-patter of rain creates the perfect excuse to slow down and relax." },
        stormy: { title: "Today's Vibe: Storm Watch", desc: "Nature's power on full display. Stay safe and enjoy the drama from indoors." },
    };

    let vibe = vibes[tempCategory] || vibes.warm;
    const weatherCat = getWeatherCategory(current.weather_code);
    if (weatherVibes[weatherCat]) {
        vibe = weatherVibes[weatherCat];
    }

    DOM.vibeTitle.textContent = vibe.title;
    DOM.vibeDescription.textContent = vibe.desc;

    // Stats
    DOM.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} mph`;
    DOM.humidity.textContent = `${current.relative_humidity_2m}%`;
    DOM.uvIndex.textContent = data.daily && data.daily.uv_index_max ? getUVLabel(data.daily.uv_index_max[0]) : '--';
}

function updateOutfit(data) {
    const current = data.current;
    const tempCategory = getTemperatureCategory(current.temperature_2m);
    const weatherCat = getWeatherCategory(current.weather_code);

    let outfitKey = tempCategory;
    if (weatherCat === 'rainy') outfitKey = 'rainy';

    const outfits = OUTFIT_DATA[outfitKey] || OUTFIT_DATA.warm;
    const tempF = Math.round((current.temperature_2m * 9/5) + 32);

    DOM.outfitSubtitle.textContent = `Curated essentials for a ${tempF}°F afternoon.`;

    // SPF tip
    const uv = data.daily && data.daily.uv_index_max ? data.daily.uv_index_max[0] : 0;
    if (uv > 5) {
        DOM.spfTip.textContent = 'SPF 50 is your best friend today!';
    } else if (uv > 2) {
        DOM.spfTip.textContent = 'SPF 30 recommended for today.';
    } else {
        DOM.spfTip.textContent = 'Low UV - enjoy the outdoors!';
    }

    // Render outfit cards
    DOM.outfitGrid.innerHTML = outfits.map(item => `
        <div class="outfit-card glass-card rounded-2xl overflow-hidden soft-shadow">
            <div class="h-56 overflow-hidden relative">
                <img class="outfit-img w-full h-full object-cover" src="${item.img}" alt="${item.name}"/>
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span class="text-xs font-semibold text-primary">${item.tag}</span>
                </div>
            </div>
            <div class="p-5 space-y-3">
                <h3 class="font-display font-semibold text-lg text-on-surface">${item.name}</h3>
                <p class="text-sm text-on-surface-variant leading-relaxed">${item.desc}</p>
                <button class="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">Shop the Look</button>
            </div>
        </div>
    `).join('');
}

function updateFood(data) {
    const current = data.current;
    const tempCategory = getTemperatureCategory(current.temperature_2m);
    const weatherCat = getWeatherCategory(current.weather_code);

    let foodKey = tempCategory;
    if (weatherCat === 'rainy') foodKey = 'rainy';

    const food = FOOD_DATA[foodKey] || FOOD_DATA.warm;

    DOM.foodBadge.textContent = food.badge;
    DOM.foodTitle.textContent = food.title;
    DOM.foodDescription.textContent = food.desc;
    DOM.foodImage.src = food.img;
}

function updateWeekend(data) {
    const daily = data.daily;
    if (!daily) return;

    const days = ['Friday', 'Saturday', 'Sunday'];
    const activities = WEEKEND_ACTIVITIES.clear;

    let html = '';
    for (let i = 0; i < 3 && i < daily.time.length; i++) {
        const code = daily.weather_code[i];
        const maxTemp = Math.round((daily.temperature_2m_max[i] * 9/5) + 32);
        const icon = getWeatherIcon(code);
        const condition = getWeatherCondition(code);
        const activity = activities[i % activities.length];
        const isBest = i === 1;

        html += `
            <div class="relative ${isBest ? 'weekend-best' : ''}">
                <div class="glass-card p-6 rounded-2xl soft-shadow text-center space-y-4 ${isBest ? 'border-2 border-primary/20' : ''}">
                    ${isBest ? '<div class="absolute top-4 right-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Best Vibe</div>' : ''}
                    <p class="text-xs font-bold text-outline uppercase tracking-widest">${formatDay(daily.time[i])}</p>
                    <div class="flex flex-col items-center space-y-2">
                        <span class="material-symbols-outlined text-[56px] ${isBest ? 'text-primary' : 'text-primary/60'}" style="font-variation-settings: 'FILL' 1;">${icon}</span>
                        <p class="font-display font-bold text-3xl text-on-surface">${maxTemp}°</p>
                        <p class="text-sm text-on-surface-variant">${condition}</p>
                    </div>
                    <div class="pt-4 border-t border-outline-variant/30">
                        <p class="text-sm font-semibold ${isBest ? 'text-primary' : 'text-on-surface'}">${activity}</p>
                    </div>
                </div>
            </div>
        `;
    }

    DOM.weekendGrid.innerHTML = html;
}

// ============================================
// MAIN WEATHER DISPLAY FUNCTION
// ============================================

async function displayWeather(lat, lon, cityName) {
    const data = await fetchWeather(lat, lon);
    if (!data || data.error) {
        DOM.vibeTitle.textContent = 'Unable to load weather data';
        DOM.vibeDescription.textContent = 'Please try again later.';
        return;
    }

    updateHero(data, cityName);
    updateOutfit(data);
    updateFood(data);
    updateWeekend(data);
}

// ============================================
// SEARCH MODAL
// ============================================

function openModal() {
    DOM.locationModal.classList.add('active');
    DOM.searchInput.focus();
}

function closeModal() {
    DOM.locationModal.classList.remove('active');
    DOM.searchInput.value = '';
    DOM.searchResults.innerHTML = '';
}

DOM.searchBtn.addEventListener('click', openModal);
DOM.modalClose.addEventListener('click', closeModal);
DOM.locationModal.addEventListener('click', (e) => {
    if (e.target === DOM.locationModal) closeModal();
});

// Search input with debounce
let searchTimeout;
DOM.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    if (query.length < 2) {
        DOM.searchResults.innerHTML = '';
        return;
    }

    searchTimeout = setTimeout(async () => {
        const cities = await searchCity(query);
        if (cities.length > 0) {
            DOM.searchResults.innerHTML = cities.map(city => `
                <div class="search-result-item" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}, ${city.country || ''}">
                    <p class="font-body-md text-body-md font-medium">${city.name}</p>
                    <p class="font-label-sm text-label-sm text-outline">${city.admin1 || ''}, ${city.country || ''}</p>
                </div>
            `).join('');

            // Add click handlers
            DOM.searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const lat = parseFloat(item.dataset.lat);
                    const lon = parseFloat(item.dataset.lon);
                    const name = item.dataset.name;
                    displayWeather(lat, lon, name);
                    closeModal();
                });
            });
        } else {
            DOM.searchResults.innerHTML = '<p class="font-body-md text-body-md text-outline">No cities found</p>';
        }
    }, 400);
});

// Search on Enter
DOM.searchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query.length < 2) return;
        const cities = await searchCity(query);
        if (cities.length > 0) {
            const city = cities[0];
            displayWeather(city.latitude, city.longitude, `${city.name}, ${city.country || ''}`);
            closeModal();
        }
    }
});

// ============================================
// CURRENT LOCATION BUTTON
// ============================================

DOM.locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    DOM.vibeTitle.textContent = 'Detecting your location...';
    DOM.vibeDescription.textContent = 'Please allow location access.';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await displayWeather(latitude, longitude, 'Your Location');
        },
        (error) => {
            let msg = 'Unable to get your location.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    msg = 'Location permission denied. Please enable location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    msg = 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    msg = 'Location request timed out.';
                    break;
            }
            DOM.vibeTitle.textContent = 'Location Error';
            DOM.vibeDescription.textContent = msg;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
});

// ============================================
// INITIALIZATION
// ============================================

function init() {
    searchCity(CONFIG.DEFAULT_CITY).then(cities => {
        if (cities.length > 0) {
            const city = cities[0];
            displayWeather(city.latitude, city.longitude, `${city.name}, ${city.country || ''}`);
        }
    });
}

init();
