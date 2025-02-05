// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene el formulario de registro por su ID
  const form = document.getElementById("registration-form");
  // Obtiene todos los campos de entrada (input, select, textarea) dentro del formulario y los convierte en un array
  const inputs = Array.from(form.querySelectorAll("input, select, textarea"));
  // Obtiene la barra de progreso por su ID
  const progressBar = document.getElementById("progress-bar");
  // Obtiene el elemento que muestra el código CAPTCHA
  const captchaCodeElement = document.getElementById("captchaCode");
  // Obtiene el campo de entrada para el CAPTCHA
  const captchaInput = document.getElementById("captchaInput");
  // Obtiene el elemento que muestra mensajes relacionados con el CAPTCHA
  const captchaMessage = document.getElementById("captchaMessage");
  // Obtiene el botón para refrescar el CAPTCHA
  const refreshCaptchaButton = document.getElementById("refreshCaptcha");

  // Función para generar un código CAPTCHA aleatorio
  const generateCaptcha = () => {
    // Define los caracteres permitidos en el CAPTCHA
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    // Inicializa una cadena vacía para almacenar el CAPTCHA
    let captcha = "";
    // Genera un código CAPTCHA de 6 caracteres
    for (let i = 0; i < 6; i++) {
      // Añade un carácter aleatorio al CAPTCHA
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length) // Selecciona un carácter aleatorio de la cadena
      );
    }
    // Devuelve el código CAPTCHA generado
    return captcha;
  };

  // Función para refrescar el CAPTCHA
  const refreshCaptcha = () => {
    // Genera un nuevo código CAPTCHA y lo muestra en el elemento correspondiente
    captchaCodeElement.textContent = generateCaptcha();
    // Limpia el campo de entrada del CAPTCHA
    captchaInput.value = "";
    // Limpia el mensaje de error del CAPTCHA
    captchaMessage.textContent = "";
    // Restablece la clase del mensaje de error
    captchaMessage.className = "";
  };

  // Agrega un evento al botón de refrescar CAPTCHA para llamar a la función refreshCaptcha
  refreshCaptchaButton.addEventListener("click", refreshCaptcha);
  // Genera un CAPTCHA inicial al cargar la página
  refreshCaptcha();

  // Función para actualizar la barra de progreso del formulario
  const updateProgressBar = () => {
    // Filtra los campos que están completos y son válidos
    const filledInputs = inputs.filter(
      (input) => input.value.trim() !== "" && input.checkValidity()
    );
    // Calcula el porcentaje de progreso basado en los campos completados
    const progress = Math.round((filledInputs.length / inputs.length) * 100);
    // Actualiza el ancho de la barra de progreso
    progressBar.style.width = `${progress}%`;
    // Actualiza el valor de la barra de progreso para accesibilidad
    progressBar.setAttribute("aria-valuenow", progress);
    // Muestra el porcentaje de progreso en la barra
    progressBar.textContent = `${progress}%`;
  };

  // Agrega un evento de entrada a cada campo para actualizar la barra de progreso
  inputs.forEach((input) => {
    input.addEventListener("input", updateProgressBar);
  });

  // Validación del formulario al enviarlo
  form.addEventListener("submit", (e) => {
    // Previene el envío del formulario
    e.preventDefault();
    // Bandera para verificar si el formulario es válido
    let isFormValid = true;

    // Verifica cada campo del formulario
    inputs.forEach((input) => {
      // Si el campo es requerido y está vacío
      if (!input.value.trim() && input.hasAttribute("required")) {
        // Marca el formulario como inválido
        isFormValid = false;
        // Añade una clase de error al campo
        input.classList.add("is-invalid");

        // Si no hay un mensaje de error, lo crea
        if (
          !input.nextElementSibling ||
          !input.nextElementSibling.classList.contains("invalid-feedback")
        ) {
          // Crea un elemento para mostrar el mensaje de error
          const errorMessage = document.createElement("div");
          // Añade la clase para estilos de error
          errorMessage.className = "invalid-feedback";
          // Establece el mensaje de error
          errorMessage.textContent = "This field is required.";
          // Añade el mensaje de error al DOM
          input.parentNode.appendChild(errorMessage);
        }
      } else {
        // Si el campo es válido, elimina la clase de error
        input.classList.remove("is-invalid");
        // Elimina el mensaje de error si existe
        if (
          input.nextElementSibling &&
          input.nextElementSibling.classList.contains("invalid-feedback")
        ) {
          input.parentNode.removeChild(input.nextElementSibling);
        }
      }
    });

    // Verifica si el CAPTCHA es correcto
    if (captchaInput.value !== captchaCodeElement.textContent) {
      // Marca el formulario como inválido
      isFormValid = false;
      // Muestra un mensaje de error
      captchaMessage.textContent = "Incorrect CAPTCHA. Please try again.";
      // Aplica estilos al mensaje de error
      captchaMessage.className = "text-danger fw-bold";
    }

    // Si el formulario es válido, muestra una alerta y resetea el formulario
    if (isFormValid) {
      alert("Form submitted successfully!");
      // Resetea el formulario
      form.reset();
      // Refresca el CAPTCHA
      refreshCaptcha();
      // Actualiza la barra de progreso
      updateProgressBar();
    }
  });
});

