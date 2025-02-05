// Variable global para contar el número de tablas creadas
let tableCount = 0;

// Función para actualizar los títulos de las tablas y corregir su numeración
const updateTableTitles = () => {
  // Obtener todos los contenedores de tablas que comienzan con "wrapper-"
  const tables = document.querySelectorAll('[id^="wrapper-"]');

  // Iterar sobre cada tabla para actualizar su título, ID y atributos de los botones
  tables.forEach((wrapper, index) => {
    const newIndex = index + 1; // Ajustar el índice para que sea basado en 1
    const title = wrapper.querySelector('h3'); // Obtener el título de la tabla

    // Actualizar el texto del título si existe
    if (title) title.textContent = `Table ${newIndex}`;

    // Actualizar el ID del contenedor de la tabla
    wrapper.id = `wrapper-${newIndex}`;

    // Obtener la tabla dentro del contenedor
    const table = wrapper.querySelector('table');

    // Actualizar el ID de la tabla si existe
    if (table) table.id = `table-${newIndex}`;

    // Obtener todos los botones dentro del contenedor
    const buttons = wrapper.querySelectorAll('button');

    // Actualizar los atributos "onclick" de los botones
    buttons.forEach((button) => {
      const currentOnclick = button.getAttribute('onclick'); // Obtener el valor actual de "onclick"

      // Si el atributo "onclick" existe, reemplazar el índice antiguo con el nuevo
      if (currentOnclick) {
        const updatedOnclick = currentOnclick.replace(/\d+/, newIndex);
        button.setAttribute('onclick', updatedOnclick); // Actualizar el atributo "onclick"
      }
    });
  });

  // Actualizar el contador global de tablas
  tableCount = tables.length;
};

