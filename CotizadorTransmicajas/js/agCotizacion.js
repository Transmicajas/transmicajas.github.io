// Función para formatear números con separadores de miles
function formatMoney(number, decimals = 0) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}

// Función para convertir formato de dinero a número
function parseMoney(moneyString) {
  return parseFloat(moneyString.replace(/\./g, "").replace(",", "."));
}

// Variables globales
let editIndex = -1;
let productosGuardados =
  JSON.parse(localStorage.getItem("productosSeleccionados")) || [];

// Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", function () {
  cargarProductosGuardados();
  actualizarTotal();

  // Configurar inputs de dinero
  document.querySelectorAll(".money-input").forEach((input) => {
    input.addEventListener("focus", function () {
      this.value = this.value.replace(/[^0-9,-]/g, "");
    });

    input.addEventListener("blur", function () {
      if (this.value) {
        this.value = formatMoney(parseMoney(this.value));
      }
    });
  });
});

function obtenerProductosDesdeTabla() {
  const filas = document.querySelectorAll("#tableBody tr");
  const productos = [];

  filas.forEach((fila) => {
    const celdas = fila.querySelectorAll("td");
    if (celdas.length >= 7) {
      const producto = {
        nombre: celdas[4].textContent.trim(),
        marca: celdas[7].textContent.trim(),
        referencia: celdas[2].textContent.trim(),
        precioCompra: parseMoney(celdas[5].textContent.trim()),
        precioVenta: parseMoney(celdas[6].textContent.trim()),
      };
      productos.push(producto);
    }
  });

  return productos;
}
// Función para detectar dispositivos móviles
function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
}

// Modificar la función cargarProductosGuardados
function cargarProductosGuardados() {
  const tabla = document.getElementById("selectedProducts");
  tabla.innerHTML = "";

  productosGuardados.forEach((producto, index) => {
    const subtotal = producto.precioVenta * (producto.cantidad || 1);
    const precioCompraConIva = producto.precioCompra * 1.19;

    const fila = document.createElement("tr");
    fila.dataset.index = index;
    fila.className = "product-row"; // Añadimos clase para estilizar

    fila.innerHTML = `
      <td class="text-center">${index + 1}</td>
      <td>
        <div class="producto-nombre">${producto.nombre}</div>
        <div class="producto-marca">${producto.marca}</div>
        <div class="producto-referencia">${producto.referencia}</div>
      </td>
      <td class="text-right">
        ${formatMoney(producto.precioCompra)}
        <div class="precio-con-iva">IVA: ${formatMoney(
          precioCompraConIva
        )}</div>
      </td>
      <td class="text-right">${formatMoney(producto.precioVenta)}</td>
      <td class="text-center"><input type="number" class="cantidad-input" value="${
        producto.cantidad || 1
      }" min="1"></td>
      <td class="text-right">${formatMoney(subtotal)}</td>
      <td class="text-center acciones-columna">
        <button class="editar-producto">Editar</button>
        <button class="eliminar-producto">Eliminar</button>
      </td>
    `;

    tabla.appendChild(fila);

    // Evento para actualizar cantidad
    fila
      .querySelector(".cantidad-input")
      .addEventListener("change", function () {
        actualizarCantidad(index, parseInt(this.value));
      });

    // Configuración de eventos según dispositivo
    if (isMobileDevice()) {
      setupMobileRowEvents(fila, index);
    } else {
      fila
        .querySelector(".editar-producto")
        .addEventListener("click", () => editarProducto(index));
      fila
        .querySelector(".eliminar-producto")
        .addEventListener("click", () => eliminarProducto(index));
    }
  });

  actualizarNumeracion();
  actualizarTotal();
}

