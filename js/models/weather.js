/* ========================================
   VibeCast - Weather Model (API Layer)
   ======================================== */

import { CONFIG } from '../config.js';

export async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
        hourly: 'temperature_2m,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset',
        timezone: 'auto',
        forecast_days: 7,
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

export async function searchCity(query) {
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
