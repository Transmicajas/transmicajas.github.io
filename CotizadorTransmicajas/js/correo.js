// Obtener elementos del DOM
const openModalButtonCorreo = document.getElementById("enviar_correo");
const modalCorreo = document.getElementById("emailModal");
const closeModalButtonCorreo = document.getElementById("closeModalEmail");

// Abrir modal
openModalButtonCorreo.addEventListener("click", () => {
  modalCorreo.style.display = "flex";
});

// Cerrar modal
closeModalButtonCorreo.addEventListener("click", () => {
  modalCorreo.style.display = "none";
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
  if (event.target === modalCorreo) {
    modal.style.display = "none";
  }
});

document
  .getElementById("sendEmailButton")
  .addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value.trim();
    const fechaCorreo = document
      .getElementById("modalFechacorreo")
      .value.trim();
    const cuentaCorreo = document
      .getElementById("modalCuentacorreo")
      .value.trim();

    modalCorreo.style.display = "none";

    if (!email) {
      alert("Por favor, ingresa un correo válido.");
      return;
    }

    // Capturar productos de la tabla
    const productos = [];
    const filas = document.querySelectorAll("#selectedProducts tr");

    filas.forEach((fila) => {
      const columnas = fila.querySelectorAll("td");
      if (columnas.length >= 6) {
        const nombre =
          columnas[1].querySelector(".producto-nombre")?.innerText.trim() || "";
        const marca =
          columnas[1].querySelector(".producto-marca")?.innerText.trim() || "";

        productos.push({
          numero: columnas[0].innerText.trim(),
          producto: `${nombre} - ${marca}`,
          subtotal: columnas[5].innerText.trim(),
        });
      }
    });

    if (productos.length === 0) {
      alert("No hay productos seleccionados para enviar.");
      return;
    }

    // Mostrar el modal para capturar datos del cliente SIEMPRE
    const modal = document.getElementById("empresaModal");
    const saveButton = document.getElementById("saveEmpresaButton");

    modal.style.display = "flex";

    saveButton.onclick = () => {
      const nombre = document.getElementById("nombreEmpresaInput").value.trim();
      const nit = document.getElementById("nitEmpresaInput").value.trim();
      const ubicacion = document
        .getElementById("ubicacionEmpresaInput")
        .value.trim();
      const telefono = document
        .getElementById("telefonoEmpresaInput")
        .value.trim();
      const direccion = document
        .getElementById("direccionEmpresaInput")
        .value.trim();

      if (!nombre || !nit || !ubicacion || !telefono || !direccion) {
        alert("Por favor, completa todos los campos del cliente.");
        return;
      }

      const empresaInfo = { nombre, nit, ubicacion, telefono, direccion };
      modal.style.display = "none";

      enviarCorreo(email, fechaCorreo, cuentaCorreo, productos, empresaInfo);
    };
  });

async function enviarCorreo(
  email,
  fechaCorreo,
  cuentaCorreo,
  productos,
  empresaInfo
) {
  mostrarSpinner();

  const formattedData = productos
    .map((producto) => {
      // Eliminar puntos de miles (ej: 20.000 -> 20000)
      const subtotalStr = (producto.subtotal || "")
        .replace(/\./g, "")
        .replace(",", ".");
      const subtotal = parseFloat(subtotalStr) || 0;

      return [
        producto.numero || "",
        producto.producto || "",
        subtotal.toFixed(0), // Si no necesitas decimales, usa toFixed(0)
      ].join(",");
    })
    .join("|");

  const params = new URLSearchParams();
  params.append("email", email);
  params.append("fechaCorreo", fechaCorreo);
  params.append("cuentaCorreo", cuentaCorreo);
  params.append("empresaNombre", empresaInfo.nombre);
  params.append("empresaNIT", empresaInfo.nit);
  params.append("empresaUbicacion", empresaInfo.ubicacion);
  params.append("empresaTelefono", empresaInfo.telefono);
  params.append("empresaDireccion", empresaInfo.direccion);
  params.append("data", formattedData);
  params.append("sumaTotal", ""); // Ya no se usa

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzkcZk2FEn8TbcbAW0F2ukF9RKlufyqz3kNWoIINUy9Wg6vzUx6l-U578HJPYrMAJ7A/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const result = await response.text();
    if (response.ok) {
      mostrarModal("Éxito", "Correo enviado correctamente");
    } else {
      mostrarModal("Error", "Hubo un error al enviar el correo: " + result);
    }
  } catch (error) {
    mostrarModal(
      "Error",
      "Hubo un problema al enviar los datos: " + error.message
    );
  } finally {
    ocultarSpinner();
  }
}

// Función para mostrar el spinner
function mostrarSpinner() {
  const spinner = document.createElement("div");
  spinner.id = "spinnerCorreoRespuesta";
  spinner.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;">
            <div style="width: 50px; height: 50px; border: 5px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
    `;
  document.body.appendChild(spinner);
}

// Función para ocultar el spinner
function ocultarSpinner() {
  const spinner = document.getElementById("spinnerCorreoRespuesta");
  if (spinner) spinner.remove();
}

// Función para mostrar un modal con mensaje
function mostrarModal(titulo, mensaje) {
  const modal = document.createElement("div");
  modal.id = "modalCorreoRespuesta";
  modal.innerHTML = `
    <div class="modal-content" style="animation: slideDown 0.3s ease-in-out;">
            <div class="modal-header">
                <h5>${titulo}</h5>              
            </div>
            <div class="modal-body">
                <p id="inputDescripcion">${mensaje}</p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="document.getElementById('modalCorreoRespuesta').remove();">Cerrar</button>
            </div>
        </div>
    `;
  document.body.appendChild(modal);
}

/*document.getElementById("sendEmailButton").addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value;
  
    if (!email) {
      alert("Por favor, ingresa un correo válido.");
      return;
    }
  
    // Obtener los datos filtrados
    const data = JSON.parse(localStorage.getItem("tableData") || "[]").filter(row => {
      return (
        (currentFilters.fecha === "" || row.fecha === currentFilters.fecha) &&
        (currentFilters.placa === "" || row.placa === currentFilters.placa) &&
        (currentFilters.estado === "" || row.estado === currentFilters.estado) &&
        (currentFilters.empresa === "" || row.empresa === currentFilters.empresa)
      );
    });
  
    if (data.length === 0) {
      alert("No hay datos para enviar.");
      return;
    }
  
    // Formatear los datos en application/x-www-form-urlencoded
    const formattedData = data.map(row => {
      return [
        row.fecha || "",
        row.placa || "",
        row.cantidad || "",
        row.descripcion || "",
        row.precio || "",
        row.total || "",    
        row.empresa || "",
        row.estado || ""
      ].join(","); // Unir columnas con coma
    }).join("|"); // Unir filas con barra vertical
  
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("data", formattedData); // Los datos se codifican como texto
  
    // Enviar los datos al GAS
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyftsnFdrdhkbeGOKLx4x2_SjBXUtDZfyox1xCtWe1fEvUE_hThepcB3oHnb-k2L-IyVw/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString(), // Convertir a formato form-urlencoded
      });
  
      const result = await response.text();
      if (response.ok) {
        alert("Correo enviado con éxito: " + result); // Mensaje de éxito desde el servidor
      } else {
        alert("Error al enviar el correo: " + result);
      }
    } catch (error) {
      alert("Hubo un problema al enviar los datos: " + error.message);
    }
  });*/
