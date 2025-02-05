// Array de productos disponibles en la tienda, cada producto tiene un ID, nombre, precio e imagen.
const products = [
    { id: 37, name: "Product 37 ", price: 10.99, image: "img/huawei.jpg" }, // Producto 37 con id, nombre, precio e imagen
    { id: 38, name: "Product 38", price: 12.99, image: "img/huawei.jpg" },  // Producto 38 con id, nombre, precio e imagen
    { id: 39, name: "Product 39", price: 9.99, image: "img/huawei.jpg" },   // Producto 39 con id, nombre, precio e imagen9
    { id: 40, name: "Product 40", price: 10.99, image: "img/huawei.jpg" },  // Producto 40 con id, nombre, precio e imagen
    { id: 41, name: "Product 41", price: 12.99, image: "img/huawei.jpg" },  // Producto 41 con id, nombre, precio e imagen
    { id: 42, name: "Product 42", price: 9.99, image: "img/huawei.jpg" },   // Producto 42 con id, nombre, precio e imagen
    { id: 43, name: "Product 43", price: 10.99, image: "img/huawei.jpg" },  // Producto 43 con id, nombre, precio e imagen
    { id: 44, name: "Product 44", price: 12.99, image: "img/huawei.jpg" },  // Producto 44 con id, nombre, precio e imagen
    { id: 45, name: "Product 45", price: 9.99, image: "img/huawei.jpg" },   // Producto 45 con id, nombre, precio e imagen
    { id: 46, name: "Product 46", price: 10.99, image: "img/huawei.jpg" },  // Producto 46 con id, nombre, precio e imagen
    { id: 47, name: "Product 47", price: 12.99, image: "img/huawei.jpg" },  // Producto 47 con id, nombre, precio e imagen
    { id: 48, name: "Product 48", price: 9.99, image: "img/huawei.jpg" },   // Producto 48 con id, nombre, precio e imagen
    // Se pueden añadir más productos según sea necesario.
];

// Obtener el carrito desde localStorage o inicializarlo como un array vacío si no existe.
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para renderizar los productos en la página.
function renderProducts(page = 4) {
    const productsPerPage = 15; // Número de productos a mostrar por página.
    const startIndex = (page - 4) * productsPerPage; // Índice de inicio para la paginación.
    const endIndex = startIndex + productsPerPage; // Índice de fin para la paginación.
    const productsToDisplay = products.slice(startIndex, endIndex); // Obtener los productos a mostrar.

    // Obtener el contenedor de productos y renderizar los productos.
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = productsToDisplay.map(product => `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}"> <!-- Imagen del producto -->
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5> <!-- Nombre del producto -->
                    <p class="card-text">Price: $${product.price.toFixed(2)}</p> <!-- Precio del producto -->
                    <div class="rating">${generateStars(product.id)}</div> <!-- Estrellas de calificación -->
                    <button onclick="addToCart(${product.id})" class="btn btn-primary mt-2">Add to Cart</button> <!-- Botón para añadir al carrito -->
                </div>
            </div>
        </div>
    `).join(""); // Unir todos los productos en un solo string HTML.
}

// Función para generar estrellas de calificación.
function generateStars(productId) {
    return Array(5).fill(0).map((_, i) =>
        `<span class="star" data-product="${productId}" data-rating="${i + 1}" onclick="rateProduct(${productId}, ${i + 1})">★</span>` // Crear una estrella con un evento de clic para calificar.
    ).join(""); // Unir todas las estrellas en un solo string HTML.
}

// Función para calificar un producto.
function rateProduct(productId, rating) {
    // Cambiar el color de las estrellas según la calificación.
    document.querySelectorAll(`.star[data-product="${productId}"]`).forEach(star => {
        star.style.color = star.dataset.rating <= rating ? 'gold' : 'gray'; // Cambiar a dorado si la estrella está seleccionada, de lo contrario, gris.
    });

    // Mostrar un mensaje de éxito y ocultarlo después de 2 segundos.
    const successMessage = document.getElementById("success-message");
    successMessage.style.display = "block"; // Mostrar el mensaje.
    setTimeout(() => successMessage.style.display = "none", 2000); // Ocultar el mensaje después de 2 segundos.
}

