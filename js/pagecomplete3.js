/* CONSTANTES Y VARIABLES */
// URL de la API para obtener imágenes de plantas aleatorias
const PLANT_IMAGE_API = "https://picsum.photos/300/200";
// Número de publicaciones por página
const POSTS_PER_PAGE = 9;
// Número total de publicaciones
const TOTAL_POSTS = 30;
// Página actual, inicializada en 1
let currentPage = 1;

/* ELEMENTOS DEL DOM */
// Contenedor donde se mostrarán las publicaciones
const postsContainer = document.querySelector("#posts-container");
// Botón para ir a la página anterior
const previousPageBtn = document.querySelector("#previous-page");
// Botón para ir a la página siguiente
const nextPageBtn = document.querySelector("#next-page");
// Contenedor para mostrar mensajes (no se usa en este código)
const messageContainer = document.querySelector("#message-container");

/* SANITIZACIÓN */
// Función para sanitizar (limpiar) el contenido de un texto y evitar XSS
function sanitize(input) {
    // Crea un elemento div temporal
    const div = document.createElement("div");
    // Asigna el texto al contenido del div
    div.textContent = input;
    // Devuelve el contenido sanitizado
    return div.innerHTML;
}

/* GENERAR PUBLICACIONES */
// Función para generar las publicaciones en la página actual
function generatePosts(page) {
    // Si no existe el contenedor de publicaciones, termina la función
    if (!postsContainer) return;
    // Limpia el contenido actual del contenedor de publicaciones
    postsContainer.innerHTML = "";

    // Calcula el índice de inicio y fin de las publicaciones para la página actual
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = Math.min(start + POSTS_PER_PAGE, TOTAL_POSTS);
    // Crea un fragmento de documento para mejorar el rendimiento al agregar múltiples elementos
    const fragment = document.createDocumentFragment();

    // Itera sobre el rango de publicaciones para la página actual
    for (let i = start; i < end; i++) {
        // Crea un elemento div para la tarjeta de la publicación
        const card = document.createElement("div");
        // Añade clases de Bootstrap para el diseño responsivo
        card.className = "col-12 col-sm-6 col-md-4";
        // Define el contenido HTML de la tarjeta
        card.innerHTML = `
            <div class="card plant-card shadow-sm" data-id="${i}">
                <img src="${PLANT_IMAGE_API}?random=${i}" class="card-img-top" alt="Random Plant ${sanitize(`Plant ${i + 1}`)}">
                <div class="card-body">
                    <h5 class="card-title">${sanitize(`Plant ${i + 1}`)}</h5>
                    <p class="card-text">Posted by: ${sanitize(`User ${i + 1}`)}</p>
                    <p class="text-muted">${new Date().toLocaleDateString()}</p>
                    <button class="btn details-btn mt-2" onclick="showDetails(${i})">View Details</button>
                    <div class="d-flex justify-content-between mt-2">
                        <button class="btn like-btn" onclick="handleInteraction(event, 'like', ${i})">👍 Like</button>
                        <button class="btn dislike-btn" onclick="handleInteraction(event, 'dislike', ${i})">👎 Dislike</button>
                    </div>
                </div>
            </div>`;
        // Añade la tarjeta al fragmento
        fragment.appendChild(card);
    }

    // Añade el fragmento al contenedor de publicaciones
    postsContainer.appendChild(fragment);
    // Actualiza el estado de los botones de navegación
    updateNavigationButtons();
}

/* ACTUALIZAR BOTONES DE NAVEGACIÓN */
// Función para habilitar o deshabilitar los botones de navegación según la página actual
function updateNavigationButtons() {
    // Calcula el número total de páginas
    const totalPages = Math.ceil(TOTAL_POSTS / POSTS_PER_PAGE);
    // Deshabilita el botón "Anterior" si estamos en la primera página
    previousPageBtn.disabled = currentPage === 1;
    // Deshabilita el botón "Siguiente" si estamos en la última página
    nextPageBtn.disabled = currentPage === totalPages;
}

