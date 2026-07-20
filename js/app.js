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

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => mobileNav.classList.remove('hidden'));
        if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', () => mobileNav.classList.add('hidden'));
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]');
            if (email && email.value) {
                email.value = '';
                showNotification('Thanks for subscribing!');
            }
        });
    }
});

function showNotification(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:linear-gradient(135deg,#a855f7,#f472b6);color:#fff;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 8px 32px rgba(168,85,247,0.4);animation:slideIn 0.3s ease;max-width:320px;';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
