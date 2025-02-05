// Selecciona el botón de suscripción por su ID y añade un evento de clic
document.getElementById("subscribeButton").addEventListener("click", function () {
  
  // Obtiene el elemento de entrada de correo electrónico por su ID
  const emailInput = document.getElementById("newsletter1");
  
  // Obtiene el elemento donde se mostrará el mensaje de respuesta por su ID
  const responseMessage = document.getElementById("responseMessage");
  
  // Obtiene el valor del campo de correo electrónico y elimina espacios en blanco al inicio y final
  const email = emailInput.value.trim();

  // Expresión regular para validar el formato de un correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Verifica si el correo electrónico cumple con el formato válido
  if (emailRegex.test(email)) {
    // Si el correo es válido, muestra un mensaje de éxito
    responseMessage.textContent = "¡Subscription successful! Thank you for joining our newsletter.";
    
    // Añade una clase de estilo para indicar éxito (texto en verde)
    responseMessage.className = "text-success";
  } else {
    // Si el correo no es válido, muestra un mensaje de error
    responseMessage.textContent = "Subscription failed. Please enter a valid email.";
    
    // Añade una clase de estilo para indicar error (texto en rojo)
    responseMessage.className = "text-danger";
  }
});