/* MOSTRAR DETALLES EN MODAL */
// Función para mostrar los detalles de una publicación en un modal
function showDetails(postId) {
    // Obtiene el elemento del modal por su ID
    const modalElement = document.querySelector("#detailsModal");
    // Crea una instancia del modal usando Bootstrap
    const modal = new bootstrap.Modal(modalElement);

    // Obtiene los elementos del modal para la imagen, título, descripción, usuario y fecha
    const modalImage = document.querySelector("#modal-image");
    const modalTitle = document.querySelector("#modal-title");
    const modalDescription = document.querySelector("#modal-description");
    const modalUser = document.querySelector("#modal-user");
    const modalDate = document.querySelector("#modal-date");

    // Establece la imagen del modal usando la API de imágenes aleatorias
    modalImage.src = `${PLANT_IMAGE_API}?random=${postId}`;
    // Establece el título del modal
    modalTitle.textContent = `Plant ${sanitize(postId + 1)}`;
    // Establece la descripción del modal
    modalDescription.textContent = `Details about Plant ${sanitize(postId + 1)}`;
    // Establece el usuario que publicó la planta
    modalUser.textContent = `User ${sanitize(postId + 1)}`;
    // Establece la fecha de publicación
    modalDate.textContent = `Published: ${new Date().toLocaleDateString()}`;

    // Elimina el atributo "aria-hidden" para asegurar la accesibilidad
    modalElement.removeAttribute("aria-hidden");
    // Muestra el modal
    modal.show();

    // Agrega un evento para restablecer el atributo "aria-hidden" cuando el modal se oculta
    modalElement.addEventListener('hidden.bs.modal', function () {
        this.setAttribute('aria-hidden', 'true');
    });
}

/* MANEJAR INTERACCIÓN DE BOTONES */
// Función para manejar las interacciones de "Like" y "Dislike"
function handleInteraction(event, action, postId) {
    // Obtiene el botón que se hizo clic
    const button = event.target;
    // Obtiene la tarjeta de la publicación usando el ID
    const postCard = document.querySelector(`.card[data-id="${postId}"]`);
    // Obtiene el botón de "Like" dentro de la tarjeta
    const likeButton = postCard.querySelector(".like-btn");
    // Obtiene el botón de "Dislike" dentro de la tarjeta
    const dislikeButton = postCard.querySelector(".dislike-btn");

    // Si la acción es "Like"
    if (action === "like") {
        // Añade clases para resaltar el botón de "Like"
        likeButton.classList.add("active", "animate");
        // Remueve las clases del botón de "Dislike"
        dislikeButton.classList.remove("active");
        // Muestra un mensaje de que se dio "Like"
        showMessage(`You liked Plant ${postId + 1}`);
    } else {
        // Añade clases para resaltar el botón de "Dislike"
        dislikeButton.classList.add("active", "animate");
        // Remueve las clases del botón de "Like"
        likeButton.classList.remove("active");
        // Muestra un mensaje de que se dio "Dislike"
        showMessage(`You disliked Plant ${postId + 1}`);
    }

    // Remueve la clase de animación después de 200ms
    setTimeout(() => button.classList.remove("animate"), 200);
}

/* MOSTRAR MENSAJE */
// Función para mostrar un mensaje en una alerta
function showMessage(message) {
    alert(message); // Muestra el mensaje en un cuadro de alerta
}

/* EVENTOS DE NAVEGACIÓN */
// Agrega un evento al botón "Anterior" para ir a la página anterior
previousPageBtn.addEventListener("click", () => {
    // Si no estamos en la primera página
    if (currentPage > 1) {
        // Disminuye la página actual
        currentPage--;
        // Genera las publicaciones para la nueva página
        generatePosts(currentPage);
    }
});

// Agrega un evento al botón "Siguiente" para ir a la página siguiente
nextPageBtn.addEventListener("click", () => {
    // Calcula el número total de páginas
    const totalPages = Math.ceil(TOTAL_POSTS / POSTS_PER_PAGE);
    // Si no estamos en la última página
    if (currentPage < totalPages) {
        // Aumenta la página actual
        currentPage++;
        // Genera las publicaciones para la nueva página
        generatePosts(currentPage);
    }
});

/* INICIALIZAR CONTENIDO */
// Genera las publicaciones para la página actual al cargar la página
generatePosts(currentPage);