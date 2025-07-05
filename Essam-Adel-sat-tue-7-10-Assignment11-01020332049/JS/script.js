const apiKey = "efb2c1f2be62452abff131227250507";

//const res_gio = await fetch(`https://api.weatherapi.com/v1/ip.json`)


// Defualt Function without giolocation
document.getElementById("locationInput").addEventListener("input", debounce(async () => {
  const query = document.getElementById("locationInput").value.trim();
  if (!query) return;
  await GetWeather(query)
  
}, 600)); // 300 ms delay


// Button Action Feature
document.getElementById("searchBtn").addEventListener("click",async () =>{
  const query = document.getElementById("locationInput").value.trim();
  if (!query) return;
  await GetWeather(query);
});

// Function with giolocation
window.addEventListener("load", () => {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try{
          const loca = `${latitude},${longitude}`
          await fetchWeather(`${latitude},${longitude}`);
        }
        catch(err){
          console.error("Geolocation weather fetch failed:", err);
        }
      }
    )
  }
})

// Get with search auto complete
async function GetWeather(query) {
  try 
  {
    const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
    const matches = await res.json();

    // To Find the top accurate word
    if (matches.length > 0) {
      const bestMatch = matches[0].name;
      fetchWeather(bestMatch);
    }
  } catch (err) 
  {
    console.error(err);
  }
  
}

// Delay Function
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Normal Fetching and Display
async function fetchWeather(location) {
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`);
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    console.error("Failed to fetch weather:", err);
  }
}

// Display
function displayWeather(data) {
  const forecast = data.forecast.forecastday;
  const location = data.location;
  const currentData = data.current;
  const today = forecast[0];
  const todayDate = new Date(today.date);
  const weekday = todayDate.toLocaleDateString("en-US", { weekday: "long" });


  console.log(data)

  const todayHTML = `
    <div class="today-forecast">
      <div class="forecast-header">
        <div class="day">${weekday}</div>
        <div class="date">${todayDate.getDate()} ${todayDate.toLocaleDateString("en-US", { month: "short" })}</div>
      </div>
      <div class="forecast-content">
        <div class="location">
        <h5>${location.region || location.country}</h5>
        </div>
        <div class="degree">
          <div class="num">${currentData.temp_c}<sup>o</sup>C</div>
          <div class="forecast-icon">
            <img src="https:${currentData.condition.icon}" alt="" width="90">
          </div>
        </div>
        <div class="custom">${currentData.condition.text}</div>
        <span><i class="fa-solid fa-droplet"></i> ${currentData.humidity}%</span>
        <span><i class="fa-solid fa-wind"></i> ${currentData.wind_kph} km/h</span>
        <span><i class="fa-solid fa-compass"></i> ${currentData.wind_dir}</span>
      </div>
    </div>
  `;

  let forecastHTML = "";
  for (let i = 1; i < 3; i++) {
    const main_day = forecast[i];
    const day = forecast[i].day;

    const date = new Date(main_day.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    forecastHTML += `
    <div class="forecast">
      <div class="forecast-header">
        <div class="day">${dayName}</div>
        <div class="date">${date.getDate()} ${date.toLocaleDateString("en-US", { month: "short" })}</div>
      </div>
      <div class="forecast-content">
        <div class="forecast-icon">
          <img class="mb-3" src="https:${day.condition.icon}" alt="" width="48">
        </div>
        <div class="degree">${day.maxtemp_c}<sup>o</sup>C</div>
        <small>${day.mintemp_c}<sup>o</sup></small>
        <div class="custom mt-5">${day.condition.text}</div>

        <span><i class="fa-solid fa-droplet"></i> ${day.avghumidity}%</span>
        <span><i class="fa-solid fa-wind"></i> ${day.maxwind_kph} km/h</span>

      </div>
    </div>
    `;
  }

  document.getElementById("forecast").innerHTML = todayHTML + forecastHTML;
  document.getElementById("forecast").classList.add("fade-in");
}
