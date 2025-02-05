// Clave de la API de OpenWeatherMap
const apiKey = "eb4ae362308a4644aad02563c3c6cc4c";

// URL base de la API de OpenWeatherMap
const apiBase = "https://api.openweathermap.org/data/2.5";

// Elementos del DOM
const cityInput = document.getElementById("city-input"); // Campo de entrada para la ciudad
const searchBtn = document.getElementById("search-btn"); // Botón de búsqueda
const loadingSpinner = document.getElementById("loading-spinner"); // Spinner de carga
const weatherResult = document.querySelector(".weather-result"); // Contenedor de resultados del clima
const errorMessage = document.getElementById("error-message"); // Mensaje de error
const forecastContainer = document.getElementById("forecast-container"); // Contenedor del pronóstico
const temperatureChartCanvas = document.getElementById("temperature-chart"); // Canvas para el gráfico de temperatura
const unitSelect = document.getElementById("unit-select"); // Selector de unidades (Celsius/Fahrenheit)
const historyList = document.getElementById("history-list"); // Lista del historial de búsquedas

// Elementos del DOM para la sección de comentarios
const commentForm = document.getElementById("comment-form"); // Formulario de comentarios
const commentList = document.getElementById("comment-items"); // Lista de comentarios

// Variables globales
let map; // Mapa de Leaflet
let marker; // Marcador en el mapa
let temperatureChart; // Gráfico de temperatura

// Historial de búsqueda, cargado desde localStorage o inicializado como un array vacío
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Función para inicializar el mapa
function initializeMap() {
  map = L.map("map").setView([51.505, -0.09], 2); // Inicializa el mapa con una vista centrada en Londres
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, // Máximo nivel de zoom
  }).addTo(map); // Añade la capa de tiles al mapa
}

// Función para actualizar el historial de búsquedas en la interfaz
function updateHistory() {
  historyList.innerHTML = searchHistory
    .map(
      (city) =>
        `<div class="history-item" onclick="searchCity('${city}')">${city}</div>` // Crea un elemento de historial por cada ciudad
    )
    .join(""); // Une todos los elementos en un solo string
}

// Función para buscar una ciudad específica
async function searchCity(city) {
  cityInput.value = city; // Establece el valor del campo de entrada
  searchBtn.click(); // Simula un clic en el botón de búsqueda
}

// Función para actualizar el mapa con la ubicación de la ciudad
function updateMap(lat, lon, cityName) {
  if (!map) return; // Si el mapa no está inicializado, no hacer nada

  map.setView([lat, lon], 10); // Centra el mapa en la nueva ubicación

  if (marker) {
    // Si ya existe un marcador, actualiza su posición y contenido
    marker.setLatLng([lat, lon]).setPopupContent(`📍 ${cityName}`).openPopup();
  } else {
    // Si no existe un marcador, crea uno nuevo
    marker = L.marker([lat, lon])
      .addTo(map)
      .bindPopup(`📍 ${cityName}`)
      .openPopup();
  }
}

