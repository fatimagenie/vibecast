/* ========================================
   VibeCast - Weather Controller
   Orchestrates weather data flow
   ======================================== */

import { fetchWeather } from '../models/weather.js';
import { getLifestyleState, celsiusToFahrenheit } from '../models/lifestyle.js';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../storage.js';
import { DOM, renderHourlyForecast, renderDailyForecast, renderLifestyle, renderWeekendGrid, formatTemp, formatTempDual } from '../views/homeView.js';
import { WEATHER_BACKGROUNDS } from '../config.js';

let currentWeatherData = null;
let userLat = 34.0151;
let userLon = 71.5249;

export function getCurrentUnit() {
    return localStorage.getItem(STORAGE_KEYS.UNIT) || 'C';
}

export function getCurrentWeatherData() {
    return currentWeatherData;
}

export function getUserCoords() {
    return { lat: userLat, lon: userLon };
}

export async function displayWeather(lat, lon, cityName) {
    userLat = lat;
    userLon = lon;
    const data = await fetchWeather(lat, lon);
    if (!data || data.error) {
        DOM.vibeDescription.textContent = 'Unable to load weather data. Please try again later.';
        return;
    }

    currentWeatherData = data;
    const current = data.current;
    const currentUnit = getCurrentUnit();

    const tempC = current.temperature_2m;
    const feelsLikeC = Math.round(current.apparent_temperature);

    DOM.temperature.innerHTML = formatTempDual(tempC);
    DOM.feelsLike.textContent = `${Math.round(feelsLikeC)}°C / ${Math.round(celsiusToFahrenheit(feelsLikeC))}°F`;
    DOM.temperature.classList.add('loaded');
    DOM.feelsLike.classList.add('loaded');

    const { WEATHER_CODES } = await import('../config.js');
    const weatherInfo = WEATHER_CODES[current.weather_code] || WEATHER_CODES[0];
    const isNight = current.is_day === 0;

    DOM.heroWeatherIcon.textContent = isNight ? 'clear_night' : weatherInfo.icon;
    DOM.weatherCondition.textContent = weatherInfo.condition;
    DOM.cityName.textContent = cityName;

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

    // === HIGH / LOW TEMPS ===
    if (data.daily && data.daily.temperature_2m_max && data.daily.temperature_2m_min) {
        const highC = data.daily.temperature_2m_max[0];
        const lowC = data.daily.temperature_2m_min[0];
        DOM.highTemp.textContent = `${Math.round(highC)}°C / ${Math.round(celsiusToFahrenheit(highC))}°F`;
        DOM.lowTemp.textContent = `${Math.round(lowC)}°C / ${Math.round(celsiusToFahrenheit(lowC))}°F`;
    }

    // === RAIN INFO ===
    if (data.daily && data.daily.precipitation_probability_max) {
        const rainChance = data.daily.precipitation_probability_max[0];
        if (rainChance !== null && rainChance > 0) {
            DOM.rainChance.textContent = `${rainChance}%`;
            DOM.rainRow.classList.remove('hidden');
        } else {
            DOM.rainRow.classList.add('hidden');
        }
    } else {
        DOM.rainRow.classList.add('hidden');
    }

    if (data.daily && data.daily.precipitation_sum) {
        const rainMm = data.daily.precipitation_sum[0] || 0;
        const rainInches = (rainMm / 25.4).toFixed(2);
        DOM.rainAmount.textContent = `${rainInches} in`;
    }

    // === TIMESTAMP ===
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const tzOffset = -now.getTimezoneOffset() / 60;
    const tzStr = tzOffset >= 0 ? `GMT+${tzOffset}` : `GMT${tzOffset}`;
    DOM.weatherTimestamp.textContent = `As of ${timeStr} ${tzStr}`;

    // === DYNAMIC WEATHER BACKGROUND ===
    const bgClass = WEATHER_BACKGROUNDS[current.weather_code] || 'weather-bg-sunny';
    const nightBg = isNight ? (bgClass === 'weather-bg-sunny' ? 'weather-bg-night' : 'weather-bg-night-cloudy') : bgClass;

    // Remove all weather-bg-* classes
    DOM.weatherCard.className = 'weather-card-google';
    DOM.weatherCard.classList.add(nightBg);

    // Apply dynamic hero background
    if (DOM.heroBg) {
        DOM.heroBg.className = 'hero-bg min-h-[80vh] flex items-center px-5 md:px-12 pt-20';
        DOM.heroBg.classList.add(nightBg);
    }

    const lifestyleState = getLifestyleState(tempC, current.weather_code);
    renderLifestyle(lifestyleState);

    window.VibeCastWeather = {
        city: cityName,
        temp: tempC,
        feelsLike: feelsLikeC,
        condition: weatherInfo.condition,
        category: lifestyleState,
        icon: isNight ? 'clear_night' : weatherInfo.icon,
        isNight: isNight
    };

    renderWeekendGrid(lifestyleState, userLat, userLon);

    if (data.hourly) {
        renderHourlyForecast(data.hourly, currentUnit);
    }

    if (data.daily) {
        renderDailyForecast(data.daily, currentUnit);
    }
}

export function reRenderTemperatures() {
    if (!currentWeatherData) return;
    const current = currentWeatherData.current;
    const tempC = current.temperature_2m;
    const feelsLikeC = Math.round(current.apparent_temperature);

    if (DOM.temperature) DOM.temperature.innerHTML = formatTempDual(tempC);
    if (DOM.feelsLike) DOM.feelsLike.textContent = `${feelsLikeC}°C / ${Math.round(celsiusToFahrenheit(feelsLikeC))}°F`;

    // Update high/low temps
    if (currentWeatherData.daily && currentWeatherData.daily.temperature_2m_max && currentWeatherData.daily.temperature_2m_min) {
        const highC = currentWeatherData.daily.temperature_2m_max[0];
        const lowC = currentWeatherData.daily.temperature_2m_min[0];
        if (DOM.highTemp) DOM.highTemp.textContent = `${Math.round(highC)}°C / ${Math.round(celsiusToFahrenheit(highC))}°F`;
        if (DOM.lowTemp) DOM.lowTemp.textContent = `${Math.round(lowC)}°C / ${Math.round(celsiusToFahrenheit(lowC))}°F`;
    }

    if (currentWeatherData.hourly) renderHourlyForecast(currentWeatherData.hourly, 'C');
    if (currentWeatherData.daily) renderDailyForecast(currentWeatherData.daily, 'C');
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