// Función para crear una nueva tabla dinámica
const createTable = () => {
  tableCount++; // Incrementar el contador de tablas
  const container = document.getElementById('tablesContainer'); // Obtener el contenedor de tablas

  // Crear un nuevo contenedor para la tabla
  const wrapper = document.createElement('div');
  wrapper.className = 'mb-5'; // Añadir clase de margen inferior
  wrapper.id = `wrapper-${tableCount}`; // Establecer el ID del contenedor

  // Establecer el contenido HTML del contenedor de la tabla
  wrapper.innerHTML = `
    <h3 contenteditable="true">Table ${tableCount}</h3>
    <div class="mb-3">
      <button class="btn btn-primary" onclick="addRow(${tableCount})">Add Row</button>
      <button class="btn btn-secondary" onclick="filterRows(${tableCount})">Filter Rows</button>
      <button class="btn btn-info" onclick="resetFilters()">Reset Filters</button>
      <button class="btn btn-danger" onclick="deleteTable(${tableCount})">Delete Table</button>
    </div>
    <div class="table-responsive">
      <table id="table-${tableCount}" class="table table-striped">
        <thead>
          <tr>
            <th>Expand</th>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Actions</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;

  // Añadir el contenedor de la tabla al contenedor principal
  container.appendChild(wrapper);
};

// Función para añadir una nueva fila a una tabla específica
const addRow = (tableId) => {
  const table = document.querySelector(`#table-${tableId} tbody`); // Obtener el cuerpo de la tabla
  const rowCount = table.querySelectorAll('tr:not(.hidden-row)').length + 1; // Contar las filas visibles
  const message = `Detailed message for row ${rowCount}.`; // Crear un mensaje detallado para la fila

  // Crear una nueva fila
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><span class="expand-icon" onclick="toggleRow(this)">▶</span></td>
    <td>${rowCount}</td>
    <td contenteditable="true">First Name ${rowCount}</td>
    <td contenteditable="true">Last Name ${rowCount}</td>
    <td contenteditable="true">email${rowCount}@example.com</td>
    <td contenteditable="true">+1 000 000 ${rowCount}</td>
    <td contenteditable="true" class="truncated">${message}</td>
    <td>
      <button class="btn btn-sm btn-danger" onclick="deleteRow(this)">Delete</button>
      <button class="btn btn-sm btn-success" onclick="duplicateRow(this)">Duplicate</button>
    </td>
    <td>
      <button class="btn btn-sm btn-primary" onclick="editRowFromButton(this)">Edit</button>
    </td>
  `;

  // Añadir la fila al cuerpo de la tabla
  table.appendChild(row);

  // Crear una fila oculta para detalles adicionales
  const hiddenRow = document.createElement('tr');
  hiddenRow.className = 'hidden-row';
  hiddenRow.innerHTML = `
    <td colspan="9">
      <span>Details: ${message}</span>
      <button class="btn btn-sm btn-primary mt-2" onclick="editHiddenRow(this)">Edit Details</button>
    </td>
  `;

  // Añadir la fila oculta al cuerpo de la tabla
  table.appendChild(hiddenRow);
};

// Función para expandir o colapsar una fila oculta
const toggleRow = (icon) => {
  const hiddenRow = icon.closest('tr').nextElementSibling; // Obtener la fila oculta siguiente

  // Si la fila oculta existe, alternar su visibilidad
  if (hiddenRow && hiddenRow.classList.contains('hidden-row')) {
    hiddenRow.style.display = hiddenRow.style.display === "none" || hiddenRow.style.display === "" ? "table-row" : "none";
    icon.textContent = hiddenRow.style.display === "none" ? "▶" : "▼"; // Cambiar el ícono de expandir/colapsar
  }
};

// Función para editar una fila principal
const editRowFromButton = (button) => {
  const row = button.closest('tr'); // Obtener la fila más cercana
  const cells = row.querySelectorAll('td[contenteditable]'); // Obtener las celdas editables

  // Añadir un borde azul a las celdas editables
  cells.forEach((cell) => (cell.style.border = "1px solid #007bff"));

  // Cambiar el texto del botón a "Save" y su clase a "btn-success"
  button.textContent = "Save";
  button.classList.replace("btn-primary", "btn-success");

  // Cambiar la función del botón para guardar la fila
  button.onclick = () => saveRowFromButton(row, button);
};

// Función para guardar los cambios en una fila principal
const saveRowFromButton = (row, button) => {
  const cells = row.querySelectorAll('td[contenteditable]'); // Obtener las celdas editables

  // Quitar el borde de las celdas editables
  cells.forEach((cell) => (cell.style.border = "none"));

  // Cambiar el texto del botón a "Edit" y su clase a "btn-primary"
  button.textContent = "Edit";
  button.classList.replace("btn-success", "btn-primary");

  // Cambiar la función del botón para editar la fila
  button.onclick = () => editRowFromButton(button);
};

// Función para editar los detalles de una fila oculta
const editHiddenRow = (button) => {
  const parentCell = button.closest('td'); // Obtener la celda padre
  const span = parentCell.querySelector('span'); // Obtener el elemento span dentro de la celda
  const originalText = span.textContent.replace('Details: ', '').trim(); // Obtener el texto original

  // Crear un textarea para editar el texto
  const input = document.createElement('textarea');
  input.className = 'form-control';
  input.value = originalText;

  // Limpiar el contenido de la celda y añadir el textarea
  parentCell.innerHTML = '';
  parentCell.appendChild(input);

  // Crear un botón para guardar los cambios
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-sm btn-success mt-2';
  saveBtn.textContent = 'Save';
  saveBtn.onclick = () => {
    span.textContent = `Details: ${input.value}`; // Actualizar el texto del span
    parentCell.innerHTML = ''; // Limpiar la celda
    parentCell.appendChild(span); // Añadir el span actualizado
    parentCell.appendChild(button); // Añadir el botón de editar
  };

  // Añadir el botón de guardar a la celda
  parentCell.appendChild(saveBtn);
};

// Función para eliminar una fila principal y su fila oculta asociada
const deleteRow = (button) => {
  const row = button.closest('tr'); // Obtener la fila más cercana
  const hiddenRow = row.nextElementSibling; // Obtener la fila oculta siguiente

  // Si la fila oculta existe, eliminarla
  if (hiddenRow && hiddenRow.classList.contains('hidden-row')) hiddenRow.remove();

  // Eliminar la fila principal
  row.remove();
};

// Función para duplicar una fila principal y su fila oculta asociada
const duplicateRow = (button) => {
  const row = button.closest('tr'); // Obtener la fila más cercana
  const hiddenRow = row.nextElementSibling; // Obtener la fila oculta siguiente

  // Clonar la fila principal y la fila oculta
  const clonedRow = row.cloneNode(true);
  const clonedHiddenRow = hiddenRow.cloneNode(true);

  // Insertar las filas clonadas después de la fila oculta original
  row.parentElement.insertBefore(clonedRow, hiddenRow.nextSibling);
  row.parentElement.insertBefore(clonedHiddenRow, clonedRow.nextSibling);
};

// Función para filtrar filas en una tabla específica
const filterRows = (tableId) => {
  const table = document.querySelector(`#table-${tableId}`); // Obtener la tabla específica
  const query = prompt('Enter a filter (first name):'); // Solicitar al usuario un filtro

  // Ocultar las filas que no coincidan con el filtro
  Array.from(table.querySelectorAll('tbody tr:not(.hidden-row)')).forEach((row) => {
    row.style.display = row.innerText.includes(query) ? '' : 'none';
  });
};

// Función para restablecer todos los filtros en todas las tablas
const resetFilters = () => {
  const tables = document.querySelectorAll('table'); // Obtener todas las tablas

  // Mostrar todas las filas en cada tabla
  tables.forEach((table) => {
    Array.from(table.querySelectorAll('tbody tr')).forEach((row) => {
      row.style.display = '';
    });
  });
};

// Función para eliminar una tabla específica
const deleteTable = (tableId) => {
  const wrapper = document.getElementById(`wrapper-${tableId}`); // Obtener el contenedor de la tabla

  // Si el contenedor existe, eliminarlo y actualizar los títulos de las tablas
  if (wrapper) {
    wrapper.remove();
    updateTableTitles();
  }
};

// Asignar el evento de clic al botón de crear tabla
document.getElementById('createTableBtn').addEventListener('click', createTable);