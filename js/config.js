/* ========================================
   VibeCast - Shared Configuration
   ======================================== */

export const CONFIG = {
    GEO_API: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
    DEFAULT_CITY: 'Peshawar',
    DEFAULT_LAT: 34.0151,
    DEFAULT_LON: 71.5249,
};

export const WEATHER_CODES = {
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

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WEATHER_BACKGROUNDS = {
    0: 'weather-bg-sunny',
    1: 'weather-bg-sunny',
    2: 'weather-bg-cloudy',
    3: 'weather-bg-cloudy',
    45: 'weather-bg-fog',
    48: 'weather-bg-fog',
    51: 'weather-bg-rainy',
    53: 'weather-bg-rainy',
    55: 'weather-bg-rainy',
    61: 'weather-bg-rainy',
    63: 'weather-bg-rainy',
    65: 'weather-bg-rainy',
    71: 'weather-bg-snow',
    73: 'weather-bg-snow',
    75: 'weather-bg-snow',
    80: 'weather-bg-rainy',
    81: 'weather-bg-rainy',
    82: 'weather-bg-rainy',
    95: 'weather-bg-thunder',
    96: 'weather-bg-thunder',
};