// Función para añadir productos al carrito y guardar en localStorage.
function addToCart(productId) {
    const product = products.find(p => p.id === productId); // Buscar el producto por ID en el array de productos.
    const cartItem = cart.find(item => item.id === productId); // Verificar si el producto ya está en el carrito.

    if (cartItem) {
        cartItem.quantity++; // Incrementar la cantidad si el producto ya está en el carrito.
    } else {
        cart.push({ ...product, quantity: 1 }); // Añadir el producto al carrito con cantidad 1 si no está en el carrito.
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito actualizado en localStorage.
    updateCartCount(); // Actualizar el contador de productos en el carrito.
}

// Función para actualizar el contador de productos en el carrito.
function updateCartCount() {
    document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0); // Sumar las cantidades de todos los productos en el carrito.
}

// Función para mostrar el carrito en el modal.
function viewCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty!</p>"; // Mostrar mensaje si el carrito está vacío.
    } else {
        // Renderizar los productos en el carrito.
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>${item.name}: $${item.price.toFixed(2)} x ${item.quantity}</div> <!-- Nombre, precio y cantidad del producto -->
                <div>Total: $${(item.price * item.quantity).toFixed(2)}</div> <!-- Total por producto -->
                <div>
                    <button onclick="changeQuantity(${item.id}, 1)" class="btn btn-success btn-sm">+</button> <!-- Botón para aumentar la cantidad -->
                    <button onclick="changeQuantity(${item.id}, -1)" class="btn btn-danger btn-sm">-</button> <!-- Botón para disminuir la cantidad -->
                </div>
            </div>
        `).join(""); // Unir todos los productos en un solo string HTML.
        
        // Añadir el total general de los productos en el carrito.
        cartItemsDiv.innerHTML += `
            <div class="mt-3">
                <strong>Total to Pay: $${calculateTotal().toFixed(2)}</strong> <!-- Mostrar el total a pagar -->
            </div>
        `;
    }

    // Abrir el modal sin el fondo oscuro.
    document.getElementById("cartModal").classList.add("show"); // Añadir la clase "show" para mostrar el modal.
    document.getElementById("cartModal").style.display = "block"; // Mostrar el modal.
    document.body.classList.add("modal-open"); // Añadir la clase "modal-open" al body para evitar el desplazamiento.
}

// Función para calcular el total de los productos en el carrito.
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0); // Sumar el precio total de todos los productos en el carrito.
}

// Función para cerrar el modal del carrito.
function closeModal() {
    document.getElementById("cartModal").classList.remove("show"); // Quitar la clase "show" para ocultar el modal.
    document.getElementById("cartModal").style.display = "none"; // Ocultar el modal.
    document.body.classList.remove("modal-open"); // Quitar la clase "modal-open" del body.
}

// Asignar la función closeModal a los botones de cerrar.
document.querySelectorAll('.btn-close, .btn-secondary').forEach(button => {
    button.addEventListener('click', closeModal); // Añadir un evento de clic para cerrar el modal.
});

// Función para cambiar la cantidad de un producto en el carrito.
function changeQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId); // Buscar el producto en el carrito.

    if (cartItem) {
        cartItem.quantity += change; // Cambiar la cantidad del producto.
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId); // Eliminar el producto si la cantidad es 0 o menor.
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito actualizado en localStorage.
    updateCartCount(); // Actualizar el contador de productos en el carrito.
    viewCart(); // Actualizar la vista del carrito.
}

// Función para finalizar la compra.
function finalizePurchase() {
    if (cart.length === 0) {
        alert("Cannot proceed with an empty cart."); // Mostrar alerta si el carrito está vacío.
    } else {
        alert("Thank you for your purchase!"); // Mostrar mensaje de agradecimiento.
        cart = []; // Vaciar el carrito.
        localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito vacío en localStorage.
        updateCartCount(); // Actualizar el contador de productos en el carrito.
        viewCart(); // Actualizar la vista del carrito.
    }
}

// Actualizar el carrito al cargar la página.
window.onload = function() {
    updateCartCount(); // Actualizar el contador de productos en el carrito.
    renderProducts(); // Renderizar los productos al cargar la página.
};