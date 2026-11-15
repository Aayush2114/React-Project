# SkyCast Weather App

A React app that fetches current weather for a searched city.

## Features
- Search city weather
- Current temperature and feels-like temperature
- Weather description, humidity and wind speed
- Loading and error messages
- Responsive layout

## Setup
1. Run `npm install`.
2. Get an API key from https://openweathermap.org/api.
3. Replace `YOUR_OPENWEATHERMAP_API_KEY` in `src/App.jsx` with your key.
4. Run `npm run dev`.

Tech: React, Vite, JavaScript, CSS, Fetch API, OpenWeatherMap.

For a public production deployment, do not expose private API keys in frontend code; use a backend proxy.