// Evento de clic en el botón de búsqueda
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim(); // Obtiene el valor del campo de entrada y elimina espacios en blanco
  if (!city) return; // Si no hay ciudad, no hacer nada

  // Muestra el spinner de carga y oculta los resultados y el mensaje de error
  loadingSpinner.classList.remove("hidden");
  weatherResult.classList.add("hidden");
  forecastContainer.classList.add("hidden");
  errorMessage.classList.add("hidden");

  try {
    const unit = unitSelect.value; // Obtiene la unidad seleccionada (Celsius/Fahrenheit)
    const weatherData = await fetchWeather(city, unit); // Obtiene los datos del clima
    const forecastData = await fetchForecast(city, unit); // Obtiene los datos del pronóstico

    updateWeatherUI(weatherData); // Actualiza la interfaz con los datos del clima
    updateForecastUI(forecastData); // Actualiza la interfaz con los datos del pronóstico

    const { lat, lon } = weatherData.coord; // Obtiene las coordenadas de la ciudad
    updateMap(lat, lon, weatherData.name); // Actualiza el mapa con la nueva ubicación

    // Actualiza el gráfico de temperatura con los datos del pronóstico
    updateTemperatureChart(
      forecastData.list
        .filter((_, index) => index % 8 === 0) // Filtra los datos para mostrar solo uno por día
        .map((entry) => entry.dt_txt.split(" ")[0]), // Obtiene las fechas
      forecastData.list
        .filter((_, index) => index % 8 === 0)
        .map((entry) => entry.main.temp) // Obtiene las temperaturas
    );

    // Guarda la ciudad en el historial de búsquedas
    if (!searchHistory.includes(city)) {
      searchHistory.unshift(city); // Añade la ciudad al inicio del historial
      if (searchHistory.length > 5) searchHistory.pop(); // Limita el historial a 5 elementos
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); // Guarda el historial en localStorage
    }

    updateHistory(); // Actualiza la interfaz del historial
  } catch (error) {
    errorMessage.textContent = error.message; // Muestra el mensaje de error
    errorMessage.classList.remove("hidden");
  } finally {
    loadingSpinner.classList.add("hidden"); // Oculta el spinner de carga
  }
});

// Función para obtener los datos del clima
async function fetchWeather(city, unit) {
  const response = await fetch(
    `${apiBase}/weather?q=${city}&units=${unit}&appid=${apiKey}` // Realiza la solicitud a la API
  );
  if (!response.ok) throw new Error("City not found"); // Si la respuesta no es válida, lanza un error
  return response.json(); // Devuelve los datos en formato JSON
}

// Función para obtener los datos del pronóstico
async function fetchForecast(city, unit) {
  const response = await fetch(
    `${apiBase}/forecast?q=${city}&units=${unit}&appid=${apiKey}` // Realiza la solicitud a la API
  );
  if (!response.ok) throw new Error("Unable to fetch forecast"); // Si la respuesta no es válida, lanza un error
  return response.json(); // Devuelve los datos en formato JSON
}

