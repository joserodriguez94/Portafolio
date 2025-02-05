// Definición de un array de productos con sus propiedades
const products = [
    { id: 1, name: "Product 1", price: 10.99, image: "img/iphone.jpg" }, // Producto 1 con id, nombre, precio e imagen
    { id: 2, name: "Product 2", price: 12.99, image: "img/iphone.jpg" }, // Producto 2 con id, nombre, precio e imagen
    { id: 3, name: "Product 3", price: 9.99, image: "img/iphone.jpg" },  // Producto 3 con id, nombre, precio e imagen
    { id: 4, name: "Product 4", price: 10.99, image: "img/iphone.jpg" }, // Producto 4 con id, nombre, precio e imagen
    { id: 5, name: "Product 5", price: 12.99, image: "img/iphone.jpg" }, // Producto 5 con id, nombre, precio e imagen
    { id: 6, name: "Product 6", price: 9.99, image: "img/iphone.jpg" },  // Producto 6 con id, nombre, precio e imagen
    { id: 7, name: "Product 7", price: 10.99, image: "img/iphone.jpg" }, // Producto 7 con id, nombre, precio e imagen
    { id: 8, name: "Product 8", price: 12.99, image: "img/iphone.jpg" }, // Producto 8 con id, nombre, precio e imagen
    { id: 9, name: "Product 9", price: 9.99, image: "img/iphone.jpg" },  // Producto 9 con id, nombre, precio e imagen
    { id: 10, name: "Product 10", price: 10.99, image: "img/iphone.jpg" }, // Producto 10 con id, nombre, precio e imagen
    { id: 11, name: "Product 11", price: 12.99, image: "img/iphone.jpg" }, // Producto 11 con id, nombre, precio e imagen
    { id: 12, name: "Product 12", price: 9.99, image: "img/iphone.jpg" },  // Producto 12 con id, nombre, precio e imagen
    // Se pueden añadir más productos según sea necesario
];

// Obtener el carrito desde localStorage o inicializarlo como un array vacío
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Si hay un carrito en localStorage, se carga; si no, se inicializa vacío

// Función para renderizar los productos en la página
function renderProducts(page = 1) {
    const productsPerPage = 15; // Número de productos a mostrar por página
    const startIndex = (page - 1) * productsPerPage; // Índice de inicio para la paginación
    const endIndex = startIndex + productsPerPage; // Índice de fin para la paginación
    const productsToDisplay = products.slice(startIndex, endIndex); // Obtener los productos a mostrar en la página actual

    const productsContainer = document.getElementById("products-container"); // Obtener el contenedor de productos en el DOM
    productsContainer.innerHTML = productsToDisplay.map(product => `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}"> <!-- Imagen del producto -->
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5> <!-- Nombre del producto -->
                    <p class="card-text">Price: $${product.price.toFixed(2)}</p> <!-- Precio del producto -->
                    <div class="rating">${generateStars(product.id)}</div> <!-- Calificación con estrellas -->
                    <button onclick="addToCart(${product.id})" class="btn btn-primary mt-2">Add to Cart</button> <!-- Botón para añadir al carrito -->
                </div>
            </div>
        </div>
    `).join(""); // Convertir el array de productos en un string HTML y asignarlo al contenedor
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

    const successMessage = document.getElementById("success-message"); // Obtener el mensaje de éxito
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
        cart.push({ ...product, quantity: 1 }); // Añadir el producto al carrito con cantidad 1 si no está
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Guardar el carrito en localStorage
    updateCartCount(); // Actualizar el contador de productos en el carrito
}

// Función para actualizar el contador de productos en el carrito
function updateCartCount() {
    document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0); // Sumar las cantidades de todos los productos en el carrito
}

// Función para mostrar el carrito en el modal
function viewCart() {
    const cartItemsDiv = document.getElementById("cart-items"); // Obtener el contenedor de los ítems del carrito en el DOM
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty!</p>"; // Mostrar mensaje si el carrito está vacío
    } else {
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>${item.name}: $${item.price.toFixed(2)} x ${item.quantity}</div> <!-- Detalles del producto -->
                <div>Total: $${(item.price * item.quantity).toFixed(2)}</div> <!-- Total por producto -->
                <div>
                    <button onclick="changeQuantity(${item.id}, 1)" class="btn btn-success btn-sm">+</button> <!-- Botón para aumentar la cantidad -->
                    <button onclick="changeQuantity(${item.id}, -1)" class="btn btn-danger btn-sm">-</button> <!-- Botón para disminuir la cantidad -->
                </div>
            </div>
        `).join(""); // Convertir el array de ítems del carrito en un string HTML

        // Añadir el total general de los productos
        cartItemsDiv.innerHTML += `
            <div class="mt-3">
                <strong>Total to Pay: $${calculateTotal().toFixed(2)}</strong> <!-- Mostrar el total a pagar -->
            </div>
        `;
    }

    // Abrir el modal sin el fondo oscuro
    document.getElementById("cartModal").classList.add("show"); // Mostrar el modal
    document.getElementById("cartModal").style.display = "block"; // Asegurar que el modal esté visible
    document.body.classList.add("modal-open"); // Añadir clase para evitar el desplazamiento del fondo
}

// Función para calcular el total de los productos en el carrito
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0); // Sumar el total de todos los productos
}

// Función para cerrar el modal del carrito
function closeModal() {
    document.getElementById("cartModal").classList.remove("show"); // Ocultar el modal
    document.getElementById("cartModal").style.display = "none"; // Asegurar que el modal esté oculto
    document.body.classList.remove("modal-open"); // Remover la clase que evita el desplazamiento del fondo
}

// Asignar la función closeModal a los botones de cerrar el modal
document.querySelectorAll('.btn-close, .btn-secondary').forEach(button => {
    button.addEventListener('click', closeModal); // Cerrar el modal al hacer clic en los botones de cerrar
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
    updateCartCount(); // Actualizar el contador de productos en el carrito
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
        updateCartCount(); // Actualizar el contador de productos en el carrito
        viewCart(); // Actualizar la vista del carrito
    }
}

// Actualizar el carrito al cargar la página
window.onload = function() {
    updateCartCount(); // Actualizar el contador de productos en el carrito
    renderProducts(); // Renderizar los productos al cargar la página
};