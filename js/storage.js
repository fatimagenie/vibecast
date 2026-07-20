/* ========================================
   VibeCast - localStorage Wrapper
   ======================================== */

export function loadFromStorage(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('localStorage save error:', e);
    }
}

export function removeFromStorage(key) {
    localStorage.removeItem(key);
}

export function resetStorage() {
    localStorage.removeItem('vibecast-outfits');
    localStorage.removeItem('vibecast-food');
    localStorage.removeItem('vibecast-travel');
    localStorage.removeItem('vibecast-tips');
    localStorage.removeItem('vibecast-settings');
    localStorage.removeItem('vibecast-admin-password');
}

export const STORAGE_KEYS = {
    ADMIN_PASSWORD: 'vibecast-admin-password',
    OUTFITS: 'vibecast-outfits',
    FOOD: 'vibecast-food',
    TRAVEL: 'vibecast-travel',
    TIPS: 'vibecast-tips',
    SETTINGS: 'vibecast-settings',
    AUTH: 'vibecast-admin-auth',
    UNIT: 'vibecast-unit',
};
