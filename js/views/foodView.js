/* ========================================
   VibeCast - Food View
   DOM rendering for food page
   ======================================== */

import { foodItems } from '../models/lifestyle.js';

export function renderFoodPage(category) {
    const grid = document.getElementById('food-grid-page');
    if (!grid) return;
    const items = foodItems[category] || foodItems.hot;
    grid.innerHTML = items.map((item, i) => `
        <div class="item-card" data-index="${i}" data-category="${category}" style="cursor:pointer;">
            <div class="item-card-img-wrapper">
                <img src="${item.image}" alt="${item.name}" loading="lazy"/>
                <span class="item-card-tag">${category.toUpperCase()}</span>
            </div>
            <div class="item-card-info">
                <h3 class="item-card-title">${item.name}</h3>
                <p class="item-card-desc">${item.desc}</p>
                <span class="item-card-cta">
                    View Recipe
                    <span class="material-symbols-outlined text-[16px]">menu_book</span>
                </span>
            </div>
        </div>
    `).join('');
}

export function openRecipeModal(index, category) {
    const item = foodItems[category][index];
    if (!item) return;
    document.getElementById('recipe-modal-img').src = item.image;
    document.getElementById('recipe-modal-title').textContent = item.name;
    document.getElementById('recipe-modal-desc').textContent = item.desc;

    const ingredientsList = document.getElementById('recipe-ingredients');
    ingredientsList.innerHTML = item.ingredients.map(ing => `<li>${ing}</li>`).join('');

    const stepsList = document.getElementById('recipe-steps');
    stepsList.innerHTML = item.recipe.map(step => `<li>${step}</li>`).join('');

    document.getElementById('recipe-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

export function closeRecipeModal() {
    document.getElementById('recipe-modal').classList.remove('active');
    document.body.style.overflow = '';
}