// Obtiene el input de archivos por su ID
const fileInput = document.getElementById("file-input");
// Obtiene la lista de archivos por su ID
const fileList = document.getElementById("file-list");
// Crea una instancia del modal de Bootstrap para mostrar imágenes
const imageModal = new bootstrap.Modal(document.getElementById("imageModal"));
// Obtiene la imagen dentro del modal por su ID
const modalImage = document.getElementById("modalImage");

// Agrega un evento al input de archivos para manejar la selección de archivos
fileInput.addEventListener("change", () => {
  // Convierte los archivos seleccionados en un array y recorre cada uno
  Array.from(fileInput.files).forEach((file) => {
    // Crea una columna para cada archivo
    const col = document.createElement("div");
    // Añade clases de Bootstrap para el diseño
    col.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");

    // Crea una tarjeta para el archivo
    const card = document.createElement("div");
    // Añade clases de Bootstrap para la tarjeta
    card.classList.add("card", "h-100");

    // Si el archivo es una imagen, muestra una vista previa
    if (file.type.startsWith("image/")) {
      // Crea un elemento de imagen
      const img = document.createElement("img");
      // Crea una URL para la imagen
      img.src = URL.createObjectURL(file);
      // Establece el nombre del archivo como texto alternativo
      img.alt = file.name;
      // Añade clases de Bootstrap para la imagen
      img.classList.add("card-img-top", "preview-img");
      // Agrega un evento para mostrar la imagen en un modal al hacer clic
      img.addEventListener("click", () => {
        // Establece la imagen en el modal
        modalImage.src = img.src;
        // Muestra el modal
        imageModal.show();
      });
      // Añade la imagen a la tarjeta
      card.appendChild(img);
    }

    // Crea el cuerpo de la tarjeta
    const cardBody = document.createElement("div");
    // Añade clases de Bootstrap para el cuerpo de la tarjeta
    cardBody.classList.add("card-body", "d-flex", "flex-column");

    // Muestra el nombre del archivo
    const fileName = document.createElement("h5");
    // Añade clases de Bootstrap para el título
    fileName.classList.add("card-title");
    // Establece el nombre del archivo como texto
    fileName.textContent = file.name;
    // Añade el nombre del archivo al cuerpo de la tarjeta
    cardBody.appendChild(fileName);

    // Crea un grupo de botones para la tarjeta
    const btnGroup = document.createElement("div");
    // Añade clases de Bootstrap para el grupo de botones
    btnGroup.classList.add("btn-group", "mt-auto");

    // Si el archivo es una imagen, añade un botón para verla
    if (file.type.startsWith("image/")) {
      // Crea un botón para ver la imagen
      const viewButton = document.createElement("button");
      // Establece el texto del botón
      viewButton.textContent = "View";
      // Añade clases de Bootstrap para el botón
      viewButton.classList.add("btn", "btn-success");
      // Agrega un evento para mostrar la imagen en el modal al hacer clic
      viewButton.addEventListener("click", () => {
        // Establece la imagen en el modal
        modalImage.src = URL.createObjectURL(file);
        // Muestra el modal
        imageModal.show();
      });
      // Añade el botón al grupo de botones
      btnGroup.appendChild(viewButton);
    }

    // Crea un botón para eliminar el archivo
    const deleteButton = document.createElement("button");
    // Establece el texto del botón
    deleteButton.textContent = "Delete";
    // Añade clases de Bootstrap para el botón
    deleteButton.classList.add("btn", "btn-danger");
    // Agrega un evento para eliminar la tarjeta al hacer clic
    deleteButton.addEventListener("click", () => {
      // Elimina la columna de la lista de archivos
      fileList.removeChild(col);
    });
    // Añade el botón al grupo de botones
    btnGroup.appendChild(deleteButton);

    // Añade el grupo de botones al cuerpo de la tarjeta
    cardBody.appendChild(btnGroup);
    // Añade el cuerpo de la tarjeta a la tarjeta
    card.appendChild(cardBody);
    // Añade la tarjeta a la columna
    col.appendChild(card);
    // Añade la columna a la lista de archivos
    fileList.appendChild(col);
  });
});

