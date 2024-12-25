const apiKey = "e6cf58d0081c4fef88d183337242512";
const inputSearch = document.getElementById("inputsearch");
const searchBtn = document.getElementById("searchbtn");
const loadingIndicator = document.getElementById("loading");

searchBtn.addEventListener("click", () => {
  const location = inputSearch.value.trim();
  if (location) {
    getWeather(location);
  } else {
    alert("Please enter a location!");
  }
});

inputSearch.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

async function getWeather(country) {
  loadingIndicator.style.display = "block";
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${country}&days=3`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch weather data. Check your API key or location."
      );
    }

    const data = await response.json();
    displayData(data.location, data.forecast.forecastday);
  } catch (error) {
    console.error(error);
    alert("Unable to retrieve weather data. Please try again.");
  } finally {
    loadingIndicator.style.display = "none";
  }
}

function displayData(location, forecastDays) {
  let output = `
        <div class="col-md-12 mb-4 text-center">
            <h2 class="text-white">${location.name}, ${location.country}</h2>
        </div>
    `;

  const relevantDays = forecastDays.slice(0, 3);

  relevantDays.forEach((day, index) => {
    const date = new Date(day.date).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const condText = day.day.condition.text;
    const humidity = day.day.avghumidity;
    const windSpeed = day.day.maxwind_kph;

    const maxTemp = day.day.maxtemp_c;
    const minTemp = day.day.mintemp_c;

    const dayLabel =
      index === 0
        ? "(Today)"
        : index === 1
        ? "(Tomorrow)"
        : "( After Tomorrow)";

    output += `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card bg-dark text-white h-100">
                    <div class="card-body d-flex flex-column">
                        <h5>${date} ${dayLabel}</h5>
                        <p>Max: ${maxTemp}°C</p>
                        <p>Min: ${minTemp}°C</p>
                        <p>${condText}</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Wind: ${windSpeed} km/h</p>
                    </div>
                </div>
            </div>
        `;
  });

  document.getElementById("weatherContainer").innerHTML = output;
}

getWeather("Cairo");