// Configura eventos táctiles para dispositivos móviles
function setupMobileRowEvents(row, index) {
  let pressTimer;
  let isLongPress = false;
  const longPressDuration = 800;

  // Prevenir la selección de texto
  row.style.userSelect = "none";
  row.style.webkitUserSelect = "none";
  row.style.msUserSelect = "none";

  // Doble toque para editar
  let lastTapTime = 0;
  row.addEventListener(
    "touchend",
    function (e) {
      if (isLongPress) return;

      const currentTime = new Date().getTime();
      if (currentTime - lastTapTime < 300) {
        e.preventDefault();
        editarProducto(index);
      }
      lastTapTime = currentTime;
    },
    { passive: false }
  );

  // Evento touchstart mejorado
  row.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault(); // Prevenir comportamiento por defecto
      row.classList.add("touch-active");

      pressTimer = setTimeout(() => {
        isLongPress = true;
        row.classList.add("confirm-delete");

        // Vibrar para confirmar
        if (navigator.vibrate) navigator.vibrate(50);

        // Usar un modal personalizado en lugar de confirm()
        showDeleteConfirmation(index, row);
      }, longPressDuration);
    },
    { passive: false }
  );

  // Eventos restantes
  row.addEventListener(
    "touchend",
    function (e) {
      if (isLongPress) e.preventDefault();
      clearTimeout(pressTimer);
      if (!isLongPress) {
        row.classList.remove("touch-active");
      }
      isLongPress = false;
    },
    { passive: false }
  );

  row.addEventListener(
    "touchmove",
    function (e) {
      if (Math.abs(e.touches[0].clientX - e.touches[0].clientY) > 10) {
        clearTimeout(pressTimer);
        row.classList.remove("touch-active", "confirm-delete");
        isLongPress = false;
      }
    },
    { passive: true }
  );
}

