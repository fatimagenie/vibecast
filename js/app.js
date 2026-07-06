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
    DEFAULT_CITY: 'Peshawar',
};

// ============================================
// STATE
// ============================================
let currentWeatherData = null;

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
    temperature: document.getElementById('temperature'),
    heroWeatherIcon: document.getElementById('hero-weather-icon'),
    weatherCondition: document.getElementById('weather-condition'),
    feelsLike: document.getElementById('feels-like'),
    vibeDescription: document.getElementById('vibe-description'),
    cityName: document.getElementById('city-name'),
    windSpeed: document.getElementById('wind-speed'),
    humidity: document.getElementById('humidity'),
    sunriseTime: document.getElementById('sunrise-time'),
    sunsetTime: document.getElementById('sunset-time'),
    hourlyScroll: document.getElementById('hourly-scroll'),
    tipsContainer: document.getElementById('tips-container'),
    outfitBadge: document.getElementById('outfit-badge'),
    outfitTitle: document.getElementById('outfit-title'),
    outfitList: document.getElementById('outfit-list'),
    foodBadge: document.getElementById('food-badge'),
    foodTitle: document.getElementById('food-title'),
    foodList: document.getElementById('food-list'),
    searchBtn: document.getElementById('search-btn'),
    locationBtn: document.getElementById('location-btn'),
    locationModal: document.getElementById('location-modal'),
    modalClose: document.getElementById('modal-close'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    heroSearchInput: document.getElementById('hero-search-input'),
};

// ============================================
// WEATHER CODES
// ============================================
const WEATHER_CODES = {
    0: { condition: 'Clear Sky', icon: 'wb_sunny', mood: 'Sunshine Day' },
    1: { condition: 'Mainly Clear', icon: 'wb_sunny', mood: 'Perfect Day' },
    2: { condition: 'Partly Cloudy', icon: 'partly_cloudy_day', mood: 'Picnic Perfect' },
    3: { condition: 'Overcast', icon: 'cloud', mood: 'Cozy Vibes' },
    45: { condition: 'Foggy', icon: 'foggy', mood: 'Mysterious Morning' },
    48: { condition: 'Rime Fog', icon: 'foggy', mood: 'Mysterious Vibes' },
    51: { condition: 'Light Drizzle', icon: 'rainy_light', mood: 'Gentle Rain' },
    53: { condition: 'Moderate Drizzle', icon: 'rainy', mood: 'Drizzle Day' },
    55: { condition: 'Dense Drizzle', icon: 'rainy_heavy', mood: 'Stay Cozy' },
    61: { condition: 'Slight Rain', icon: 'rainy_light', mood: 'Rainy Day' },
    63: { condition: 'Moderate Rain', icon: 'rainy', mood: 'Pakora Weather' },
    65: { condition: 'Heavy Rain', icon: 'rainy_heavy', mood: 'Stay Inside' },
    71: { condition: 'Slight Snow', icon: 'weather_snowy', mood: 'Winter Wonderland' },
    73: { condition: 'Moderate Snow', icon: 'weather_snowy', mood: 'Snow Day!' },
    75: { condition: 'Heavy Snow', icon: 'weather_snowy', mood: 'Bundle Up!' },
    80: { condition: 'Light Showers', icon: 'rainy_light', mood: 'Shower Time' },
    81: { condition: 'Moderate Showers', icon: 'rainy', mood: 'Carry Umbrella' },
    82: { condition: 'Violent Showers', icon: 'rainy_heavy', mood: 'Stay Dry!' },
    95: { condition: 'Thunderstorm', icon: 'thunderstorm', mood: 'Thunder & Lightning' },
    96: { condition: 'Thunderstorm with Hail', icon: 'thunderstorm', mood: 'Stay Safe!' },
};

