const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// коды погоды -> описание и иконка
const WEATHER_CODES = {
    0: ["Ясно", "☀️"],
    1: ["Преимущественно ясно", "🌤️"],
    2: ["Переменная облачность", "⛅"],
    3: ["Пасмурно", "☁️"],
    45: ["Туман", "🌫️"],
    48: ["Изморозь", "🌫️"],
    51: ["Лёгкая морось", "🌦️"],
    53: ["Морось", "🌦️"],
    55: ["Сильная морось", "🌧️"],
    61: ["Небольшой дождь", "🌦️"],
    63: ["Дождь", "🌧️"],
    65: ["Сильный дождь", "🌧️"],
    71: ["Небольшой снег", "🌨️"],
    73: ["Снег", "🌨️"],
    75: ["Сильный снег", "❄️"],
    80: ["Ливень", "🌦️"],
    81: ["Ливень", "🌧️"],
    82: ["Сильный ливень", "⛈️"],
    95: ["Гроза", "⛈️"],
    96: ["Гроза с градом", "⛈️"],
    99: ["Гроза с градом", "⛈️"]
};

const $ = selector => document.querySelector(selector);

async function getJSON(url, params) {
    const response = await fetch(url + "?" + new URLSearchParams(params));
    if (!response.ok) throw new Error("Сервер ответил ошибкой " + response.status);
    return response.json();
}

function time(iso) {
    return iso.slice(11, 16);
}

function dayLength(sunrise, sunset) {
    const minutes = Math.round((new Date(sunset) - new Date(sunrise)) / 60000);
    return `${Math.floor(minutes / 60)} ч ${minutes % 60} мин`;
}

// сначала ищем город, потом погоду по его координатам
async function showWeather(cityName) {
    $("#status").textContent = "Загрузка...";
    $("#card").hidden = true;

    try {
        const geo = await getJSON(GEO_URL, { name: cityName, count: 1, language: "ru" });
        if (!geo.results || geo.results.length === 0) {
            $("#status").textContent = `Город «${cityName}» не найден`;
            return;
        }
        const place = geo.results[0];

        const data = await getJSON(WEATHER_URL, {
            latitude: place.latitude,
            longitude: place.longitude,
            current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
            daily: "sunrise,sunset,temperature_2m_max,temperature_2m_min",
            timezone: "auto",
            forecast_days: 1
        });

        const now = data.current;
        const day = data.daily;
        const [description, icon] = WEATHER_CODES[now.weather_code] || ["—", "🌡️"];

        $("#place").textContent = place.name + (place.country ? ", " + place.country : "");
        $("#date").textContent = new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
        $("#icon").textContent = now.is_day ? icon : icon.replace("☀️", "🌙").replace("🌤️", "🌙");
        $("#temp").textContent = Math.round(now.temperature_2m) + "°";
        $("#description").textContent = description;
        $("#feels").textContent = Math.round(now.apparent_temperature) + "°";
        $("#minmax").textContent = `${Math.round(day.temperature_2m_min[0])}° / ${Math.round(day.temperature_2m_max[0])}°`;
        $("#humidity").textContent = now.relative_humidity_2m + "%";
        $("#wind").textContent = now.wind_speed_10m + " км/ч";
        $("#sunrise").textContent = time(day.sunrise[0]);
        $("#sunset").textContent = time(day.sunset[0]);
        $("#dayLength").textContent = dayLength(day.sunrise[0], day.sunset[0]);

        $("#card").classList.toggle("night", !now.is_day);
        $("#card").hidden = false;
        $("#status").textContent = "";

        localStorage.setItem("weather.lastCity", JSON.stringify({ name: cityName, savedAt: Date.now() }));
    } catch (error) {
        $("#status").textContent = "Не удалось загрузить погоду: " + error.message;
    }
}

// поиск по городу
$("#searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const city = $("#city").value.trim();
    if (city) showWeather(city);
});

const last = JSON.parse(localStorage.getItem("weather.lastCity") || "null");
$("#city").value = last ? last.name : "Одесса";
showWeather($("#city").value);
