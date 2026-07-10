/* ========================================
   VibeCast - Lifestyle Weather Companion
   Weather API + Dynamic Content
   ======================================== */

const CONFIG = {
    GEO_API: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
    DEFAULT_CITY: 'Peshawar',
};

function loadFromStorage(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
}

let currentWeatherData = null;
let currentUnit = localStorage.getItem('vibecast-unit') || 'C';

function celsiusToFahrenheit(c) {
    return Math.round((c * 9 / 5) + 32);
}

function formatTemp(celsius) {
    const val = currentUnit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
    return `${val}°${currentUnit}`;
}

const DOM = {
    temperature: document.getElementById('temperature'),
    heroWeatherIcon: document.getElementById('hero-weather-icon'),
    weatherCondition: document.getElementById('weather-condition'),
    feelsLike: document.getElementById('feels-like'),
    vibeDescription: document.getElementById('vibe-description'),
    cityName: document.getElementById('city-name'),
    windSpeed: document.getElementById('wind-speed'),
    humidity: document.getElementById('humidity'),
    sunriseTime: document.getElementById('sunrise-time'),
    sunsetTime: document.getElementById('sunset-time'),
    hourlyScroll: document.getElementById('hourly-scroll'),
    tipsContainer: document.getElementById('tips-container'),
    outfitBadge: document.getElementById('outfit-badge'),
    outfitTitle: document.getElementById('outfit-title'),
    outfitGrid: document.getElementById('outfit-grid'),
    foodTitle: document.getElementById('food-title'),
    foodList: document.getElementById('food-list'),
    hydrationList: document.getElementById('hydration-list'),
    todayList: document.getElementById('today-list'),
    searchBtn: document.getElementById('search-btn'),
    locationBtn: document.getElementById('location-btn'),
    locationModal: document.getElementById('location-modal'),
    modalClose: document.getElementById('modal-close'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    heroSearchInput: document.getElementById('hero-search-input'),
    heroSearchResults: document.getElementById('hero-search-results'),
    heroSearchSpinner: document.getElementById('hero-search-spinner'),
    weekendGrid: document.getElementById('weekend-grid'),
    dailyScroll: document.getElementById('daily-scroll'),
};

const WEATHER_CODES = {
    0: { condition: 'Clear Sky', icon: 'wb_sunny' },
    1: { condition: 'Mainly Clear', icon: 'wb_sunny' },
    2: { condition: 'Partly Cloudy', icon: 'partly_cloudy_day' },
    3: { condition: 'Overcast', icon: 'cloud' },
    45: { condition: 'Foggy', icon: 'foggy' },
    48: { condition: 'Rime Fog', icon: 'foggy' },
    51: { condition: 'Light Drizzle', icon: 'rainy_light' },
    53: { condition: 'Moderate Drizzle', icon: 'rainy' },
    55: { condition: 'Dense Drizzle', icon: 'rainy_heavy' },
    61: { condition: 'Slight Rain', icon: 'rainy_light' },
    63: { condition: 'Moderate Rain', icon: 'rainy' },
    65: { condition: 'Heavy Rain', icon: 'rainy_heavy' },
    71: { condition: 'Slight Snow', icon: 'weather_snowy' },
    73: { condition: 'Moderate Snow', icon: 'weather_snowy' },
    75: { condition: 'Heavy Snow', icon: 'weather_snowy' },
    80: { condition: 'Light Showers', icon: 'rainy_light' },
    81: { condition: 'Moderate Showers', icon: 'rainy' },
    82: { condition: 'Violent Showers', icon: 'rainy_heavy' },
    95: { condition: 'Thunderstorm', icon: 'thunderstorm' },
    96: { condition: 'Thunderstorm with Hail', icon: 'thunderstorm' },
};

const lifestyleDatabase = loadFromStorage('vibecast-tips', {
    hot: {
        description: "The warm weather in your area makes for a perfect afternoon. A great day to enjoy outdoor activities or visit a cafe.",
        outfit: {
            badge: "SEE EVERYTHING",
            title: "Very Hot — Light Clothes",
            items: [
                "Cotton kurta / kameez",
                "Shorts or light trousers",
                "Sandals / breathable shoes",
                "Sunglasses & cap",
                "Sunscreen SPF 50+"
            ]
        },
        outfitImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=300&fit=crop&q=80",
        food: {
            title: "Cooling Food",
            items: [
                "Dahi / raita / lassi",
                "Cucumber-tomato salad",
                "Watermelon (tarbooj)",
                "Light dal-chawal"
            ]
        },
        foodImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=200&fit=crop&q=80",
        hydration: [
            "Nimbu pani",
            "Coconut water",
            "Chai / lassi",
            "Cold homemade drinks"
        ],
        todayPlan: [
            "Morning walk (early)",
            "Avoid 12PM - 3PM sun",
            "Evening stroll"
        ],
        tips: [
            "UV levels are very high today — apply sunscreen",
            "Stay between 12PM - 4PM in shade"
        ]
    },
    rainy: {
        description: "Rain drops and cool winds call for a perfect indoor evening with warm comfort food.",
        outfit: {
            badge: "STAY DRY",
            title: "Rainy Day — Waterproof Gear",
            items: [
                "Waterproof jacket",
                "Quick-dry pants",
                "Compact umbrella",
                "Waterproof shoes",
                "Rain cover for bag"
            ]
        },
        outfitImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=300&fit=crop&q=80",
        food: {
            title: "Comfort Food",
            items: [
                "Hot pakoras",
                "Karak chai",
                "Warm soup",
                "Crispy samosa"
            ]
        },
        foodImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=200&fit=crop&q=80",
        hydration: [
            "Hot tea",
            "Masala chai",
            "Hot chocolate",
            "Warm lemon water"
        ],
        todayPlan: [
            "Carry umbrella always",
            "Check traffic alerts",
            "Indoor activities recommended"
        ],
        tips: [
            "80% chance of rain — carry umbrella",
            "Avoid flooded roads"
        ]
    },
    cold: {
        description: "Chilly winds and crisp air. Perfect time to layer up and enjoy a hot cup of coffee.",
        outfit: {
            badge: "STAY WARM",
            title: "Cold Day — Bundle Up",
            items: [
                "Warm hoodie / jacket",
                "Fleece-lined jeans",
                "Beanie & gloves",
                "Warm socks",
                "Scarf for neck"
            ]
        },
        outfitImage: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=300&fit=crop&q=80",
        food: {
            title: "Hot & Warming",
            items: [
                "Chicken soup",
                "Hot coffee / chai",
                "Warm bread & butter",
                "Garam masala dishes"
            ]
        },
        foodImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=200&fit=crop&q=80",
        hydration: [
            "Hot coffee",
            "Ginger tea",
            "Hot soup",
            "Warm milk"
        ],
        todayPlan: [
            "Morning gym / walk",
            "Warm up before going out",
            "Evening cozy at home"
        ],
        tips: [
            "Temperature feels colder with wind chill",
            "Layer up before heading outside"
        ]
    }
});

const weekendDestinationPool = [
    { title: "Murree Hills", description: "Cool breezy hill station with pine forests", lat: 33.9071, lon: 73.3956, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=350&fit=crop", tag: "Popular" },
    { title: "Naran Kaghan", description: "Mountain adventure with lakes & meadows", lat: 34.9067, lon: 73.6513, image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=350&fit=crop", tag: "Adventure" },
    { title: "Swat Valley", description: "Beautiful valley — the Switzerland of Pakistan", lat: 35.2223, lon: 72.3461, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=350&fit=crop", tag: "Scenic" },
    { title: "Chitral", description: "Remote valley with rich culture and heritage", lat: 35.8506, lon: 71.7870, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=350&fit=crop", tag: "Offbeat" },
    { title: "Ayubia", description: "Nature trails and butterfly museum for families", lat: 34.0850, lon: 73.3870, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=350&fit=crop", tag: "Family" },
    { title: "Patriata", description: "Chairlift ride through misty forested hills", lat: 34.0778, lon: 73.5870, image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=350&fit=crop", tag: "Scenic" },
    { title: "Nathia Gali", description: "Foggy trails and colonial-era mountain charm", lat: 34.0734, lon: 73.3696, image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=350&fit=crop", tag: "Peaceful" },
    { title: "Abbottabad", description: "Green valley surrounded by towering mountains", lat: 34.1468, lon: 73.2115, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=350&fit=crop", tag: "Peaceful" },
    { title: "Skardu", description: "Land of mountains, frozen lakes and ancient forts", lat: 35.2869, lon: 75.6894, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=350&fit=crop", tag: "Epic" },
    { title: "Hunza Valley", description: "Breathtaking peaks and centuries-old Baltit Fort", lat: 36.3167, lon: 74.6500, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=350&fit=crop", tag: "Scenic" },
    { title: "Fairy Meadows", description: "Gateway to Nanga Parbat base camp", lat: 35.4014, lon: 74.5830, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=350&fit=crop", tag: "Epic" },
    { title: "Deosai Plains", description: "World's second highest alpine plateau", lat: 34.9833, lon: 75.4333, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=350&fit=crop", tag: "Wildlife" },
    { title: "Clifton Beach", description: "Cool sea breeze and golden Arabian Sea sand", lat: 24.8084, lon: 67.0330, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=350&fit=crop", tag: "Beach" },
    { title: "Gwadar Coast", description: "Pristine beaches and crystal clear blue water", lat: 25.1264, lon: 62.3275, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=350&fit=crop", tag: "Coastal" },
    { title: "Ormara Beach", description: "Secluded coastal gem with turquoise water", lat: 25.2690, lon: 64.5845, image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&h=350&fit=crop", tag: "Hidden Gem" },
    { title: "Sonmiani Beach", description: "Calm waters and scenic golden sand dunes", lat: 24.9333, lon: 66.5833, image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&h=350&fit=crop", tag: "Relaxing" },
    { title: "Makran Coast", description: "Dramatic cliffs meeting the Arabian Sea", lat: 25.4500, lon: 62.7500, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=350&fit=crop", tag: "Scenic" },
    { title: "Lahore Food Street", description: "Iconic food and heritage in the Walled City", lat: 31.5825, lon: 74.3160, image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=350&fit=crop", tag: "Food" },
    { title: "Badshahi Mosque", description: "Mughal-era grandeur and stunning architecture", lat: 31.5880, lon: 74.3163, image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=350&fit=crop", tag: "Heritage" },
];

function haversineDistance(lat1, lon1, lat2, lon2) {
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function renderWeekendGrid(lat, lon) {
    if (!DOM.weekendGrid) return;
    const withDist = weekendDestinationPool.map(dest => ({
        ...dest,
        distance: haversineDistance(lat, lon, dest.lat, dest.lon)
    }));
    const nearest = withDist.sort((a, b) => a.distance - b.distance).slice(0, 3);
    DOM.weekendGrid.innerHTML = nearest.map(dest => `
        <div class="glass-card rounded-2xl overflow-hidden weekend-card">
            <div style="overflow:hidden;">
                <img src="${dest.image}" alt="${dest.title}" class="weekend-card-img" loading="lazy"/>
            </div>
            <div class="p-5">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-display font-bold text-lg text-white">${dest.title}</h3>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/15 px-2 py-1 rounded-md">${dest.tag}</span>
                </div>
                <p class="text-white/50 text-sm mb-3">${dest.description}</p>
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-[16px]">near_me</span>
                    <span class="text-white font-display font-bold text-sm">${Math.round(dest.distance)} km away</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderHomeTravelSection(category) {
    const grid = document.getElementById('home-travel-grid');
    const title = document.getElementById('travel-section-title');
    const desc = document.getElementById('travel-section-desc');
    if (!grid) return;

    const items = travelDestinations[category] || travelDestinations.hot;

    const titles = {
        hot: 'Beach Destinations',
        rainy: 'Hill Station Escapes',
        cold: 'Mountain Adventures'
    };
    const descs = {
        hot: 'Beach and coastal destinations to cool off in the heat.',
        rainy: 'Hill stations and valleys to enjoy the monsoon vibes.',
        cold: 'Mountain retreats with snow-capped peaks and warm hospitality.'
    };

    if (title) title.textContent = titles[category] || 'Travel Destinations';
    if (desc) desc.textContent = descs[category] || 'Curated destinations based on current weather near you.';

    grid.innerHTML = items.map(item => `
        <a href="${item.affiliateUrl}" target="_blank" class="home-travel-card">
            <div style="overflow:hidden;">
                <img src="${item.image}" alt="${item.name}" class="home-travel-card-img" loading="lazy"/>
            </div>
            <div class="home-travel-card-body">
                <span class="home-travel-card-tag">${item.tag}</span>
                <div class="flex items-center justify-between">
                    <h3 class="home-travel-card-name">${item.name}</h3>
                    <span class="text-green-400 font-display font-bold text-sm">${formatTemp(item.tempC)}</span>
                </div>
                <p class="home-travel-card-desc">${item.desc}</p>
                <span class="home-travel-card-cta">
                    Plan Trip
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
            </div>
        </a>
    `).join('');
}

// ========== EXPANDED PAGE DATA ==========
const outfitItems = loadFromStorage('vibecast-outfits', {
    hot: [
        { name: "Cotton Kurta / Kameez", desc: "Light, breathable fabric for hot summer days", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Linen Summer Shirt", desc: "Cool and stylish linen shirt for outdoor wear", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Wide-Brim Straw Hat", desc: "Protect yourself from harsh UV rays", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Polarized Sunglasses", desc: "UV400 protection for bright sunny days", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Breathable Sandals", desc: "Comfortable open-toe footwear for summer", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "SPF 50+ Sunscreen", desc: "Essential skin protection from UV damage", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Light Chinos", desc: "Comfortable lightweight pants for everyday", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Cotton Scarf / Dupatta", desc: "Versatile accessory for sun and style", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc64?w=500&h=600&fit=crop", affiliateUrl: "#" }
    ],
    rainy: [
        { name: "Waterproof Jacket", desc: "Stay dry with a lightweight rain jacket", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Compact Umbrella", desc: "Foldable umbrella that fits in your bag", image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Rain Boots", desc: "Waterproof boots for puddle-proof walks", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Quick-Dry Pants", desc: "Drying fast, perfect for wet weather", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Waterproof Bag Cover", desc: "Protect your belongings from rain", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Rain Poncho", desc: "Full-body protection in heavy downpour", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Waterproof Phone Case", desc: "Keep your phone safe from water damage", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Fleece Hoodie", desc: "Warm layer for cool rainy evenings", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop", affiliateUrl: "#" }
    ],
    cold: [
        { name: "Wool Sweater", desc: "Cozy knitwear for chilly winter days", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Down Puffer Jacket", desc: "Maximum warmth with lightweight fill", image: "https://images.unsplash.com/photo-1544923246-77307dd270da?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Thermal Innerwear Set", desc: "Base layer for extreme cold protection", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Knitted Beanie", desc: "Keep your head warm in freezing temps", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Leather Gloves", desc: "Stylish and warm hand protection", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Winter Boots", desc: "Insulated boots with grip for icy roads", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Scarf / Muffler", desc: "Warm neck protection in cold winds", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Warm Socks (Pack of 3)", desc: "Thick cushioned socks for cold feet", image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c87?w=500&h=600&fit=crop", affiliateUrl: "#" }
    ]
});

const foodItems = loadFromStorage('vibecast-food', {
    hot: [
        { name: "Dahi / Raita", desc: "Cooling yogurt with spices and herbs", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cups plain yogurt", "1/2 tsp cumin powder", "Salt to taste", "Fresh coriander", "1 green chili (finely chopped)", "Pinch of chaat masala"],
          recipe: ["Whisk yogurt until smooth in a bowl", "Add cumin powder, salt, and chaat masala", "Mix in finely chopped green chili", "Garnish with fresh coriander leaves", "Chill for 15 minutes before serving", "Serve cold with meals or as a dip"] },
        { name: "Mango Lassi", desc: "Sweet and refreshing yogurt drink", image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["1 ripe mango (peeled & chopped)", "1 cup cold yogurt", "1/2 cup cold milk", "2 tbsp sugar or honey", "Ice cubes", "Pinch of cardamom powder"],
          recipe: ["Add mango pieces to a blender", "Pour in cold yogurt and milk", "Add sugar or honey to taste", "Blend until smooth and creamy", "Add ice cubes and blend briefly", "Pour into glasses and sprinkle cardamom"] },
        { name: "Watermelon", desc: "Hydrating and naturally sweet summer fruit", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["1 large watermelon", "Black salt (optional)", "Chaat masala (optional)", "Lemon juice", "Fresh mint leaves"],
          recipe: ["Chill watermelon in fridge for 2 hours", "Cut into halves or slices", "Remove seeds if needed", "Sprinkle black salt and chaat masala", "Squeeze a little lemon juice on top", "Garnish with mint leaves and serve cold"] },
        { name: "Cucumber Salad", desc: "Crisp and refreshing side dish", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cucumbers", "1 tomato", "1 green chili", "Salt to taste", "Chaat masala", "Lemon juice", "Fresh coriander"],
          recipe: ["Wash and slice cucumbers into thin rounds", "Dice tomato into small cubes", "Chop green chili finely", "Mix everything in a bowl", "Add salt, chaat masala and lemon juice", "Toss well and serve chilled"] },
        { name: "Cold Coffee", desc: "Chilled coffee with ice cream topping", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 tbsp instant coffee", "1 cup cold milk", "2 tbsp sugar", "Ice cubes", "1 scoop vanilla ice cream", "Chocolate syrup (optional)"],
          recipe: ["Dissolve coffee in 2 tbsp warm water", "Add sugar and mix well", "Pour cold milk into a blender", "Add coffee mixture and ice cubes", "Blend until frothy", "Pour in glass, top with ice cream and chocolate syrup"] },
        { name: "Fruit Chaat", desc: "Mixed seasonal fruits with chat masala", image: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["1 apple (diced)", "2 bananas (sliced)", "1 cup grapes", "1 cup watermelon cubes", "Chaat masala", "Black salt", "Lemon juice", "Fresh mint"],
          recipe: ["Wash all fruits thoroughly", "Cut apple into small cubes", "Slice bananas into rounds", "Halve the grapes", "Combine all fruits in a large bowl", "Sprinkle chaat masala and black salt", "Squeeze lemon juice and toss gently", "Garnish with mint and serve fresh"] },
        { name: "Mint Lemonade", desc: "Fresh mint blended with tangy lemon", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["10-12 fresh mint leaves", "3 lemons (juiced)", "4 tbsp sugar", "4 cups cold water", "Ice cubes", "Black salt (optional)"],
          recipe: ["Boil 1/2 cup water with sugar until dissolved", "Let the sugar syrup cool completely", "Blend mint leaves with a little water", "Strain the mint juice through a sieve", "Mix lemon juice, mint juice, and sugar syrup", "Add cold water and stir well", "Serve over ice cubes with a mint sprig"] },
        { name: "Golgappa / Pani Puri", desc: "Crispy shells with tangy water", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["24 ready-made puri shells", "2 potatoes (boiled & mashed)", "1 cup boiled chickpeas", "Tamarind chutney", "Mint-coriander chutney", "Cumin powder", "Chaat masala", "Cold water"],
          recipe: ["Boil and mash potatoes with salt", "Mix chickpeas with cumin and chaat masala", "Prepare tamarind chutney (sweet)", "Blend mint, coriander with water for green chutney", "Mix all chutneys with cold water for pani", "Make a small hole in each puri shell", "Fill with potato-chickpea mixture", "Dip in flavored pani and eat immediately"] },
        { name: "Aam Panna", desc: "Tangy raw mango summer drink", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 raw green mangoes", "3 tbsp sugar or jaggery", "1 tsp cumin powder", "Fresh mint leaves", "Black salt", "Pinch of black pepper", "4 cups cold water"],
          recipe: ["Boil raw mangoes until soft and pulpy", "Peel and squeeze out the pulp", "Dissolve sugar in a little warm water", "Mix mango pulp, sugar water, and cold water", "Add cumin powder, black salt, and pepper", "Blend with mint leaves until smooth", "Strain and serve over ice cubes"] },
        { name: "Chana Chaat", desc: "Spicy chickpea street snack", image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cups boiled chickpeas", "1 onion (finely chopped)", "1 tomato (diced)", "Green chilies", "Chaat masala", "Cumin powder", "Lemon juice", "Fresh coriander"],
          recipe: ["Boil chickpeas until tender or use canned", "Chop onion, tomato, and green chilies finely", "Combine chickpeas with chopped vegetables", "Add chaat masala and cumin powder", "Squeeze fresh lemon juice over mixture", "Toss everything together gently", "Garnish with fresh coriander and serve"] }
    ],
    rainy: [
        { name: "Hot Pakoras", desc: "Crispy fried fritters with green chutney", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["1 cup besan (gram flour)", "2 potatoes (sliced thin)", "1 onion (sliced)", "Green chilies", "Cumin seeds", "Salt", "Ajwain (carom seeds)", "Oil for frying"],
          recipe: ["Mix besan with water to make thick batter", "Add salt, cumin seeds, and ajwain", "Mix in sliced potatoes and onions", "Add chopped green chilies", "Heat oil in a deep pan", "Drop spoonfuls of batter into hot oil", "Fry until golden brown on both sides", "Drain on paper towels and serve hot with chutney"] },
        { name: "Samosa", desc: "Golden crispy pastry with spiced filling", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cups flour (maida)", "4 potatoes (boiled & mashed)", "1 cup peas", "Cumin seeds", "Garam masala", "Green chilies", "Fresh coriander", "Oil for frying"],
          recipe: ["Make stiff dough with flour, salt and oil", "Rest dough for 30 minutes", "Heat oil, add cumin seeds and green chilies", "Add mashed potatoes and peas", "Season with garam masala, salt, and coriander", "Roll dough and cut into semi-circles", "Form cones and fill with potato mixture", "Seal edges and deep fry until golden"] },
        { name: "Karak Chai", desc: "Strong spiced tea to warm your soul", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cups water", "1 cup milk", "2 tbsp loose tea leaves", "3-4 sugar cubes", "2 cardamom pods", "1 inch ginger (crushed)", "Pinch of baking soda"],
          recipe: ["Boil water with crushed ginger", "Add tea leaves and cardamom pods", "Let it brew on medium heat for 3 minutes", "Add a pinch of baking soda for color", "Pour in milk and bring to boil", "Add sugar and simmer for 2 minutes", "Strain into cups and serve piping hot"] },
        { name: "Chicken Soup", desc: "Hot and soothing comfort in a bowl", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["500g chicken (bone-in)", "1 onion (chopped)", "2 carrots (diced)", "2 celery stalks", "3 garlic cloves", "Black pepper", "Salt", "Fresh parsley"],
          recipe: ["Boil chicken in water for 30 minutes", "Remove chicken and shred the meat", "Strain the broth and return to pot", "Add onions, carrots, and celery", "Cook until vegetables are tender", "Add shredded chicken back to pot", "Season with salt and black pepper", "Garnish with parsley and serve hot"] },
        { name: "Biryani", desc: "Aromatic rice with tender spiced meat", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["500g chicken/mutton", "2 cups basmati rice", "2 onions (fried)", "1 cup yogurt", "Biryani masala", "Saffron milk", "Mint leaves", "Ghee", "Whole spices"],
          recipe: ["Marinate meat with yogurt and biryani masala for 1 hour", "Parboil rice with whole spices until 70% done", "Layer marinated meat in a heavy pot", "Top with parboil rice evenly", "Sprinkle fried onions, mint, and saffron milk", "Seal with foil and place lid tightly", "Cook on low heat (dum) for 25 minutes", "Gently mix layers and serve with raita"] },
        { name: "Naan with Karahi", desc: "Soft bread with rich gravy curry", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cups flour", "Yogurt", "Yeast", "500g chicken", "Tomatoes", "Green chilies", "Ginger", "Garlic", "Karahi masala"],
          recipe: ["Mix flour, yogurt, yeast and knead soft dough", "Rest dough for 2 hours until doubled", "Cook chicken with ginger-garlic paste", "Add chopped tomatoes and karahi masala", "Cook until oil separates from gravy", "Add green chilies and simmer", "Roll naan dough and cook on tawa or tandoor", "Brush with butter and serve together"] },
        { name: "Halwa Puri", desc: "Sweet halwa with crispy deep-fried bread", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cups semolina (suji)", "1 cup sugar", "1/2 cup ghee", "Water", "Cardamom", "Food color (orange)", "Flour for puri", "Oil for frying"],
          recipe: ["Roast semolina in ghee until golden and aromatic", "Prepare sugar syrup with cardamom", "Slowly add syrup to semolina while stirring", "Add food color and mix well", "Make puri dough with flour, salt, and water", "Roll into thin circles", "Deep fry in hot oil until puffed", "Serve hot halwa with puris"] },
        { name: "French Fries", desc: "Crispy golden fries with ketchup", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["4 large potatoes", "Oil for deep frying", "Salt", "Black pepper", "Paprika (optional)", "Ketchup for serving"],
          recipe: ["Peel and cut potatoes into thin strips", "Soak in cold water for 30 minutes", "Drain and pat completely dry with towel", "Heat oil to 160°C and fry for 3 minutes", "Remove and let cool for 5 minutes", "Increase oil heat to 190°C", "Fry again until golden and crispy", "Season with salt and serve with ketchup"] },
        { name: "Aloo Paratha", desc: "Crispy stuffed potato flatbread", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cups whole wheat flour", "3 potatoes (boiled and mashed)", "1 green chili (chopped)", "Cumin seeds", "Fresh coriander", "Salt to taste", "Ghee for cooking"],
          recipe: ["Mix flour, salt and knead soft dough", "Rest dough for 20 minutes", "Mix mashed potatoes with chili, cumin, coriander and salt", "Divide dough and potato filling into equal balls", "Roll dough, place filling in center and seal", "Roll into flat circles carefully", "Cook on hot tawa with ghee on both sides", "Serve hot with yogurt and pickle"] },
        { name: "Pakora Chaat", desc: "Crispy fritters with tangy chutneys", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["1 cup besan (gram flour)", "1 potato (sliced)", "1 onion (sliced)", "Green chilies", "Tamarind chutney", "Mint-coriander chutney", "Whisked yogurt", "Chaat masala"],
          recipe: ["Mix besan with water, salt and spices for batter", "Dip potato and onion slices in batter", "Deep fry until golden and crispy", "Arrange pakoras on a serving plate", "Drizzle tamarind and mint chutneys on top", "Add whisked yogurt over the pakoras", "Sprinkle chaat masala generously", "Serve immediately while crispy"] }
    ],
    cold: [
        { name: "Chicken Soup", desc: "Steaming hot soup for cold winter nights", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["500g chicken (bone-in)", "1 onion", "2 carrots", "2 celery stalks", "3 garlic cloves", "Black pepper", "Salt", "Fresh parsley"],
          recipe: ["Boil chicken in water for 30 minutes", "Remove chicken and shred the meat", "Strain the broth and return to pot", "Add onions, carrots, and celery", "Cook until vegetables are tender", "Add shredded chicken back to pot", "Season with salt and black pepper", "Garnish with parsley and serve hot"] },
        { name: "Garam Chai", desc: "Traditional spiced hot tea", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cups water", "1 cup milk", "2 tbsp loose tea leaves", "3-4 sugar cubes", "2 cardamom pods", "1 inch ginger (crushed)", "Pinch of baking soda"],
          recipe: ["Boil water with crushed ginger", "Add tea leaves and cardamom pods", "Let it brew on medium heat for 3 minutes", "Add a pinch of baking soda for color", "Pour in milk and bring to boil", "Add sugar and simmer for 2 minutes", "Strain into cups and serve piping hot"] },
        { name: "Butter Chicken", desc: "Creamy rich curry, perfect with naan", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["500g chicken", "1 cup yogurt", "2 tbsp butter", "1 cup cream", "Tomato puree", "Garam masala", "Kashmiri chili", "Ginger-garlic paste", "Kasuri methi"],
          recipe: ["Marinate chicken in yogurt and spices for 2 hours", "Grill or pan-fry marinated chicken", "Heat butter and cook ginger-garlic paste", "Add tomato puree and cook for 10 minutes", "Add garam masala and Kashmiri chili", "Pour in cream and kasuri methi", "Add grilled chicken pieces", "Simmer for 5 minutes and serve with naan"] },
        { name: "Sarson ka Saag", desc: "Traditional mustard greens with makki roti", image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["1 bunch mustard greens", "1/2 bunch spinach", "2 green chilies", "Ginger", "Garlic", "Maize flour", "Ghee", "Salt"],
          recipe: ["Wash and chop mustard greens and spinach", "Boil greens with green chilies until soft", "Mash or blend to coarse paste", "Heat ghee and add ginger-garlic paste", "Add greens paste and cook for 15 minutes", "Mix in maize flour for thickening", "Cook on low heat stirring constantly", "Serve hot with makki roti and butter"] },
        { name: "Haleem", desc: "Slow-cooked meat and lentil stew", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["500g chicken/mutton", "1 cup mixed lentils", "1/2 cup barley", "Onions", "Ginger-garlic paste", "Haleem masala", "Ghee", "Fried onions", "Lemon"],
          recipe: ["Soak lentils and barley overnight", "Cook meat with haleem masala until tender", "Boil soaked lentils and barley until mushy", "Blend lentil mixture to smooth paste", "Combine meat and lentil paste", "Cook on very low heat for 2 hours", "Stir continuously until thick and stretchy", "Garnish with fried onions, lemon, and ginger"] },
        { name: "Gajar ka Halwa", desc: "Sweet carrot pudding with cardamom", image: "https://images.unsplash.com/photo-1666190462699-e1fef2e8d09d?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["1 kg carrots (grated)", "1 cup milk", "1/2 cup sugar", "3 tbsp ghee", "Cardamom powder", "Cashews", "Almonds", "Raisins"],
          recipe: ["Peel and grate carrots finely", "Heat ghee in a heavy pan", "Add grated carrots and cook for 10 minutes", "Pour in milk and cook until absorbed", "Add sugar and stir continuously", "Cook until mixture leaves the sides of pan", "Add cardamom powder and mix well", "Garnish with cashews, almonds and raisins"] },
        { name: "Hot Coffee", desc: "Freshly brewed coffee to beat the cold", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 tbsp instant coffee", "1 cup hot water", "1 cup hot milk", "2 tbsp sugar", "Cocoa powder (optional)", "Whipped cream (optional)"],
          recipe: ["Boil water and let it cool for 30 seconds", "Add coffee powder to a cup", "Pour hot water and stir until dissolved", "Heat milk separately until steaming", "Add sugar to coffee and mix well", "Pour hot milk over the coffee", "Top with cocoa powder or whipped cream", "Serve immediately and enjoy the warmth"] },
        { name: "Naan with Haleem", desc: "Warm bread dipped in rich stew", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["2 cups flour", "Yeast", "Yogurt", "1 cup haleem (pre-made)", "Ghee", "Fried onions", "Lemon", "Green chilies"],
          recipe: ["Prepare naan dough with flour, yeast, and yogurt", "Rest dough for 2 hours until doubled", "Heat haleem in a pan until bubbling", "Roll naan and cook on tawa until golden", "Brush naan with ghee", "Serve haleem in a bowl", "Garnish with fried onions and lemon", "Tear naan and dip into hot haleem"] },
        { name: "Mutton Paye", desc: "Rich slow-cooked bone soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["4 mutton trotters (paye)", "2 onions (sliced)", "1 inch ginger", "6 garlic cloves", "2 bay leaves", "Cinnamon stick", "Garam masala", "Fresh ginger (julienned)"],
          recipe: ["Clean and wash trotters thoroughly", "Pressure cook with water for 45 minutes", "Fry onions until golden brown", "Add ginger-garlic paste and cook 2 minutes", "Add bay leaves and cinnamon", "Pour in the cooked broth and trotters", "Simmer on low heat for 30 minutes", "Garnish with ginger and serve hot"] },
        { name: "Moong Dal Khichdi", desc: "Warm rice and lentil comfort food", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop", affiliateUrl: "#",
          ingredients: ["1 cup rice", "1/2 cup moong dal", "1 tsp turmeric", "1 tsp cumin seeds", "1 inch ginger (chopped)", "Ghee", "Salt", "4 cups water"],
          recipe: ["Wash rice and dal together until clean", "Heat ghee in a pot and add cumin seeds", "Add chopped ginger and saute for 30 seconds", "Add rice and dal, mix well for 1 minute", "Add turmeric and salt", "Pour water and bring to a boil", "Cover and cook on low heat for 20 minutes", "Serve hot with ghee and pickle"] }
    ]
});

const travelDestinations = loadFromStorage('vibecast-travel', {
    hot: [
        { name: "Clifton Beach", desc: "Cool sea breeze and golden sand", tempC: 32, tag: "Beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Gwadar Coast", desc: "Pristine beaches and crystal clear water", tempC: 30, tag: "Coastal", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Astola Island", desc: "Pakistan's hidden island paradise", tempC: 29, tag: "Island", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Ormara Beach", desc: "Secluded coastal gem with turquoise water", tempC: 31, tag: "Hidden Gem", image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Sonmiani Beach", desc: "Calm waters and scenic dunes", tempC: 33, tag: "Relaxing", image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Makran Coast", desc: "Dramatic cliffs meet the Arabian Sea", tempC: 30, tag: "Scenic", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", affiliateUrl: "#" }
    ],
    rainy: [
        { name: "Murree Hills", desc: "Cool breezy hill station with pine forests", tempC: 18, tag: "Popular", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Abbottabad", desc: "Green valley surrounded by mountains", tempC: 20, tag: "Peaceful", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Patriata", desc: "Chairlift ride through misty hills", tempC: 17, tag: "Adventure", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Nathia Gali", desc: "Foggy trails and colonial-era charm", tempC: 15, tag: "Scenic", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Ayubia", desc: "Nature trails and butterfly museum", tempC: 16, tag: "Family", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Chitral", desc: "Remote valley with rich culture", tempC: 19, tag: "Offbeat", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" }
    ],
    cold: [
        { name: "Skardu", desc: "Land of mountains and frozen lakes", tempC: 5, tag: "Adventure", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Hunza Valley", desc: "Breathtaking peaks and ancient forts", tempC: 8, tag: "Scenic", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Naran Kaghan", desc: "Snow-capped mountains and crystal lakes", tempC: 3, tag: "Popular", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Swat Valley", desc: "Pakistan's Switzerland in winter snow", tempC: 6, tag: "Beautiful", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Fairy Meadows", desc: "Gateway to Nanga Parbat base camp", tempC: 2, tag: "Epic", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Deosai Plains", desc: "World's second highest plateau", tempC: 0, tag: "Wildlife", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" }
    ]
});

// ========== PAGE RENDER FUNCTIONS ==========
function renderOutfitPage(category) {
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

function renderFoodPage(category) {
    const grid = document.getElementById('food-grid-page');
    if (!grid) return;
    const items = foodItems[category] || foodItems.hot;
    grid.innerHTML = items.map((item, i) => `
        <div class="item-card" onclick="openRecipeModal(${i}, '${category}')" style="cursor:pointer;">
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

function renderTravelPage(category) {
    const grid = document.getElementById('travel-grid-page');
    if (!grid) return;
    const items = travelDestinations[category] || travelDestinations.hot;
    grid.innerHTML = items.map(item => `
        <a href="${item.affiliateUrl}" target="_blank" class="item-card travel-card">
            <div class="item-card-img-wrapper">
                <img src="${item.image}" alt="${item.name}" loading="lazy"/>
                <span class="item-card-tag">${item.tag}</span>
            </div>
            <div class="item-card-info">
                <div class="flex items-center justify-between">
                    <h3 class="item-card-title">${item.name}</h3>
                    <span class="text-primary font-display font-bold text-sm">${formatTemp(item.tempC)}</span>
                </div>
                <p class="item-card-desc">${item.desc}</p>
                <span class="item-card-cta">
                    Plan Trip
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
            </div>
        </a>
    `).join('');
}

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

function getLifestyleState(tempC, weatherCode) {
    const weatherCat = getWeatherCategory(weatherCode);
    if (weatherCat === 'rainy') return 'rainy';
    const tempCat = getTemperatureCategory(tempC);
    if (tempCat === 'hot' || tempCat === 'warm') return 'hot';
    return 'cold';
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatHour(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

async function searchCity(query) {
    const url = `${CONFIG.GEO_API}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results || [];
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
        hourly: 'temperature_2m,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset',
        timezone: 'auto',
        forecast_days: 7,
    });
    const url = `${CONFIG.WEATHER_API}?${params.toString()}`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
}

function renderHourlyForecast(hourlyData) {
    if (!hourlyData || !hourlyData.time || !hourlyData.temperature_2m) {
        DOM.hourlyScroll.innerHTML = '<p class="text-white/40 text-sm">Hourly data unavailable</p>';
        return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    let startIndex = 0;
    for (let i = 0; i < hourlyData.time.length; i++) {
        if (new Date(hourlyData.time[i]).getHours() === currentHour) {
            startIndex = i;
            break;
        }
    }

    const cards = [];
    for (let i = startIndex; i < Math.min(startIndex + 24, hourlyData.time.length); i++) {
        const time = hourlyData.time[i];
        const temp = Math.round(hourlyData.temperature_2m[i]);
        const weatherCode = hourlyData.weather_code[i];
        const weatherInfo = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];
        const hourLabel = formatHour(time);
        const isActive = i === startIndex;

        cards.push(`
            <div class="hourly-card ${isActive ? 'active' : ''}">
                <span class="hour-time">${isActive ? 'Now' : hourLabel}</span>
                <span class="material-symbols-outlined hour-icon ${isActive ? 'text-white' : 'text-primary'}" style="font-variation-settings: 'FILL' 1;">${weatherInfo.icon}</span>
                <span class="hour-temp">${formatTemp(temp)}</span>
            </div>
        `);
    }
    DOM.hourlyScroll.innerHTML = cards.join('');
}

function renderDailyForecast(dailyData) {
    const dailyScroll = document.getElementById('daily-scroll');
    if (!dailyScroll) {
        console.error('daily-scroll element not found');
        return;
    }
    if (!dailyData || !dailyData.time || !dailyData.temperature_2m_max) {
        console.error('Daily data missing:', dailyData);
        dailyScroll.innerHTML = '<p class="text-white/40 text-sm">Daily data unavailable</p>';
        return;
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const cards = [];

    for (let i = 0; i < dailyData.time.length; i++) {
        const date = new Date(dailyData.time[i] + 'T00:00:00');
        const dayName = i === 0 ? 'Today' : dayNames[date.getDay()];
        const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
        const minTemp = dailyData.temperature_2m_min ? Math.round(dailyData.temperature_2m_min[i]) : maxTemp - 8;
        const weatherCode = dailyData.weather_code ? dailyData.weather_code[i] : 0;
        const weatherInfo = WEATHER_CODES[weatherCode] || WEATHER_CODES[0];
        const rainProb = dailyData.precipitation_probability_max ? dailyData.precipitation_probability_max[i] : null;
        const isActive = i === 0;

        cards.push(`
            <div class="daily-card ${isActive ? 'active' : ''}">
                <span class="daily-day">${dayName}</span>
                <span class="material-symbols-outlined daily-icon ${isActive ? 'text-white' : 'text-primary'}" style="font-variation-settings: 'FILL' 1;">${weatherInfo.icon}</span>
                <div class="daily-temps">
                    <span class="daily-max">${formatTemp(maxTemp)}</span>
                    <span class="daily-min">${formatTemp(minTemp)}</span>
                </div>
                ${rainProb !== null && rainProb > 0 ? `<span class="daily-rain"><span class="material-symbols-outlined text-[10px]">water_drop</span>${rainProb}%</span>` : ''}
            </div>
        `);
    }
    dailyScroll.innerHTML = cards.join('');
}

function renderTips(tips) {
    if (!tips || tips.length === 0) {
        DOM.tipsContainer.innerHTML = '<p class="text-white/40 text-sm">No tips available</p>';
        return;
    }
    DOM.tipsContainer.innerHTML = tips.map((tip, i) => `
        <div class="tip-card">
            <div class="tip-number">${i + 1}</div>
            <p class="tip-text">${tip}</p>
        </div>
    `).join('');
}

function renderLifestyle(lifestyle) {
    const data = lifestyleDatabase[lifestyle];
    if (!data) return;

    DOM.vibeDescription.innerHTML = data.description;

    // Outfit
    DOM.outfitBadge.textContent = data.outfit.badge;
    DOM.outfitTitle.textContent = data.outfit.title;

    // Remove old image if exists
    const oldOutfitImg = document.getElementById('outfit-dynamic-img');
    if (oldOutfitImg) oldOutfitImg.remove();

    // Add outfit image before the grid
    if (data.outfitImage) {
        const imgHtml = `<img id="outfit-dynamic-img" src="${data.outfitImage}" alt="Outfit suggestion" class="card-img" loading="lazy"/>`;
        DOM.outfitGrid.insertAdjacentHTML('beforebegin', imgHtml);
    }

    DOM.outfitGrid.innerHTML = data.outfit.items.map(item => `
        <div class="outfit-item">${item}</div>
    `).join('');

    // Food
    DOM.foodTitle.textContent = data.food.title;

    // Remove old image if exists
    const oldFoodImg = document.getElementById('food-dynamic-img');
    if (oldFoodImg) oldFoodImg.remove();

    // Add food image at top of food card
    if (data.foodImage) {
        const foodCard = document.getElementById('food-card');
        const foodInner = foodCard.querySelector('.relative.z-10');
        if (foodInner) {
            const imgHtml = `<img id="food-dynamic-img" src="${data.foodImage}" alt="Food suggestion" class="card-img-sm" loading="lazy"/>`;
            foodInner.insertAdjacentHTML('afterbegin', imgHtml);
        }
    }

    DOM.foodList.innerHTML = data.food.items.map(item => `<li>${item}</li>`).join('');

    // Hydration
    DOM.hydrationList.innerHTML = data.hydration.map(item => `<li>${item}</li>`).join('');

    // Today
    DOM.todayList.innerHTML = data.todayPlan.map(item => `<li>${item}</li>`).join('');

    // Tips
    renderTips(data.tips);
}

async function displayWeather(lat, lon, cityName) {
    const data = await fetchWeather(lat, lon);
    if (!data || data.error) {
        DOM.vibeDescription.textContent = 'Unable to load weather data. Please try again later.';
        return;
    }

    currentWeatherData = data;
    const current = data.current;

    const tempC = current.temperature_2m;
    const feelsLikeC = Math.round(current.apparent_temperature);

    DOM.temperature.textContent = formatTemp(tempC);
    DOM.feelsLike.textContent = formatTemp(feelsLikeC);
    DOM.temperature.classList.add('loaded');
    DOM.feelsLike.classList.add('loaded');

    const weatherInfo = WEATHER_CODES[current.weather_code] || WEATHER_CODES[0];
    const isNight = current.is_day === 0;

    DOM.heroWeatherIcon.textContent = isNight ? 'clear_night' : weatherInfo.icon;
    DOM.weatherCondition.textContent = weatherInfo.condition;
    DOM.cityName.textContent = cityName;

    // Update icon color for night
    if (DOM.heroWeatherIcon) {
        DOM.heroWeatherIcon.style.color = isNight ? '#F5A623' : '#FFD700';
        DOM.heroWeatherIcon.style.filter = isNight
            ? 'drop-shadow(0 0 20px rgba(245, 166, 35, 0.4))'
            : 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))';
    }

    DOM.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} m/s`;
    DOM.humidity.textContent = `${current.relative_humidity_2m}%`;

    if (data.daily && data.daily.sunrise && data.daily.sunset) {
        DOM.sunriseTime.textContent = formatTime(data.daily.sunrise[0]);
        DOM.sunsetTime.textContent = formatTime(data.daily.sunset[0]);
    }

    const lifestyleState = getLifestyleState(tempC, current.weather_code);
    renderLifestyle(lifestyleState);

    // Expose global state for page scripts
    window.VibeCastWeather = {
        city: cityName,
        temp: tempC,
        feelsLike: feelsLikeC,
        condition: weatherInfo.condition,
        category: lifestyleState,
        icon: isNight ? 'clear_night' : weatherInfo.icon,
        isNight: isNight
    };

    renderWeekendGrid(lat, lon);
    renderHomeTravelSection(lifestyleState);

    if (data.hourly) {
        renderHourlyForecast(data.hourly);
    }

    if (data.daily) {
        console.log('Daily data keys:', Object.keys(data.daily));
        console.log('Daily time:', data.daily.time);
        console.log('Daily max temps:', data.daily.temperature_2m_max);
        renderDailyForecast(data.daily);
    } else {
        console.error('No daily data in API response');
    }
}

function openModal() {
    DOM.locationModal.classList.add('active');
    DOM.searchInput.value = '';
    DOM.searchResults.innerHTML = '';
    setTimeout(() => DOM.searchInput.focus(), 100);
}

function closeModal() {
    DOM.locationModal.classList.remove('active');
    DOM.searchResults.innerHTML = '';
}

// Event Listeners
DOM.searchBtn.addEventListener('click', openModal);
DOM.modalClose.addEventListener('click', closeModal);
DOM.locationModal.addEventListener('click', (e) => {
    if (e.target === DOM.locationModal) closeModal();
});

// ========== HERO SEARCH (Dropdown + Auto-search) ==========
let heroSearchTimeout;
let heroSearchFocused = false;

function showHeroDropdown() {
    if (DOM.heroSearchResults) DOM.heroSearchResults.classList.add('active');
}
function hideHeroDropdown() {
    setTimeout(() => {
        if (DOM.heroSearchResults) DOM.heroSearchResults.classList.remove('active');
    }, 200);
}
function showHeroSpinner() {
    if (DOM.heroSearchSpinner) DOM.heroSearchSpinner.style.display = 'flex';
}
function hideHeroSpinner() {
    if (DOM.heroSearchSpinner) DOM.heroSearchSpinner.style.display = 'none';
}

function renderHeroSearchResults(cities) {
    if (!DOM.heroSearchResults) return;
    if (cities.length === 0) {
        DOM.heroSearchResults.innerHTML = '<div class="hero-search-no-result">No cities found</div>';
        showHeroDropdown();
        return;
    }
    DOM.heroSearchResults.innerHTML = cities.map(city => `
        <div class="hero-search-item" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}, ${city.country || ''}">
            <div class="search-icon">
                <span class="material-symbols-outlined">location_on</span>
            </div>
            <div class="search-info">
                <div class="search-city">${city.name}</div>
                <div class="search-region">${city.admin1 ? city.admin1 + ', ' : ''}${city.country || ''}</div>
            </div>
        </div>
    `).join('');

    DOM.heroSearchResults.querySelectorAll('.hero-search-item').forEach(item => {
        item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const lat = parseFloat(item.dataset.lat);
            const lon = parseFloat(item.dataset.lon);
            const name = item.dataset.name;
            displayWeather(lat, lon, name);
            DOM.heroSearchInput.value = '';
            DOM.heroSearchResults.classList.remove('active');
        });
    });
    showHeroDropdown();
}

if (DOM.heroSearchInput) {
    DOM.heroSearchInput.addEventListener('focus', () => {
        heroSearchFocused = true;
        if (DOM.heroSearchInput.value.trim().length >= 2) {
            showHeroDropdown();
        }
    });

    DOM.heroSearchInput.addEventListener('blur', () => {
        heroSearchFocused = false;
        hideHeroDropdown();
    });

    DOM.heroSearchInput.addEventListener('input', (e) => {
        clearTimeout(heroSearchTimeout);
        const query = e.target.value.trim();
        if (query.length < 2) {
            DOM.heroSearchResults.innerHTML = '';
            DOM.heroSearchResults.classList.remove('active');
            hideHeroSpinner();
            return;
        }
        showHeroSpinner();
        heroSearchTimeout = setTimeout(async () => {
            const cities = await searchCity(query);
            hideHeroSpinner();
            renderHeroSearchResults(cities);
        }, 350);
    });

    DOM.heroSearchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            clearTimeout(heroSearchTimeout);
            const query = e.target.value.trim();
            if (query.length < 2) return;
            showHeroSpinner();
            const cities = await searchCity(query);
            hideHeroSpinner();
            if (cities.length > 0) {
                const city = cities[0];
                displayWeather(city.latitude, city.longitude, `${city.name}, ${city.country || ''}`);
                DOM.heroSearchInput.value = '';
                DOM.heroSearchResults.classList.remove('active');
            }
        }
    });
}

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
                    closeModal();
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
            closeModal();
        }
    }
});

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

// ========== CATEGORY BUTTONS (Navigate to pages) ==========
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const text = btn.textContent.trim().toLowerCase();
        if (text === 'outfit') {
            window.location.href = '/vibecast/outfit/';
        } else if (text === 'food') {
            window.location.href = '/vibecast/food/';
        }
    });
});

// ========== UNIT TOGGLE ==========
function reRenderTemperatures() {
    if (!currentWeatherData) return;
    const current = currentWeatherData.current;
    const tempC = current.temperature_2m;
    const feelsLikeC = Math.round(current.apparent_temperature);

    if (DOM.temperature) DOM.temperature.textContent = formatTemp(tempC);
    if (DOM.feelsLike) DOM.feelsLike.textContent = formatTemp(feelsLikeC);

    if (currentWeatherData.hourly) renderHourlyForecast(currentWeatherData.hourly);
    if (currentWeatherData.daily) renderDailyForecast(currentWeatherData.daily);
}

function initUnitToggle() {
    const toggleBtns = document.querySelectorAll('.unit-btn');
    if (!toggleBtns.length) return;

    toggleBtns.forEach(btn => {
        if (btn.dataset.unit === currentUnit) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentUnit = btn.dataset.unit;
            localStorage.setItem('vibecast-unit', currentUnit);
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            reRenderTemperatures();
        });
    });
}

initUnitToggle();

// ========== INIT ==========
displayWeather(34.0151, 71.5249, CONFIG.DEFAULT_CITY);
