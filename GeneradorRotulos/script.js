let filaEditando = null; // Guarda la fila que se está editando
document.addEventListener("DOMContentLoaded", function () {
  cargarDatos(); // Cargar datos de localStorage

  document.getElementById("PC").addEventListener("input", function () {
    actualizarPC2yPC3();
  });
});

function actualizarPC2yPC3() {
  let precioCompra =
    parseFloat(document.getElementById("PC").value.replace(/\./g, "")) || 0;
  let precioConIVA = precioCompra * 1.19;
  let precioRedondeado = redondearMiles(precioConIVA);

  document.getElementById("PC2").value = precioConIVA.toFixed(0);
  document.getElementById("PC3").value = transformarNumero(precioRedondeado);

  // Aplicar formato con separador de miles en PC y PC2
  document.getElementById("PC").value = precioCompra.toLocaleString("es-ES");
  document.getElementById("PC2").value = parseFloat(
    precioConIVA.toFixed(0)
  ).toLocaleString("es-ES");
}

function guardarRegistro() {
  let codigo = document.getElementById("codigo").value.trim();
  let factura = document.getElementById("factura").value.trim();
  let fechaInput = document.getElementById("fecha").value.trim();

  // Convertir la fecha a formato DD-MM-YYYY
  let [año, mes, dia] = fechaInput.split("-");
  let fecha = `${dia}-${mes}-${año}`;

  let PC =
    parseFloat(document.getElementById("PC").value.replace(/\./g, "")) || 0;
  let PC2 =
    parseFloat(document.getElementById("PC2").value.replace(/\./g, "")) || 0;

  let PC3 = document.getElementById("PC3").value;
  let ref = document.getElementById("ref").value;
  let cantidad = parseInt(document.getElementById("cantidad").value) || 1;

  if (!codigo || !factura || !fecha || PC <= 0) {
    alert("Por favor, complete todos los campos correctamente.");
    return;
  }

  if (cantidad > 44) {
    alert("La cantidad máxima es 44.");
    return;
  }

  let tablaBody = document.getElementById("tabla-body");

  if (filaEditando) {
    if (cantidad === 1) {
      let celdas = filaEditando.children;
      celdas[0].textContent = codigo;
      celdas[1].textContent = factura;
      celdas[2].textContent = fecha; // Ahora con el formato DD-MM-YYYY
      celdas[3].textContent = PC.toLocaleString("es-ES");
      celdas[4].textContent = PC2.toLocaleString("es-ES");
      celdas[5].textContent = PC3;
      celdas[6].textContent = ref;
    } else {
      filaEditando.remove();
      for (let i = 0; i < cantidad; i++) {
        agregarFila(tablaBody, codigo, factura, fecha, PC, PC2, PC3, ref);
      }
    }
    filaEditando = null;
  } else {
    for (let i = 0; i < cantidad; i++) {
      agregarFila(tablaBody, codigo, factura, fecha, PC, PC2, PC3, ref);
    }
  }
  guardarDatos();
  limpiarFormulario();

  let modal = bootstrap.Modal.getInstance(document.getElementById("modal"));
  modal.hide();
}

function agregarFila(tablaBody, codigo, factura, fecha, PC, PC2, PC3, ref) {
  let nuevaFila = document.createElement("tr");

  let PC_Formateado = parseFloat(PC).toLocaleString("es-ES");
  let PC2_Formateado = parseFloat(PC2).toLocaleString("es-ES");

  nuevaFila.innerHTML = `
        <td>${codigo}</td>
        <td>${factura}</td>
        <td>${fecha}</td>
        <td>${PC_Formateado}</td>
        <td>${PC2_Formateado}</td>
        <td>${PC3}</td>
        <td>${ref}</td>
        <td class="acciones-col">
            <button class="btn btn-warning btn-sm" onclick="editarRegistro(this)">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarRegistro(this)">Eliminar</button>
        </td>
        <td class="check-col" style="display: none;">
            <input type="checkbox" class="fila-checkbox">
        </td>
    `;
  tablaBody.appendChild(nuevaFila);
}

