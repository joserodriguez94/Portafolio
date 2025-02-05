// Escuchar eventos de clic en todo el documento
document.addEventListener('click', function(event) {
    // Seleccionar todos los elementos con la clase 'contenido-desplegable' (menús desplegables)
    const desplegables = document.querySelectorAll('.contenido-desplegable');
    
    // Seleccionar todos los elementos con la clase 'flecha' (íconos de flecha)
    const flechas = document.querySelectorAll('.flecha');
    
    // Variable para almacenar el menú desplegable en el que se hizo clic
    let desplegableClicado = null;

    // Verificar si el clic fue en un botón desplegable
    if (event.target.closest('.boton-desplegable')) {
        // Si es así, obtener el menú desplegable asociado al botón clicado
        desplegableClicado = event.target.closest('.desplegable').querySelector('.contenido-desplegable');
    }

    // Recorrer todos los menús desplegables
    desplegables.forEach(desplegable => {
        // Si el menú desplegable no es el que se clicó, ocultarlo
        if (desplegable !== desplegableClicado) {
            desplegable.style.display = 'none';
            
            // Remover la clase 'active' de la flecha asociada al menú desplegable oculto
            desplegable.previousElementSibling.querySelector('.flecha').classList.remove('active');
        }
    });

    // Si se hizo clic en un menú desplegable
    if (desplegableClicado) {
        // Obtener la flecha asociada al menú desplegable clicado
        const flecha = desplegableClicado.previousElementSibling.querySelector('.flecha');
        
        // Verificar si el menú desplegable ya está visible
        if (desplegableClicado.style.display === 'block') {
            // Si está visible, ocultarlo y remover la clase 'active' de la flecha
            desplegableClicado.style.display = 'none';
            flecha.classList.remove('active');
        } else {
            // Si no está visible, mostrarlo y agregar la clase 'active' a la flecha
            desplegableClicado.style.display = 'block';
            flecha.classList.add('active');
        }
    }
});

// Escuchar eventos de teclado en el campo de búsqueda
document.getElementById('search-input').addEventListener('keypress', function(event) {
    // Verificar si la tecla presionada es 'Enter'
    if (event.key === 'Enter') {
        // Prevenir el comportamiento por defecto (por ejemplo, enviar un formulario)
        event.preventDefault();
        
        // Llamar a la función para realizar la búsqueda
        realizarBusqueda();
    }
});

// Función para realizar la búsqueda
function realizarBusqueda() {
    // Obtener el término de búsqueda ingresado por el usuario
    const terminoBusqueda = document.getElementById('search-input').value;
    
    // Obtener el contenedor donde se mostrarán los resultados de la búsqueda
    const resultadosDiv = document.getElementById('search-results');

    // Verificar si el término de búsqueda está vacío o solo contiene espacios en blanco
    if (terminoBusqueda.trim() === '') {
        // Si está vacío, limpiar el contenedor de resultados y salir de la función
        resultadosDiv.innerHTML = '';
        return;
    }

    // Simulación de búsqueda (esto puede ser reemplazado por una lógica real de búsqueda)
    resultadosDiv.innerHTML = `Has buscado: <strong>${terminoBusqueda}</strong>`;
}