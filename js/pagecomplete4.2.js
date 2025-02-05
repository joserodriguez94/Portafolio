// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
  // Obtiene el elemento del switch "Ocultar" por su ID
  const hideSwitch = document.getElementById("hideSwitch");
  // Obtiene el elemento del switch "Mostrar" por su ID
  const showSwitch = document.getElementById("showSwitch");
  // Obtiene el bloque que se mostrará u ocultará por su ID
  const toggleBlock = document.getElementById("toggleBlock");
  // Asegura que el bloque esté visible al inicio
  toggleBlock.style.display = "block";

  // Agrega un evento al switch de "Ocultar"
  hideSwitch.addEventListener("change", function () {
    if (hideSwitch.checked) {
      // Si el switch está activado, oculta el bloque
      toggleBlock.style.display = "none";
      // Desactiva el switch de "Visible"
      showSwitch.checked = false;
    } else {
      // Si el switch está desactivado, muestra el bloque
      toggleBlock.style.display = "block";
      // Activa el switch de "Visible"
      showSwitch.checked = true;
    }
  });

  // Agrega un evento al switch de "Visible"
  showSwitch.addEventListener("change", function () {
    if (showSwitch.checked) {
      // Si el switch está activado, muestra el bloque
      toggleBlock.style.display = "block";
      // Desactiva el switch de "Ocultar"
      hideSwitch.checked = false;
    } else {
      // Si el switch está desactivado, oculta el bloque
      toggleBlock.style.display = "none";
      // Activa el switch de "Ocultar"
      hideSwitch.checked = true;
    }
  });
});

// Función para mostrar una notificación en la pantalla
function showNotification(message) {
  // Obtiene el elemento de notificación
  const notification = document.getElementById("notification");
  // Establece el mensaje de la notificación
  notification.textContent = message;
  // Muestra la notificación
  notification.style.display = "block";
  // Oculta la notificación después de 2 segundos
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}

// Función para alternar entre Like y Dislike
function toggleLike(button) {
  // Obtiene el elemento del corazón dentro del botón
  const heart = button.querySelector(".heart");
  if (heart.classList.contains("inactive")) {
    // Si el corazón está inactivo, lo activa
    heart.classList.remove("inactive");
    heart.classList.add("active");
    // Muestra una notificación de que se ha dado Like
    showNotification("¡Has dado Like a la publicación!");
  } else {
    // Si el corazón está activo, lo desactiva
    heart.classList.remove("active");
    heart.classList.add("inactive");
    // Muestra una notificación de que se ha quitado el Like
    showNotification("¡Has quitado tu Like!");
  }
}

// Función para editar una publicación
function editPost(card) {
  // Obtiene los datos de la publicación desde el DOM
  const title = card.querySelector(".card-title").textContent;
  const category = card.dataset.category;
  const description = card.querySelector(".card-text").getAttribute("title");
  const date = card.querySelector(".text-muted").textContent;
  const image = card.querySelector(".post-image").src;

  // Llena el formulario de edición con los datos de la publicación
  document.getElementById("title").value = title;
  document.getElementById("category").value = category;
  document.getElementById("description").value = description;
  document.getElementById("date").value = date;
  document.getElementById("image").dataset.prevImage = image;

  // Elimina la publicación del DOM
  card.remove();
  // Muestra una notificación de que se puede editar la publicación
  showNotification("¡Ahora puedes editar la publicación!");
}

// Función para configurar los eventos de las imágenes, editar y eliminar
function setupEventListeners() {
  // Agrega un evento de clic a cada imagen de publicación
  document.querySelectorAll(".post-image").forEach((img) => {
    img.addEventListener("click", function () {
      // Obtiene la tarjeta de la publicación
      const card = img.closest(".card");
      // Muestra la imagen en el modal
      document.getElementById("modalImage").src = img.src;
      // Muestra el título de la publicación en el modal
      document.getElementById("modalTitle").textContent =
        card.querySelector(".card-title").textContent;
      // Muestra la categoría de la publicación en el modal
      document.getElementById(
        "modalCategory"
      ).textContent = `Category: ${card.dataset.category}`;
      // Muestra la fecha de la publicación en el modal
      document.getElementById("modalDate").textContent = `Date: ${
        card.querySelector(".text-muted").textContent
      }`;
      // Muestra la descripción de la publicación en el modal
      document.getElementById(
        "modalDescription"
      ).textContent = `Description: ${card
        .querySelector(".card-text")
        .getAttribute("title")}`;

      // Muestra el modal
      const modal = new bootstrap.Modal(document.getElementById("postModal"));
      modal.show();
    });
  });

  // Agrega un evento de clic a cada botón de editar
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Obtiene la tarjeta de la publicación y la edita
      const card = btn.closest(".card");
      editPost(card);
    });
  });

  // Agrega un evento de clic a cada botón de eliminar
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Obtiene la tarjeta de la publicación y la elimina
      const card = btn.closest(".card");
      deletePost(card);
    });
  });
}