document.addEventListener("DOMContentLoaded", function () {
  const tablaBody = document.getElementById("tabla-body");

  // Evento de doble clic para editar (funciona en desktop y móvil)
  tablaBody.addEventListener("dblclick", function (event) {
    const fila = event.target.closest("tr");
    if (fila) {
      editarRegistro(fila.querySelector(".btn-warning"));
    }
  });

  // Evento de "hold" para eliminar (compatible con móviles)
  let holdTimer;

  // Evento para dispositivos táctiles
  tablaBody.addEventListener("touchstart", function (event) {
    const fila = event.target.closest("tr");
    if (fila) {
      holdTimer = setTimeout(() => {
        mostrarModalEliminar(fila);
      }, 1000); // 2 segundos
    }
  });

  tablaBody.addEventListener("touchend", function () {
    clearTimeout(holdTimer);
  });

  tablaBody.addEventListener("touchcancel", function () {
    clearTimeout(holdTimer);
  });

  // Evento para dispositivos con mouse
  tablaBody.addEventListener("mousedown", function (event) {
    const fila = event.target.closest("tr");
    if (fila) {
      holdTimer = setTimeout(() => {
        mostrarModalEliminar(fila);
      }, 1000); // 2 segundos
    }
  });

  tablaBody.addEventListener("mouseup", function () {
    clearTimeout(holdTimer);
  });

  tablaBody.addEventListener("mouseleave", function () {
    clearTimeout(holdTimer);
  });
});

function mostrarModalEliminar(fila) {
  const modalEliminar = new bootstrap.Modal(
    document.getElementById("modalEliminar")
  );
  modalEliminar.show();

  document.getElementById("confirmarEliminar").onclick = function () {
    fila.remove();
    modalEliminar.hide();
  };
}

function editarRegistro(boton) {
  filaEditando = boton.closest("tr"); // Guarda la fila seleccionada
  let celdas = filaEditando.children;

  document.getElementById("codigo").value = celdas[0].textContent;
  document.getElementById("factura").value = celdas[1].textContent;
  document.getElementById("fecha").value = celdas[2].textContent;

  // ❌ Quitar separador de miles antes de asignar al input
  document.getElementById("PC").value = celdas[3].textContent.replace(
    /\./g,
    ""
  );
  document.getElementById("PC2").value = celdas[4].textContent.replace(
    /\./g,
    ""
  );
  document.getElementById("PC3").value = celdas[5].textContent;
  document.getElementById("ref").value = celdas[6].textContent;

  // Recalcular PC2 y PC3 con el nuevo valor de PC
  actualizarPC2yPC3();

  let modal = new bootstrap.Modal(document.getElementById("modal"));
  modal.show();
}

function limpiarFormulario() {
  document.getElementById("modal-form").reset();
  document.getElementById("cantidad").value = 1;
}

function eliminarRegistro(boton) {
  if (confirm("¿Está seguro de eliminar este registro?")) {
    boton.closest("tr").remove();
    guardarDatos();
  }
}

function guardarDatos() {
  let datos = [];
  document.querySelectorAll("#tabla-body tr").forEach((fila) => {
    let celdas = fila.children;
    datos.push({
      codigo: celdas[0].textContent,
      factura: celdas[1].textContent,
      fecha: celdas[2].textContent,
      PC: celdas[3].textContent,
      PC2: celdas[4].textContent,
      PC3: celdas[5].textContent,
      ref: celdas[6].textContent,
    });
  });

  localStorage.setItem("tablaDatos", JSON.stringify(datos));
}

function cargarDatos() {
  let datos = JSON.parse(localStorage.getItem("tablaDatos")) || [];
  let tablaBody = document.getElementById("tabla-body");
  tablaBody.innerHTML = "";

  datos.forEach((registro) => {
    agregarFila(
      tablaBody,
      registro.codigo,
      registro.factura,
      registro.fecha,
      parseFloat(registro.PC) || 0, // Convertimos a número
      parseFloat(registro.PC2) || 0, // Convertimos a número
      registro.PC3,
      registro.ref
    );
  });
}

function redondearMiles(numero) {
  let miles = Math.floor(numero / 1000) * 1000;
  let residuo = numero % 1000;

  if (residuo >= 400) {
    return miles + 1000; // Redondea hacia arriba
  } else {
    return miles; // Redondea hacia abajo
  }
}

function transformarNumero(numero) {
  const mapa = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "I",
    6: "H",
    7: "J",
    8: "K",
    9: "L",
    0: "X",
  };
  let numStr = Math.round(numero).toString();
  return numStr
    .split("")
    .map((digito) => mapa[digito])
    .join("")
    .replace(/(.)(?=(.{3})+$)/g, "$1.");
}

