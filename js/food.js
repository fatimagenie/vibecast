/* ========================================
   VibeCast - Food Page Entry Point
   ======================================== */

import { renderFoodPage, openRecipeModal, closeRecipeModal } from './views/foodView.js';
import { fetchWeather } from './models/weather.js';
import { getLifestyleState } from './models/lifestyle.js';
import { CONFIG } from './config.js';

let currentCategory = 'hot';

function updateFoodPage(category) {
    currentCategory = category;
    renderFoodPage(category);

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    import('./models/lifestyle.js').then(({ lifestyleDatabase }) => {
        const data = lifestyleDatabase[category];
        if (data && data.food) {
            const text = document.getElementById('food-weather-text');
            const icon = document.getElementById('food-weather-icon');
            const desc = document.getElementById('food-page-desc');
            if (text) text.textContent = data.food.title;
            if (desc) desc.textContent = data.description;
            if (icon) {
                icon.textContent = category === 'hot' ? 'wb_sunny' : category === 'rainy' ? 'rainy' : 'ac_unit';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Filter buttons
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateFoodPage(btn.dataset.category);
        });
    });

    // Recipe modal - delegate clicks on item cards
    document.getElementById('food-grid-page')?.addEventListener('click', (e) => {
        const card = e.target.closest('.item-card');
        if (!card) return;
        const index = parseInt(card.dataset.index);
        const category = card.dataset.category;
        openRecipeModal(index, category);
    });

    // Close modal
    document.querySelector('.recipe-modal-overlay')?.addEventListener('click', closeRecipeModal);
    document.querySelector('.recipe-modal-close')?.addEventListener('click', closeRecipeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeRecipeModal();
    });

    // Auto-detect weather
    async function initFoodPage() {
        try {
            const data = await fetchWeather(CONFIG.DEFAULT_LAT, CONFIG.DEFAULT_LON);
            if (data && data.current) {
                const category = getLifestyleState(data.current.temperature_2m, data.current.weather_code);
                updateFoodPage(category);
            } else {
                updateFoodPage('hot');
            }
        } catch (e) {
            updateFoodPage('hot');
        }
    }
    initFoodPage();
});
