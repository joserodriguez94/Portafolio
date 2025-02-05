// Obtener el botón de suscripción por su ID y agregar un evento de clic
document.getElementById("subscribeButton").addEventListener("click", function () {
  // Obtener el campo de entrada de correo electrónico por su ID
  const emailInput = document.getElementById("newsletter1");
  
  // Obtener el elemento donde se mostrará el mensaje de respuesta por su ID
  const responseMessage = document.getElementById("responseMessage");
  
  // Obtener el valor del campo de correo electrónico y eliminar espacios en blanco al principio y al final
  const email = emailInput.value.trim();

  // Expresión regular para validar el formato de un correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Verificar si el correo electrónico cumple con el formato válido
  if (emailRegex.test(email)) {
    // Si el correo es válido, mostrar un mensaje de éxito
    responseMessage.textContent = "¡Subscription successful! Thank you for joining our newsletter.";
    
    // Cambiar el estilo del mensaje a verde (éxito)
    responseMessage.className = "text-success";
  } else {
    // Si el correo no es válido, mostrar un mensaje de error
    responseMessage.textContent = "Subscription failed. Please enter a valid email.";
    
    // Cambiar el estilo del mensaje a rojo (error)
    responseMessage.className = "text-danger";
  }
});