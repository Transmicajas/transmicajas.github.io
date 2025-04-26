const scriptURL =
  "https://script.google.com/macros/s/AKfycbzDb4Djh60Zk_hoA3ZKyhK1e9R9C3ikgNcTk-qUVqzzu3OENe7UWPjtPiVgJ10inzQc/exec";
let editRowIndex = null;

/*Spinner*/
function showSpinner(message = "Conectando...") {
  const indicator = document.getElementById("statusIndicatorA");
  const spinner = document.getElementById("spinner");
  const checkmark = document.getElementById("checkmark");
  const statusText = indicator.querySelector(".status-text");

  // Configurar el mensaje
  statusText.textContent = message;

  // Mostrar elementos
  indicator.style.display = "block";
  spinner.style.display = "block";
  checkmark.style.display = "none";

  // Reiniciar animaciones
  spinner.querySelectorAll(".particle").forEach((particle) => {
    particle.style.animation = "none";
    particle.offsetHeight; // Trigger reflow
    particle.style.animation = "";
  });

  // Animar barras de señal
  indicator.querySelectorAll(".signal-bar").forEach((bar) => {
    bar.style.animation = "signal-pulse 1.6s infinite ease-in-out";
  });
}

function showCheckmark(message = "Conexión exitosa") {
  const indicator = document.getElementById("statusIndicatorA");
  const spinner = document.getElementById("spinner");
  const checkmark = document.getElementById("checkmark");
  const statusText = indicator.querySelector(".status-text");
  const checkPath = checkmark.querySelector(".check-path");
  const checkGlow = checkmark.querySelector(".check-glow");

  // Configurar el mensaje
  statusText.textContent = message;

  // Cambiar a checkmark
  spinner.style.display = "none";
  checkmark.style.display = "block";

  // Animación de dibujo
  checkPath.style.strokeDashoffset = "24";
  checkPath.style.animation = "draw-check 0.6s ease-out forwards";

  // Efecto de brillo
  checkGlow.style.animation = "glow 0.8s ease-out forwards";

  // Detener animación de barras de señal
  indicator.querySelectorAll(".signal-bar").forEach((bar) => {
    bar.style.animation = "none";
    bar.style.background = "#00ff88";
  });

  // Ocultar después de 2 segundos
  setTimeout(() => {
    indicator.style.display = "none";
    // Resetear animaciones para la próxima vez
    checkPath.style.strokeDashoffset = "24";
    checkPath.style.animation = "none";
    checkGlow.style.animation = "none";
  }, 2000);
}

function showError(message = "Error de conexión") {
  const indicator = document.getElementById("statusIndicatorA");
  const spinner = document.getElementById("spinner");
  const checkmark = document.getElementById("checkmark");
  const statusText = indicator.querySelector(".status-text");

  // Configurar el mensaje
  statusText.textContent = message;

  // Cambiar a estado de error
  spinner.style.display = "none";
  checkmark.style.display = "none";

  // Cambiar color a rojo
  statusText.style.color = "#ff5555";
  indicator.querySelectorAll(".signal-bar").forEach((bar) => {
    bar.style.animation = "none";
    bar.style.background = "#ff5555";
  });

  // Parpadear el indicador
  let blinkCount = 0;
  const blinkInterval = setInterval(() => {
    indicator.style.opacity = indicator.style.opacity === "0.5" ? "1" : "0.5";
    blinkCount++;
    if (blinkCount >= 6) {
      clearInterval(blinkInterval);
      indicator.style.display = "none";
      indicator.style.opacity = "1";
      statusText.style.color = "rgba(255, 255, 255, 0.9)";
    }
  }, 300);
}
/*Spinner END*/

function renderTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  // Verificar el tamaño de la pantalla
  const isMobile = window.matchMedia("(max-width: 744px)").matches;

  let currentRowToDelete = null; // Almacena la fila actual que se está deslizando

  data.forEach((row, index) => {
    const tableRow = tableBody.insertRow();
    tableRow.insertCell(0).textContent = index + 1;
    tableRow.insertCell(1).textContent = row.fecha;
    tableRow.insertCell(2).textContent = row.placa;
    tableRow.insertCell(3).textContent = row.cantidad;
    tableRow.insertCell(4).textContent = row.descripcion;
    tableRow.insertCell(5).textContent = row.empresa;
    tableRow.insertCell(6).textContent = row.ubicacion;
    tableRow.insertCell(7).textContent = row.precio;
    tableRow.insertCell(8).textContent = row.preciov;

    const estadoCell = tableRow.insertCell(9);
    const estadoSelect = document.createElement("select");
    estadoSelect.classList.add("form-select-empresas");

    ["agotado", "revisar", "inventario"].forEach((option) => {
      const opt = document.createElement("option");

      opt.value = option;
      opt.textContent = option;
      if (option === row.estado) opt.selected = true;
      estadoSelect.appendChild(opt);
    });

    // Función para actualizar el color según el estado seleccionado
    const actualizarColor = () => {
      estadoSelect.classList.remove("agotado", "revisar", "inventario");
      estadoSelect.classList.add(estadoSelect.value.toLowerCase());
    };

    // Aplicar color inicial y añadir evento para cambios
    actualizarColor();
    estadoSelect.addEventListener("change", actualizarColor);

    estadoCell.appendChild(estadoSelect);

    estadoSelect.addEventListener("change", function () {
      row.estado = this.value;
      localStorage.setItem("tableData", JSON.stringify(data));
      updateGoogleSheet(row, "update");
    });

    estadoCell.appendChild(estadoSelect);

    if (!isMobile) {
      // Agregar columna de acciones solo en pantallas grandes
      const actionsCell = tableRow.insertCell(10);
      const editButton = document.createElement("button");
      editButton.classList.add("btn", "btn-warning", "me-2");
      editButton.textContent = "Editar";
      editButton.addEventListener("click", () => openEditModal(row, index));
      actionsCell.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger");
      deleteButton.textContent = "Eliminar";
      deleteButton.addEventListener("click", () =>
        showDeleteModal(tableRow, row, index, data)
      );
      actionsCell.appendChild(deleteButton);
    } else {
      // Comportamiento para pantallas móviles
      tableRow.addEventListener("dblclick", () => openEditModal(row, index));

      let startX = 0;
      tableRow.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
      });

      tableRow.addEventListener("touchmove", (e) => {
        const endX = e.touches[0].clientX;
        const deltaX = startX - endX;

        if (deltaX > 0) {
          tableRow.style.transform = `translateX(${-deltaX}px)`;
          tableRow.style.backgroundColor = `rgba(255, 0, 0, ${Math.min(
            deltaX / 200,
            0.7
          )})`;
        }
      });

      tableRow.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const deltaX = startX - endX;

        if (deltaX > 350) {
          // Umbral para eliminar
          currentRowToDelete = { row: tableRow, data: row, index }; // Almacena la fila que se deslizó
          showDeleteModal(tableRow, row, index, data); // Muestra el modal de confirmación
        } else {
          // Volver al estado inicial si no se eliminó
          tableRow.style.transition =
            "transform 0.8s ease-out, background-color 0.2s ease-out";
          tableRow.style.transform = "translateX(0)";
          tableRow.style.backgroundColor = "";
        }
      });
    }
    tableRow.addEventListener("click", () => {
      // Limpiar fondo de otras filas
      document
        .querySelectorAll("tr")
        .forEach((row) => (row.style.backgroundColor = ""));

      // Aplicar color azul claro a la fila seleccionada
      tableRow.style.backgroundColor = "#ADD8E6"; // Azul claro
    });
    // Detectar clic en cualquier parte de la página
    document.addEventListener("click", (e) => {
      const table = document.getElementById("tableBody").parentElement; // Contenedor de la tabla

      if (!table.contains(e.target)) {
        // Si el clic no fue dentro de la tabla, limpiar fondo de todas las filas
        document
          .querySelectorAll("tr")
          .forEach((row) => (row.style.backgroundColor = ""));
      }
    });
  });
}

function showDeleteModal(tableRow, row, index, data) {
  const modal = document.getElementById("confirmModal");
  const confirmDelete = document.getElementById("confirmDelete");

  // Asegúrate de eliminar cualquier evento previo del botón de confirmación
  confirmDelete.replaceWith(confirmDelete.cloneNode(true));
  const newConfirmDelete = document.getElementById("confirmDelete");

  modal.style.display = "flex";

  // Evento para confirmar eliminación
  newConfirmDelete.onclick = function () {
    modal.style.display = "none";
    tableRow.style.transition =
      "transform 0.3s ease-out, background-color 0.3s ease-out";
    tableRow.style.transform = "translateX(-100%)";
    tableRow.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    setTimeout(() => {
      updateGoogleSheet(row, "delete"); // Llama a la función para actualizar Google Sheets
      data.splice(index, 1); // Elimina la fila del arreglo de datos
      localStorage.setItem("tableData", JSON.stringify(data)); // Actualiza localStorage
      renderTable(data); // Vuelve a renderizar la tabla
    }, 200); // Eliminar después de la animación
  };

  // Evento para cancelar eliminación
  const closeButtons = modal.querySelectorAll("[data-close-modal]");
  closeButtons.forEach((button) => {
    button.onclick = function () {
      modal.style.display = "none";
      tableRow.style.transition =
        "transform 0.2s ease-out, background-color 0.2s ease-out";
      tableRow.style.transform = "translateX(0)";
      tableRow.style.backgroundColor = ""; // Restaurar estado original
    };
  });
}

