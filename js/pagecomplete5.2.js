// Definición de un array de productos con sus propiedades
const products = [
    { id: 13, name: "Product 13 ", price: 10.99, image: "img/samsung.jpg" }, // Producto 13 con id, nombre, precio e imagen
    { id: 14, name: "Product 14", price: 12.99, image: "img/samsung.jpg" },  // Producto 14 con id, nombre, precio e imagen
    { id: 15, name: "Product 15", price: 9.99, image: "img/samsung.jpg" },   // Producto 15 con id, nombre, precio e imagen
    { id: 16, name: "Product 16", price: 10.99, image: "img/samsung.jpg" },  // Producto 16 con id, nombre, precio e imagen
    { id: 17, name: "Product 17", price: 12.99, image: "img/samsung.jpg" },  // Producto 17 con id, nombre, precio e imagen
    { id: 18, name: "Product 18", price: 9.99, image: "img/samsung.jpg" },   // Producto 18 con id, nombre, precio e imagen
    { id: 19, name: "Product 19", price: 10.99, image: "img/samsung.jpg" },  // Producto 19 con id, nombre, precio e imagen
    { id: 20, name: "Product 20", price: 12.99, image: "img/samsung.jpg" },  // Producto 20 con id, nombre, precio e imagen
    { id: 21, name: "Product 21", price: 9.99, image: "img/samsung.jpg" },   // Producto 21 con id, nombre, precio e imagen
    { id: 22, name: "Product 22", price: 10.99, image: "img/samsung.jpg" },  // Producto 22 con id, nombre, precio e imagen
    { id: 23, name: "Product 23", price: 12.99, image: "img/samsung.jpg" },  // Producto 23 con id, nombre, precio e imagen
    { id: 24, name: "Product 24", price: 9.99, image: "img/samsung.jpg" },   // Producto 24 con id, nombre, precio e imagen
    // Se pueden añadir más productos según sea necesario
];

// Obtener el carrito desde localStorage o inicializarlo como un array vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para renderizar los productos en la página
function renderProducts(page = 2) {
    const productsPerPage = 15; // Número de productos por página
    const startIndex = (page - 2) * productsPerPage; // Índice de inicio para la paginación
    const endIndex = startIndex + productsPerPage; // Índice de fin para la paginación
    const productsToDisplay = products.slice(startIndex, endIndex); // Obtener los productos a mostrar

    const productsContainer = document.getElementById("products-container"); // Contenedor de productos en el DOM
    productsContainer.innerHTML = productsToDisplay.map(product => `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}"> <!-- Imagen del producto -->
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5> <!-- Nombre del producto -->
                    <p class="card-text">Price: $${product.price.toFixed(2)}</p> <!-- Precio del producto -->
                    <div class="rating">${generateStars(product.id)}</div> <!-- Calificación del producto -->
                    <button onclick="addToCart(${product.id})" class="btn btn-primary mt-2">Add to Cart</button> <!-- Botón para añadir al carrito -->
                </div>
            </div>
        </div>
    `).join(""); // Convertir el array de productos en un string HTML
}

// Función para generar las estrellas de calificación
function generateStars(productId) {
    return Array(5).fill(0).map((_, i) =>
        `<span class="star" data-product="${productId}" data-rating="${i + 1}" onclick="rateProduct(${productId}, ${i + 1})">★</span>`
    ).join(""); // Crear 5 estrellas con eventos de clic para calificar
}

// Función para calificar un producto
function rateProduct(productId, rating) {
    document.querySelectorAll(`.star[data-product="${productId}"]`).forEach(star => {
        star.style.color = star.dataset.rating <= rating ? 'gold' : 'gray'; // Cambiar el color de las estrellas según la calificación
    });

    const successMessage = document.getElementById("success-message"); // Mensaje de éxito al calificar
    successMessage.style.display = "block"; // Mostrar el mensaje
    setTimeout(() => successMessage.style.display = "none", 2000); // Ocultar el mensaje después de 2 segundos
}

// Función para añadir productos al carrito y guardar en localStorage
function addToCart(productId) {
    const product = products.find(p => p.id === productId); // Buscar el producto por su ID
    const cartItem = cart.find(item => item.id === productId); // Verificar si el producto ya está en el carrito

    if (cartItem) {
        cartItem.quantity++; // Incrementar la cantidad si el producto ya está en el carrito
    } else {
        cart.push({ ...product, quantity: 1 }); // Añadir el producto al carrito con cantidad 1
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito en localStorage
    updateCartCount(); // Actualizar el contador del carrito
}

// Función para actualizar el contador de productos en el carrito
function updateCartCount() {
    document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0); // Sumar las cantidades de los productos en el carrito
}

// Función para mostrar el carrito en un modal
function viewCart() {
    const cartItemsDiv = document.getElementById("cart-items"); // Contenedor de los ítems del carrito en el DOM
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty!</p>"; // Mostrar mensaje si el carrito está vacío
    } else {
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>${item.name}: $${item.price.toFixed(2)} x ${item.quantity}</div> <!-- Nombre, precio y cantidad del producto -->
                <div>Total: $${(item.price * item.quantity).toFixed(2)}</div> <!-- Total por producto -->
                <div>
                    <button onclick="changeQuantity(${item.id}, 1)" class="btn btn-success btn-sm">+</button> <!-- Botón para aumentar la cantidad -->
                    <button onclick="changeQuantity(${item.id}, -1)" class="btn btn-danger btn-sm">-</button> <!-- Botón para disminuir la cantidad -->
                </div>
            </div>
        `).join("");

        // Añadir el total general de los productos en el carrito
        cartItemsDiv.innerHTML += `
            <div class="mt-3">
                <strong>Total to Pay: $${calculateTotal().toFixed(2)}</strong> <!-- Total a pagar -->
            </div>
        `;
    }

    // Abrir el modal sin el fondo oscuro
    document.getElementById("cartModal").classList.add("show");
    document.getElementById("cartModal").style.display = "block";
    document.body.classList.add("modal-open");
}

// Función para calcular el total de los productos en el carrito
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0); // Sumar el total de todos los productos
}

// Función para cerrar el modal del carrito
function closeModal() {
    document.getElementById("cartModal").classList.remove("show");
    document.getElementById("cartModal").style.display = "none";
    document.body.classList.remove("modal-open");
}

// Asignar la función closeModal a los botones de cerrar el modal
document.querySelectorAll('.btn-close, .btn-secondary').forEach(button => {
    button.addEventListener('click', closeModal);
});

// Función para cambiar la cantidad de un producto en el carrito
function changeQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId); // Buscar el producto en el carrito

    if (cartItem) {
        cartItem.quantity += change; // Cambiar la cantidad del producto
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId); // Eliminar el producto si la cantidad es 0 o menor
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito actualizado en localStorage
    updateCartCount(); // Actualizar el contador del carrito
    viewCart(); // Actualizar la vista del carrito
}

// Función para finalizar la compra
function finalizePurchase() {
    if (cart.length === 0) {
        alert("Cannot proceed with an empty cart."); // Mostrar alerta si el carrito está vacío
    } else {
        alert("Thank you for your purchase!"); // Mostrar mensaje de agradecimiento
        cart = []; // Vaciar el carrito
        localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito vacío en localStorage
        updateCartCount(); // Actualizar el contador del carrito
        viewCart(); // Actualizar la vista del carrito
    }
}

// Actualizar el carrito al cargar la página
window.onload = function () {
    updateCartCount(); // Actualizar el contador del carrito
    renderProducts(); // Renderizar los productos al cargar la página
};