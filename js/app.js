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
    timeLabel: document.getElementById('time-label'),
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
    heroSearchResults: document.getElementById('hero-search-results'),
    heroSearchSpinner: document.getElementById('hero-search-spinner'),
    weekendGrid: document.getElementById('weekend-grid'),
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
        outfitImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=300&fit=crop",
        food: {
            title: "Cooling Food",
            items: [
                "Dahi / raita / lassi",
                "Cucumber-tomato salad",
                "Watermelon (tarbooj)",
                "Light dal-chawal"
            ]
        },
        foodImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=200&fit=crop",
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
        outfitImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=300&fit=crop",
        food: {
            title: "Comfort Food",
            items: [
                "Hot pakoras",
                "Karak chai",
                "Warm soup",
                "Crispy samosa"
            ]
        },
        foodImage: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=200&fit=crop",
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
        outfitImage: "https://images.unsplash.com/photo-1544923246-77307dd270da?w=600&h=300&fit=crop",
        food: {
            title: "Hot & Warming",
            items: [
                "Chicken soup",
                "Hot coffee / chai",
                "Warm bread & butter",
                "Garam masala dishes"
            ]
        },
        foodImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=200&fit=crop",
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

const weekendDestinations = [
    {
        title: "Murree Hills",
        description: "Cool breezy hill station with pine forests",
        temp: "18°C",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=350&fit=crop",
        tag: "Popular"
    },
    {
        title: "Swat Valley",
        description: "Beautiful valley — the Switzerland of Pakistan",
        temp: "22°C",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=350&fit=crop",
        tag: "Scenic"
    },
    {
        title: "Naran Kaghan",
        description: "Mountain adventure with lakes & meadows",
        temp: "15°C",
        image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=350&fit=crop",
        tag: "Adventure"
    }
];

