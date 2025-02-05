// Selecciona el elemento del DOM con el ID 'menu-icon' y le añade un event listener para el evento 'click'
document.getElementById('menu-icon').addEventListener('click', function () {
    
    // Selecciona el elemento del DOM con el ID 'nav-menu' y lo almacena en la constante 'navMenu'
    const navMenu = document.getElementById('nav-menu');
    
    // Alterna la clase 'active' en el elemento 'navMenu'. Si la clase está presente, la elimina; si no está presente, la añade.
    navMenu.classList.toggle('active');
});