// Función para actualizar la interfaz con los datos del clima
function updateWeatherUI(data) {
  document.getElementById(
    "city-name"
  ).textContent = `${data.name}, ${data.sys.country}`; // Nombre de la ciudad y país
  document.getElementById("temperature").textContent = `🌡️ Temp: ${
    data.main.temp
  } °${unitSelect.value === "metric" ? "C" : "F"}`; // Temperatura
  document.getElementById(
    "humidity"
  ).textContent = `💧 Humidity: ${data.main.humidity}%`; // Humedad
  document.getElementById(
    "conditions"
  ).textContent = `☁️ Conditions: ${data.weather[0].description}`; // Condiciones climáticas
  document.getElementById(
    "wind-speed"
  ).textContent = `🌬️ Wind Speed: ${data.wind.speed} m/s`; // Velocidad del viento
  document.getElementById(
    "pressure"
  ).textContent = `💨 Pressure: ${data.main.pressure} hPa`; // Presión atmosférica

  if (data.alerts) {
    document.getElementById(
      "alerts"
    ).textContent = `⚠️ Alert: ${data.alerts[0].description}`; // Alertas climáticas
  } else {
    document.getElementById("alerts").textContent = ""; // Si no hay alertas, no mostrar nada
  }

  document.getElementById(
    "weather-icon"
  ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // Ícono del clima
  weatherResult.classList.remove("hidden"); // Muestra el contenedor de resultados
}

// Función para actualizar la interfaz con los datos del pronóstico
function updateForecastUI(data) {
  const forecastHTML = data.list
    .filter((_, index) => index % 8 === 0) // Filtra los datos para mostrar solo uno por día
    .map((entry) => {
      return `
          <div class="forecast-item">
            <p>${new Date(entry.dt_txt).toLocaleDateString()}</p> <!-- Fecha -->
            <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png"> <!-- Ícono del clima -->
            <p>${entry.main.temp} °${unitSelect.value === "metric" ? "C" : "F"}</p> <!-- Temperatura -->
          </div>`;
    })
    .join(""); // Une todos los elementos en un solo string
  document.getElementById("forecast").innerHTML = forecastHTML; // Actualiza el contenido del pronóstico
  forecastContainer.classList.remove("hidden"); // Muestra el contenedor del pronóstico
}

// Función para actualizar el gráfico de temperatura
function updateTemperatureChart(labels, temperatures) {
  if (temperatureChart) temperatureChart.destroy(); // Si ya existe un gráfico, lo destruye

  temperatureChart = new Chart(temperatureChartCanvas, {
    type: "line", // Tipo de gráfico (línea)
    data: {
      labels, // Etiquetas del eje X (fechas)
      datasets: [
        {
          label: "Temperature", // Etiqueta del conjunto de datos
          data: temperatures, // Datos de temperatura
          borderColor: "#ffff", // Color de la línea
          backgroundColor: "rgba(54, 162, 235, 0.2)", // Color de relleno bajo la línea
          fill: true, // Rellenar el área bajo la línea
          pointBackgroundColor: "red", // Color de los puntos
          pointBorderColor: "red", // Borde de los puntos
          pointRadius: 5, // Tamaño de los puntos
        },
      ],
    },
    options: {
      responsive: true, // Habilita la capacidad de respuesta
      maintainAspectRatio: false, // No mantener la relación de aspecto
      plugins: {
        legend: {
          labels: {
            color: "white", // Color del texto de la leyenda
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "white", // Color de las etiquetas del eje X
          },
          grid: {
            color: "white", // Color de las líneas de la cuadrícula del eje X
          },
        },
        y: {
          ticks: {
            color: "white", // Color de las etiquetas del eje Y
          },
          grid: {
            color: "white", // Color de las líneas de la cuadrícula del eje Y
          },
        },
      },
    },
  });
}

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  initializeMap(); // Inicializa el mapa
  updateHistory(); // Actualiza el historial de búsquedas
});

// Evento para buscar al presionar Enter en el campo de entrada
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click(); // Simula un clic en el botón de búsqueda
  }
});

// Sección de Comentarios

// Función para cargar comentarios desde LocalStorage
function loadComments() {
  const storedComments = JSON.parse(localStorage.getItem("comments")) || []; // Obtiene los comentarios almacenados
  storedComments.forEach((comment) => {
    const listItem = document.createElement("li"); // Crea un elemento de lista
    listItem.className = "list-group-item"; // Añade una clase al elemento
    listItem.textContent = comment; // Establece el contenido del elemento
    commentList.appendChild(listItem); // Añade el elemento a la lista de comentarios
  });
}

// Función para guardar un comentario en LocalStorage
function saveComment(comment) {
  const storedComments = JSON.parse(localStorage.getItem("comments")) || []; // Obtiene los comentarios almacenados
  storedComments.push(comment); // Añade el nuevo comentario
  localStorage.setItem("comments", JSON.stringify(storedComments)); // Guarda los comentarios en LocalStorage
}

// Cargar comentarios al inicio
loadComments();

// Manejar el evento de envío del formulario de comentarios
commentForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita el envío del formulario
  const commentText = document.getElementById("user-comment").value; // Obtiene el texto del comentario

  if (commentText.trim()) {
    // Si el comentario no está vacío
    const listItem = document.createElement("li"); // Crea un elemento de lista
    listItem.className = "list-group-item"; // Añade una clase al elemento
    listItem.textContent = commentText; // Establece el contenido del elemento
    commentList.appendChild(listItem); // Añade el elemento a la lista de comentarios

    saveComment(commentText); // Guarda el comentario en LocalStorage

    document.getElementById("user-comment").value = ""; // Limpia el campo de entrada
  }
});
