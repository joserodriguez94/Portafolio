// URL de la API para obtener datos de usuarios
const API_URL = "https://jsonplaceholder.typicode.com/users";

// Número de filas por página para la navegación personalizada
const ROWS_PER_PAGE = 10;

// Variable para rastrear la página actual
let currentPage = 1;

// Almacenar todos los datos de usuarios
let usersData = [];

// Función para obtener y cargar todos los datos
async function fetchData() {
  const resultsContainer = document.getElementById("results");
  
  // Mostrar un spinner de carga mientras se obtienen los datos
  resultsContainer.innerHTML =
    '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';

  try {
    // Realizar la solicitud a la API
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error fetching data");

    // Convertir la respuesta a JSON
    const data = await response.json();
    
    // Combinar los datos de la API con datos mock generados
    usersData = [...data, ...generateMockData(40)];
    
    // Reiniciar a la página 1
    currentPage = 1;
    
    // Mostrar la tabla con los datos
    displayTable();
  } catch (error) {
    // Manejar errores y mostrar un mensaje de error
    console.error("Error:", error);
    resultsContainer.innerHTML =
      '<p class="text-danger">Error loading data.</p>';
  }
}

// Función para generar datos mock para pruebas
function generateMockData(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: 11 + i,
    name: `User ${11 + i}`,
    username: `user${11 + i}`,
    email: `user${11 + i}@example.com`,
    phone: `123-456-789${i}`,
    address: { city: `City ${i}`, street: `Street ${i}` },
    company: { name: `Company ${i}` },
    website: `www.user${11 + i}.com`,
  }));
}

// Función para mostrar la tabla con datos paginados y buscables
function displayTable() {
  const resultsContainer = document.getElementById("results");
  
  // Calcular las filas de inicio y fin para la paginación
  const startRow = (currentPage - 1) * ROWS_PER_PAGE;
  const endRow = startRow + ROWS_PER_PAGE;
  
  // Obtener los datos de la página actual
  const pageData = usersData.slice(startRow, endRow);

  // Generar el HTML para la tabla
  resultsContainer.innerHTML = `
    <div class="table-responsive">
      <table id="dataTable" class="table table-striped table-hover shadow-lg">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Street</th>
            <th>Company</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pageData
            .map(
              (user, index) => `
            <tr>
              <td>${startRow + index + 1}</td>
              <td>${user.name}</td>
              <td>${user.username}</td>
              <td><a href="mailto:${user.email}" class="text-decoration-none">${user.email}</a></td>
              <td><a href="tel:${user.phone}" class="text-decoration-none">${user.phone}</a></td>
              <td>${user.address.city}</td>
              <td>${user.address.street}</td>
              <td>${user.company.name}</td>
              <td><a href="https://${user.website}" target="_blank" class="text-decoration-none">${user.website}</a></td>
              <td>
                <button class="btn btn-sm btn-primary view-profile-btn" data-id="${user.id}">View Profile</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="pagination-controls">
      <button id="prevPage" class="btn btn-secondary" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${currentPage} of ${Math.ceil(usersData.length / ROWS_PER_PAGE)}</span>
      <button id="nextPage" class="btn btn-primary" ${
        currentPage === Math.ceil(usersData.length / ROWS_PER_PAGE)
          ? "disabled"
          : ""
      }>Next</button>
    </div>
  `;

  // Inicializar características de DataTable
  $("#dataTable").DataTable({
    dom: "Bfrtip",
    buttons: [
      {
        extend: "copy",
        className: "btn btn-sm btn-outline-primary mx-1 px-2 p-2 mb-3",
        text: '<i class="bi bi-clipboard"></i> Copy',
        action: function (e, dt, button, config) {
          // Llamar a la acción por defecto del botón Copy
          $.fn.dataTable.ext.buttons.copyHtml5.action.call(this, e, dt, button, config);
          // Mostrar una alerta
          alert('¡Data copied to the clipboard!');
        }
      },
      {
        extend: "csv",
        className: "btn btn-sm btn-outline-success mx-1 p-2 px-2 mb-3",
        text: '<i class="bi bi-file-earmark-spreadsheet"></i> CSV',
      },
      {
        extend: "excel",
        className: "btn btn-sm btn-outline-success mx-1 p-2 px-2 mb-3",
        text: '<i class="bi bi-file-earmark-excel"></i> Excel',
      },
      {
        extend: "pdf",
        className: "btn btn-sm btn-outline-danger mx-1 p-2 px-2 mb-3 ",
        text: '<i class="bi bi-file-earmark-pdf"></i> PDF',
      },
      {
        extend: "print",
        className: "btn btn-sm btn-outline-warning mx-1 p-2 px-2 mb-3",
        text: '<i class="bi bi-printer"></i> Print',
      },
    ],
    paging: false,
    info: false,
    searching: false,
  });

  // Agregar event listeners para la paginación
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayTable();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < Math.ceil(usersData.length / ROWS_PER_PAGE)) {
      currentPage++;
      displayTable();
    }
  });

  // Agregar event listeners para los botones "View Profile"
  document.querySelectorAll(".view-profile-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const userId = event.target.getAttribute("data-id");
      showUserProfile(userId);
    });
  });
}

// Función para mostrar el perfil de un usuario en un modal
function showUserProfile(userId) {
  const user = usersData.find((u) => u.id == userId);
  if (!user) return;

  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = `
    <h5>${user.name} (@${user.username})</h5>
    <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    <p><strong>Website:</strong> <a href="https://${user.website}" target="_blank">${user.website}</a></p>
    <p><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
    <p><strong>Company:</strong> ${user.company.name}</p>
  `;
  const profileModal = new bootstrap.Modal(
    document.getElementById("profileModal")
  );
  profileModal.show();
}

// Función para restablecer los datos
function resetData() {
  document.getElementById("results").innerHTML =
    "Click the button to load data.";
}

// Filtrar la tabla basado en el cuadro de búsqueda
document.getElementById("searchBox").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  if (query) {
    const filteredData = usersData.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
    displayFilteredTable(filteredData);
  } else {
    displayTable(); // Restaurar datos completos si no hay texto en el cuadro de búsqueda
  }
});

// Mostrar datos filtrados en la tabla
function displayFilteredTable(filteredData) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = `
    <table id="dataTable" class="table table-striped table-hover shadow-lg rounded-4 ">
      <thead class="table-primary">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Phone</th>
          <th>City</th>
          <th>Street</th>
          <th>Company</th>
          <th>Website</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filteredData
          .map(
            (user, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td><a href="mailto:${user.email}" class="text-decoration-none">${user.email}</a></td>
            <td><a href="tel:${user.phone}" class="text-decoration-none">${user.phone}</a></td>
            <td>${user.address.city}</td>
            <td>${user.address.street}</td>
            <td>${user.company.name}</td>
            <td><a href="https://${user.website}" target="_blank" class="text-decoration-none">${user.website}</a></td>
            <td>
              <button class="btn btn-sm btn-primary view-profile-btn" data-id="${user.id}">View Profile</button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
  document.querySelectorAll(".view-profile-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const userId = event.target.getAttribute("data-id");
      showUserProfile(userId);
    });
  });
}

// Agregar event listeners para los botones de carga y restablecimiento de datos
document.getElementById("fetchData").addEventListener("click", fetchData);
document.getElementById("resetData").addEventListener("click", resetData);