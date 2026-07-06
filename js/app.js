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
let isDarkMode = false;

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
    temperature: document.getElementById('temperature'),
    heroWeatherIcon: document.getElementById('hero-weather-icon'),
    weatherBadge: document.getElementById('weather-badge'),
    weatherBadgeIcon: document.getElementById('weather-badge-icon'),
    weatherBadgeText: document.getElementById('weather-badge-text'),
    vibeTitle: document.getElementById('vibe-title'),
    vibeDescription: document.getElementById('vibe-description'),
    windSpeed: document.getElementById('wind-speed'),
    humidity: document.getElementById('humidity'),
    sunriseTime: document.getElementById('sunrise-time'),
    sunsetTime: document.getElementById('sunset-time'),
    hourlyScroll: document.getElementById('hourly-scroll'),
    tipsContainer: document.getElementById('tips-container'),
    outfitSubtitle: document.getElementById('outfit-subtitle'),
    outfitGrid: document.getElementById('outfit-grid'),
    spfTip: document.getElementById('spf-tip'),
    rainAlert: document.getElementById('rain-alert'),
    rainAlertText: document.getElementById('rain-alert-text'),
    foodBadge: document.getElementById('food-badge'),
    foodTitle: document.getElementById('food-title'),
    foodDescription: document.getElementById('food-description'),
    foodImage: document.getElementById('food-image'),
    searchBtn: document.getElementById('search-btn'),
    locationBtn: document.getElementById('location-btn'),
    locationModal: document.getElementById('location-modal'),
    modalClose: document.getElementById('modal-close'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    themeToggle: document.getElementById('theme-toggle'),
};

// ============================================
// WEATHER CODES
// ============================================
const WEATHER_CODES = {
    0: { condition: 'Clear Sky', icon: 'wb_sunny', mood: 'Sunshine Day', badge: 'CLEAR SKY' },
    1: { condition: 'Mainly Clear', icon: 'wb_sunny', mood: 'Perfect Day', badge: 'MAINLY CLEAR' },
    2: { condition: 'Partly Cloudy', icon: 'partly_cloudy_day', mood: 'Picnic Perfect', badge: 'PARTLY SUNNY' },
    3: { condition: 'Overcast', icon: 'cloud', mood: 'Cozy Vibes', badge: 'OVERCAST' },
    45: { condition: 'Foggy', icon: 'foggy', mood: 'Mysterious Morning', badge: 'FOGGY' },
    48: { condition: 'Rime Fog', icon: 'foggy', mood: 'Mysterious Vibes', badge: 'FOGGY' },
    51: { condition: 'Light Drizzle', icon: 'rainy_light', mood: 'Gentle Rain', badge: 'LIGHT DRIZZLE' },
    53: { condition: 'Moderate Drizzle', icon: 'rainy', mood: 'Drizzle Day', badge: 'DRIZZLE' },
    55: { condition: 'Dense Drizzle', icon: 'rainy_heavy', mood: 'Stay Cozy', badge: 'HEAVY DRIZZLE' },
    61: { condition: 'Slight Rain', icon: 'rainy_light', mood: 'Rainy Day', badge: 'LIGHT RAIN' },
    63: { condition: 'Moderate Rain', icon: 'rainy', mood: 'Pakora Weather', badge: 'RAIN' },
    65: { condition: 'Heavy Rain', icon: 'rainy_heavy', mood: 'Stay Inside', badge: 'HEAVY RAIN' },
    71: { condition: 'Slight Snow', icon: 'weather_snowy', mood: 'Winter Wonderland', badge: 'LIGHT SNOW' },
    73: { condition: 'Moderate Snow', icon: 'weather_snowy', mood: 'Snow Day!', badge: 'SNOW' },
    75: { condition: 'Heavy Snow', icon: 'weather_snowy', mood: 'Bundle Up!', badge: 'HEAVY SNOW' },
    80: { condition: 'Light Showers', icon: 'rainy_light', mood: 'Shower Time', badge: 'SHOWERS' },
    81: { condition: 'Moderate Showers', icon: 'rainy', mood: 'Carry Umbrella', badge: 'SHOWERS' },
    82: { condition: 'Violent Showers', icon: 'rainy_heavy', mood: 'Stay Dry!', badge: 'STORM' },
    95: { condition: 'Thunderstorm', icon: 'thunderstorm', mood: 'Thunder & Lightning', badge: 'THUNDERSTORM' },
    96: { condition: 'Thunderstorm with Hail', icon: 'thunderstorm', mood: 'Stay Safe!', badge: 'SEVERE STORM' },
};

