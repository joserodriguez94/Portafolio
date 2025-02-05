// Referencias a elementos del DOM
const monthSelect = document.getElementById("month-select"); // Selector de mes
const yearSelect = document.getElementById("year-select"); // Selector de año
const calendarBody = document.getElementById("calendar-body"); // Cuerpo del calendario
const prevMonthButton = document.getElementById("prev-month"); // Botón para ir al mes anterior
const nextMonthButton = document.getElementById("next-month"); // Botón para ir al mes siguiente
const botonIncrementar = document.getElementById("incrementar"); // Botón para incrementar el contador
const botonDecrementar = document.getElementById("decrementar"); // Botón para decrementar el contador
const valorContador = document.getElementById("valor-contador"); // Elemento que muestra el valor del contador

// Variables globales
let currentMonth = new Date().getMonth(); // Mes actual
let currentYear = new Date().getFullYear(); // Año actual
let contador = 0; // Contador para incrementar/decrementar

// Función para reiniciar el formulario
function resetForm() {
  // Reinicia los selectores de mes y año
  document.getElementById("month-select").selectedIndex = 0;
  document.getElementById("year-select").selectedIndex = 0;

  // Remueve las clases activas/inactivas de los botones de tiempo
  document
    .querySelectorAll(".button")
    .forEach((button) => button.classList.remove("active", "inactive"));

  // Remueve las clases activas/inactivas de los botones de duración
  document
    .querySelectorAll(".button2")
    .forEach((button) => button.classList.remove("active2", "inactive2"));

  // Limpia el campo de texto del mensaje
  document.querySelector('textarea[name="mensaje"]').value = "";
}

// Validación y envío del formulario
document.getElementById("reserve-btn").addEventListener("click", function () {
  // Obtiene los botones de tiempo y duración seleccionados
  const timeButtons = document.querySelectorAll(".button.active");
  const durationButtons = document.querySelectorAll(".button2.active2");

  // Obtiene el valor del campo de comentarios
  const comments = document
    .querySelector('textarea[name="mensaje"]')
    .value.trim();

  // Valida que todos los campos estén completos
  if (
    monthSelect.value === "" ||
    yearSelect.value === "" ||
    timeButtons.length === 0 ||
    durationButtons.length === 0 ||
    comments === ""
  ) {
    alert("Please, complete all fields before submitting."); // Muestra una alerta si falta algún campo
  } else {
    alert("Form successfully submitted."); // Muestra una alerta de éxito
    resetForm(); // Reinicia el formulario
  }
});

// Evento para reiniciar el formulario al hacer clic en el botón de cancelar
document.getElementById("cancel-btn").addEventListener("click", resetForm);

// Rellenar el selector de años con un rango de 10 años antes y 40 años después del año actual
for (let i = currentYear - 10; i <= currentYear + 40; i++) {
  const option = document.createElement("option"); // Crea una opción para el selector
  option.value = i; // Establece el valor de la opción
  option.textContent = i; // Establece el texto de la opción
  if (i === currentYear) option.selected = true; // Selecciona el año actual por defecto
  yearSelect.appendChild(option); // Añade la opción al selector de años
}

// Función para poblar el calendario con los días del mes
function populateCalendar(month, year) {
  calendarBody.innerHTML = ""; // Limpia el contenido actual del calendario

  // Obtiene el día de la semana en el que comienza el mes
  const firstDay = new Date(year, month, 1).getDay();

  // Obtiene el número de días en el mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Crea celdas vacías para los días anteriores al inicio del mes
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div"); // Crea una celda vacía
    calendarBody.appendChild(emptyCell); // Añade la celda al calendario
  }

  // Crea celdas con los días del mes
  for (let i = 1; i <= daysInMonth; i++) {
    const dateCell = document.createElement("div"); // Crea una celda para el día
    dateCell.textContent = i; // Establece el número del día

    // Evento para seleccionar un día al hacer clic
    dateCell.addEventListener("click", () => {
      // Remueve la clase "selected" de todas las celdas
      document
        .querySelectorAll(".calendar-body div")
        .forEach((cell) => cell.classList.remove("selected"));

      // Añade la clase "selected" a la celda clickeada
      dateCell.classList.add("selected");
    });

    calendarBody.appendChild(dateCell); // Añade la celda al calendario
  }
}

// Evento para actualizar el calendario cuando se cambia el mes
monthSelect.addEventListener("change", () => {
  currentMonth = parseInt(monthSelect.value); // Actualiza el mes actual
  populateCalendar(currentMonth, currentYear); // Puebla el calendario con el nuevo mes
});

// Evento para actualizar el calendario cuando se cambia el año
yearSelect.addEventListener("change", () => {
  currentYear = parseInt(yearSelect.value); // Actualiza el año actual
  populateCalendar(currentMonth, currentYear); // Puebla el calendario con el nuevo año
});

// Evento para ir al mes anterior
prevMonthButton.addEventListener("click", () => {
  if (currentMonth === 0) {
    currentMonth = 11; // Si es enero, cambia a diciembre
    currentYear--; // Disminuye el año
  } else {
    currentMonth--; // Disminuye el mes
  }
  monthSelect.value = currentMonth; // Actualiza el selector de mes
  yearSelect.value = currentYear; // Actualiza el selector de año
  populateCalendar(currentMonth, currentYear); // Puebla el calendario con el nuevo mes
});

// Evento para ir al mes siguiente
nextMonthButton.addEventListener("click", () => {
  if (currentMonth === 11) {
    currentMonth = 0; // Si es diciembre, cambia a enero
    currentYear++; // Aumenta el año
  } else {
    currentMonth++; // Aumenta el mes
  }
  monthSelect.value = currentMonth; // Actualiza el selector de mes
  yearSelect.value = currentYear; // Actualiza el selector de año
  populateCalendar(currentMonth, currentYear); // Puebla el calendario con el nuevo mes
});

// Poblar el calendario con el mes y año actuales al cargar la página
populateCalendar(currentMonth, currentYear);

// Función para activar un botón de tiempo
function activateButton(buttonId) {
  const buttons = document.querySelectorAll(".button"); // Obtiene todos los botones de tiempo
  buttons.forEach((button) => {
    if (button.id === buttonId) {
      button.classList.add("active"); // Añade la clase "active" al botón seleccionado
      button.classList.remove("inactive"); // Remueve la clase "inactive"
    } else {
      button.classList.add("inactive"); // Añade la clase "inactive" a los demás botones
      button.classList.remove("active"); // Remueve la clase "active"
    }
  });
}

// Función para activar un botón de duración
function activateButton2(buttonId) {
  const buttons2 = document.querySelectorAll(".button2"); // Obtiene todos los botones de duración
  buttons2.forEach((button2) => {
    if (button2.id === buttonId) {
      button2.classList.add("active2"); // Añade la clase "active2" al botón seleccionado
      button2.classList.remove("inactive2"); // Remueve la clase "inactive2"
    } else {
      button2.classList.add("inactive2"); // Añade la clase "inactive2" a los demás botones
      button2.classList.remove("active2"); // Remueve la clase "active2"
    }
  });

  // Lógica específica para incrementar y decrementar el contador
  if (buttonId === "incrementar") {
    contador++; // Incrementa el contador
  } else if (buttonId === "decrementar") {
    if (contador > 0) contador--; // Decrementa el contador si es mayor que 0
  } else {
    contador = 0; // Reinicia el contador para cualquier otro botón
  }

  // Actualiza el valor del contador en la interfaz
  valorContador.textContent = contador;
}