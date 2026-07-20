/* ========================================
   VibeCast - Admin Page Entry Point
   ======================================== */

import { checkAuth, initAdminEvents } from './controllers/adminController.js';

document.addEventListener('DOMContentLoaded', () => {
    initAdminEvents();
    checkAuth();
});