// ============================================
// LIFESTYLE DATABASE (Weather-Based Content)
// ============================================
const lifestyleDatabase = {
    hot: {
        vibeTitle: "Today's Vibe: Golden Hour Magic",
        vibeDesc: "Warm breezes and sunshine create the perfect atmosphere for a memorable day out.",
        status: "SUNNY",
        statusIcon: "wb_sunny",
        outfits: [
            { title: "Cotton Polo", desc: "Classic style for a warm afternoon.", link: "https://s.click.aliexpress.com/e/_xxx1", gradient: "outfit-gradient-1" },
            { title: "Canvas Sneakers", desc: "Walk comfortable all day long.", link: "https://s.click.aliexpress.com/e/_xxx2", gradient: "outfit-gradient-2" },
            { title: "Baseball Cap", desc: "Stay shaded and stylish.", link: "https://s.click.aliexpress.com/e/_xxx3", gradient: "outfit-gradient-3" }
        ],
        food: {
            title: "Fresh Mint Juice & Acai Bowl",
            desc: "Start your day right with a refreshing acai bowl topped with fresh fruits. Pair it with a cold juice for the ultimate wellness combo.",
            badge: "WARM DAY PICK"
        },
        tips: [
            { icon: "thermostat", text: "Stay hydrated - drink at least 8 glasses of water today", color: "text-orange-500" },
            { icon: "wb_sunny", text: "Apply SPF 50+ sunscreen before going outside", color: "text-yellow-500" },
            { icon: "access_time", text: "Avoid outdoor activities between 12PM - 3PM", color: "text-red-500" },
            { icon: "checkroom", text: "Wear light-colored, loose-fitting clothing", color: "text-pink-500" }
        ]
    },
    rainy: {
        vibeTitle: "Today's Vibe: Cozy Monsoon Melodies",
        vibeDesc: "Rain drops and cool winds call for a perfect indoor evening with warm Pakistani comfort food.",
        status: "RAINY",
        statusIcon: "rainy",
        outfits: [
            { title: "Waterproof Jacket", desc: "Stay dry and stylish in the heavy rain.", link: "https://s.click.aliexpress.com/e/_rain1", gradient: "outfit-gradient-1" },
            { title: "Dark Cargo Pants", desc: "Easy to clean and perfect to avoid mud stains.", link: "https://s.click.aliexpress.com/e/_rain2", gradient: "outfit-gradient-2" },
            { title: "Compact Umbrella", desc: "Your best friend for today. Don't leave home without it.", link: "https://s.click.aliexpress.com/e/_rain3", gradient: "outfit-gradient-3" }
        ],
        food: {
            title: "Karak Chai & Crispy Samosa",
            desc: "The ultimate Pakistani comfort combo. Steaming hot tea with traditional crispy samosas while enjoying the rain.",
            badge: "RAINY DAY COMFORT"
        },
        tips: [
            { icon: "umbrella", text: "Carry an umbrella - rain expected throughout the day", color: "text-blue-500" },
            { icon: "water_drop", text: "Keep electronics in waterproof bags", color: "text-cyan-500" },
            { icon: "checkroom", text: "Wear waterproof shoes and layers", color: "text-indigo-500" },
            { icon: "route", text: "Plan alternate routes to avoid flooded areas", color: "text-purple-500" }
        ]
    },
    cold: {
        vibeTitle: "Today's Vibe: Cozy Winter Chill",
        vibeDesc: "Chilly winds and crisp air. Perfect time to layer up and enjoy a hot cup of coffee.",
        status: "COLD",
        statusIcon: "ac_unit",
        outfits: [
            { title: "Oversized Hoodie", desc: "Cozy layers to keep you warm and trendy.", link: "https://s.click.aliexpress.com/e/_cold1", gradient: "outfit-gradient-1" },
            { title: "Warm Fleece Jeans", desc: "Perfect protection against cold winter winds.", link: "https://s.click.aliexpress.com/e/_cold2", gradient: "outfit-gradient-2" },
            { title: "Stylish Beanie Cap", desc: "Keep your ears warm and your look aesthetic.", link: "https://s.click.aliexpress.com/e/_cold3", gradient: "outfit-gradient-3" }
        ],
        food: {
            title: "Hot Coffee & Chicken Soup",
            desc: "Warm up your soul with a freshly brewed hot latte and a steaming bowl of local chicken corn soup.",
            badge: "COLD DAY PICK"
        },
        tips: [
            { icon: "thermostat", text: "Bundle up in layers - temperature feels colder with wind", color: "text-blue-500" },
            { icon: "local_cafe", text: "Start your day with a hot beverage to warm up", color: "text-amber-500" },
            { icon: "checkroom", text: "Wear a warm jacket, scarf, and gloves", color: "text-purple-500" },
            { icon: "home", text: "Keep室内 heated - check heating system", color: "text-red-500" }
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

function getUVLabel(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
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
// THEME TOGGLE
// ============================================
function initTheme() {
    const saved = localStorage.getItem('vibecast-theme');
    if (saved === 'dark') {
        isDarkMode = true;
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        isDarkMode = false;
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('vibecast-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('vibecast-theme', 'light');
    }
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
        DOM.hourlyScroll.innerHTML = '<p class="text-on-surface-variant text-sm">Hourly data unavailable</p>';
        return;
    }

    const now = new Date();
    const currentHour = now.getHours();

    // Get next 24 hours of data
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
                <span class="material-symbols-outlined ${isActive ? 'text-white' : 'text-primary'}" style="font-size: 28px; font-variation-settings: 'FILL' 1;">${weatherInfo.icon}</span>
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
        DOM.tipsContainer.innerHTML = '<p class="text-on-surface-variant text-sm">No tips available</p>';
        return;
    }

    DOM.tipsContainer.innerHTML = tips.map(tip => `
        <div class="tip-item">
            <span class="material-symbols-outlined ${tip.color} text-[20px]">${tip.icon}</span>
            <span class="text-on-surface-variant">${tip.text}</span>
        </div>
    `).join('');
}

// ============================================
// UPDATE WEBSITE VIBE (Main DOM Manipulation)
// ============================================
function updateWebsiteVibe(weatherState) {
    const data = lifestyleDatabase[weatherState];
    if (!data) return;

    // Hero Section Updates
    DOM.weatherBadgeIcon.textContent = data.statusIcon;
    DOM.weatherBadgeText.textContent = data.status;
    DOM.vibeTitle.textContent = data.vibeTitle;
    DOM.vibeDescription.textContent = data.vibeDesc;

    // Outfit Section - Generate Gradient Cards
    DOM.outfitGrid.innerHTML = data.outfits.map((item, index) => `
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" 
           class="gradient-card ${item.gradient} block hover:scale-[1.02] transition-transform">
            <div class="relative z-10">
                <span class="material-symbols-outlined text-white/80 text-[32px] mb-3">${index === 0 ? 'checkroom' : index === 1 ? 'footprints' : 'hat'}</span>
                <h3 class="font-display font-semibold text-xl text-white mb-2">${item.title}</h3>
                <p class="text-sm text-white/80 leading-relaxed mb-4">${item.desc}</p>
                <span class="inline-block w-full py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold text-sm text-center text-white hover:bg-white/30 transition-colors">Shop on AliExpress</span>
            </div>
        </a>
    `).join('');

    // Food Section Updates
    DOM.foodBadge.textContent = data.food.badge;
    DOM.foodTitle.textContent = data.food.title;
    DOM.foodDescription.textContent = data.food.desc;

    // Tips Section
    renderWeatherTips(data.tips);
}

// ============================================
// RAIN ALERT CHECK
// ============================================
function checkRainAlert(data) {
    if (!data.daily || !data.daily.precipitation_probability_max) {
        DOM.rainAlert.classList.add('hidden');
        return false;
    }

    const todayRainChance = data.daily.precipitation_probability_max[0];

    if (todayRainChance >= 80) {
        DOM.rainAlert.classList.remove('hidden');
        DOM.rainAlertText.textContent = `Rain Alert: ${todayRainChance}% chance of rain today! We recommend waterproof gear.`;
        return true;
    }

    DOM.rainAlert.classList.add('hidden');
    return false;
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

    currentWeatherData = data;
    const current = data.current;

    // Update hero stats
    const tempC = current.temperature_2m;
    const tempF = Math.round((tempC * 9/5) + 32);
    DOM.temperature.textContent = `${tempF}°F`;

    const weatherInfo = WEATHER_CODES[current.weather_code] || WEATHER_CODES[0];
    const isNight = current.is_day === 0;

    // Update hero weather icon
    DOM.heroWeatherIcon.textContent = isNight ? 'night_clear' : weatherInfo.icon;
    DOM.weatherBadgeIcon.textContent = isNight ? 'night_clear' : weatherInfo.icon;
    DOM.weatherBadgeText.textContent = isNight ? 'CLEAR NIGHT' : weatherInfo.badge;

    // Update weather details
    DOM.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    DOM.humidity.textContent = `${current.relative_humidity_2m}%`;

    // Update sunrise/sunset
    if (data.daily && data.daily.sunrise && data.daily.sunset) {
        DOM.sunriseTime.textContent = formatTime(data.daily.sunrise[0]);
        DOM.sunsetTime.textContent = formatTime(data.daily.sunset[0]);
    }

    // UV Index
    const uv = data.daily && data.daily.uv_index_max ? data.daily.uv_index_max[0] : 0;

    // Determine lifestyle state and update sections
    const lifestyleState = getLifestyleState(tempC, current.weather_code);
    updateWebsiteVibe(lifestyleState);

    // Update outfit subtitle with temperature
    DOM.outfitSubtitle.textContent = `Curated essentials for a ${tempF}°F afternoon.`;

    // Update SPF tip based on UV
    if (uv > 5) {
        DOM.spfTip.textContent = 'SPF 50 is your best friend today!';
    } else if (uv > 2) {
        DOM.spfTip.textContent = 'SPF 30 recommended for today.';
    } else {
        DOM.spfTip.textContent = 'Low UV - enjoy the outdoors!';
    }

    // Render hourly forecast
    if (data.hourly) {
        renderHourlyForecast(data.hourly);
    }

    // Rain alert check
    checkRainAlert(data);
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

// Theme Toggle
DOM.themeToggle.addEventListener('click', toggleTheme);

// Search
DOM.searchBtn.addEventListener('click', openModal);
DOM.modalClose.addEventListener('click', closeModal);
DOM.locationModal.addEventListener('click', (e) => {
    if (e.target === DOM.locationModal) closeModal();
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
                <div class="search-result-item p-3 hover:bg-primary/10 cursor-pointer border-b border-outline-variant/30 last:border-0" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}, ${city.country || ''}">
                    <p class="font-medium text-on-surface">${city.name}</p>
                    <p class="text-xs text-on-surface-variant">${city.admin1 || ''}, ${city.country || ''}</p>
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
            DOM.searchResults.innerHTML = '<p class="p-3 text-on-surface-variant">No cities found</p>';
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
initTheme();
displayWeather(34.0151, 71.5249, CONFIG.DEFAULT_CITY);
