/* ========================================
   VibeCast - Admin Controller
   CRUD operations, auth, admin logic
   ======================================== */

import { loadFromStorage, saveToStorage, removeFromStorage, resetStorage, STORAGE_KEYS } from '../storage.js';
import {
    outfitItems as defaultOutfits,
    foodItems as defaultFood,
    lifestyleDatabase as defaultTips
} from '../models/lifestyle.js';
import { travelDestinations as defaultTravel } from '../models/travel.js';
import {
    showToast,
    updateDashboardStats,
    renderOutfitTable,
    renderFoodTable,
    renderTravelTable,
    renderLifestylePage
} from '../views/adminView.js';

// ========== Default Data ==========
const DEFAULT_PASSWORD = 'Wather@';
const DEFAULT_SETTINGS = {
    city: 'Peshawar',
    lat: '34.0151',
    lon: '71.5249',
    brand: 'VibeCast',
    copyright: '2024 VibeCast. All rights reserved.',
    password: DEFAULT_PASSWORD
};

// ========== State ==========
let currentPage = 'dashboard';
let currentOutfitTab = 'hot';
let currentFoodTab = 'hot';
let currentTravelTab = 'hot';
let currentLifestyleTab = 'hot';

// ========== Auth ==========
export function login() {
    const input = document.getElementById('login-password');
    const error = document.getElementById('login-error');
    const password = input.value.trim();
    const stored = loadFromStorage(STORAGE_KEYS.ADMIN_PASSWORD, DEFAULT_PASSWORD);

    if (password === stored) {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, '1');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        error.style.display = 'none';
        initDashboard();
    } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
    }
}

export function logout() {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    location.reload();
}

export function checkAuth() {
    if (sessionStorage.getItem(STORAGE_KEYS.AUTH)) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        initDashboard();
    }
}

// ========== Sidebar ==========
export function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ========== Page Switching ==========
export function showPage(page) {
    currentPage = page;

    document.querySelectorAll('.admin-page').forEach(p => p.classList.add('hidden'));
    document.getElementById('page-' + page).classList.remove('hidden');

    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    if (page === 'dashboard') updateDashboardStats();
    if (page === 'outfits') renderOutfitTable(currentOutfitTab);
    if (page === 'food') renderFoodTable(currentFoodTab);
    if (page === 'travel') renderTravelTable(currentTravelTab);
    if (page === 'tips') renderLifestylePage(currentLifestyleTab);
    if (page === 'settings') loadSettings();

    document.getElementById('sidebar').classList.remove('open');
}

// ========== Dashboard ==========
function initDashboard() {
    updateDashboardStats();
}

