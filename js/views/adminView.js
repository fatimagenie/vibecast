/* ========================================
   VibeCast - Admin View
   DOM rendering for admin panel
   ======================================== */

import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../storage.js';
import {
    outfitItems as defaultOutfits,
    foodItems as defaultFood,
    lifestyleDatabase as defaultTips
} from '../models/lifestyle.js';
import { travelDestinations as defaultTravel } from '../models/travel.js';

// ========== Toast ==========
export function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========== Dashboard Stats ==========
export function updateDashboardStats() {
    const outfits = loadFromStorage(STORAGE_KEYS.OUTFITS, defaultOutfits);
    const food = loadFromStorage(STORAGE_KEYS.FOOD, defaultFood);
    const travel = loadFromStorage(STORAGE_KEYS.TRAVEL, defaultTravel);
    const tips = loadFromStorage(STORAGE_KEYS.TIPS, defaultTips);

    const statOutfits = document.getElementById('stat-outfits');
    const statFood = document.getElementById('stat-food');
    const statTravel = document.getElementById('stat-travel');
    const statTips = document.getElementById('stat-tips');

    if (statOutfits) statOutfits.textContent = Object.values(outfits).flat().length;
    if (statFood) statFood.textContent = Object.values(food).flat().length;
    if (statTravel) statTravel.textContent = Object.values(travel).flat().length;

    let tipCount = 0;
    Object.values(tips).forEach(cat => {
        tipCount += (cat.tips?.length || 0) + (cat.hydration?.length || 0) + (cat.todayPlan?.length || 0);
    });
    if (statTips) statTips.textContent = tipCount;
}

// ========== Render Tables ==========
export function renderOutfitTable(currentTab) {
    const outfits = loadFromStorage(STORAGE_KEYS.OUTFITS, defaultOutfits);
    const items = outfits[currentTab] || [];
    const tbody = document.getElementById('outfit-table-body');
    const empty = document.getElementById('outfit-empty');

    if (items.length === 0) {
        if (tbody) tbody.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }
    if (empty) empty.classList.add('hidden');

    if (tbody) {
        tbody.innerHTML = items.map((item, i) => `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" class="item-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2748%27 height=%2748%27%3E%3Crect fill=%27%231a1028%27 width=%2748%27 height=%2748%27/%3E%3C/svg%3E'"/></td>
                <td class="font-semibold">${item.name}</td>
                <td class="text-white/50 max-w-[200px] truncate">${item.desc}</td>
                <td class="text-primary text-xs">${item.affiliateUrl || '-'}</td>
                <td>
                    <div class="list-item-actions">
                        <button class="btn-edit" data-action="edit-outfit" data-index="${i}">Edit</button>
                        <button class="btn-danger" data-action="delete-outfit" data-index="${i}">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

export function renderFoodTable(currentTab) {
    const food = loadFromStorage(STORAGE_KEYS.FOOD, defaultFood);
    const items = food[currentTab] || [];
    const tbody = document.getElementById('food-table-body');
    const empty = document.getElementById('food-empty');

    if (items.length === 0) {
        if (tbody) tbody.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }
    if (empty) empty.classList.add('hidden');

    if (tbody) {
        tbody.innerHTML = items.map((item, i) => `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" class="item-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2748%27 height=%2748%27%3E%3Crect fill=%27%231a1028%27 width=%2748%27 height=%2748%27/%3E%3C/svg%3E'"/></td>
                <td class="font-semibold">${item.name}</td>
                <td class="text-white/50 max-w-[200px] truncate">${item.desc}</td>
                <td class="text-white/40 text-xs">${(item.ingredients || []).length} items</td>
                <td>
                    <div class="list-item-actions">
                        <button class="btn-edit" data-action="edit-food" data-index="${i}">Edit</button>
                        <button class="btn-danger" data-action="delete-food" data-index="${i}">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

export function renderTravelTable(currentTab) {
    const travel = loadFromStorage(STORAGE_KEYS.TRAVEL, defaultTravel);
    const items = travel[currentTab] || [];
    const tbody = document.getElementById('travel-table-body');
    const empty = document.getElementById('travel-empty');

    if (items.length === 0) {
        if (tbody) tbody.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }
    if (empty) empty.classList.add('hidden');

    if (tbody) {
        tbody.innerHTML = items.map((item, i) => `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" class="item-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2748%27 height=%2748%27%3E%3Crect fill=%27%231a1028%27 width=%2748%27 height=%2748%27/%3E%3C/svg%3E'"/></td>
                <td class="font-semibold">${item.name}</td>
                <td class="text-white/50 max-w-[200px] truncate">${item.desc}</td>
                <td>${item.tempC}°C</td>
                <td class="text-xs">${item.tag}</td>
                <td>
                    <div class="list-item-actions">
                        <button class="btn-edit" data-action="edit-travel" data-index="${i}">Edit</button>
                        <button class="btn-danger" data-action="delete-travel" data-index="${i}">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

export function renderLifestylePage(currentTab) {
    const tips = loadFromStorage(STORAGE_KEYS.TIPS, defaultTips);
    const cat = tips[currentTab] || { tips: [], hydration: [], todayPlan: [], description: '' };

    renderListItems('tips-list', cat.tips || [], 'tips');
    renderListItems('hydration-list-admin', cat.hydration || [], 'hydration');
    renderListItems('today-list-admin', cat.todayPlan || [], 'todayPlan');

    const desc = document.getElementById('lifestyle-description');
    if (desc) desc.value = cat.description || '';
}

function renderListItems(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map((item, i) => `
        <div class="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.03]">
            <span class="text-xs text-white/70 flex-1 truncate">${item}</span>
            <div class="list-item-actions">
                <button class="btn-edit text-[10px] px-2 py-1" data-action="edit-list" data-type="${type}" data-index="${i}">Edit</button>
                <button class="btn-danger text-[10px] px-2 py-1" data-action="delete-list" data-type="${type}" data-index="${i}">Del</button>
            </div>
        </div>
    `).join('');
}
