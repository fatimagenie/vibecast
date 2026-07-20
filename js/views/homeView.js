/* ========================================
   VibeCast - Home View
   DOM rendering for home page
   ======================================== */

import { WEATHER_CODES, DAY_NAMES } from '../config.js';
import { lifestyleDatabase, celsiusToFahrenheit } from '../models/lifestyle.js';
import { travelDestinations, weekendDestinationPool, haversineDistance } from '../models/travel.js';

// ========== DOM Element References ==========
export const DOM = {};

export function initDOM() {
    DOM.temperature = document.getElementById('temperature');
    DOM.heroWeatherIcon = document.getElementById('hero-weather-icon');
    DOM.weatherCondition = document.getElementById('weather-condition');
    DOM.feelsLike = document.getElementById('feels-like');
    DOM.vibeDescription = document.getElementById('vibe-description');
    DOM.cityName = document.getElementById('city-name');
    DOM.windSpeed = document.getElementById('wind-speed');
    DOM.humidity = document.getElementById('humidity');
    DOM.sunriseTime = document.getElementById('sunrise-time');
    DOM.sunsetTime = document.getElementById('sunset-time');
    DOM.hourlyScroll = document.getElementById('hourly-scroll');
    DOM.tipsContainer = document.getElementById('tips-container');
    DOM.outfitBadge = document.getElementById('outfit-badge');
    DOM.outfitTitle = document.getElementById('outfit-title');
    DOM.outfitGrid = document.getElementById('outfit-grid');
    DOM.foodTitle = document.getElementById('food-title');
    DOM.foodList = document.getElementById('food-list');
    DOM.hydrationList = document.getElementById('hydration-list');
    DOM.todayList = document.getElementById('today-list');
    DOM.searchBtn = document.getElementById('search-btn');
    DOM.locationBtn = document.getElementById('location-btn');
    DOM.locationModal = document.getElementById('location-modal');
    DOM.modalClose = document.getElementById('modal-close');
    DOM.searchInput = document.getElementById('search-input');
    DOM.searchResults = document.getElementById('search-results');
    DOM.heroSearchInput = document.getElementById('hero-search-input');
    DOM.heroSearchResults = document.getElementById('hero-search-results');
    DOM.heroSearchSpinner = document.getElementById('hero-search-spinner');
    DOM.weekendGrid = document.getElementById('weekend-grid');
    DOM.dailyScroll = document.getElementById('daily-scroll');
    DOM.weatherCard = document.getElementById('weather-card');
    DOM.weatherBgLayer = document.getElementById('weather-bg-layer');
    DOM.highTemp = document.getElementById('high-temp');
    DOM.lowTemp = document.getElementById('low-temp');
    DOM.rainChance = document.getElementById('rain-chance');
    DOM.rainAmount = document.getElementById('rain-amount');
    DOM.rainRow = document.getElementById('rain-row');
    DOM.weatherTimestamp = document.getElementById('weather-timestamp');
}

// ========== Format Helpers ==========
export function formatTempDual(celsius) {
    const c = Math.round(celsius);
    const f = Math.round(celsiusToFahrenheit(celsius));
    return `<span class="temp-primary">${c}°C</span> <span class="temp-secondary">/ ${f}°F</span>`;
}

export function formatTempDualText(celsius) {
    const c = Math.round(celsius);
    const f = Math.round(celsiusToFahrenheit(celsius));
    return `${c}°C / ${f}°F`;
}