/*MODALES ENVIO Y RECIBIDA DE DATOS*/
function mostrarSpinner() {
  let loadingContainer = document.getElementById("loadingContainer");
  let spinner = document.getElementById("spinner");
  let successCheck = document.getElementById("successCheck");

  loadingContainer.style.display = "flex";
  spinner.style.display = "block";
  successCheck.style.display = "none";
}

function mostrarCheck() {
  let spinner = document.getElementById("spinner");
  let successCheck = document.getElementById("successCheck");

  spinner.style.display = "none"; // Oculta el spinner
  successCheck.style.display = "flex"; // Muestra el check verde

  setTimeout(() => {
    ocultarSpinner();
  }, 1500); // Oculta todo después de 1.5 segundos
}

function ocultarSpinner() {
  document.getElementById("loadingContainer").style.display = "none";
}

function mostrarError(mensaje) {
  document.getElementById("errorMessage").innerText = mensaje;
  document.getElementById("errorModal").style.display = "block";
}

function cerrarModal() {
  document.getElementById("errorModal").style.display = "none";
}

function enviarDatos() {
  let tablaBody = document.getElementById("tabla-body");
  let filas = tablaBody.getElementsByTagName("tr");
  let datos = [];

  for (let fila of filas) {
    let celdas = fila.getElementsByTagName("td");
    let filaDatos = {
      codigo: celdas[0].innerText,
      factura: celdas[1].innerText,
      fecha: celdas[2].innerText,
      PC: celdas[3].innerText,
      PC2: celdas[4].innerText,
      PC3: celdas[5].innerText,
      ref: celdas[6].innerText,
    };
    datos.push(filaDatos);
  }

  if (datos.length === 0) {
    alert("No hay datos para enviar.");
    return;
  }

  let url =
    "https://script.google.com/macros/s/AKfycbxVsmFCAYn0o2hqQ5rU5sfdXd6S5R6f7bhi99gOFsRn88TcQUd02fLQeLSBmmiTXD0B/exec";
  let params = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `datos=${encodeURIComponent(JSON.stringify(datos))}`,
  };

  mostrarSpinner(); // Mostrar spinner antes de la petición

  fetch(url, params)
    .then((response) => response.text())
    .then((data) => {
      ocultarSpinner(); // Ocultar spinner cuando termine la petición
      if (data === "success") {
        mostrarCheck();
        limpiarTabla();
      } else {
        mostrarError("Error al enviar los datos.");
      }
    })
    .catch((error) => {
      ocultarSpinner();
      console.error("Error:", error);
      mostrarError("Error al enviar los datos.");
    });
}

function recibirDatos() {
  let url =
    "https://script.google.com/macros/s/AKfycbxVsmFCAYn0o2hqQ5rU5sfdXd6S5R6f7bhi99gOFsRn88TcQUd02fLQeLSBmmiTXD0B/exec";

  mostrarSpinner(); // Mostrar spinner antes de recibir datos

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      ocultarSpinner(); // Ocultar spinner después de recibir datos

      let tablaBody = document.getElementById("tabla-body");

      // Obtener datos almacenados previamente
      let datosGuardados = JSON.parse(localStorage.getItem("tablaDatos")) || [];

      // Combinar datos nuevos con los ya guardados
      datosGuardados = datosGuardados.concat(data);

      // Guardar en localStorage
      localStorage.setItem("tablaDatos", JSON.stringify(datosGuardados));

      // Mostrar datos en la tabla
      mostrarDatosEnTabla(datosGuardados);
    })
    .catch((error) => {
      ocultarSpinner();
      console.error("Error:", error);
      mostrarError("No encontré nada, ¡pide que te envíen los datos!.");
    });
}