function openEditModal(row, index) {
  // Asignar los valores a los campos del formulario
  document.getElementById("inputFecha").value = row.fecha;
  document.getElementById("inputPlaca").value = row.placa;
  document.getElementById("inputCantidad").value = row.cantidad;
  document.getElementById("inputDescripcion").value = row.descripcion;
  document.getElementById("inputUbicacionProducto").value = row.ubicacion;
  document.getElementById("inputPrecio").value = row.precio;
  document.getElementById("inputPrecioVenta").value = row.preciov;
  document.getElementById("inputEstado").value = row.estado;
  document.getElementById("inputEmpresa").value = row.empresa;

  // Guardar el índice de la fila que estamos editando
  editRowIndex = index;

  // Mostrar el modal manualmente
  const modalOverlay = document.getElementById("modalOverlay");
  modalOverlay.style.display = "flex";
}

function deleteRow(row, index, data) {
  // Abre el modal de confirmación y pasa el índice de la fila a eliminar
  openConfirmModal(index);

  // Configurar el botón de confirmación para eliminar la fila
  confirmDeleteButton.onclick = function () {
    // Realizar la eliminación
    updateGoogleSheet(row, "delete"); // Asume que esta función ya está definida
    data.splice(index, 1); // Elimina la fila del arreglo de datos
    localStorage.setItem("tableData", JSON.stringify(data)); // Actualiza el almacenamiento local
    renderTable(data); // Vuelve a renderizar la tabla

    // Cierra el modal de confirmación
    closeModal(confirmModal);
  };
}

async function fetchTableData() {
  const cachedData = localStorage.getItem("tableData");
  if (cachedData) {
    renderTable(JSON.parse(cachedData));
  } else {
    try {
      const response = await fetch(`${scriptURL}?action=datos`);

      const data = await response.json();

      // Convertir fechas largas a YYYY-MM-DD
      const formattedData = data.map((row) => ({
        ...row,
        fecha: formatDateLongToShort(row.fecha), // Convertir fecha
      }));

      localStorage.setItem("tableData", JSON.stringify(formattedData));
      renderTable(formattedData);
    } catch (error) {
      console.error("Error al recuperar datos:", error);
    }
  }
}

function formatDateLongToShort(dateLong) {
  const date = new Date(dateLong);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function updateGoogleSheet(row, action) {
  showSpinner();
  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: action,
        id: row.id || "",
        fecha: row.fecha || "",
        placa: row.placa || "",
        cantidad: row.cantidad || "",
        descripcion: row.descripcion || "",
        ubicacion: row.ubicacion || "",
        precio: row.precio || "",
        preciov: row.preciov || "",
        //total: row.total || "",
        estado: row.estado || "",
        empresa: row.empresa || "",
      }),
    });

    const responseText = await response.text();
    if (
      responseText === "success" ||
      responseText === "updated" ||
      responseText === "deleted"
    ) {
      showCheckmark();
    } else {
      throw new Error("Error en la respuesta del servidor.");
    }
  } catch (error) {
    console.error("Error al interactuar con Google Sheets:", error);
    showErrorModal(
      "Hubo un error al actualizar Google Sheets. Revisa la consola para más detalles."
    );
  }
}

document.getElementById("saveData").addEventListener("click", function () {
  const fecha = document.getElementById("inputFecha").value;
  const placa = document.getElementById("inputPlaca").value.trim();
  const cantidad = parseInt(document.getElementById("inputCantidad").value);
  const descripcion = document.getElementById("inputDescripcion").value.trim();
  const ubicacion = document
    .getElementById("inputUbicacionProducto")
    .value.trim();
  const precio = parseFloat(document.getElementById("inputPrecio").value);
  const preciov = parseFloat(document.getElementById("inputPrecioVenta").value);
  const estado = document.getElementById("inputEstado").value;
  const empresa = document.getElementById("inputEmpresa").value;

  if (
    !fecha ||
    !placa ||
    isNaN(cantidad) ||
    cantidad <= 0 ||
    !descripcion ||
    !ubicacion ||
    isNaN(precio) ||
    precio <= 0 ||
    isNaN(preciov) ||
    preciov <= 0
  ) {
    alert("Por favor, completa todos los campos con valores válidos.");
    return;
  }

  const total = Math.round(cantidad * precio);
  const cachedData = JSON.parse(localStorage.getItem("tableData")) || [];

  if (editRowIndex !== null) {
    cachedData[editRowIndex] = {
      fecha,
      placa,
      cantidad,
      descripcion,
      ubicacion,
      precio,
      preciov,
      //total,
      estado,
      empresa,
      id: cachedData[editRowIndex].id,
    };
    updateGoogleSheet(cachedData[editRowIndex], "update");
    editRowIndex = null;
  } else {
    const newRow = {
      id: "id_" + new Date().getTime(),
      fecha,
      placa,
      cantidad,
      descripcion,
      ubicacion,
      precio,
      preciov,
      //total,
      estado,
      empresa,
    };
    cachedData.push(newRow);
    updateGoogleSheet(newRow, "add");
  }

  localStorage.setItem("tableData", JSON.stringify(cachedData));
  renderTable(cachedData);

  const modalElement = bootstrap.Modal.getInstance(
    document.getElementById("dataModal")
  );
  if (modalElement) modalElement.hide();
});

document.addEventListener("DOMContentLoaded", fetchTableData);
