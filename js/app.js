/* ========================================
   VibeCast - Lifestyle Weather Companion
   Weather API + Dynamic Content
   ======================================== */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    GEO_API: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
    DEFAULT_CITY: 'Karachi',
};

// ============================================
// STATE
// ============================================
let currentGender = 'men';
let currentStyle = 'western';
let currentWeatherData = null;

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
    temperature: document.getElementById('temperature'),
    weatherBadge: document.getElementById('weather-badge'),
    weatherBadgeIcon: document.getElementById('weather-badge-icon'),
    weatherBadgeText: document.getElementById('weather-badge-text'),
    vibeTitle: document.getElementById('vibe-title'),
    vibeDescription: document.getElementById('vibe-description'),
    windSpeed: document.getElementById('wind-speed'),
    humidity: document.getElementById('humidity'),
    uvIndex: document.getElementById('uv-index'),
    outfitSubtitle: document.getElementById('outfit-subtitle'),
    outfitGrid: document.getElementById('outfit-grid'),
    spfTip: document.getElementById('spf-tip'),
    rainAlert: document.getElementById('rain-alert'),
    rainAlertText: document.getElementById('rain-alert-text'),
    genderBtns: document.querySelectorAll('.gender-btn'),
    styleBtns: document.querySelectorAll('.style-btn'),
    foodBadge: document.getElementById('food-badge'),
    foodTitle: document.getElementById('food-title'),
    foodDescription: document.getElementById('food-description'),
    foodImage: document.getElementById('food-image'),
    weekendGrid: document.getElementById('weekend-grid'),
    searchBtn: document.getElementById('search-btn'),
    locationBtn: document.getElementById('location-btn'),
    locationModal: document.getElementById('location-modal'),
    modalClose: document.getElementById('modal-close'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
};

// ============================================
// WEATHER CODES
// ============================================
const WEATHER_CODES = {
    0: { condition: 'Clear Sky', icon: 'wb_sunny', mood: 'Sunshine Day', badge: 'CLEAR SKY', bg: 'weather-gradient' },
    1: { condition: 'Mainly Clear', icon: 'wb_sunny', mood: 'Perfect Day', badge: 'MAINLY CLEAR', bg: 'weather-gradient' },
    2: { condition: 'Partly Cloudy', icon: 'partly_cloudy_day', mood: 'Picnic Perfect', badge: 'PARTLY SUNNY', bg: 'weather-gradient' },
    3: { condition: 'Overcast', icon: 'cloud', mood: 'Cozy Vibes', badge: 'OVERCAST', bg: 'weather-gradient' },
    45: { condition: 'Foggy', icon: 'foggy', mood: 'Mysterious Morning', badge: 'FOGGY', bg: 'weather-gradient' },
    48: { condition: 'Rime Fog', icon: 'foggy', mood: 'Mysterious Vibes', badge: 'FOGGY', bg: 'weather-gradient' },
    51: { condition: 'Light Drizzle', icon: 'rainy_light', mood: 'Gentle Rain', badge: 'LIGHT DRIZZLE', bg: 'weather-gradient-rain' },
    53: { condition: 'Moderate Drizzle', icon: 'rainy', mood: 'Drizzle Day', badge: 'DRIZZLE', bg: 'weather-gradient-rain' },
    55: { condition: 'Dense Drizzle', icon: 'rainy_heavy', mood: 'Stay Cozy', badge: 'HEAVY DRIZZLE', bg: 'weather-gradient-rain' },
    61: { condition: 'Slight Rain', icon: 'rainy_light', mood: 'Rainy Day', badge: 'LIGHT RAIN', bg: 'weather-gradient-rain' },
    63: { condition: 'Moderate Rain', icon: 'rainy', mood: 'Pakora Weather', badge: 'RAIN', bg: 'weather-gradient-rain' },
    65: { condition: 'Heavy Rain', icon: 'rainy_heavy', mood: 'Stay Inside', badge: 'HEAVY RAIN', bg: 'weather-gradient-rain' },
    71: { condition: 'Slight Snow', icon: 'weather_snowy', mood: 'Winter Wonderland', badge: 'LIGHT SNOW', bg: 'weather-gradient-snow' },
    73: { condition: 'Moderate Snow', icon: 'weather_snowy', mood: 'Snow Day!', badge: 'SNOW', bg: 'weather-gradient-snow' },
    75: { condition: 'Heavy Snow', icon: 'weather_snowy', mood: 'Bundle Up!', badge: 'HEAVY SNOW', bg: 'weather-gradient-snow' },
    80: { condition: 'Light Showers', icon: 'rainy_light', mood: 'Shower Time', badge: 'SHOWERS', bg: 'weather-gradient-rain' },
    81: { condition: 'Moderate Showers', icon: 'rainy', mood: 'Carry Umbrella', badge: 'SHOWERS', bg: 'weather-gradient-rain' },
    82: { condition: 'Violent Showers', icon: 'rainy_heavy', mood: 'Stay Dry!', badge: 'STORM', bg: 'weather-gradient-rain' },
    95: { condition: 'Thunderstorm', icon: 'thunderstorm', mood: 'Thunder & Lightning', badge: 'THUNDERSTORM', bg: 'weather-gradient-rain' },
    96: { condition: 'Thunderstorm with Hail', icon: 'thunderstorm', mood: 'Stay Safe!', badge: 'SEVERE STORM', bg: 'weather-gradient-rain' },
};