// Agrega un evento al botón de enviar para cambiar la contraseña
document.getElementById("submit-button").addEventListener("click", function () {
  // Obtiene el valor del campo de contraseña actual
  const currentPassword = document
    .getElementById("current-password")
    .value.trim();
  // Obtiene el valor del campo de nueva contraseña
  const newPassword = document.getElementById("new-password").value.trim();
  // Obtiene el valor del campo de confirmación de contraseña
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.trim();

  // Valida que los campos no estén vacíos
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Missing fields to be filled in.");
    return;
  }

  // Valida que la nueva contraseña y la confirmación coincidan
  if (newPassword !== confirmPassword) {
    alert("The new password and the confirmation do not match.");
    return;
  }

  // Valida que la nueva contraseña no sea demasiado similar a la actual
  if (arePasswordsSimilar(currentPassword, newPassword)) {
    alert(
      "The new password is too similar to the current password. Please choose a different password."
    );
    return;
  }

  // Aquí podrías agregar la lógica para enviar la contraseña actualizada al servidor
  alert("¡Successful submission!");
});

// Función para comparar la similitud entre dos contraseñas
function arePasswordsSimilar(password1, password2) {
  // Define el umbral de similitud (50%)
  const similarityThreshold = 0.5;
  // Inicializa un contador de coincidencias
  let matches = 0;
  // Obtiene la longitud mínima de las dos contraseñas
  const length = Math.min(password1.length, password2.length);

  // Compara cada carácter de las contraseñas
  for (let i = 0; i < length; i++) {
    if (password1[i] === password2[i]) {
      // Incrementa el contador si los caracteres coinciden
      matches++;
    }
  }

  // Calcula el porcentaje de similitud
  const similarity = matches / Math.max(password1.length, password2.length);

  // Devuelve true si la similitud supera el umbral
  return similarity >= similarityThreshold;
}

// Agrega un evento al botón de cancelar para limpiar los campos de contraseña
document.getElementById("cancel-button").addEventListener("click", function () {
  // Limpia el campo de contraseña actual
  document.getElementById("current-password").value = "";
  // Limpia el campo de nueva contraseña
  document.getElementById("new-password").value = "";
  // Limpia el campo de confirmación de contraseña
  document.getElementById("confirm-password").value = "";
  // Muestra una alerta indicando que se canceló el cambio de contraseña
  alert("Password change cancelled.");
});

// Agrega un evento a los íconos de alternar visibilidad de contraseña
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", function () {
    // Obtiene el ID del campo de contraseña asociado al ícono
    const targetId = this.getAttribute("data-target");
    // Obtiene el campo de contraseña por su ID
    const targetInput = document.getElementById(targetId);
    // Alterna entre mostrar y ocultar la contraseña
    if (targetInput.type === "password") {
      targetInput.type = "text";
    } else {
      targetInput.type = "password";
    }
  });
});