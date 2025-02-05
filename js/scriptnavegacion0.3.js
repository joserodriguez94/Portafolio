// Manejo de clics en el documento para controlar menús desplegables
document.addEventListener("click", function (event) {
  // Selecciona todos los elementos con la clase "contenido-desplegable" y "flecha"
  const desplegables = document.querySelectorAll(".contenido-desplegable");
  const flechas = document.querySelectorAll(".flecha");
  let desplegableClicado = null;

  // Verifica si el clic fue en un botón desplegable
  if (event.target.closest(".boton-desplegable")) {
    // Obtiene el contenido desplegable asociado al botón clicado
    desplegableClicado = event.target
      .closest(".desplegable")
      .querySelector(".contenido-desplegable");
  }

  // Cierra todos los menús desplegables excepto el que se ha clicado
  desplegables.forEach((desplegable) => {
    if (desplegable !== desplegableClicado) {
      // Oculta el contenido desplegable
      desplegable.style.display = "none";
      // Remueve la clase "active" de la flecha asociada
      desplegable.previousElementSibling
        .querySelector(".flecha")
        .classList.remove("active");
    }
  });

  // Maneja la apertura y cierre del menú desplegable clicado
  if (desplegableClicado) {
    // Obtiene la flecha asociada al menú desplegable clicado
    const flecha =
      desplegableClicado.previousElementSibling.querySelector(".flecha");
    // Verifica si el menú desplegable está visible
    if (desplegableClicado.style.display === "block") {
      // Oculta el menú desplegable
      desplegableClicado.style.display = "none";
      // Remueve la clase "active" de la flecha
      flecha.classList.remove("active");
    } else {
      // Muestra el menú desplegable
      desplegableClicado.style.display = "block";
      // Añade la clase "active" a la flecha
      flecha.classList.add("active");
    }
  }
});

// Manejo del menú de hamburguesa para móviles
const burger = document.getElementById("burger"); // Selecciona el botón de hamburguesa
const navLinks = document.getElementById("nav-links"); // Selecciona los enlaces de navegación

// Añade un evento de clic al botón de hamburguesa
burger.addEventListener("click", () => {
  // Alterna la clase "active" en el botón de hamburguesa y en los enlaces de navegación
  burger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Manejo de menús desplegables (dropdowns)
const dropdowns = document.querySelectorAll(".dropdown"); // Selecciona todos los elementos con la clase "dropdown"

// Función para manejar el clic en el dropdown
dropdowns.forEach((dropdown) => {
  // Selecciona el botón que abre/cierra el menú desplegable dentro del dropdown
  const toggle = dropdown.querySelector(".dropdown-toggle");
  // Añade un evento de clic al botón de alternar el menú desplegable
  toggle.addEventListener("click", (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del enlace
    // Cierra todos los otros dropdowns
    dropdowns.forEach((d) => {
      if (d !== dropdown) {
        d.classList.remove("active");
      }
    });
    // Activa o desactiva el dropdown actual
    dropdown.classList.toggle("active");
  });
});

// Función para manejar la búsqueda
document.getElementById("search-button").addEventListener("click", function () {
  // Obtiene el valor del campo de búsqueda y elimina espacios en blanco al inicio y final
  const searchValue = document.getElementById("search-input").value.trim();
  // Selecciona el div donde se mostrarán los resultados de la búsqueda
  const resultDiv = document.getElementById("result");

  // Verifica si el campo de búsqueda no está vacío
  if (searchValue) {
    // Muestra el término buscado en el div de resultados
    resultDiv.innerHTML = `Has buscado: <strong>${searchValue}</strong>`;
  } else {
    // Muestra un mensaje de error si el campo de búsqueda está vacío
    resultDiv.innerHTML = `<span style="color: red;">Por favor, ingresa un término de búsqueda.</span>`;
  }
});

// Opcional: Permitir la búsqueda al presionar "Enter"
document.getElementById("search-input")
  .addEventListener("keypress", function (event) {
    // Verifica si la tecla presionada es "Enter"
    if (event.key === "Enter") {
      // Simula un clic en el botón de búsqueda
      document.getElementById("search-button").click();
    }
  });