/* ========================================
   VibeCast - Outfit View
   DOM rendering for outfit page
   ======================================== */

import { outfitItems, getLifestyleState } from '../models/lifestyle.js';

export function renderOutfitPage(category) {
    const grid = document.getElementById('outfit-grid-page');
    if (!grid) return;
    const items = outfitItems[category] || outfitItems.hot;
    grid.innerHTML = items.map(item => `
        <a href="${item.affiliateUrl}" target="_blank" class="item-card">
            <div class="item-card-img-wrapper">
                <img src="${item.image}" alt="${item.name}" loading="lazy"/>
                <span class="item-card-tag">${category.toUpperCase()}</span>
            </div>
            <div class="item-card-info">
                <h3 class="item-card-title">${item.name}</h3>
                <p class="item-card-desc">${item.desc}</p>
                <span class="item-card-cta">
                    View on Store
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
            </div>
        </a>
    `).join('');
}
