// Obtener el carrito desde localStorage o inicializarlo como un array vacío si no existe
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para renderizar los productos en la página
function renderProducts(products) {
    // Obtener el contenedor de productos del DOM
    const productsContainer = document.getElementById("products-container");
    
    // Generar el HTML para cada producto y unirlo en una cadena
    productsContainer.innerHTML = products.map(product => `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
                <!-- Mostrar la imagen del producto -->
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <!-- Mostrar el nombre del producto -->
                    <h5 class="card-title">${product.name}</h5>
                    <!-- Mostrar el precio del producto formateado a 2 decimales -->
                    <p class="card-text">Price: $${product.price.toFixed(2)}</p>
                    <!-- Botón para añadir el producto al carrito -->
                    <button onclick="addToCart(${product.id})" class="btn btn-primary mt-2">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join(""); // Unir todos los productos en una sola cadena de HTML
}

// Función para añadir productos al carrito y guardar en localStorage
function addToCart(productId) {
    // Buscar el producto en la lista de productos por su ID
    const product = products.find(p => p.id === productId);
    
    // Verificar si el producto ya está en el carrito
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        cartItem.quantity++;
    } else {
        // Si el producto no está en el carrito, añadirlo con cantidad 1
        cart.push({ ...product, quantity: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Actualizar el contador de productos en el carrito
    updateCartCount();
}

// Función para actualizar el contador de productos en el carrito
function updateCartCount() {
    // Calcular la cantidad total de productos en el carrito y actualizar el contador en el DOM
    document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Función para mostrar el carrito en el modal
function viewCart() {
    // Obtener el contenedor de elementos del carrito
    const cartItemsDiv = document.getElementById("cart-items");

    if (cart.length === 0) {
        // Si el carrito está vacío, mostrar un mensaje
        cartItemsDiv.innerHTML = "<p>Your cart is empty!</p>";
    } else {
        // Generar el HTML para cada producto en el carrito
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <!-- Mostrar el nombre, precio y cantidad del producto -->
                <div>${item.name}: $${item.price.toFixed(2)} x ${item.quantity}</div>
                <!-- Mostrar el total por producto (precio * cantidad) -->
                <div>Total: $${(item.price * item.quantity).toFixed(2)}</div>
                <!-- Botones para aumentar o disminuir la cantidad del producto -->
                <div>
                    <button onclick="changeQuantity(${item.id}, 1)" class="btn btn-success btn-sm">+</button>
                    <button onclick="changeQuantity(${item.id}, -1)" class="btn btn-danger btn-sm">-</button>
                </div>
            </div>
        `).join(""); // Unir todos los elementos del carrito en una sola cadena de HTML
        
        // Añadir el total a pagar al final del carrito
        cartItemsDiv.innerHTML += `
            <div class="mt-3">
                <strong>Total to Pay: $${calculateTotal().toFixed(2)}</strong>
            </div>
        `;
    }

    // Mostrar el modal del carrito
    document.getElementById("cartModal").classList.add("show");
    document.getElementById("cartModal").style.display = "block";
    document.body.classList.add("modal-open");
}

// Función para calcular el total de los productos en el carrito
function calculateTotal() {
    // Calcular el total sumando el precio de cada producto multiplicado por su cantidad
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Función para cerrar el modal del carrito
function closeModal() {
    // Ocultar el modal del carrito
    document.getElementById("cartModal").classList.remove("show");
    document.getElementById("cartModal").style.display = "none";
    document.body.classList.remove("modal-open");
}

// Función para cambiar la cantidad de un producto en el carrito
function changeQuantity(productId, change) {
    // Buscar el producto en el carrito por su ID
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        // Cambiar la cantidad del producto según el valor de "change" (+1 o -1)
        cartItem.quantity += change;
        
        // Si la cantidad es menor o igual a 0, eliminar el producto del carrito
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Actualizar el contador de productos en el carrito
    updateCartCount();
    
    // Mostrar el carrito actualizado en el modal
    viewCart();
}

// Función para finalizar la compra
function finalizePurchase() {
    if (cart.length === 0) {
        // Si el carrito está vacío, mostrar una alerta
        alert("Cannot proceed with an empty cart.");
    } else {
        // Mostrar un mensaje de agradecimiento y vaciar el carrito
        alert("Thank you for your purchase!");
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        viewCart();
    }
}

// Inicializar la página cuando se carga
window.onload = function() {
    // Actualizar el contador de productos en el carrito al cargar la página
    updateCartCount();
    // `products` debe estar definido con la lista de productos
};