function renderWeekendGrid() {
    if (!DOM.weekendGrid) return;
    DOM.weekendGrid.innerHTML = weekendDestinations.map(dest => `
        <div class="glass-card rounded-2xl overflow-hidden weekend-card">
            <div style="overflow:hidden;">
                <img src="${dest.image}" alt="${dest.title}" class="weekend-card-img" loading="lazy"/>
            </div>
            <div class="p-5">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-display font-bold text-lg text-white">${dest.title}</h3>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/15 px-2 py-1 rounded-md">${dest.tag}</span>
                </div>
                <p class="text-white/50 text-sm mb-3">${dest.description}</p>
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-[16px]">thermostat</span>
                    <span class="text-white font-display font-bold text-sm">${dest.temp}</span>
                </div>
            </div>
        </div>
    `).join('');
}

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

    // Remove old image if exists
    const oldOutfitImg = document.getElementById('outfit-dynamic-img');
    if (oldOutfitImg) oldOutfitImg.remove();

    // Add outfit image before the grid
    if (data.outfitImage) {
        const imgHtml = `<img id="outfit-dynamic-img" src="${data.outfitImage}" alt="Outfit suggestion" class="card-img" loading="lazy"/>`;
        DOM.outfitGrid.insertAdjacentHTML('beforebegin', imgHtml);
    }

    DOM.outfitGrid.innerHTML = data.outfit.items.map(item => `
        <div class="outfit-item">${item}</div>
    `).join('');

    // Food
    DOM.foodTitle.textContent = data.food.title;

    // Remove old image if exists
    const oldFoodImg = document.getElementById('food-dynamic-img');
    if (oldFoodImg) oldFoodImg.remove();

    // Add food image at top of food card
    if (data.foodImage) {
        const foodCard = document.getElementById('food-card');
        const foodInner = foodCard.querySelector('.relative.z-10');
        if (foodInner) {
            const imgHtml = `<img id="food-dynamic-img" src="${data.foodImage}" alt="Food suggestion" class="card-img-sm" loading="lazy"/>`;
            foodInner.insertAdjacentHTML('afterbegin', imgHtml);
        }
    }

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

    // Update time label (NIGHT/DAY) and icon color
    if (DOM.timeLabel) {
        DOM.timeLabel.textContent = isNight ? 'NIGHT' : 'DAY';
        DOM.timeLabel.style.color = isNight ? '#F5A623' : '#FFD700';
    }
    if (DOM.heroWeatherIcon) {
        DOM.heroWeatherIcon.style.color = isNight ? '#F5A623' : '#FFD700';
        DOM.heroWeatherIcon.style.filter = isNight
            ? 'drop-shadow(0 0 20px rgba(245, 166, 35, 0.4))'
            : 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))';
    }

    DOM.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} m/s`;
    DOM.humidity.textContent = `${current.relative_humidity_2m}%`;

    if (data.daily && data.daily.sunrise && data.daily.sunset) {
        DOM.sunriseTime.textContent = formatTime(data.daily.sunrise[0]);
        DOM.sunsetTime.textContent = formatTime(data.daily.sunset[0]);
    }

    const lifestyleState = getLifestyleState(tempC, current.weather_code);
    renderLifestyle(lifestyleState);

    renderWeekendGrid();

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

// ========== HERO SEARCH (Dropdown + Auto-search) ==========
let heroSearchTimeout;
let heroSearchFocused = false;

function showHeroDropdown() {
    if (DOM.heroSearchResults) DOM.heroSearchResults.classList.add('active');
}
function hideHeroDropdown() {
    setTimeout(() => {
        if (DOM.heroSearchResults) DOM.heroSearchResults.classList.remove('active');
    }, 200);
}
function showHeroSpinner() {
    if (DOM.heroSearchSpinner) DOM.heroSearchSpinner.style.display = 'flex';
}
function hideHeroSpinner() {
    if (DOM.heroSearchSpinner) DOM.heroSearchSpinner.style.display = 'none';
}

function renderHeroSearchResults(cities) {
    if (!DOM.heroSearchResults) return;
    if (cities.length === 0) {
        DOM.heroSearchResults.innerHTML = '<div class="hero-search-no-result">No cities found</div>';
        showHeroDropdown();
        return;
    }
    DOM.heroSearchResults.innerHTML = cities.map(city => `
        <div class="hero-search-item" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}, ${city.country || ''}">
            <div class="search-icon">
                <span class="material-symbols-outlined">location_on</span>
            </div>
            <div class="search-info">
                <div class="search-city">${city.name}</div>
                <div class="search-region">${city.admin1 ? city.admin1 + ', ' : ''}${city.country || ''}</div>
            </div>
        </div>
    `).join('');

    DOM.heroSearchResults.querySelectorAll('.hero-search-item').forEach(item => {
        item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const lat = parseFloat(item.dataset.lat);
            const lon = parseFloat(item.dataset.lon);
            const name = item.dataset.name;
            displayWeather(lat, lon, name);
            DOM.heroSearchInput.value = '';
            DOM.heroSearchResults.classList.remove('active');
        });
    });
    showHeroDropdown();
}

if (DOM.heroSearchInput) {
    DOM.heroSearchInput.addEventListener('focus', () => {
        heroSearchFocused = true;
        if (DOM.heroSearchInput.value.trim().length >= 2) {
            showHeroDropdown();
        }
    });

    DOM.heroSearchInput.addEventListener('blur', () => {
        heroSearchFocused = false;
        hideHeroDropdown();
    });

    DOM.heroSearchInput.addEventListener('input', (e) => {
        clearTimeout(heroSearchTimeout);
        const query = e.target.value.trim();
        if (query.length < 2) {
            DOM.heroSearchResults.innerHTML = '';
            DOM.heroSearchResults.classList.remove('active');
            hideHeroSpinner();
            return;
        }
        showHeroSpinner();
        heroSearchTimeout = setTimeout(async () => {
            const cities = await searchCity(query);
            hideHeroSpinner();
            renderHeroSearchResults(cities);
        }, 350);
    });

    DOM.heroSearchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            clearTimeout(heroSearchTimeout);
            const query = e.target.value.trim();
            if (query.length < 2) return;
            showHeroSpinner();
            const cities = await searchCity(query);
            hideHeroSpinner();
            if (cities.length > 0) {
                const city = cities[0];
                displayWeather(city.latitude, city.longitude, `${city.name}, ${city.country || ''}`);
                DOM.heroSearchInput.value = '';
                DOM.heroSearchResults.classList.remove('active');
            }
        }
    });
}

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

// ========== CATEGORY BUTTONS (Scroll to sections) ==========
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const text = btn.textContent.trim().toLowerCase();
        let targetId = null;

        if (text === 'outfit') {
            targetId = 'outfit-section';
        } else if (text === 'food') {
            targetId = 'food-section';
        } else if (text === 'travel') {
            targetId = 'weekend-section';
        }

        if (targetId) {
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ========== INIT ==========
displayWeather(34.0151, 71.5249, CONFIG.DEFAULT_CITY);
