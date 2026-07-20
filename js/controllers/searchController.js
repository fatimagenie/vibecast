/* ========================================
   VibeCast - Search Controller
   City search, geolocation, dropdown
   ======================================== */

import { searchCity } from '../models/weather.js';
import { DOM, renderHeroSearchResults } from '../views/homeView.js';
import { displayWeather } from './weatherController.js';

let heroSearchTimeout;
let searchTimeout;

export function initHeroSearch() {
    if (!DOM.heroSearchInput) return;

    DOM.heroSearchInput.addEventListener('focus', () => {
        if (DOM.heroSearchInput.value.trim().length >= 2) {
            DOM.heroSearchResults.classList.add('active');
        }
    });

    DOM.heroSearchInput.addEventListener('blur', () => {
        setTimeout(() => {
            if (DOM.heroSearchResults) DOM.heroSearchResults.classList.remove('active');
        }, 200);
    });

    DOM.heroSearchInput.addEventListener('input', (e) => {
        clearTimeout(heroSearchTimeout);
        const query = e.target.value.trim();
        if (query.length < 2) {
            DOM.heroSearchResults.innerHTML = '';
            DOM.heroSearchResults.classList.remove('active');
            if (DOM.heroSearchSpinner) DOM.heroSearchSpinner.style.display = 'none';
            return;
        }
        if (DOM.heroSearchSpinner) DOM.heroSearchSpinner.style.display = 'flex';
        heroSearchTimeout = setTimeout(async () => {
            const cities = await searchCity(query);
            if (DOM.heroSearchSpinner) DOM.heroSearchSpinner.style.display = 'none';
            renderHeroSearchResults(cities);
        }, 350);
    });

    DOM.heroSearchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            clearTimeout(heroSearchTimeout);
            const query = e.target.value.trim();
            if (query.length < 2) return;
            if (DOM.heroSearchSpinner) DOM.heroSearchSpinner.style.display = 'flex';
            const cities = await searchCity(query);
            if (DOM.heroSearchSpinner) DOM.heroSearchSpinner.style.display = 'none';
            if (cities.length > 0) {
                const city = cities[0];
                displayWeather(city.latitude, city.longitude, `${city.name}, ${city.country || ''}`);
                DOM.heroSearchInput.value = '';
                DOM.heroSearchResults.classList.remove('active');
            }
        }
    });

    // Delegate click on search results
    DOM.heroSearchResults.addEventListener('mousedown', (e) => {
        const item = e.target.closest('.hero-search-item');
        if (!item) return;
        e.preventDefault();
        const lat = parseFloat(item.dataset.lat);
        const lon = parseFloat(item.dataset.lon);
        const name = item.dataset.name;
        displayWeather(lat, lon, name);
        DOM.heroSearchInput.value = '';
        DOM.heroSearchResults.classList.remove('active');
    });
}

export function initModalSearch() {
    DOM.searchBtn.addEventListener('click', () => {
        DOM.locationModal.classList.add('active');
        DOM.searchInput.value = '';
        DOM.searchResults.innerHTML = '';
        setTimeout(() => DOM.searchInput.focus(), 100);
    });

    DOM.modalClose.addEventListener('click', () => {
        DOM.locationModal.classList.remove('active');
        DOM.searchResults.innerHTML = '';
    });

    DOM.locationModal.addEventListener('click', (e) => {
        if (e.target === DOM.locationModal) {
            DOM.locationModal.classList.remove('active');
            DOM.searchResults.innerHTML = '';
        }
    });

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
                        DOM.locationModal.classList.remove('active');
                        DOM.searchResults.innerHTML = '';
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
                DOM.locationModal.classList.remove('active');
                DOM.searchResults.innerHTML = '';
            }
        }
    });
}

export function initGeolocation() {
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
}