// Función para mostrar datos en la tabla
function mostrarDatosEnTabla(datos) {
  let tablaBody = document.getElementById("tabla-body");
  tablaBody.innerHTML = ""; // Limpiar la tabla antes de llenar con los datos

  datos.forEach((fila) => {
    let fechaFormateada = new Date(fila.fecha).toISOString().split("T")[0];

    let nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
        <td>${fila.codigo}</td>
        <td>${fila.factura}</td>
        <td>${fechaFormateada}</td>
        <td>${fila.PC}</td>
        <td>${fila.PC2}</td>
        <td>${fila.PC3}</td>
        <td>${fila.ref}</td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="editarRegistro(this)">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarRegistro(this)">Eliminar</button>
        </td>
    `;

    tablaBody.appendChild(nuevaFila); // Agregar la fila a la tabla
  });
}

let doc;

// Función para enviar el PDF por WhatsApp
function enviarPorWhatsApp() {
  if (!doc) {
    var myModal = new bootstrap.Modal(document.getElementById("whatsappModal"));
    myModal.show();
    return;
  }

  let pdfBlob = doc.output("blob");
  let formData = new FormData();
  formData.append("file", pdfBlob, "Reporte_Tabla.pdf");

  fetch("https://store1.gofile.io/uploadFile", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        let fileURL = data.data.downloadPage;
        const numero = "573213160824";
        let mensaje = encodeURIComponent(
          "Aquí tienes el archivo PDF: " + fileURL
        );
        let whatsappLink = `https://api.whatsapp.com/send?phone=${numero}&text=${mensaje}`;
        window.open(whatsappLink, "_blank");
      } else {
        alert("Error al subir el archivo.");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function limpiarTabla() {
  document.getElementById("tabla-body").innerHTML = ""; // Vacía la tabla
  localStorage.removeItem("tablaDatos"); // Borra los datos guardados en el cache
}

let modoEliminar = false;
let seleccionando = false;

function toggleEliminarVarios() {
  modoEliminar = !modoEliminar;

  let checkCols = document.querySelectorAll(".check-col");
  let checkboxes = document.querySelectorAll(".fila-checkbox");
  let btnEliminarVarios = document.getElementById("btn-eliminar-varios");
  let btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");

  if (modoEliminar) {
    checkCols.forEach((col) => (col.style.display = "table-cell"));
    checkboxes.forEach((checkbox) => (checkbox.style.display = "inline-block"));
    btnEliminarVarios.style.display = "none";
    btnConfirmarEliminar.style.display = "inline-block";
    document.getElementById("cancelar-eliminar").style.display = "inline-block";
  } else {
    checkCols.forEach((col) => (col.style.display = "none"));
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
    btnEliminarVarios.style.display = "inline-block";
    btnConfirmarEliminar.style.display = "none";
    document.getElementById("cancelar-eliminar").style.display = "none";
  }
}

function eliminarSeleccionados() {
  let checkboxes = document.querySelectorAll(".fila-checkbox:checked");

  if (checkboxes.length === 0) {
    mostrarModalNoSeleccion();
    return;
  }

  mostrarModalConfirmarEliminar(() => {
    checkboxes.forEach((checkbox) => {
      let fila = checkbox.closest("tr");
      fila.remove();
    });

    toggleEliminarVarios();
  });
}

function mostrarModalNoSeleccion() {
  const modal = document.getElementById("modal-no-seleccion");
  const cerrarModal = document.getElementById("cerrar-modal-no-seleccion");

  modal.style.display = "flex";

  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

function mostrarModalConfirmarEliminar(onConfirm) {
  const modal = document.getElementById("modal-confirmar-eliminar");
  const confirmarBtn = document.getElementById("confirmar-eliminar");
  const cancelarBtn = document.getElementById("cancelar-eliminar-modal");

  modal.style.display = "flex";

  confirmarBtn.addEventListener("click", () => {
    modal.style.display = "none";
    onConfirm();
  });

  cancelarBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

document.addEventListener("click", function (event) {
  let checkbox = event.target.closest(".fila-checkbox");
  if (checkbox && modoEliminar) {
    checkbox.checked = !checkbox.checked;
  }
});

document.addEventListener("mousedown", function (event) {
  if (event.target.classList.contains("fila-checkbox") && modoEliminar) {
    seleccionando = true;
    event.target.checked = !event.target.checked;
  }
});

document.addEventListener("mousemove", function (event) {
  if (seleccionando && modoEliminar) {
    let checkbox = event.target.closest(".fila-checkbox");
    if (checkbox) {
      checkbox.checked = true;
    }
  }
});

document.addEventListener("mouseup", function () {
  seleccionando = false;
});

function cancelarEliminacionMultiple() {
  let checkboxes = document.querySelectorAll(".fila-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  document.getElementById("cancelar-eliminar").style.display = "none";
  document.getElementById("btn-confirmar-eliminar").style.display = "none";
  document.getElementById("btn-eliminar-varios").style.display = "block";
  toggleEliminarVarios();
}