// Función para añadir una publicación al DOM
function addPostToDOM(post) {
  // Crea el HTML de la publicación
  const postHtml = `
    <div class="card mb-3" data-category="${post.category}">
      <img src="${post.image}" class="card-img-top post-image" alt="Imagen">
      <div class="card-body">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text truncated-text" title="${post.description}">${post.description}</p>
        <p class="card-text"><small class="text-muted">${post.date}</small></p>
        <div class="d-flex justify-content-between">
          <div class="like-button" onclick="toggleLike(this)">
            <div class="heart inactive">&hearts;</div>
          </div>
          <div>
            <button class="btn btn-warning edit-btn">Editar</button>
            <button class="btn btn-danger delete-btn">Eliminar</button>
          </div>
        </div>
      </div>
    </div>`;
  // Añade la publicación al contenedor de publicaciones
  document.getElementById("posts").innerHTML += postHtml;
  // Configura los eventos para la nueva publicación
  setupEventListeners();
}

// Función para eliminar una publicación
function deletePost(card) {
  // Elimina la tarjeta de la publicación del DOM
  card.remove();
  // Muestra una notificación de que la publicación ha sido eliminada
  showNotification("¡Publicación eliminada con éxito!");
}

// Filtra las publicaciones según el valor del input de filtro
document.getElementById("filterInput").addEventListener("input", function () {
  // Obtiene el valor del filtro en minúsculas
  const filterValue = this.value.toLowerCase();
  // Recorre todas las publicaciones
  document.querySelectorAll("#posts .card").forEach((card) => {
    // Obtiene el título y la descripción de la publicación
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    const description = card
      .querySelector(".card-text")
      .getAttribute("title")
      .toLowerCase();
    // Muestra u oculta la publicación según el filtro
    if (title.includes(filterValue) || description.includes(filterValue)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// Filtra las publicaciones por categoría
document
  .getElementById("categoryFilter")
  .addEventListener("change", function () {
    // Obtiene la categoría seleccionada
    const category = this.value;
    // Recorre todas las publicaciones
    document.querySelectorAll("#posts .card").forEach((card) => {
      // Muestra u oculta la publicación según la categoría seleccionada
      if (!category || card.dataset.category === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

// Evento de envío del formulario de publicación
document
  .getElementById("postForm")
  .addEventListener("submit", function (event) {
    // Previene el envío del formulario
    event.preventDefault();
    // Obtiene los valores del formulario
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const imageInput = document.getElementById("image");
    const prevImage = imageInput.dataset.prevImage;
    const image = imageInput.files[0];

    // Si se ha seleccionado una nueva imagen
    if (image) {
      // Lee la imagen como una URL de datos
      const reader = new FileReader();
      reader.onload = function (e) {
        // Crea un objeto de publicación con la nueva imagen
        const post = {
          title,
          category,
          description,
          date,
          image: e.target.result,
        };
        // Añade la publicación al DOM
        addPostToDOM(post);
        // Muestra una notificación de que la publicación se ha creado con éxito
        showNotification("¡Publicación creada con éxito!");
      };
      reader.readAsDataURL(image);
    } else if (prevImage) {
      // Si no hay nueva imagen, pero hay una imagen previa, usa la imagen previa
      const post = {
        title,
        category,
        description,
        date,
        image: prevImage,
      };
      // Añade la publicación al DOM
      addPostToDOM(post);
      // Muestra una notificación de que la publicación se ha actualizado con éxito
      showNotification("¡Publicación actualizada con éxito!");
    }

    // Resetea el formulario
    document.getElementById("postForm").reset();
    // Elimina la referencia a la imagen previa
    delete imageInput.dataset.prevImage;
  });

// Función para actualizar las estadísticas de las publicaciones
function updateStats() {
  // Objeto para almacenar las estadísticas por categoría
  const stats = {};
  // Recorre todas las publicaciones
  document.querySelectorAll("#posts .card").forEach((card) => {
    // Obtiene la categoría de la publicación
    const category = card.dataset.category;
    // Incrementa el contador de la categoría
    stats[category] = stats[category] ? stats[category] + 1 : 1;
  });

  // Obtiene el contenedor de estadísticas
  const statsDiv = document.getElementById("stats");
  // Muestra las estadísticas en el DOM
  statsDiv.innerHTML = Object.entries(stats)
    .map(([category, count]) => `${category}: ${count} Publicaciones`)
    .join("<br>");
}

// Función para añadir un comentario
function addComment() {
  // Obtiene el input del comentario y la lista de comentarios
  const commentInput = document.getElementById("commentInput");
  const commentList = document.getElementById("commentList");
  // Obtiene el texto del comentario
  const commentText = commentInput.value.trim();

  // Si el comentario no está vacío
  if (commentText) {
    // Crea un nuevo elemento de lista para el comentario
    const commentItem = document.createElement("li");
    commentItem.textContent = commentText;
    commentItem.className = "list-group-item";
    // Añade el comentario a la lista
    commentList.appendChild(commentItem);
    // Limpia el input del comentario
    commentInput.value = "";
  }
}

// Configuración inicial cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", () => {
  // Agrega un evento al botón de añadir comentario
  const addCommentButton = document.getElementById("addComment");
  addCommentButton.addEventListener("click", addComment);

  // Actualiza las estadísticas cuando se añade una publicación
  document.getElementById("postForm").addEventListener("submit", () => {
    setTimeout(updateStats, 100);
  });

  // Actualiza las estadísticas cuando se elimina una publicación
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      setTimeout(updateStats, 100);
    }
  });
});

// Llama a la función updateStats cuando la página carga
updateStats();