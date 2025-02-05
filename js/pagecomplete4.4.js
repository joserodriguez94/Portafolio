// Función para resaltar la tarjeta seleccionada
function selectCard(card) {
  // Remueve la clase "active" de todas las tarjetas con la clase "plan-card"
  document
    .querySelectorAll(".plan-card")
    .forEach((el) => el.classList.remove("active"));
  // Añade la clase "active" a la tarjeta seleccionada
  card.classList.add("active");
}

// Función para mostrar un mensaje de confirmación al seleccionar un plan
function showPlanConfirmation(planName) {
  // Muestra una alerta con el nombre del plan seleccionado
  alert(`You have selected the ${planName} plan!`);
}

// Escucha para cada botón de selección en las tarjetas
document.querySelectorAll(".btn").forEach((button) => {
  // Agrega un evento de clic a cada botón
  button.addEventListener("click", function (event) {
    // Evita que el evento de clic en la tarjeta se active
    event.stopPropagation();
    // Obtiene el nombre del plan desde el encabezado de la tarjeta
    const planName =
      this.closest(".plan-card").querySelector(".card-header h4").textContent;
    // Muestra la confirmación del plan seleccionado
    showPlanConfirmation(planName);
  });
});

// Animación al hacer clic en las tarjetas
document.querySelectorAll(".plan-card").forEach((card) => {
  // Agrega un evento de clic a cada tarjeta
  card.addEventListener("click", function () {
    // Añade una clase de animación al hacer clic
    this.classList.add("clicked-animation");
    // Remueve la clase de animación después de 500ms
    setTimeout(() => this.classList.remove("clicked-animation"), 500);
  });
});

// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene el formulario de inicio de sesión por su ID
  const loginForm = document.getElementById("loginForm");
  // Obtiene el campo de entrada de correo electrónico por su ID
  const emailInput = document.getElementById("email");
  // Obtiene el campo de entrada de contraseña por su ID
  const passwordInput = document.getElementById("password");
  // Obtiene el botón para alternar la visibilidad de la contraseña por su ID
  const togglePassword = document.getElementById("togglePassword");
  // Obtiene el mensaje de advertencia de Caps Lock por su ID
  const capsWarning = document.getElementById("capsWarning");
  // Obtiene la barra de fuerza de la contraseña por su ID
  const strengthBar = document.getElementById("passwordStrength");
  // Obtiene el spinner de carga por su ID
  const spinner = document.getElementById("spinner");
  // Obtiene la tarjeta de inicio de sesión por su ID
  const loginCard = document.getElementById("loginCard");
  // Obtiene el mensaje de bienvenida por su ID
  const welcomeMessage = document.getElementById("welcomeMessage");

  // Mostrar/ocultar contraseña
  togglePassword.addEventListener("click", () => {
    // Alterna entre mostrar y ocultar la contraseña
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    // Cambia el tipo de entrada de la contraseña
    passwordInput.setAttribute("type", type);
    // Cambia el ícono del botón según el estado de la contraseña
    togglePassword.innerHTML =
      type === "password"
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
  });

  // Validación del formulario y envío simulado
  loginForm.addEventListener("submit", (event) => {
    // Previene el envío del formulario
    event.preventDefault();
    // Bandera para verificar si el formulario es válido
    let isValid = true;

    // Valida el campo de correo electrónico
    if (!emailInput.value || !emailInput.validity.valid) {
      // Añade una clase de error si el campo está vacío o es inválido
      emailInput.classList.add("is-invalid");
      isValid = false;
    } else {
      // Remueve la clase de error si el campo es válido
      emailInput.classList.remove("is-invalid");
    }

    // Valida el campo de contraseña
    if (!passwordInput.value) {
      // Añade una clase de error si el campo está vacío
      passwordInput.classList.add("is-invalid");
      isValid = false;
    } else {
      // Remueve la clase de error si el campo es válido
      passwordInput.classList.remove("is-invalid");
    }

    // Si el formulario es válido, simula el envío
    if (isValid) {
      // Muestra el spinner de carga
      spinner.style.display = "inline-block";
      // Simula un retraso de 2 segundos antes de mostrar el mensaje de bienvenida
      setTimeout(() => {
        // Oculta el spinner
        spinner.style.display = "none";
        // Oculta la tarjeta de inicio de sesión
        loginCard.style.display = "none";
        // Muestra el mensaje de bienvenida
        welcomeMessage.style.display = "block";
      }, 2000);
    }
  });

  // Aviso de Caps Lock
  passwordInput.addEventListener("keydown", (event) => {
    // Muestra una advertencia si Caps Lock está activado
    capsWarning.style.display = event.getModifierState("CapsLock")
      ? "block"
      : "none";
  });

  passwordInput.addEventListener("keyup", (event) => {
    // Muestra una advertencia si Caps Lock está activado
    capsWarning.style.display = event.getModifierState("CapsLock")
      ? "block"
      : "none";
  });

  // Verificador de fuerza de contraseña
  passwordInput.addEventListener("input", () => {
    // Obtiene el valor de la contraseña
    const value = passwordInput.value;
    // Inicializa la fuerza de la contraseña en 0
    let strength = 0;

    // Aumenta la fuerza si la contraseña contiene letras minúsculas
    if (value.match(/[a-z]/)) strength += 25;
    // Aumenta la fuerza si la contraseña contiene letras mayúsculas
    if (value.match(/[A-Z]/)) strength += 25;
    // Aumenta la fuerza si la contraseña contiene números
    if (value.match(/[0-9]/)) strength += 25;
    // Aumenta la fuerza si la contraseña contiene caracteres especiales
    if (value.match(/[@$!%*?&]/)) strength += 25;

    // Actualiza el ancho de la barra de fuerza de la contraseña
    strengthBar.style.width = `${strength}%`;
    // Cambia el color de la barra según la fuerza de la contraseña
    strengthBar.className = `custom-password-strength-bar progress-bar ${
      strength < 50 ? "bg-danger" : strength < 75 ? "bg-warning" : "bg-success"
    }`;
  });

  // Eliminar feedback de validación en tiempo real
  document.querySelectorAll(".form-control").forEach((input) => {
    // Agrega un evento de entrada a cada campo de entrada
    input.addEventListener("input", () => {
      // Remueve la clase de error cuando el usuario comienza a escribir
      input.classList.remove("is-invalid");
    });
  });

  // Envío del formulario de recuperación de contraseña
  document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", (event) => {
      // Previene el envío del formulario
      event.preventDefault();

      // Obtiene el campo de correo electrónico para restablecer la contraseña
      const resetEmailField = document.getElementById("resetEmail");
      // Valida si el campo está vacío
      if (!resetEmailField.value.trim()) {
        // Añade una clase de error si el campo está vacío
        resetEmailField.classList.add("is-invalid");
        return;
      } else {
        // Remueve la clase de error si el campo es válido
        resetEmailField.classList.remove("is-invalid");
      }

      // Simulación de envío del formulario
      alert("A reset link has been sent to your email address.");
      // Oculta el modal de recuperación de contraseña
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("forgotPasswordModal")
      );
      modal.hide();
    });
});