// ============================================
// LIFESTYLE DATABASE
// ============================================
const lifestyleDatabase = {
    hot: {
        description: "The warm weather in your area makes for a perfect afternoon. A great day to enjoy outdoor activities or visit a cafe.",
        outfit: {
            badge: "Sunny Day",
            title: "Very Hot - Light Clothes",
            items: [
                "Cotton breathable fabric",
                "Light colors preferred",
                "Sunglasses & hat",
                "Comfortable sandals"
            ]
        },
        food: {
            badge: "Stay Healthy",
            title: "Fresh & Hydrating",
            items: [
                "Fresh fruit juice",
                "Light salad meals",
                "Stay hydrated",
                "Avoid heavy food"
            ]
        },
        tips: [
            { icon: "thermostat", text: "Stay hydrated - drink at least 8 glasses of water today", color: "text-orange-400" },
            { icon: "wb_sunny", text: "Apply SPF 50+ sunscreen before going outside", color: "text-yellow-400" },
            { icon: "access_time", text: "Avoid outdoor activities between 12PM - 3PM", color: "text-red-400" },
            { icon: "checkroom", text: "Wear light-colored, loose-fitting clothing", color: "text-pink-400" }
        ]
    },
    rainy: {
        description: "Rain drops and cool winds call for a perfect indoor evening with warm comfort food.",
        outfit: {
            badge: "Rainy Day",
            title: "Stay Dry & Warm",
            items: [
                "Waterproof jacket",
                "Quick-dry pants",
                "Compact umbrella",
                "Waterproof shoes"
            ]
        },
        food: {
            badge: "Comfort Food",
            title: "Warm & Cozy",
            items: [
                "Hot tea or coffee",
                "Warm soup",
                "Crispy samosa",
                "Avoid cold drinks"
            ]
        },
        tips: [
            { icon: "umbrella", text: "Carry an umbrella - rain expected throughout the day", color: "text-blue-400" },
            { icon: "water_drop", text: "Keep electronics in waterproof bags", color: "text-cyan-400" },
            { icon: "checkroom", text: "Wear waterproof shoes and layers", color: "text-indigo-400" },
            { icon: "route", text: "Plan alternate routes to avoid flooded areas", color: "text-purple-400" }
        ]
    },
    cold: {
        description: "Chilly winds and crisp air. Perfect time to layer up and enjoy a hot cup of coffee.",
        outfit: {
            badge: "Cold Day",
            title: "Bundle Up & Stay Warm",
            items: [
                "Warm hoodie or jacket",
                "Fleece-lined jeans",
                "Beanie & gloves",
                "Warm socks"
            ]
        },
        food: {
            badge: "Warmth Food",
            title: "Hot & Comforting",
            items: [
                "Hot coffee or chai",
                "Chicken soup",
                "Warm bread",
                "Avoid cold items"
            ]
        },
        tips: [
            { icon: "thermostat", text: "Bundle up in layers - temperature feels colder with wind", color: "text-blue-400" },
            { icon: "local_cafe", text: "Start your day with a hot beverage to warm up", color: "text-amber-400" },
            { icon: "checkroom", text: "Wear a warm jacket, scarf, and gloves", color: "text-purple-400" },
            { icon: "home", text: "Keep室内 heated - check heating system", color: "text-red-400" }
        ]
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function getTemperatureCategory(tempC) {
    if (tempC >= 30) return 'hot';
    if (tempC >= 20) return 'warm';
    if (tempC >= 10) return 'cool';
    return 'cold';
}

function getWeatherCategory(code) {
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 77) return 'cold';
    if (code >= 80 && code <= 82) return 'rainy';
    if (code >= 95 && code <= 96) return 'rainy';
    return 'clear';
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatHour(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

// ============================================
// MAP WEATHER TO LIFESTYLE STATE
// ============================================
function getLifestyleState(tempC, weatherCode) {
    const weatherCat = getWeatherCategory(weatherCode);
    const tempCat = getTemperatureCategory(tempC);

    if (weatherCat === 'rainy') return 'rainy';
    if (tempCat === 'hot' || tempCat === 'warm') return 'hot';
    if (tempCat === 'cool' || tempCat === 'cold') return 'cold';

    return 'hot';
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
        hourly: 'temperature_2m,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,sunrise,sunset',
        timezone: 'auto',
        forecast_days: 1,
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
// RENDER HOURLY FORECAST
// ============================================
function renderHourlyForecast(hourlyData) {
    if (!hourlyData || !hourlyData.time || !hourlyData.temperature_2m) {
        DOM.hourlyScroll.innerHTML = '<p class="text-white/40 text-sm">Hourly data unavailable</p>';
        return;
    }

    const now = new Date();
    const currentHour = now.getHours();

    let startIndex = 0;
    for (let i = 0; i < hourlyData.time.length; i++) {
        const hourDate = new Date(hourlyData.time[i]);
        if (hourDate.getHours() === currentHour) {
            startIndex = i;
            break;
        }
    }

    const cards = [];
    for (let i = startIndex; i < Math.min(startIndex + 24, hourlyData.time.length); i++) {
        const time = hourlyData.time[i];
        const temp = Math.round(hourlyData.temperature_2m[i]);
        const weatherCode = hourlyData.weather_code[i];
        const weatherInfo = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];
        const hourLabel = formatHour(time);
        const isActive = i === startIndex;

        cards.push(`
            <div class="hourly-card ${isActive ? 'active' : ''}">
                <span class="hour-time">${isActive ? 'Now' : hourLabel}</span>
                <span class="material-symbols-outlined ${isActive ? 'text-white' : 'text-primary'}" style="font-size: 24px; font-variation-settings: 'FILL' 1;">${weatherInfo.icon}</span>
                <span class="hour-temp">${temp}°</span>
            </div>
        `);
    }

    DOM.hourlyScroll.innerHTML = cards.join('');
}

// ============================================
// RENDER WEATHER TIPS
// ============================================
function renderWeatherTips(tips) {
    if (!tips || tips.length === 0) {
        DOM.tipsContainer.innerHTML = '<p class="text-white/40 text-sm">No tips available</p>';
        return;
    }

    DOM.tipsContainer.innerHTML = tips.map(tip => `
        <div class="tip-item">
            <span class="material-symbols-outlined ${tip.color} text-[18px]">${tip.icon}</span>
            <span class="text-white/60">${tip.text}</span>
        </div>
    `).join('');
}

// ============================================
// RENDER LIFESTYLE SECTION
// ============================================
function renderLifestyle(lifestyle) {
    const data = lifestyleDatabase[lifestyle];
    if (!data) return;

    // Update description
    DOM.vibeDescription.innerHTML = data.description;

    // Outfit section
    DOM.outfitBadge.textContent = data.outfit.badge;
    DOM.outfitTitle.textContent = data.outfit.title;
    DOM.outfitList.innerHTML = data.outfit.items.map(item => `
        <li class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[14px]">check</span>
            ${item}
        </li>
    `).join('');

    // Food section
    DOM.foodBadge.textContent = data.food.badge;
    DOM.foodTitle.textContent = data.food.title;
    DOM.foodList.innerHTML = data.food.items.map(item => `
        <li class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[14px]">check</span>
            ${item}
        </li>
    `).join('');

    // Tips section
    renderWeatherTips(data.tips);
}

// ============================================
// MAIN WEATHER DISPLAY FUNCTION
// ============================================
async function displayWeather(lat, lon, cityName) {
    const data = await fetchWeather(lat, lon);
    if (!data || data.error) {
        DOM.vibeDescription.textContent = 'Unable to load weather data. Please try again later.';
        return;
    }

    currentWeatherData = data;
    const current = data.current;

    // Update hero stats
    const tempC = current.temperature_2m;
    const tempF = Math.round((tempC * 9/5) + 32);
    const feelsLikeC = Math.round(current.apparent_temperature);
    const feelsLikeF = Math.round((feelsLikeC * 9/5) + 32);

    DOM.temperature.textContent = `${tempC}°C`;
    DOM.feelsLike.textContent = `${feelsLikeC}°C`;

    const weatherInfo = WEATHER_CODES[current.weather_code] || WEATHER_CODES[0];
    const isNight = current.is_day === 0;

    DOM.heroWeatherIcon.textContent = isNight ? 'night_clear' : weatherInfo.icon;
    DOM.weatherCondition.textContent = weatherInfo.condition;

    // Update city name
    DOM.cityName.textContent = cityName;

    // Update weather details
    DOM.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} m/s`;
    DOM.humidity.textContent = `${current.relative_humidity_2m}%`;

    // Update sunrise/sunset
    if (data.daily && data.daily.sunrise && data.daily.sunset) {
        DOM.sunriseTime.textContent = formatTime(data.daily.sunrise[0]);
        DOM.sunsetTime.textContent = formatTime(data.daily.sunset[0]);
    }

    // Determine lifestyle state
    const lifestyleState = getLifestyleState(tempC, current.weather_code);
    renderLifestyle(lifestyleState);

    // Render hourly forecast
    if (data.hourly) {
        renderHourlyForecast(data.hourly);
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openModal() {
    DOM.locationModal.classList.remove('hidden');
    DOM.locationModal.classList.add('flex');
    DOM.searchInput.value = '';
    DOM.searchResults.innerHTML = '';
    setTimeout(() => DOM.searchInput.focus(), 100);
}

function closeModal() {
    DOM.locationModal.classList.add('hidden');
    DOM.locationModal.classList.remove('flex');
    DOM.searchResults.innerHTML = '';
}

// ============================================
// EVENT LISTENERS
// ============================================

// Search
DOM.searchBtn.addEventListener('click', openModal);
DOM.modalClose.addEventListener('click', closeModal);
DOM.locationModal.addEventListener('click', (e) => {
    if (e.target === DOM.locationModal) closeModal();
});

// Hero search input
DOM.heroSearchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query.length < 2) return;
        const cities = await searchCity(query);
        if (cities.length > 0) {
            const city = cities[0];
            displayWeather(city.latitude, city.longitude, `${city.name}, ${city.country || ''}`);
            DOM.heroSearchInput.value = '';
        }
    }
});

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
                <div class="search-result-item p-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}, ${city.country || ''}">
                    <p class="font-medium text-white">${city.name}</p>
                    <p class="text-xs text-white/40">${city.admin1 || ''}, ${city.country || ''}</p>
                </div>
            `).join('');

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
            DOM.searchResults.innerHTML = '<p class="p-3 text-white/40">No cities found</p>';
        }
    }, 400);
});

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

// Current Location
DOM.locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    DOM.vibeDescription.textContent = 'Detecting your location...';

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
            DOM.vibeDescription.textContent = msg;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
});

// Category buttons
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ============================================
// INITIALIZATION
// ============================================
displayWeather(34.0151, 71.5249, CONFIG.DEFAULT_CITY);
