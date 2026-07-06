/* ========================================
   VibeCast - Lifestyle Weather Companion
   Weather API + Dynamic Content
   ======================================== */

const CONFIG = {
    GEO_API: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
    DEFAULT_CITY: 'Peshawar',
};

let currentWeatherData = null;

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
    outfitGrid: document.getElementById('outfit-grid'),
    foodTitle: document.getElementById('food-title'),
    foodList: document.getElementById('food-list'),
    hydrationList: document.getElementById('hydration-list'),
    todayList: document.getElementById('today-list'),
    searchBtn: document.getElementById('search-btn'),
    locationBtn: document.getElementById('location-btn'),
    locationModal: document.getElementById('location-modal'),
    modalClose: document.getElementById('modal-close'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    heroSearchInput: document.getElementById('hero-search-input'),
};

const WEATHER_CODES = {
    0: { condition: 'Clear Sky', icon: 'wb_sunny' },
    1: { condition: 'Mainly Clear', icon: 'wb_sunny' },
    2: { condition: 'Partly Cloudy', icon: 'partly_cloudy_day' },
    3: { condition: 'Overcast', icon: 'cloud' },
    45: { condition: 'Foggy', icon: 'foggy' },
    48: { condition: 'Rime Fog', icon: 'foggy' },
    51: { condition: 'Light Drizzle', icon: 'rainy_light' },
    53: { condition: 'Moderate Drizzle', icon: 'rainy' },
    55: { condition: 'Dense Drizzle', icon: 'rainy_heavy' },
    61: { condition: 'Slight Rain', icon: 'rainy_light' },
    63: { condition: 'Moderate Rain', icon: 'rainy' },
    65: { condition: 'Heavy Rain', icon: 'rainy_heavy' },
    71: { condition: 'Slight Snow', icon: 'weather_snowy' },
    73: { condition: 'Moderate Snow', icon: 'weather_snowy' },
    75: { condition: 'Heavy Snow', icon: 'weather_snowy' },
    80: { condition: 'Light Showers', icon: 'rainy_light' },
    81: { condition: 'Moderate Showers', icon: 'rainy' },
    82: { condition: 'Violent Showers', icon: 'rainy_heavy' },
    95: { condition: 'Thunderstorm', icon: 'thunderstorm' },
    96: { condition: 'Thunderstorm with Hail', icon: 'thunderstorm' },
};

const lifestyleDatabase = {
    hot: {
        description: "The warm weather in your area makes for a perfect afternoon. A great day to enjoy outdoor activities or visit a cafe.",
        outfit: {
            badge: "SEE EVERYTHING",
            title: "Very Hot — Light Clothes",
            items: [
                "Cotton kurta / kameez",
                "Shorts or light trousers",
                "Sandals / breathable shoes",
                "Sunglasses & cap",
                "Sunscreen SPF 50+"
            ]
        },
        food: {
            title: "Cooling Food",
            items: [
                "Dahi / raita / lassi",
                "Cucumber-tomato salad",
                "Watermelon (tarbooj)",
                "Light dal-chawal"
            ]
        },
        hydration: [
            "Nimbu pani",
            "Coconut water",
            "Chai / lassi",
            "Cold homemade drinks"
        ],
        todayPlan: [
            "Morning walk (early)",
            "Avoid 12PM - 3PM sun",
            "Evening stroll"
        ],
        tips: [
            "UV levels are very high today — apply sunscreen",
            "Stay between 12PM - 4PM in shade"
        ]
    },
    rainy: {
        description: "Rain drops and cool winds call for a perfect indoor evening with warm comfort food.",
        outfit: {
            badge: "STAY DRY",
            title: "Rainy Day — Waterproof Gear",
            items: [
                "Waterproof jacket",
                "Quick-dry pants",
                "Compact umbrella",
                "Waterproof shoes",
                "Rain cover for bag"
            ]
        },
        food: {
            title: "Comfort Food",
            items: [
                "Hot pakoras",
                "Karak chai",
                "Warm soup",
                "Crispy samosa"
            ]
        },
        hydration: [
            "Hot tea",
            "Masala chai",
            "Hot chocolate",
            "Warm lemon water"
        ],
        todayPlan: [
            "Carry umbrella always",
            "Check traffic alerts",
            "Indoor activities recommended"
        ],
        tips: [
            "80% chance of rain — carry umbrella",
            "Avoid flooded roads"
        ]
    },
    cold: {
        description: "Chilly winds and crisp air. Perfect time to layer up and enjoy a hot cup of coffee.",
        outfit: {
            badge: "STAY WARM",
            title: "Cold Day — Bundle Up",
            items: [
                "Warm hoodie / jacket",
                "Fleece-lined jeans",
                "Beanie & gloves",
                "Warm socks",
                "Scarf for neck"
            ]
        },
        food: {
            title: "Hot & Warming",
            items: [
                "Chicken soup",
                "Hot coffee / chai",
                "Warm bread & butter",
                "Garam masala dishes"
            ]
        },
        hydration: [
            "Hot coffee",
            "Ginger tea",
            "Hot soup",
            "Warm milk"
        ],
        todayPlan: [
            "Morning gym / walk",
            "Warm up before going out",
            "Evening cozy at home"
        ],
        tips: [
            "Temperature feels colder with wind chill",
            "Layer up before heading outside"
        ]
    }
};

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

