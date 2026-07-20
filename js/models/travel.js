/* ========================================
   VibeCast - Travel Model
   Destinations Data + Logic
   ======================================== */

import { loadFromStorage } from '../storage.js';

export const travelDestinations = loadFromStorage('vibecast-travel', {
    hot: [
        { name: "Clifton Beach", desc: "Cool sea breeze and golden sand", tempC: 32, tag: "Beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 24.8084, lon: 67.0360 },
        { name: "Gwadar Coast", desc: "Pristine beaches and crystal clear water", tempC: 30, tag: "Coastal", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 25.1210, lon: 62.3250 },
        { name: "Astola Island", desc: "Pakistan's hidden island paradise", tempC: 29, tag: "Island", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 25.1080, lon: 65.5310 },
        { name: "Ormara Beach", desc: "Secluded coastal gem with turquoise water", tempC: 31, tag: "Hidden Gem", image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 25.2631, lon: 64.5967 },
        { name: "Sonmiani Beach", desc: "Calm waters and scenic dunes", tempC: 33, tag: "Relaxing", image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 24.8800, lon: 66.7900 },
        { name: "Makran Coast", desc: "Dramatic cliffs meet the Arabian Sea", tempC: 30, tag: "Scenic", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 25.3960, lon: 65.0970 }
    ],
    rainy: [
        { name: "Murree Hills", desc: "Cool breezy hill station with pine forests", tempC: 18, tag: "Popular", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 33.9070, lon: 73.3940 },
        { name: "Abbottabad", desc: "Green valley surrounded by mountains", tempC: 20, tag: "Peaceful", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 34.1469, lon: 73.2138 },
        { name: "Patriata", desc: "Chairlift ride through misty hills", tempC: 17, tag: "Adventure", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 33.8870, lon: 73.4800 },
        { name: "Nathia Gali", desc: "Foggy trails and colonial-era charm", tempC: 15, tag: "Scenic", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 34.0734, lon: 73.3867 },
        { name: "Ayubia", desc: "Nature trails and butterfly museum", tempC: 16, tag: "Family", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 34.0684, lon: 73.3847 },
        { name: "Chitral", desc: "Remote valley with rich culture", tempC: 19, tag: "Offbeat", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 35.8516, lon: 71.7950 }
    ],
    cold: [
        { name: "Skardu", desc: "Land of mountains and frozen lakes", tempC: 5, tag: "Adventure", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 35.2896, lon: 75.6498 },
        { name: "Hunza Valley", desc: "Breathtaking peaks and ancient forts", tempC: 8, tag: "Scenic", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 36.3167, lon: 74.6500 },
        { name: "Naran Kaghan", desc: "Snow-capped mountains and crystal lakes", tempC: 3, tag: "Popular", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 34.9068, lon: 73.6491 },
        { name: "Swat Valley", desc: "Pakistan's Switzerland in winter snow", tempC: 6, tag: "Beautiful", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 35.2220, lon: 72.4258 },
        { name: "Fairy Meadows", desc: "Gateway to Nanga Parbat base camp", tempC: 2, tag: "Epic", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 35.4028, lon: 74.5906 },
        { name: "Deosai Plains", desc: "World's second highest plateau", tempC: 0, tag: "Wildlife", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#", lat: 34.9900, lon: 75.4300 }
    ]
});

export const weekendDestinationPool = [
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

export function haversineDistance(lat1, lon1, lat2, lon2) {
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
