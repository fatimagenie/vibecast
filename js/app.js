/* ========================================
   VibeCast - Lifestyle Weather Companion
   Weather API + Dynamic Content
   ======================================== */

const CONFIG = {
    GEO_API: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
    DEFAULT_CITY: 'Peshawar',
};

let currentWeatherData = null;

const DOM = {
    temperature: document.getElementById('temperature'),
    heroWeatherIcon: document.getElementById('hero-weather-icon'),
    weatherCondition: document.getElementById('weather-condition'),
    feelsLike: document.getElementById('feels-like'),
    timeLabel: document.getElementById('time-label'),
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

const lifestyleDatabase = {
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
};

const weekendDestinations = [
    {
        title: "Murree Hills",
        description: "Cool breezy hill station with pine forests",
        temp: "18°C",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=350&fit=crop",
        tag: "Popular"
    },
    {
        title: "Swat Valley",
        description: "Beautiful valley — the Switzerland of Pakistan",
        temp: "22°C",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=350&fit=crop",
        tag: "Scenic"
    },
    {
        title: "Naran Kaghan",
        description: "Mountain adventure with lakes & meadows",
        temp: "15°C",
        image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=350&fit=crop",
        tag: "Adventure"
    }
];

function renderWeekendGrid() {
    if (!DOM.weekendGrid) return;
    DOM.weekendGrid.innerHTML = weekendDestinations.map(dest => `
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
                    <span class="material-symbols-outlined text-primary text-[16px]">thermostat</span>
                    <span class="text-white font-display font-bold text-sm">${dest.temp}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== EXPANDED PAGE DATA ==========
const outfitItems = {
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
};

const foodItems = {
    hot: [
        { name: "Dahi / Raita", desc: "Cooling yogurt with spices and herbs", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Mango Lassi", desc: "Sweet and refreshing yogurt drink", image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Watermelon", desc: "Hydrating and naturally sweet summer fruit", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Cucumber Salad", desc: "Crisp and refreshing side dish", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Cold Coffee", desc: "Chilled coffee with ice cream topping", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Fruit Chaat", desc: "Mixed seasonal fruits with chat masala", image: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Mint Lemonade", desc: "Fresh mint blended with tangy lemon", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Golgappa / Pani Puri", desc: "Crispy shells with tangy water", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop", affiliateUrl: "#" }
    ],
    rainy: [
        { name: "Hot Pakoras", desc: "Crispy fried fritters with green chutney", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Samosa", desc: "Golden crispy pastry with spiced filling", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Karak Chai", desc: "Strong spiced tea to warm your soul", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Chicken Soup", desc: "Hot and soothing comfort in a bowl", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Biryani", desc: "Aromatic rice with tender spiced meat", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Naan with Karahi", desc: "Soft bread with rich gravy curry", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Halwa Puri", desc: "Sweet halwa with crispy deep-fried bread", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "French Fries", desc: "Crispy golden fries with ketchup", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop", affiliateUrl: "#" }
    ],
    cold: [
        { name: "Chicken Soup", desc: "Steaming hot soup for cold winter nights", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Garam Chai", desc: "Traditional spiced hot tea", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Butter Chicken", desc: "Creamy rich curry, perfect with naan", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Sarson ka Saag", desc: "Traditional mustard greens with makki roti", image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Haleem", desc: "Slow-cooked meat and lentil stew", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Gajar ka Halwa", desc: "Sweet carrot pudding with cardamom", image: "https://images.unsplash.com/photo-1666190462699-e1fef2e8d09d?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Hot Coffee", desc: "Freshly brewed coffee to beat the cold", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Naan with Haleem", desc: "Warm bread dipped in rich stew", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop", affiliateUrl: "#" }
    ]
};

const travelDestinations = {
    hot: [
        { name: "Clifton Beach", desc: "Cool sea breeze and golden sand", temp: "32°C", tag: "Beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Gwadar Coast", desc: "Pristine beaches and crystal clear water", temp: "30°C", tag: "Coastal", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Astola Island", desc: "Pakistan's hidden island paradise", temp: "29°C", tag: "Island", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Ormara Beach", desc: "Secluded coastal gem with turquoise water", temp: "31°C", tag: "Hidden Gem", image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Sonmiani Beach", desc: "Calm waters and scenic dunes", temp: "33°C", tag: "Relaxing", image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Makran Coast", desc: "Dramatic cliffs meet the Arabian Sea", temp: "30°C", tag: "Scenic", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", affiliateUrl: "#" }
    ],
    rainy: [
        { name: "Murree Hills", desc: "Cool breezy hill station with pine forests", temp: "18°C", tag: "Popular", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Abbottabad", desc: "Green valley surrounded by mountains", temp: "20°C", tag: "Peaceful", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Patriata", desc: "Chairlift ride through misty hills", temp: "17°C", tag: "Adventure", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Nathia Gali", desc: "Foggy trails and colonial-era charm", temp: "15°C", tag: "Scenic", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Ayubia", desc: "Nature trails and butterfly museum", temp: "16°C", tag: "Family", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Chitral", desc: "Remote valley with rich culture", temp: "19°C", tag: "Offbeat", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" }
    ],
    cold: [
        { name: "Skardu", desc: "Land of mountains and frozen lakes", temp: "5°C", tag: "Adventure", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Hunza Valley", desc: "Breathtaking peaks and ancient forts", temp: "8°C", tag: "Scenic", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Naran Kaghan", desc: "Snow-capped mountains and crystal lakes", temp: "3°C", tag: "Popular", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Swat Valley", desc: "Pakistan's Switzerland in winter snow", temp: "6°C", tag: "Beautiful", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Fairy Meadows", desc: "Gateway to Nanga Parbat base camp", temp: "2°C", tag: "Epic", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Deosai Plains", desc: "World's second highest plateau", temp: "0°C", tag: "Wildlife", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" }
    ]
};

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
                    View Recipe
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
            </div>
        </a>
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
                    <span class="text-primary font-display font-bold text-sm">${item.temp}</span>
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
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,sunrise,sunset',
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
                <span class="hour-temp">${temp}°</span>
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
                    <span class="daily-max">${maxTemp}°</span>
                    <span class="daily-min">${minTemp}°</span>
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

    DOM.temperature.textContent = `${tempC}°C`;
    DOM.feelsLike.textContent = `${feelsLikeC}°C`;

    const weatherInfo = WEATHER_CODES[current.weather_code] || WEATHER_CODES[0];
    const isNight = current.is_day === 0;

    DOM.heroWeatherIcon.textContent = isNight ? 'night_clear' : weatherInfo.icon;
    DOM.weatherCondition.textContent = weatherInfo.condition;
    DOM.cityName.textContent = cityName;

    // Update time label (NIGHT/DAY) and icon color
    if (DOM.timeLabel) {
        DOM.timeLabel.textContent = isNight ? 'NIGHT' : 'DAY';
        DOM.timeLabel.style.color = isNight ? '#F5A623' : '#FFD700';
    }
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
        icon: isNight ? 'night_clear' : weatherInfo.icon,
        isNight: isNight
    };

    renderWeekendGrid();

    if (data.hourly) {
        renderHourlyForecast(data.hourly);
    }

    if (data.daily) {
        renderDailyForecast(data.daily);
    }
}

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
            window.location.href = 'outfit.html';
        } else if (text === 'food') {
            window.location.href = 'food.html';
        }
    });
});

// ========== INIT ==========
displayWeather(34.0151, 71.5249, CONFIG.DEFAULT_CITY);