function getLifestyleState(tempC, weatherCode) {
    const weatherCat = getWeatherCategory(weatherCode);
    if (weatherCat === 'rainy') return 'rainy';
    const tempCat = getTemperatureCategory(tempC);
    if (tempCat === 'hot' || tempCat === 'warm') return 'hot';
    return 'cold';
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatHour(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

async function searchCity(query) {
    const url = `${CONFIG.GEO_API}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results || [];
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
        return await response.json();
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
}

function renderHourlyForecast(hourlyData) {
    if (!hourlyData || !hourlyData.time || !hourlyData.temperature_2m) {
        DOM.hourlyScroll.innerHTML = '<p class="text-white/40 text-sm">Hourly data unavailable</p>';
        return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    let startIndex = 0;
    for (let i = 0; i < hourlyData.time.length; i++) {
        if (new Date(hourlyData.time[i]).getHours() === currentHour) {
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
                <span class="material-symbols-outlined hour-icon ${isActive ? 'text-white' : 'text-primary'}" style="font-variation-settings: 'FILL' 1;">${weatherInfo.icon}</span>
                <span class="hour-temp">${temp}°</span>
            </div>
        `);
    }
    DOM.hourlyScroll.innerHTML = cards.join('');
}

function renderTips(tips) {
    if (!tips || tips.length === 0) {
        DOM.tipsContainer.innerHTML = '<p class="text-white/40 text-sm">No tips available</p>';
        return;
    }
    DOM.tipsContainer.innerHTML = tips.map((tip, i) => `
        <div class="tip-card">
            <div class="tip-number">${i + 1}</div>
            <p class="tip-text">${tip}</p>
        </div>
    `).join('');
}

function renderLifestyle(lifestyle) {
    const data = lifestyleDatabase[lifestyle];
    if (!data) return;

    DOM.vibeDescription.innerHTML = data.description;

    // Outfit
    DOM.outfitBadge.textContent = data.outfit.badge;
    DOM.outfitTitle.textContent = data.outfit.title;
    DOM.outfitGrid.innerHTML = data.outfit.items.map(item => `
        <div class="outfit-item">${item}</div>
    `).join('');

    // Food
    DOM.foodTitle.textContent = data.food.title;
    DOM.foodList.innerHTML = data.food.items.map(item => `<li>${item}</li>`).join('');

    // Hydration
    DOM.hydrationList.innerHTML = data.hydration.map(item => `<li>${item}</li>`).join('');

    // Today
    DOM.todayList.innerHTML = data.todayPlan.map(item => `<li>${item}</li>`).join('');

    // Tips
    renderTips(data.tips);
}

async function displayWeather(lat, lon, cityName) {
    const data = await fetchWeather(lat, lon);
    if (!data || data.error) {
        DOM.vibeDescription.textContent = 'Unable to load weather data. Please try again later.';
        return;
    }

    currentWeatherData = data;
    const current = data.current;

    const tempC = current.temperature_2m;
    const feelsLikeC = Math.round(current.apparent_temperature);

    DOM.temperature.textContent = `${tempC}°C`;
    DOM.feelsLike.textContent = `${feelsLikeC}°C`;

    const weatherInfo = WEATHER_CODES[current.weather_code] || WEATHER_CODES[0];
    const isNight = current.is_day === 0;

    DOM.heroWeatherIcon.textContent = isNight ? 'night_clear' : weatherInfo.icon;
    DOM.weatherCondition.textContent = weatherInfo.condition;
    DOM.cityName.textContent = cityName;

    DOM.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} m/s`;
    DOM.humidity.textContent = `${current.relative_humidity_2m}%`;

    if (data.daily && data.daily.sunrise && data.daily.sunset) {
        DOM.sunriseTime.textContent = formatTime(data.daily.sunrise[0]);
        DOM.sunsetTime.textContent = formatTime(data.daily.sunset[0]);
    }

    const lifestyleState = getLifestyleState(tempC, current.weather_code);
    renderLifestyle(lifestyleState);

    if (data.hourly) {
        renderHourlyForecast(data.hourly);
    }
}

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

// Event Listeners
DOM.searchBtn.addEventListener('click', openModal);
DOM.modalClose.addEventListener('click', closeModal);
DOM.locationModal.addEventListener('click', (e) => {
    if (e.target === DOM.locationModal) closeModal();
});

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
            if (error.code === error.PERMISSION_DENIED) msg = 'Location permission denied.';
            else if (error.code === error.POSITION_UNAVAILABLE) msg = 'Location unavailable.';
            else if (error.code === error.TIMEOUT) msg = 'Location request timed out.';
            DOM.vibeDescription.textContent = msg;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
});

document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

displayWeather(34.0151, 71.5249, CONFIG.DEFAULT_CITY);
