/* ========================================
   VibeCast - Outfit Page Entry Point
   ======================================== */

import { renderOutfitPage } from './views/outfitView.js';
import { fetchWeather } from './models/weather.js';
import { getLifestyleState } from './models/lifestyle.js';
import { CONFIG } from './config.js';

let currentCategory = 'hot';

function updateOutfitPage(category) {
    currentCategory = category;
    renderOutfitPage(category);

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Update weather badge (import lifestyle data)
    import('./models/lifestyle.js').then(({ lifestyleDatabase }) => {
        const data = lifestyleDatabase[category];
        if (data && data.outfit) {
            const text = document.getElementById('outfit-weather-text');
            const icon = document.getElementById('outfit-weather-icon');
            const desc = document.getElementById('outfit-page-desc');
            if (text) text.textContent = data.outfit.title;
            if (desc) desc.textContent = data.description;
            if (icon) {
                icon.textContent = category === 'hot' ? 'wb_sunny' : category === 'rainy' ? 'rainy' : 'ac_unit';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Filter button clicks
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateOutfitPage(btn.dataset.category);
        });
    });

    // Auto-detect weather and render
    async function initOutfitPage() {
        try {
            const data = await fetchWeather(CONFIG.DEFAULT_LAT, CONFIG.DEFAULT_LON);
            if (data && data.current) {
                const category = getLifestyleState(data.current.temperature_2m, data.current.weather_code);
                updateOutfitPage(category);
            } else {
                updateOutfitPage('hot');
            }
        } catch (e) {
            updateOutfitPage('hot');
        }
    }
    initOutfitPage();
});