export function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatHour(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

// ========== Render Functions ==========
export function renderHourlyForecast(hourlyData, currentUnit) {
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
                <span class="hour-temp">${formatTemp(temp, currentUnit)}</span>
            </div>
        `);
    }
    DOM.hourlyScroll.innerHTML = cards.join('');
}

export function renderDailyForecast(dailyData, currentUnit) {
    const dailyScroll = document.getElementById('daily-scroll');
    if (!dailyScroll) return;

    if (!dailyData || !dailyData.time || !dailyData.temperature_2m_max) {
        dailyScroll.innerHTML = '<p class="text-white/40 text-sm">Daily data unavailable</p>';
        return;
    }

    const cards = [];

    for (let i = 0; i < dailyData.time.length; i++) {
        const date = new Date(dailyData.time[i] + 'T00:00:00');
        const dayName = i === 0 ? 'Today' : DAY_NAMES[date.getDay()];
        const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
        const minTemp = dailyData.temperature_2m_min ? Math.round(dailyData.temperature_2m_min[i]) : maxTemp - 8;
        const weatherCode = dailyData.weather_code ? dailyData.weather_code[i] : 0;
        const weatherInfo = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];
        const rainProb = dailyData.precipitation_probability_max ? dailyData.precipitation_probability_max[i] : null;
        const isActive = i === 0;

        cards.push(`
            <div class="daily-card ${isActive ? 'active' : ''}">
                <span class="daily-day">${dayName}</span>
                <span class="material-symbols-outlined daily-icon ${isActive ? 'text-white' : 'text-primary'}" style="font-variation-settings: 'FILL' 1;">${weatherInfo.icon}</span>
                <div class="daily-temps">
                    <span class="daily-max">${formatTemp(maxTemp, currentUnit)}</span>
                    <span class="daily-min">${formatTemp(minTemp, currentUnit)}</span>
                </div>
                ${rainProb !== null && rainProb > 0 ? `<span class="daily-rain"><span class="material-symbols-outlined text-[10px]">water_drop</span>${rainProb}%</span>` : ''}
            </div>
        `);
    }
    dailyScroll.innerHTML = cards.join('');
}

export function renderTips(tips) {
    if (!tips || tips.length === 0) {
        DOM.tipsContainer.innerHTML = '<p class="text-white/40 text-xs">No tips available</p>';
        return;
    }
    DOM.tipsContainer.innerHTML = tips.map((tip, i) => `
        <div class="flex items-start gap-2 p-2 rounded-lg bg-white/[0.06]">
            <div class="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-[10px] font-bold text-yellow-400">${i + 1}</span>
            </div>
            <p class="text-xs text-white/70 leading-relaxed">${tip}</p>
        </div>
    `).join('');
}

export function renderLifestyle(lifestyle) {
    const data = lifestyleDatabase[lifestyle];
    if (!data) return;

    DOM.vibeDescription.innerHTML = data.description;

    // Outfit
    DOM.outfitBadge.textContent = data.outfit.badge;
    DOM.outfitTitle.textContent = data.outfit.title;

    const oldOutfitImg = document.getElementById('outfit-dynamic-img');
    if (oldOutfitImg) oldOutfitImg.remove();

    if (data.outfitImage) {
        const imgHtml = `<img id="outfit-dynamic-img" src="${data.outfitImage}" alt="Outfit suggestion" class="card-img" loading="lazy"/>`;
        DOM.outfitGrid.insertAdjacentHTML('beforebegin', imgHtml);
    }

    DOM.outfitGrid.innerHTML = data.outfit.items.map(item => `
        <div class="outfit-item">${item}</div>
    `).join('');

    // Food
    DOM.foodTitle.textContent = data.food.title;

    const oldFoodImg = document.getElementById('food-dynamic-img');
    if (oldFoodImg) oldFoodImg.remove();

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

export function renderWeekendGrid(category, userLat, userLon) {
    if (!DOM.weekendGrid) return;

    const allItems = travelDestinations[category] || travelDestinations.hot;
    const items = allItems
        .map(d => ({ ...d, distance: haversineDistance(userLat, userLon, d.lat, d.lon) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

    const titles = {
        hot: 'Your Weekend Escape',
        rainy: 'Your Weekend Escape',
        cold: 'Your Weekend Escape'
    };
    const descs = {
        hot: 'Cool coastal spots to beat the heat this weekend.',
        rainy: 'Misty hills and valleys for a monsoon escape.',
        cold: 'Snow-capped peaks and cozy mountain stays.'
    };

    const heading = document.getElementById('weekend-title');
    const subtext = document.getElementById('weekend-desc');
    if (heading) heading.textContent = titles[category] || 'Your Weekend Escape';
    if (subtext) subtext.textContent = descs[category] || 'Curated destinations for your perfect trip.';

    DOM.weekendGrid.innerHTML = items.map(dest => `
        <div class="glass-card rounded-2xl overflow-hidden weekend-card">
            <div style="overflow:hidden;">
                <img src="${dest.image}" alt="${dest.name}" class="weekend-card-img" loading="lazy"/>
            </div>
            <div class="p-5">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-display font-bold text-lg text-white">${dest.name}</h3>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/15 px-2 py-1 rounded-md">${dest.tag}</span>
                </div>
                <p class="text-white/50 text-sm mb-3">${dest.desc}</p>
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-[16px]">navigation</span>
                    <span class="text-white font-display font-bold text-sm">${Math.round(dest.distance)} km away</span>
                </div>
            </div>
        </div>
    `).join('');
}

export function renderHeroSearchResults(cities) {
    if (!DOM.heroSearchResults) return;
    if (cities.length === 0) {
        DOM.heroSearchResults.innerHTML = '<div class="hero-search-no-result">No cities found</div>';
        DOM.heroSearchResults.classList.add('active');
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
    DOM.heroSearchResults.classList.add('active');
}
