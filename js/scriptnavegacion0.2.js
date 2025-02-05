// Toggle mobile menu
// Selecciona el botón de alternar el menú móvil y añade un evento de clic
document.getElementById('navbar-toggle').addEventListener('click', function () {
  // Selecciona el menú móvil
  const menu = document.getElementById('navbar-menu');
  // Alterna la clase 'show' en el menú para mostrarlo u ocultarlo
  menu.classList.toggle('show');
});

// Toggle dropdown menu
// Selecciona todos los elementos con la clase 'dropdown'
document.querySelectorAll('.dropdown').forEach(dropdown => {
  // Selecciona el botón que abre/cierra el menú desplegable dentro del dropdown
  const toggle = dropdown.querySelector('.dropdown-toggle');
  // Selecciona el menú desplegable dentro del dropdown
  const menu = dropdown.querySelector('.dropdown-menu');

  // Añade un evento de clic al botón de alternar el menú desplegable
  toggle.addEventListener('click', function (e) {
    // Previene el comportamiento por defecto del enlace
    e.preventDefault();
    // Alterna la clase 'open' en el dropdown para mostrar u ocultar el menú desplegable
    dropdown.classList.toggle('open');
  });

  // Añade un evento de clic al documento para cerrar el menú desplegable si se hace clic fuera de él
  document.addEventListener('click', function (e) {
    // Verifica si el clic fue fuera del dropdown
    if (!dropdown.contains(e.target)) {
      // Remueve la clase 'open' para cerrar el menú desplegable
      dropdown.classList.remove('open');
    }
  });
});

// Función para manejar la búsqueda
// Selecciona el botón de búsqueda y añade un evento de clic
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
// Selecciona el campo de búsqueda y añade un evento de tecla presionada
document.getElementById("search-input")
  .addEventListener("keypress", function (event) {
    // Verifica si la tecla presionada es "Enter"
    if (event.key === "Enter") {
      // Simula un clic en el botón de búsqueda
      document.getElementById("search-button").click();
    }
  });