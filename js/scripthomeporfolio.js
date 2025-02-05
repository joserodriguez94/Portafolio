// Sección 1: Descarga de archivos PDF
// Agrega un evento de clic al elemento con ID "download1" para abrir un archivo PDF en una nueva pestaña
document.getElementById("download1").addEventListener("click", function () {
  window.open("documents/Jose-cv-espanol.pdf", "_blank");
});

// Agrega un evento de clic al elemento con ID "download2" para abrir otro archivo PDF en una nueva pestaña
document.getElementById("download2").addEventListener("click", function () {
  window.open("documents/Jose-cv-english.pdf", "_blank");
});