// ============================================
// OUTFIT DATA - WESTERN (Men/Women/Unisex)
// ============================================
const OUTFIT_WESTERN = {
    men: {
        hot: [
            { name: 'Linen Shirt', desc: 'Keep it light and breezy in the midday sun.', tag: 'Breathable', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+linen+shirt' },
            { name: 'Oversized Sunglasses', desc: 'Protect your eyes with a touch of elegance.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+sunglasses' },
            { name: 'Breathable Chinos', desc: 'Versatile comfort for city strolls or park sits.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+chinos' },
        ],
        warm: [
            { name: 'Cotton Polo', desc: 'Classic style for a warm afternoon.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1625910513413-5fc428e4d14d?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+polo+tshirt' },
            { name: 'Canvas Sneakers', desc: 'Walk comfortable all day long.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+sneakers' },
            { name: 'Baseball Cap', desc: 'Stay shaded and stylish.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+cap' },
        ],
        cool: [
            { name: 'Light Jacket', desc: 'Perfect layer for cooler evenings.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+jacket' },
            { name: 'Denim Jeans', desc: 'Classic comfort for any occasion.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+jeans' },
            { name: 'Ankle Boots', desc: 'Step out in style.', tag: 'Style', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+boots' },
        ],
        cold: [
            { name: 'Wool Sweater', desc: 'Stay warm without sacrificing style.', tag: 'Warm', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a00?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+sweater' },
            { name: 'Puffer Jacket', desc: 'Maximum warmth for cold days.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1544923246-77307dd270c8?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+puffer+jacket' },
            { name: 'Knit Scarf', desc: 'Keep your neck warm and cozy.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+scarf' },
        ],
        rainy: [
            { name: 'Rain Jacket', desc: 'Stay dry in style.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+rain+jacket' },
            { name: 'Waterproof Boots', desc: 'Walk through puddles worry-free.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+waterproof+boots' },
            { name: 'Compact Umbrella', desc: 'Never leave home without it.', tag: 'Must Have', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=umbrella' },
        ],
    },
    women: {
        hot: [
            { name: 'Flowy Sundress', desc: 'Effortless elegance for hot summer days.', tag: 'Breezy', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+sundress' },
            { name: 'Straw Hat', desc: 'Shield yourself from the sun in style.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+straw+hat' },
            { name: 'Espadrille Sandals', desc: 'Chic and comfortable for warm days.', tag: 'Style', img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+espadrilles' },
        ],
        warm: [
            { name: 'Cotton Blouse', desc: 'Light and airy for a perfect afternoon.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+blouse' },
            { name: 'White Sneakers', desc: 'Go anywhere, do anything.', tag: 'Versatile', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+sneakers' },
            { name: 'Crossbody Bag', desc: 'Keep your essentials close.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+crossbody+bag' },
        ],
        cool: [
            { name: 'Cardigan', desc: 'Layer up with cozy comfort.', tag: 'Cozy', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a00?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+cardigan' },
            { name: 'High-Waist Jeans', desc: 'Flattering fit for any occasion.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+jeans' },
            { name: 'Ankle Boots', desc: 'Step out in style.', tag: 'Style', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+boots' },
        ],
        cold: [
            { name: 'Cozy Knit Sweater', desc: 'Stay warm and stylish.', tag: 'Warm', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+sweater' },
            { name: 'Wool Coat', desc: 'Elegance meets warmth.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+wool+coat' },
            { name: 'Knit Beanie', desc: 'Keep your head warm.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+beanie' },
        ],
        rainy: [
            { name: 'Trench Coat', desc: 'Classic rain protection.', tag: 'Elegant', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+trench+coat' },
            { name: 'Rain Boots', desc: 'Walk through puddles worry-free.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=women+rain+boots' },
            { name: 'Compact Umbrella', desc: 'Never leave home without it.', tag: 'Must Have', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=umbrella' },
        ],
    },
    unisex: {
        hot: [
            { name: 'Linen Shirt', desc: 'Keep it light and breezy in the midday sun.', tag: 'Breathable', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=linen+shirt' },
            { name: 'Sunglasses', desc: 'Protect your eyes with a touch of elegance.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=sunglasses' },
            { name: 'Breathable Shorts', desc: 'Versatile comfort for city strolls.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=shorts' },
        ],
        warm: [
            { name: 'Cotton T-Shirt', desc: 'Classic style for a warm afternoon.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=tshirt' },
            { name: 'Canvas Sneakers', desc: 'Walk comfortable all day long.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=sneakers' },
            { name: 'Baseball Cap', desc: 'Stay shaded and stylish.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=cap' },
        ],
        cool: [
            { name: 'Light Jacket', desc: 'Perfect layer for cooler evenings.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=jacket' },
            { name: 'Denim Jeans', desc: 'Classic comfort for any occasion.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=jeans' },
            { name: 'Sneakers', desc: 'Step out in style.', tag: 'Style', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=sneakers' },
        ],
        cold: [
            { name: 'Wool Sweater', desc: 'Stay warm without sacrificing style.', tag: 'Warm', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a00?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=sweater' },
            { name: 'Puffer Jacket', desc: 'Maximum warmth for cold days.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1544923246-77307dd270c8?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=puffer+jacket' },
            { name: 'Knit Scarf', desc: 'Keep your neck warm and cozy.', tag: 'Comfort', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=scarf' },
        ],
        rainy: [
            { name: 'Rain Jacket', desc: 'Stay dry in style.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=rain+jacket' },
            { name: 'Waterproof Boots', desc: 'Walk through puddles worry-free.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=waterproof+boots' },
            { name: 'Compact Umbrella', desc: 'Never leave home without it.', tag: 'Must Have', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=umbrella' },
        ],
    },
};

// ============================================
// OUTFIT DATA - DESI (Men/Women/Unisex)
// ============================================
const OUTFIT_DESI = {
    men: {
        hot: [
            { name: 'Lawn Kurta', desc: 'Beat the heat with traditional comfort.', tag: 'Traditional', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+lawn+kurta' },
            { name: 'Peshawari Chappal', desc: 'Walk in tradition and comfort.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=peshawari+chappal' },
            { name: 'Cotton Waistcoat', desc: 'Layer up with elegance.', tag: 'Elegant', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=men+waistcoat' },
        ],
        warm: [
            { name: 'Kurta Pajama', desc: 'Classic comfort for any occasion.', tag: 'Traditional', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=kurta+pajama' },
            { name: 'Leather Khussa', desc: 'Step out in style.', tag: 'Heritage', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=khussa' },
            { name: 'Embroidered Cap', desc: 'Complete the traditional look.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=turban+cap' },
        ],
        cool: [
            { name: 'Wool Kurta', desc: 'Stay warm with traditional style.', tag: 'Warm', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=wool+kurta' },
            { name: 'Peshawari Cap', desc: 'Keep your head warm.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=peshawari+cap' },
            { name: 'Leather Boots', desc: 'Step out in style.', tag: 'Style', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=leather+boots' },
        ],
        cold: [
            { name: 'Peshawari Waistcoat', desc: 'Warmth meets tradition.', tag: 'Heritage', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=peshawari+waistcoat' },
            { name: 'Wool Shawl', desc: 'Wrap up in elegance.', tag: 'Elegant', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=wool+shawl' },
            { name: 'Karakul Cap', desc: 'Traditional warmth.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=karakul+cap' },
        ],
        rainy: [
            { name: 'Raincoat', desc: 'Stay dry in style.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=raincoat' },
            { name: 'Waterproof Chappal', desc: 'Walk through puddles worry-free.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=waterproof+chappal' },
            { name: 'Compact Umbrella', desc: 'Never leave home without it.', tag: 'Must Have', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=umbrella' },
        ],
    },
    women: {
        hot: [
            { name: 'Lawn Dupatta Set', desc: 'Beat the heat with traditional grace.', tag: 'Traditional', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=lawn+dupatta' },
            { name: 'Kolhapuri Sandals', desc: 'Walk in tradition and comfort.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=kolhapuri+sandals' },
            { name: 'Embroidered Clutch', desc: 'Add elegance to your look.', tag: 'Elegant', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=embroidered+clutch' },
        ],
        warm: [
            { name: 'Kurti Set', desc: 'Classic comfort for any occasion.', tag: 'Traditional', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=kurti+set' },
            { name: 'Juttis', desc: 'Step out in style.', tag: 'Heritage', img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=juttis' },
            { name: 'Potli Bag', desc: 'Complete the traditional look.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=potli+bag' },
        ],
        cool: [
            { name: 'Wool Kurti', desc: 'Stay warm with traditional style.', tag: 'Warm', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=wool+kurti' },
            { name: 'Silk Scarf', desc: 'Wrap up in elegance.', tag: 'Elegant', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=silk+scarf' },
            { name: 'Knee-High Boots', desc: 'Step out in style.', tag: 'Style', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=knee+high+boots' },
        ],
        cold: [
            { name: 'Velvet Shawl', desc: 'Wrap up in luxury.', tag: 'Luxury', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=velvet+shawl' },
            { name: 'Pashmina Stole', desc: 'Warmth meets elegance.', tag: 'Elegant', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=pashmina+stole' },
            { name: 'Wool Potli', desc: 'Complete the look.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=wool+potli' },
        ],
        rainy: [
            { name: 'Waterproof Kurti', desc: 'Stay dry in style.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=waterproof+kurti' },
            { name: 'Rain Juttis', desc: 'Walk through puddles worry-free.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=rain+juttis' },
            { name: 'Compact Umbrella', desc: 'Never leave home without it.', tag: 'Must Have', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=umbrella' },
        ],
    },
    unisex: {
        hot: [
            { name: 'Lawn Kurta', desc: 'Beat the heat with traditional comfort.', tag: 'Traditional', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=lawn+kurta' },
            { name: 'Kolhapuri Chappal', desc: 'Walk in tradition and comfort.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=kolhapuri' },
            { name: 'Cotton Dupatta', desc: 'Add elegance to your look.', tag: 'Elegant', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=dupatta' },
        ],
        warm: [
            { name: 'Kurta Set', desc: 'Classic comfort for any occasion.', tag: 'Traditional', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=kurta+set' },
            { name: 'Khussa', desc: 'Step out in style.', tag: 'Heritage', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=khussa' },
            { name: 'Embroidered Cap', desc: 'Complete the traditional look.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=cap' },
        ],
        cool: [
            { name: 'Wool Kurta', desc: 'Stay warm with traditional style.', tag: 'Warm', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=wool+kurta' },
            { name: 'Peshawari Cap', desc: 'Keep your head warm.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=peshawari+cap' },
            { name: 'Leather Boots', desc: 'Step out in style.', tag: 'Style', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=boots' },
        ],
        cold: [
            { name: 'Peshawari Waistcoat', desc: 'Warmth meets tradition.', tag: 'Heritage', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=waistcoat' },
            { name: 'Wool Shawl', desc: 'Wrap up in elegance.', tag: 'Elegant', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=wool+shawl' },
            { name: 'Karakul Cap', desc: 'Traditional warmth.', tag: 'Classic', img: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=karakul+cap' },
        ],
        rainy: [
            { name: 'Raincoat', desc: 'Stay dry in style.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=raincoat' },
            { name: 'Waterproof Chappal', desc: 'Walk through puddles worry-free.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=waterproof+chappal' },
            { name: 'Compact Umbrella', desc: 'Never leave home without it.', tag: 'Must Have', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=umbrella' },
        ],
    },
};

// ============================================
// RAIN ALERT DATA
// ============================================
const RAIN_ALERT_ITEMS = [
    { name: 'Waterproof Jacket', desc: 'Stay completely dry during heavy rain.', tag: 'Rain Essential', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=waterproof+jacket' },
    { name: 'Rain Boots', desc: 'Keep your feet dry and stylish.', tag: 'Must Have', img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=rain+boots' },
    { name: 'Compact Umbrella', desc: 'Never leave home without it.', tag: 'Essential', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=umbrella' },
    { name: 'Dark Jeans', desc: 'Hide those rain stains.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=dark+jeans' },
    { name: 'Waterproof Backpack', desc: 'Protect your belongings.', tag: 'Smart', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=waterproof+backpack' },
    { name: 'Dark Sweater', desc: 'Stay warm and hide water spots.', tag: 'Practical', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a00?w=400&h=300&fit=crop', link: 'https://amazon.in/s?k=dark+sweater' },
];

// ============================================
// FOOD DATA (Weather-Based)
// ============================================
const FOOD_DATA = {
    hot: {
        badge: 'HOT DAY PICK',
        title: 'Mango Lassi & Chaat',
        desc: 'There is no better pairing for a hot day than the tropical sweetness of mango lassi balanced by the tangy, refreshing taste of chaat. Light, refreshing, and perfect for summer.',
        img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=450&fit=crop',
    },
    warm: {
        badge: 'WARM DAY PICK',
        title: 'Chai & Samosa',
        desc: 'Start your day right with a refreshing cup of chai paired with crispy samosas. The perfect comfort combo for a pleasant afternoon.',
        img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=450&fit=crop',
    },
    cool: {
        badge: 'COOL DAY PICK',
        title: 'Hot Chai & Pakora',
        desc: 'Warm up with a perfectly spiced chai paired with crispy pakoras. The ideal comfort combo for a breezy afternoon.',
        img: 'https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=600&h=450&fit=crop',
    },
    cold: {
        badge: 'COLD DAY PICK',
        title: 'Karachi Sajji & Naan',
        desc: 'Warm your soul with slow-roasted sajji served with fresh naan. A hearty meal perfect for cold evenings.',
        img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=450&fit=crop',
    },
    rainy: {
        badge: 'RAINY DAY PICK',
        title: 'Pakoras & Hot Chai',
        desc: 'The ultimate rainy day combo! Crispy pakoras with a steaming cup of chai while watching the rain from your window.',
        img: 'https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=600&h=450&fit=crop',
    },
};

// ============================================
// WEEKEND ACTIVITIES
// ============================================
const WEEKEND_ACTIVITIES = {
    clear: ['Morning Jog', 'Park Picnic', 'Beach Day'],
    cloudy: ['Indoor Games', 'Museum Visit', 'Shopping'],
    rainy: ['Movie Marathon', 'Board Games', 'Cooking'],
    cold: ['Hot Springs', 'Mall Walk', 'Cafe Hopping'],
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function getTemperatureCategory(tempC) {
    if (tempC >= 30) return 'hot';
    if (tempC >= 20) return 'warm';
    if (tempC >= 10) return 'cool';
    return 'cold';
}

function getWeatherCategory(code) {
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 77) return 'cold';
    if (code >= 80 && code <= 82) return 'rainy';
    if (code >= 95 && code <= 96) return 'rainy';
    return 'clear';
}

function getUVLabel(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
}

function getWeatherIcon(code) {
    const info = WEATHER_CODES[code];
    return info ? info.icon : 'cloud';
}

function getWeatherCondition(code) {
    const info = WEATHER_CODES[code];
    return info ? info.condition : 'Cloudy';
}

function formatDay(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// ============================================
// API FUNCTIONS
// ============================================
async function searchCity(query) {
    const url = `${CONFIG.GEO_API}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results;
        }
        return [];
    } catch (error) {
        console.error('Geocoding error:', error);
        return [];
    }
}

async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: 7,
    });
    const url = `${CONFIG.WEATHER_API}?${params.toString()}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================
function updateHero(data, cityName) {
    const current = data.current;
    const weatherInfo = WEATHER_CODES[current.weather_code] || WEATHER_CODES[0];
    const tempC = current.temperature_2m;
    const tempF = Math.round((tempC * 9/5) + 32);
    const tempCategory = getTemperatureCategory(tempC);
    const isNight = current.is_day === 0;

    DOM.temperature.textContent = `${tempF}°F`;

    DOM.weatherBadgeIcon.textContent = isNight ? 'night_clear' : weatherInfo.icon;
    DOM.weatherBadgeText.textContent = isNight ? 'CLEAR NIGHT' : weatherInfo.badge;

    const vibes = {
        hot: { title: "Today's Vibe: Beach Day Paradise", desc: "The sun is blazing and the vibes are immaculate. Perfect for outdoor adventures and staying cool." },
        warm: { title: "Today's Vibe: Golden Hour Magic", desc: "Warm breezes and sunshine create the perfect atmosphere for a memorable day out." },
        cool: { title: "Today's Vibe: Cozy Afternoon", desc: "The crisp air invites you to layer up and enjoy a comfortable, refreshing day." },
        cold: { title: "Today's Vibe: Winter Wonderland", desc: "Bundle up and embrace the cold. Hot drinks and warm moments await." },
    };

    const weatherVibes = {
        rainy: { title: "Today's Vibe: Rainy Day Retreat", desc: "The pitter-patter of rain creates the perfect excuse to slow down and relax." },
        stormy: { title: "Today's Vibe: Storm Watch", desc: "Nature's power on full display. Stay safe and enjoy the drama from indoors." },
    };

    let vibe = vibes[tempCategory] || vibes.warm;
    const weatherCat = getWeatherCategory(current.weather_code);
    if (weatherVibes[weatherCat]) {
        vibe = weatherVibes[weatherCat];
    }

    DOM.vibeTitle.textContent = vibe.title;
    DOM.vibeDescription.textContent = vibe.desc;

    DOM.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} mph`;
    DOM.humidity.textContent = `${current.relative_humidity_2m}%`;
    DOM.uvIndex.textContent = data.daily && data.daily.uv_index_max ? getUVLabel(data.daily.uv_index_max[0]) : '--';
}

function checkRainAlert(data) {
    if (!data.daily || !data.daily.precipitation_probability_max) {
        DOM.rainAlert.classList.add('hidden');
        return false;
    }

    const todayRainChance = data.daily.precipitation_probability_max[0];

    if (todayRainChance >= 80) {
        DOM.rainAlert.classList.remove('hidden');
        DOM.rainAlertText.textContent = `Rain Alert: ${todayRainChance}% chance of rain today! We recommend waterproof gear and dark-colored clothes.`;
        return true;
    }

    DOM.rainAlert.classList.add('hidden');
    return false;
}

function updateOutfit(data) {
    currentWeatherData = data;
    const current = data.current;
    const tempCategory = getTemperatureCategory(current.temperature_2m);
    const weatherCat = getWeatherCategory(current.weather_code);

    const isRainAlert = checkRainAlert(data);

    let outfitKey = tempCategory;
    if (weatherCat === 'rainy') outfitKey = 'rainy';

    let outfits;
    if (isRainAlert) {
        outfits = RAIN_ALERT_ITEMS;
    } else {
        const styleData = currentStyle === 'desi' ? OUTFIT_DESI : OUTFIT_WESTERN;
        const genderData = styleData[currentGender] || styleData.men;
        outfits = genderData[outfitKey] || genderData.warm;
    }

    const tempF = Math.round((current.temperature_2m * 9/5) + 32);
    DOM.outfitSubtitle.textContent = `Curated essentials for a ${tempF}°F afternoon.`;

    const uv = data.daily && data.daily.uv_index_max ? data.daily.uv_index_max[0] : 0;
    if (uv > 5) {
        DOM.spfTip.textContent = 'SPF 50 is your best friend today!';
    } else if (uv > 2) {
        DOM.spfTip.textContent = 'SPF 30 recommended for today.';
    } else {
        DOM.spfTip.textContent = 'Low UV - enjoy the outdoors!';
    }

    DOM.outfitGrid.innerHTML = outfits.map(item => `
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="outfit-card glass-card rounded-2xl overflow-hidden soft-shadow block hover:scale-[1.02] transition-transform">
            <div class="h-56 overflow-hidden relative">
                <img class="outfit-img w-full h-full object-cover" src="${item.img}" alt="${item.name}"/>
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span class="text-xs font-semibold text-primary">${item.tag}</span>
                </div>
            </div>
            <div class="p-5 space-y-3">
                <h3 class="font-display font-semibold text-lg text-on-surface">${item.name}</h3>
                <p class="text-sm text-on-surface-variant leading-relaxed">${item.desc}</p>
                <span class="inline-block w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm text-center hover:bg-primary/90 transition-colors">Shop on Amazon</span>
            </div>
        </a>
    `).join('');
}

function updateFood(data) {
    const current = data.current;
    const tempCategory = getTemperatureCategory(current.temperature_2m);
    const weatherCat = getWeatherCategory(current.weather_code);

    let foodKey = tempCategory;
    if (weatherCat === 'rainy') foodKey = 'rainy';

    const food = FOOD_DATA[foodKey] || FOOD_DATA.warm;

    DOM.foodBadge.textContent = food.badge;
    DOM.foodTitle.textContent = food.title;
    DOM.foodDescription.textContent = food.desc;
    DOM.foodImage.src = food.img;
}

function updateWeekend(data) {
    const daily = data.daily;
    if (!daily) return;

    const activities = WEEKEND_ACTIVITIES.clear;

    let html = '';
    for (let i = 0; i < 3 && i < daily.time.length; i++) {
        const code = daily.weather_code[i];
        const maxTemp = Math.round((daily.temperature_2m_max[i] * 9/5) + 32);
        const icon = getWeatherIcon(code);
        const condition = getWeatherCondition(code);
        const activity = activities[i % activities.length];
        const isBest = i === 1;

        html += `
            <div class="relative ${isBest ? 'weekend-best' : ''}">
                <div class="glass-card p-6 rounded-2xl soft-shadow text-center space-y-4 ${isBest ? 'border-2 border-primary/20' : ''}">
                    ${isBest ? '<div class="absolute top-4 right-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Best Vibe</div>' : ''}
                    <p class="text-xs font-bold text-outline uppercase tracking-widest">${formatDay(daily.time[i])}</p>
                    <div class="flex flex-col items-center space-y-2">
                        <span class="material-symbols-outlined text-[56px] ${isBest ? 'text-primary' : 'text-primary/60'}" style="font-variation-settings: 'FILL' 1;">${icon}</span>
                        <p class="font-display font-bold text-3xl text-on-surface">${maxTemp}°</p>
                        <p class="text-sm text-on-surface-variant">${condition}</p>
                    </div>
                    <div class="pt-4 border-t border-outline-variant/30">
                        <p class="text-sm font-semibold ${isBest ? 'text-primary' : 'text-on-surface'}">${activity}</p>
                    </div>
                </div>
            </div>
        `;
    }

    DOM.weekendGrid.innerHTML = html;
}

// ============================================
// MAIN WEATHER DISPLAY FUNCTION
// ============================================
async function displayWeather(lat, lon, cityName) {
    const data = await fetchWeather(lat, lon);
    if (!data || data.error) {
        DOM.vibeTitle.textContent = 'Unable to load weather data';
        DOM.vibeDescription.textContent = 'Please try again later.';
        return;
    }

    updateHero(data, cityName);
    updateOutfit(data);
    updateFood(data);
    updateWeekend(data);
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openModal() {
    DOM.locationModal.classList.remove('hidden');
    DOM.locationModal.classList.add('flex');
    DOM.searchInput.value = '';
    DOM.searchResults.innerHTML = '';
    setTimeout(() => DOM.searchInput.focus(), 100);
}

function closeModal() {
    DOM.locationModal.classList.add('hidden');
    DOM.locationModal.classList.remove('flex');
    DOM.searchResults.innerHTML = '';
}

// ============================================
// EVENT LISTENERS
// ============================================

// Gender filter buttons
DOM.genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        DOM.genderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGender = btn.dataset.gender;
        if (currentWeatherData) {
            updateOutfit(currentWeatherData);
        }
    });
});

// Style filter buttons
DOM.styleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        DOM.styleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStyle = btn.dataset.style;
        if (currentWeatherData) {
            updateOutfit(currentWeatherData);
        }
    });
});

// Search
DOM.searchBtn.addEventListener('click', openModal);
DOM.modalClose.addEventListener('click', closeModal);
DOM.locationModal.addEventListener('click', (e) => {
    if (e.target === DOM.locationModal) closeModal();
});

let searchTimeout;
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
                <div class="search-result-item p-3 hover:bg-primary/10 cursor-pointer border-b border-outline-variant/30 last:border-0" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}, ${city.country || ''}">
                    <p class="font-medium text-on-surface">${city.name}</p>
                    <p class="text-xs text-on-surface-variant">${city.admin1 || ''}, ${city.country || ''}</p>
                </div>
            `).join('');

            DOM.searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const lat = parseFloat(item.dataset.lat);
                    const lon = parseFloat(item.dataset.lon);
                    const name = item.dataset.name;
                    displayWeather(lat, lon, name);
                    closeModal();
                });
            });
        } else {
            DOM.searchResults.innerHTML = '<p class="p-3 text-on-surface-variant">No cities found</p>';
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
            closeModal();
        }
    }
});

// Current Location
DOM.locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
    }

    DOM.vibeTitle.textContent = 'Detecting your location...';
    DOM.vibeDescription.textContent = 'Please allow location access.';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await displayWeather(latitude, longitude, 'Your Location');
        },
        (error) => {
            let msg = 'Unable to get your location.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    msg = 'Location permission denied. Please enable location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    msg = 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    msg = 'Location request timed out.';
                    break;
            }
            DOM.vibeTitle.textContent = 'Location Error';
            DOM.vibeDescription.textContent = msg;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
});

// ============================================
// INITIALIZATION
// ============================================
displayWeather(24.8607, 67.0011, CONFIG.DEFAULT_CITY);
