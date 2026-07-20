/* ========================================
   VibeCast - Home Page Entry Point
   ======================================== */

import { initDOM } from './views/homeView.js';
import { displayWeather } from './controllers/weatherController.js';
import { initHeroSearch, initModalSearch, initGeolocation } from './controllers/searchController.js';
import { CONFIG } from './config.js';
import { renderHourlyForecast, renderDailyForecast } from './views/homeView.js';

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    initHeroSearch();
    initModalSearch();
    initGeolocation();

    // Category button navigation
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const text = btn.textContent.trim().toLowerCase();
            if (text === 'outfit') window.location.href = '/vibecast/outfit/';
            else if (text === 'food') window.location.href = '/vibecast/food/';
        });
    });

    // Hourly scroll arrows
    window.scrollHourly = function(direction) {
        const container = document.getElementById('hourly-scroll');
        const scrollAmount = 150;
        container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    };

    // Update progress bar on scroll
    const hourlyScroll = document.getElementById('hourly-scroll');
    const progressBar = document.getElementById('scroll-progress-bar');
    if (hourlyScroll && progressBar) {
        hourlyScroll.addEventListener('scroll', () => {
            const scrollLeft = hourlyScroll.scrollLeft;
            const maxScroll = hourlyScroll.scrollWidth - hourlyScroll.clientWidth;
            const percentage = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
            progressBar.style.width = Math.max(30, percentage) + '%';
        });
    }

    // Scroll header hide/show
    let lastScroll = 0;
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 80) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Load weather
    displayWeather(CONFIG.DEFAULT_LAT, CONFIG.DEFAULT_LON, CONFIG.DEFAULT_CITY);
});