// Modal personalizado para confirmación
function showDeleteConfirmation(index, row) {
  const modal = document.createElement("div");
  modal.className = "delete-modal";
  modal.innerHTML = `
    <div class="delete-modal-content">
      <p>¿Eliminar este producto?</p>
      <div class="delete-modal-buttons">
        <button class="delete-cancel">Cancelar</button>
        <button class="delete-confirm">Eliminar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Eventos del modal
  modal.querySelector(".delete-cancel").addEventListener(
    "touchend",
    function (e) {
      e.preventDefault();
      row.classList.remove("confirm-delete", "touch-active");
      document.body.removeChild(modal);
    },
    { passive: false }
  );

  modal.querySelector(".delete-confirm").addEventListener(
    "touchend",
    function (e) {
      e.preventDefault();
      row.classList.add("deleting");
      setTimeout(() => {
        eliminarProducto(index);
        document.body.removeChild(modal);
      }, 200);
    },
    { passive: false }
  );
}

function actualizarCantidad(index, nuevaCantidad) {
  if (nuevaCantidad > 0) {
    productosGuardados[index].cantidad = nuevaCantidad;
    localStorage.setItem(
      "productosSeleccionados",
      JSON.stringify(productosGuardados)
    );
    cargarProductosGuardados();
  } else {
    alert("La cantidad debe ser mayor a cero");
  }
}

function editarProducto(index) {
  editIndex = index;
  const producto = productosGuardados[index];

  document.getElementById("nombreProducto").value = producto.nombre;
  document.getElementById("refProducto").value = producto.referencia;
  document.getElementById("productoMarca").value = producto.marca;
  document.getElementById("precioCompra").value = formatMoney(
    producto.precioCompra
  );
  document.getElementById("precioVenta").value = formatMoney(
    producto.precioVenta
  );
  document.getElementById("cantidadProducto").value = producto.cantidad || 1;

  document.getElementById("cotizacionModal").style.display = "flex";
  document.getElementById("addProduct").textContent = "Actualizar producto";
}

function eliminarProducto(index) {
  productosGuardados.splice(index, 1);
  localStorage.setItem(
    "productosSeleccionados",
    JSON.stringify(productosGuardados)
  );
  cargarProductosGuardados();
}

function actualizarNumeracion() {
  document.querySelectorAll("#selectedProducts tr").forEach((fila, index) => {
    fila.cells[0].textContent = index + 1;
  });
}

function actualizarTotal() {
  const total = productosGuardados.reduce((sum, producto) => {
    return sum + producto.precioVenta * (producto.cantidad || 1);
  }, 0);

  document.getElementById("totalCotizacion").textContent = formatMoney(total);
}

// Eventos del modal
// Abrir el modal
document.getElementById("addCotizacionBtn").addEventListener("click", () => {
  editIndex = -1;
  document.getElementById("cotizacionModal").style.display = "flex";
  document.getElementById("addProduct").textContent = "Agregar este producto";
  limpiarCamposModal();
});

// Cerrar el modal al hacer clic en el botón de cerrar
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("cotizacionModal").style.display = "none";
});

// Cerrar el modal si se hace clic fuera del contenedor
document
  .getElementById("cotizacionModal")
  .addEventListener("click", function (event) {
    const content = document.querySelector(".cotizacion-modal-content");
    // Si el clic NO fue dentro del contenido, se cierra
    if (!content.contains(event.target)) {
      this.style.display = "none";
    }
  });

document.getElementById("closeModal").addEventListener("click", cerrarModal);

document.getElementById("searchInput").addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const productosDesdeTabla = obtenerProductosDesdeTabla();

  const resultados = productosDesdeTabla.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm) ||
      p.referencia.toLowerCase().includes(searchTerm)
  );

  mostrarResultados(resultados);
});

function mostrarResultados(listaProductos) {
  const tabla = document.getElementById("productTable");
  tabla.innerHTML = "";

  listaProductos.forEach((producto) => {
    let fila = document.createElement("tr");
    fila.innerHTML = `
              <td>
                  <div class="producto-nombre">${producto.nombre}</div>
                  <div class="producto-referencia">${producto.referencia}</div>
                  <div class="producto-marca">${producto.marca}</div>
              </td>
              <td class="text-right">
                  ${formatMoney(producto.precioCompra)}
                  <div class="precio-con-iva">IVA: ${formatMoney(
                    producto.precioCompra * 1.19
                  )}</div>
              </td>
              <td class="text-right">${formatMoney(producto.precioVenta)}</td>
          `;
    fila.addEventListener("click", () => {
      document.getElementById("nombreProducto").value = producto.nombre;
      document.getElementById("refProducto").value = producto.referencia;
      document.getElementById("productoMarca").value = producto.marca;
      document.getElementById("precioCompra").value = formatMoney(
        producto.precioCompra
      );
      document.getElementById("precioVenta").value = formatMoney(
        producto.precioVenta
      );
      document.getElementById("cantidadProducto").value = 1;
    });
    tabla.appendChild(fila);
  });
}

document.getElementById("addProduct").addEventListener("click", () => {
  const nombre = document.getElementById("nombreProducto").value;
  const referencia = document.getElementById("refProducto").value;
  const marca = document.getElementById("productoMarca").value;
  const precioCompra = parseMoney(
    document.getElementById("precioCompra").value
  );
  const precioVenta = parseMoney(document.getElementById("precioVenta").value);
  const cantidad = parseInt(document.getElementById("cantidadProducto").value);

  if (
    nombre &&
    referencia &&
    !isNaN(precioCompra) &&
    !isNaN(precioVenta) &&
    cantidad > 0
  ) {
    const producto = {
      nombre,
      referencia,
      marca,
      precioCompra,
      precioVenta,
      cantidad,
    };

    if (typeof editIndex !== "undefined" && editIndex >= 0) {
      productosGuardados[editIndex] = producto;
    } else {
      productosGuardados.push(producto);
    }

    localStorage.setItem(
      "productosSeleccionados",
      JSON.stringify(productosGuardados)
    );
    cargarProductosGuardados();
    cerrarModal();
  } else {
    alert("Por favor complete todos los campos correctamente.");
  }
});

document
  .getElementById("borrarCotizacion")
  .addEventListener("click", function () {
    document.getElementById("selectedProducts").innerHTML = "";
    document.getElementById("totalCotizacion").textContent = "0.00";

    productosGuardados.length = 0; // ✅ Vaciamos correctamente el arreglo
    localStorage.setItem(
      "productosSeleccionados",
      JSON.stringify(productosGuardados)
    );
  });

function limpiarCamposModal() {
  document.getElementById("nombreProducto").value = "";
  document.getElementById("refProducto").value = "";
  document.getElementById("productoMarca").value = "";
  document.getElementById("precioCompra").value = "";
  document.getElementById("precioVenta").value = "";
  document.getElementById("cantidadProducto").value = 1;
}

function cerrarModal() {
  document.getElementById("cotizacionModal").style.display = "none";
  document.getElementById("searchInput").value = "";
  document.getElementById("productTable").innerHTML = "";
  limpiarCamposModal();
}

/*tabla datos*/
/*Boton Borrar tabla cotizacion*/