// ========== Modal ==========
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ========== Outfits ==========
export function switchOutfitTab(tab, btn) {
    currentOutfitTab = tab;
    document.querySelectorAll('#page-outfits .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderOutfitTable(currentOutfitTab);
}

export function openOutfitModal(index) {
    const isEdit = index !== undefined;
    document.getElementById('outfit-modal-title').textContent = isEdit ? 'Edit Outfit' : 'Add Outfit';
    document.getElementById('outfit-edit-index').value = isEdit ? index : -1;

    if (isEdit) {
        const outfits = loadFromStorage(STORAGE_KEYS.OUTFITS, defaultOutfits);
        const item = outfits[currentOutfitTab][index];
        document.getElementById('outfit-name').value = item.name;
        document.getElementById('outfit-desc').value = item.desc;
        document.getElementById('outfit-image').value = item.image;
        document.getElementById('outfit-link').value = item.affiliateUrl || '';
    } else {
        document.getElementById('outfit-name').value = '';
        document.getElementById('outfit-desc').value = '';
        document.getElementById('outfit-image').value = '';
        document.getElementById('outfit-link').value = '';
    }
    openModal('outfit-modal');
}

export function saveOutfit() {
    const name = document.getElementById('outfit-name').value.trim();
    const desc = document.getElementById('outfit-desc').value.trim();
    const image = document.getElementById('outfit-image').value.trim();
    const link = document.getElementById('outfit-link').value.trim();
    const editIndex = parseInt(document.getElementById('outfit-edit-index').value);

    if (!name) { alert('Name is required'); return; }

    const outfits = loadFromStorage(STORAGE_KEYS.OUTFITS, defaultOutfits);
    const item = { name, desc, image: image || 'https://via.placeholder.com/500x600', affiliateUrl: link || '#' };

    if (editIndex >= 0) {
        outfits[currentOutfitTab][editIndex] = item;
    } else {
        if (!outfits[currentOutfitTab]) outfits[currentOutfitTab] = [];
        outfits[currentOutfitTab].push(item);
    }

    saveToStorage(STORAGE_KEYS.OUTFITS, outfits);
    closeModal('outfit-modal');
    renderOutfitTable(currentOutfitTab);
    showToast(editIndex >= 0 ? 'Outfit updated' : 'Outfit added');
}

export function deleteOutfit(index) {
    if (!confirm('Delete this outfit item?')) return;
    const outfits = loadFromStorage(STORAGE_KEYS.OUTFITS, defaultOutfits);
    outfits[currentOutfitTab].splice(index, 1);
    saveToStorage(STORAGE_KEYS.OUTFITS, outfits);
    renderOutfitTable(currentOutfitTab);
    showToast('Outfit deleted');
}

// ========== Food ==========
export function switchFoodTab(tab, btn) {
    currentFoodTab = tab;
    document.querySelectorAll('#page-food .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderFoodTable(currentFoodTab);
}

export function openFoodModal(index) {
    const isEdit = index !== undefined;
    document.getElementById('food-modal-title').textContent = isEdit ? 'Edit Food Item' : 'Add Food Item';
    document.getElementById('food-edit-index').value = isEdit ? index : -1;

    if (isEdit) {
        const food = loadFromStorage(STORAGE_KEYS.FOOD, defaultFood);
        const item = food[currentFoodTab][index];
        document.getElementById('food-name').value = item.name;
        document.getElementById('food-desc').value = item.desc;
        document.getElementById('food-image').value = item.image;
        document.getElementById('food-ingredients').value = (item.ingredients || []).join('\n');
        document.getElementById('food-recipe').value = (item.recipe || []).join('\n');
    } else {
        document.getElementById('food-name').value = '';
        document.getElementById('food-desc').value = '';
        document.getElementById('food-image').value = '';
        document.getElementById('food-ingredients').value = '';
        document.getElementById('food-recipe').value = '';
    }
    openModal('food-modal');
}

export function saveFood() {
    const name = document.getElementById('food-name').value.trim();
    const desc = document.getElementById('food-desc').value.trim();
    const image = document.getElementById('food-image').value.trim();
    const ingredients = document.getElementById('food-ingredients').value.split('\n').map(s => s.trim()).filter(Boolean);
    const recipe = document.getElementById('food-recipe').value.split('\n').map(s => s.trim()).filter(Boolean);
    const editIndex = parseInt(document.getElementById('food-edit-index').value);

    if (!name) { alert('Name is required'); return; }

    const food = loadFromStorage(STORAGE_KEYS.FOOD, defaultFood);
    const item = { name, desc, image: image || 'https://via.placeholder.com/500x400', affiliateUrl: '#', ingredients, recipe };

    if (editIndex >= 0) {
        food[currentFoodTab][editIndex] = item;
    } else {
        if (!food[currentFoodTab]) food[currentFoodTab] = [];
        food[currentFoodTab].push(item);
    }

    saveToStorage(STORAGE_KEYS.FOOD, food);
    closeModal('food-modal');
    renderFoodTable(currentFoodTab);
    showToast(editIndex >= 0 ? 'Food item updated' : 'Food item added');
}

export function deleteFood(index) {
    if (!confirm('Delete this food item?')) return;
    const food = loadFromStorage(STORAGE_KEYS.FOOD, defaultFood);
    food[currentFoodTab].splice(index, 1);
    saveToStorage(STORAGE_KEYS.FOOD, food);
    renderFoodTable(currentFoodTab);
    showToast('Food item deleted');
}

// ========== Travel ==========
export function switchTravelTab(tab, btn) {
    currentTravelTab = tab;
    document.querySelectorAll('#page-travel .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTravelTable(currentTravelTab);
}

export function openTravelModal(index) {
    const isEdit = index !== undefined;
    document.getElementById('travel-modal-title').textContent = isEdit ? 'Edit Destination' : 'Add Destination';
    document.getElementById('travel-edit-index').value = isEdit ? index : -1;

    if (isEdit) {
        const travel = loadFromStorage(STORAGE_KEYS.TRAVEL, defaultTravel);
        const item = travel[currentTravelTab][index];
        document.getElementById('travel-name').value = item.name;
        document.getElementById('travel-desc').value = item.desc;
        document.getElementById('travel-temp').value = item.tempC;
        document.getElementById('travel-tag').value = item.tag;
        document.getElementById('travel-image').value = item.image;
        document.getElementById('travel-link').value = item.affiliateUrl || '';
    } else {
        document.getElementById('travel-name').value = '';
        document.getElementById('travel-desc').value = '';
        document.getElementById('travel-temp').value = '';
        document.getElementById('travel-tag').value = '';
        document.getElementById('travel-image').value = '';
        document.getElementById('travel-link').value = '';
    }
    openModal('travel-modal');
}

export function saveTravel() {
    const name = document.getElementById('travel-name').value.trim();
    const desc = document.getElementById('travel-desc').value.trim();
    const tempC = parseInt(document.getElementById('travel-temp').value) || 25;
    const tag = document.getElementById('travel-tag').value.trim();
    const image = document.getElementById('travel-image').value.trim();
    const link = document.getElementById('travel-link').value.trim();
    const editIndex = parseInt(document.getElementById('travel-edit-index').value);

    if (!name) { alert('Name is required'); return; }

    const travel = loadFromStorage(STORAGE_KEYS.TRAVEL, defaultTravel);
    const item = { name, desc, tempC, tag: tag || 'Popular', image: image || 'https://via.placeholder.com/600x400', affiliateUrl: link || '#' };

    if (editIndex >= 0) {
        travel[currentTravelTab][editIndex] = item;
    } else {
        if (!travel[currentTravelTab]) travel[currentTravelTab] = [];
        travel[currentTravelTab].push(item);
    }

    saveToStorage(STORAGE_KEYS.TRAVEL, travel);
    closeModal('travel-modal');
    renderTravelTable(currentTravelTab);
    showToast(editIndex >= 0 ? 'Destination updated' : 'Destination added');
}

export function deleteTravel(index) {
    if (!confirm('Delete this destination?')) return;
    const travel = loadFromStorage(STORAGE_KEYS.TRAVEL, defaultTravel);
    travel[currentTravelTab].splice(index, 1);
    saveToStorage(STORAGE_KEYS.TRAVEL, travel);
    renderTravelTable(currentTravelTab);
    showToast('Destination deleted');
}

// ========== Lifestyle / Tips ==========
export function switchLifestyleTab(tab, btn) {
    currentLifestyleTab = tab;
    document.querySelectorAll('#page-tips .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderLifestylePage(currentLifestyleTab);
}

export function addItemToList(type) {
    document.getElementById('list-edit-index').value = -1;
    document.getElementById('list-type').value = type;
    document.getElementById('list-item-text').value = '';
    const titles = { tips: 'Add Tip', hydration: 'Add Hydration Item', todayPlan: 'Add Plan Item' };
    document.getElementById('list-modal-title').textContent = titles[type] || 'Add Item';
    openModal('list-modal');
}

export function editListItem(type, index) {
    const tips = loadFromStorage(STORAGE_KEYS.TIPS, defaultTips);
    const cat = tips[currentLifestyleTab];
    const item = cat[type][index];

    document.getElementById('list-edit-index').value = index;
    document.getElementById('list-type').value = type;
    document.getElementById('list-item-text').value = item;
    const titles = { tips: 'Edit Tip', hydration: 'Edit Hydration Item', todayPlan: 'Edit Plan Item' };
    document.getElementById('list-modal-title').textContent = titles[type] || 'Edit Item';
    openModal('list-modal');
}

export function deleteListItem(type, index) {
    if (!confirm('Delete this item?')) return;
    const tips = loadFromStorage(STORAGE_KEYS.TIPS, defaultTips);
    tips[currentLifestyleTab][type].splice(index, 1);
    saveToStorage(STORAGE_KEYS.TIPS, tips);
    renderLifestylePage(currentLifestyleTab);
    showToast('Item deleted');
}

export function saveListItem() {
    const text = document.getElementById('list-item-text').value.trim();
    const index = parseInt(document.getElementById('list-edit-index').value);
    const type = document.getElementById('list-type').value;

    if (!text) { alert('Text is required'); return; }

    const tips = loadFromStorage(STORAGE_KEYS.TIPS, defaultTips);
    if (!tips[currentLifestyleTab]) {
        tips[currentLifestyleTab] = { tips: [], hydration: [], todayPlan: [], description: '' };
    }
    if (!tips[currentLifestyleTab][type]) tips[currentLifestyleTab][type] = [];

    if (index >= 0) {
        tips[currentLifestyleTab][type][index] = text;
    } else {
        tips[currentLifestyleTab][type].push(text);
    }

    saveToStorage(STORAGE_KEYS.TIPS, tips);
    closeModal('list-modal');
    renderLifestylePage(currentLifestyleTab);
    showToast(index >= 0 ? 'Item updated' : 'Item added');
}

export function saveLifestyleDescription() {
    const desc = document.getElementById('lifestyle-description').value.trim();
    const tips = loadFromStorage(STORAGE_KEYS.TIPS, defaultTips);
    if (!tips[currentLifestyleTab]) {
        tips[currentLifestyleTab] = { tips: [], hydration: [], todayPlan: [], description: '' };
    }
    tips[currentLifestyleTab].description = desc;
    saveToStorage(STORAGE_KEYS.TIPS, tips);
    showToast('Description saved');
}

// ========== Settings ==========
function loadSettings() {
    const settings = loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    document.getElementById('setting-city').value = settings.city || '';
    document.getElementById('setting-lat').value = settings.lat || '';
    document.getElementById('setting-lon').value = settings.lon || '';
    document.getElementById('setting-brand').value = settings.brand || '';
    document.getElementById('setting-copyright').value = settings.copyright || '';
    document.getElementById('setting-password').value = '';
}

export function saveSettings() {
    const settings = {
        city: document.getElementById('setting-city').value.trim(),
        lat: document.getElementById('setting-lat').value.trim(),
        lon: document.getElementById('setting-lon').value.trim(),
        brand: document.getElementById('setting-brand').value.trim(),
        copyright: document.getElementById('setting-copyright').value.trim(),
    };

    const newPassword = document.getElementById('setting-password').value.trim();
    if (newPassword) {
        settings.password = newPassword;
        saveToStorage(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
    } else {
        settings.password = loadFromStorage(STORAGE_KEYS.ADMIN_PASSWORD, DEFAULT_PASSWORD);
    }

    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
    showToast('Settings saved');
}

// ========== Backup / Export / Import ==========
export function exportData() {
    const allData = {
        outfits: loadFromStorage(STORAGE_KEYS.OUTFITS, defaultOutfits),
        food: loadFromStorage(STORAGE_KEYS.FOOD, defaultFood),
        travel: loadFromStorage(STORAGE_KEYS.TRAVEL, defaultTravel),
        tips: loadFromStorage(STORAGE_KEYS.TIPS, defaultTips),
        settings: loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibecast-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully');
}

export function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.outfits) saveToStorage(STORAGE_KEYS.OUTFITS, data.outfits);
            if (data.food) saveToStorage(STORAGE_KEYS.FOOD, data.food);
            if (data.travel) saveToStorage(STORAGE_KEYS.TRAVEL, data.travel);
            if (data.tips) saveToStorage(STORAGE_KEYS.TIPS, data.tips);
            if (data.settings) {
                saveToStorage(STORAGE_KEYS.SETTINGS, data.settings);
                if (data.settings.password) saveToStorage(STORAGE_KEYS.ADMIN_PASSWORD, data.settings.password);
            }
            showToast('Data imported successfully');
            showPage(currentPage);
        } catch (err) {
            alert('Invalid JSON file: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

export function resetAllData() {
    if (!confirm('This will DELETE all your custom data and restore defaults. Are you sure?')) return;
    if (!confirm('Final confirmation: Reset everything?')) return;

    resetStorage();
    showToast('All data reset to defaults');
    showPage(currentPage);
}

// ========== Init Admin Events ==========
export function initAdminEvents() {
    // Login
    const loginInput = document.getElementById('login-password');
    if (loginInput) {
        loginInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });
    }

    // Keyboard - Escape to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
    });

    // Delegate all button clicks via data-action
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const index = parseInt(btn.dataset.index);
        const type = btn.dataset.type;

        switch (action) {
            case 'show-page': showPage(btn.dataset.page); break;
            case 'logout': logout(); break;
            case 'toggle-sidebar': toggleSidebar(); break;
            case 'open-outfit-modal': openOutfitModal(); break;
            case 'edit-outfit': openOutfitModal(index); break;
            case 'delete-outfit': deleteOutfit(index); break;
            case 'save-outfit': saveOutfit(); break;
            case 'open-food-modal': openFoodModal(); break;
            case 'edit-food': openFoodModal(index); break;
            case 'delete-food': deleteFood(index); break;
            case 'save-food': saveFood(); break;
            case 'open-travel-modal': openTravelModal(); break;
            case 'edit-travel': openTravelModal(index); break;
            case 'delete-travel': deleteTravel(index); break;
            case 'save-travel': saveTravel(); break;
            case 'add-list-item': addItemToList(type); break;
            case 'edit-list': editListItem(type, index); break;
            case 'delete-list': deleteListItem(type, index); break;
            case 'save-list-item': saveListItem(); break;
            case 'save-lifestyle-desc': saveLifestyleDescription(); break;
            case 'save-settings': saveSettings(); break;
            case 'export-data': exportData(); break;
            case 'reset-data': resetAllData(); break;
            case 'import-data': document.getElementById('import-file').click(); break;
            case 'close-modal': closeModal(btn.dataset.modal); break;
        }
    });

    // File import handler
    const importInput = document.getElementById('import-file');
    if (importInput) {
        importInput.addEventListener('change', importData);
    }

    // Tab switching
    document.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.tab-btn');
        if (!tabBtn) return;

        const page = tabBtn.closest('.admin-page');
        if (!page) return;

        const pageId = page.id;

        if (pageId === 'page-outfits') switchOutfitTab(tabBtn.dataset.tab || tabBtn.textContent.trim().toLowerCase(), tabBtn);
        if (pageId === 'page-food') switchFoodTab(tabBtn.dataset.tab || tabBtn.textContent.trim().toLowerCase(), tabBtn);
        if (pageId === 'page-travel') switchTravelTab(tabBtn.dataset.tab || tabBtn.textContent.trim().toLowerCase(), tabBtn);
        if (pageId === 'page-tips') switchLifestyleTab(tabBtn.dataset.tab || tabBtn.textContent.trim().toLowerCase(), tabBtn);
    });
}
