const apiKey = "efb2c1f2be62452abff131227250507";

const res_gio = await fetch(`https://api.weatherapi.com/v1/ip.json`)


// Defualt Function without giolocation
document.getElementById("locationInput").addEventListener("input", debounce(async () => {
  const query = document.getElementById("locationInput").value.trim();
  if (!query) return;

  try {
    const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
    const matches = await res.json();

    // To Find the top accurate word
    if (matches.length > 0) {
      const bestMatch = matches[0].name;
      fetchWeather(bestMatch);
    }
  } catch (err) {
    console.error("Auto-match Api error:", err);
  }
}, 300)); // 300 ms delay

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

async function fetchWeather(location) {
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`);
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    console.error("Failed to fetch weather:", err);
  }
}

function displayWeather(data) {
  const forecast = data.forecast.forecastday;
  const today = forecast[0];
  const todayDate = new Date(today.date);
  const weekday = todayDate.toLocaleDateString("en-US", { weekday: "long" });

  const todayHTML = `
    <div class="today forecast">
      <div class="forecast-header">
        <div class="day">${weekday}</div>
        <div class="date">${todayDate.getDate()} ${todayDate.toLocaleDateString("en-US", { month: "short" })}</div>
      </div>
      <div class="forecast-content">
        <div class="location">
        <h5>${data.location.name}</h5>
        </div>
        <div class="degree">
          <div class="num">${data.current.temp_c}<sup>o</sup>C</div>
          <div class="forecast-icon">
            <img src="https:${data.current.condition.icon}" alt="" width="90">
          </div>
        </div>
        <div class="custom">${data.current.condition.text}</div>
        <span><i class="fa-solid fa-droplet"></i> ${data.current.humidity}%</span>
        <span><i class="fa-solid fa-wind"></i> ${data.current.wind_kph} km/h</span>
        <span><i class="fa-solid fa-compass"></i> ${data.current.wind_dir}</span>
      </div>
    </div>
  `;

  let forecastHTML = "";
  for (let i = 1; i < 3; i++) {
    const day = forecast[i];
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    forecastHTML += `
    <div class="forecast">
      <div class="forecast-header">
        <div class="day">${dayName}</div>
      </div>
      <div class="forecast-content">
        <div class="forecast-icon">
          <img src="https:${day.day.condition.icon}" alt="" width="48">
        </div>
        <div class="degree">${day.day.maxtemp_c}<sup>o</sup>C</div>
        <small>${day.day.mintemp_c}<sup>o</sup></small>
        <div class="custom">${day.day.condition.text}</div>
      </div>
    </div>
    `;
  }

  document.getElementById("forecast").innerHTML = todayHTML + forecastHTML;
}
