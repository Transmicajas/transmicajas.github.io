document.addEventListener("DOMContentLoaded", function () {
  cargarDatos(); // Cargar datos almacenados al iniciar la página

  const precioInput = document.getElementById("precio");
  const cantidadInput = document.getElementById("cantidad");
  const totalInput = document.getElementById("total");

  precioInput.addEventListener("input", calcularTotal);
  cantidadInput.addEventListener("input", calcularTotal);

  function calcularTotal() {
    let precio = parseFloat(precioInput.value) || 0;
    let cantidad = parseFloat(cantidadInput.value) || 0;
    let total = precio * cantidad;
    totalInput.value = total.toFixed(2);
  }
});

function guardarRegistro() {
  let placa = document.getElementById("placa").value.trim();
  let cantidad = document.getElementById("cantidad").value.trim();
  let descripcion = document.getElementById("descripcion").value.trim();
  let ubicacion = document.getElementById("ubicacion").value.trim();
  let precio = parseFloat(document.getElementById("precio").value) || 0;
  let estado = document.getElementById("estado").value;
  let Empresa = document.getElementById("Empresa").value;
  let cantidaddt = parseInt(document.getElementById("cantidaddt").value) || 1;

  if (!placa || !cantidad || !descripcion || precio <= 0) {
    alert("Por favor, complete todos los campos correctamente.");
    return;
  }

  if (cantidaddt > 100) {
    alert("La cantidad máxima es 100.");
    return;
  }

  let tablaBody = document.getElementById("tabla-body");

  for (let i = 0; i < cantidaddt; i++) {
    let total = precio * cantidad;
    total = isNaN(total) ? 0 : total;

    let nuevaFila = `
            <tr>
                <td>${placa}</td>
                <td>${cantidad}</td>
                <td>${descripcion} </td>
                td>${ubicacion}</td>
                <td>${precio.toFixed(2)}</td>
                <td>${estado}</td>
                <td>${Empresa}</td>
                <td>${total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarRegistro(this)">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarRegistro(this)">Eliminar</button>
                </td>
            </tr>
        `;
    tablaBody.innerHTML += nuevaFila;
  }

  guardarDatos();
  limpiarFormulario();
  let modal = bootstrap.Modal.getInstance(document.getElementById("modal"));
  modal.hide();
}

function limpiarFormulario() {
  document.getElementById("modal-form").reset();
  document.getElementById("cantidaddt").value = 1;
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
      placa: celdas[0].textContent,
      cantidad: celdas[1].textContent,
      descripcion: celdas[2].textContent,
      ubicacion: celdas[3].textContent,
      precio: celdas[4].textContent,
      estado: celdas[5].textContent,
      Empresa: celdas[6].textContent,
      total: celdas[7].textContent,
    });
  });
  localStorage.setItem("datosTabla", JSON.stringify(datos));
}

function cargarDatos() {
  let datos = JSON.parse(localStorage.getItem("datosTabla")) || [];
  let tablaBody = document.getElementById("tabla-body");
  tablaBody.innerHTML = "";

  datos.forEach((registro) => {
    tablaBody.innerHTML += `
            <tr>
                <td>${registro.placa}</td>
                <td>${registro.cantidad}</td>
                <td>${registro.descripcion}</td>
                <td>${registro.ubicacion}</td>
                <td>${registro.precio}</td>
                <td>${registro.estado}</td>
                <td>${registro.Empresa}</td>
                <td>${registro.total}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarRegistro(this)">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarRegistro(this)">Eliminar</button>
                </td>
            </tr>
        `;
  });
}

function editarRegistro(boton) {
  let fila = boton.closest("tr");
  let celdas = fila.getElementsByTagName("td");

  function limpiarNumero(valor) {
    return parseFloat(valor.replace(/,/g, "").trim()) || 0;
  }

  document.getElementById("placa").value = celdas[0].textContent;
  document.getElementById("cantidad").value = limpiarNumero(
    celdas[1].textContent
  );
  document.getElementById("descripcion").value = celdas[2].textContent;
  document.getElementById("precio").value = limpiarNumero(
    celdas[3].textContent
  );
  document.getElementById("estado").value = celdas[4].textContent;
  document.getElementById("Empresa").value = celdas[5].textContent;
  document.getElementById("total").value = limpiarNumero(celdas[6].textContent);

  fila.remove();
  let modal = new bootstrap.Modal(document.getElementById("modal"));
  modal.show();
}

function obtenerTablaHTML() {
  let filas = document.querySelectorAll("#tabla-body tr");
  let tablaHTML =
    '<table border="1" style="border-collapse: collapse; width: 100%;">';

  // Encabezados
  tablaHTML += `<tr>
                    <th>Placa</th>
                    <th>Cantidad</th>
                    <th>Descripción</th>
                    <th>Ubicacion</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Empresa</th>
                    <th>Total</th>
                  </tr>`;

  // Filas de datos
  filas.forEach((fila) => {
    let celdas = fila.querySelectorAll("td");
    if (celdas.length > 6) {
      // Evita incluir la columna de botones
      tablaHTML += `<tr>
                            <td style="padding: 5px;">${celdas[0].textContent}</td>
                            <td style="padding: 5px;">${celdas[1].textContent}</td>
                            <td style="padding: 5px;">${celdas[2].textContent}</td>
                            <td style="padding: 5px;">${celdas[3].textContent}</td>
                            <td style="padding: 5px;">${celdas[4].textContent}</td>
                            <td style="padding: 5px;">${celdas[5].textContent}</td>
                            <td style="padding: 5px;">${celdas[6].textContent}</td>
                            <td style="padding: 5px;">${celdas[7].textContent}</td>
                          </tr>`;
    }
  });
  tablaHTML += "</table>";
  return tablaHTML;
}

function enviarCorreo() {
  let tablaHTML = obtenerTablaHTML();

  emailjs
    .send(
      "service_isxerem",
      "template_fy80ibh",
      {
        to_name: "Carlos Florian",
        from_name: "Transmicajas",
        message: tablaHTML,
      },
      "QbOQvaMnW1IMV30XA"
    )
    .then((response) => {
      console.log("Correo enviado con éxito", response);
      alert("Correo enviado correctamente");
    })
    .catch((error) => {
      console.error("Error al enviar el correo:", error);
      alert("Hubo un error al enviar el correo");
    });
}

let doc;

document.addEventListener("click", function (event) {
  if (
    event.target.matches("#generarPDF") ||
    event.target.matches("#generarPDFModal")
  ) {
    const { jsPDF } = window.jspdf;
    doc = new jsPDF(); // Se asigna a la variable global

    // Estilos y configuración
    const img = new Image();
    img.src = "https://efimant.com/images/logo.png"; // Reemplaza con tu logo
    doc.addImage(img, "PNG", 15, 15, 60, 20); // Ajusta el tamaño y la posición*/

    // Nombre del documento
    doc.setFontSize(28);
    doc.setTextColor(54, 95, 145); // Color azul oscuro
    doc.text("Recibo de ventas", 155, 30, { align: "center" });

    // Línea separadora
    doc.setDrawColor(54, 95, 145);
    doc.line(15, 37, 195, 37);

    // Datos de la empresa
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("EFIMANT Ingenieria", 15, 45);
    doc.setFont("helvetica", "italic");
    doc.text("Tu aliado para el mantenimiento electrico", 15, 50);

    // Fecha y número de factura alineados a la derecha
    doc.setFont("helvetica", "bold");
    doc.setTextColor(54, 95, 145);
    doc.text("Fecha:", 140, 45);
    doc.setTextColor(0, 0, 0);
    doc.text("5 de febrero de 2025", 155, 45);

    doc.setTextColor(54, 95, 145);
    doc.text("N.º de factura:", 140, 50);
    doc.setTextColor(0, 0, 0);
    doc.text("_____", 165, 50);

    // Información del cliente
    doc.setFont("helvetica", "bold");
    doc.text("Vendido a:", 15, 60);
    doc.setFont("helvetica", "normal");
    doc.text("Nombre: ___________________________________", 15, 65);
    doc.text("Empresa: __________________________________", 15, 70);
    doc.text("Dirección: __________________________________", 15, 75);
    doc.text("Ciudad y código postal: _______________________", 110, 65);
    doc.text("Teléfono: __________________________________", 110, 70);

    // Tabla de productos
    let startY = 85;
    doc.autoTable({
      startY: startY,
      head: [
        ["Placa", "Cantidad", "Descripción", "Precio", "Estado", "Empresa"],
      ],
      body: obtenerDatosDeTabla(),
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        fillColor: [255, 255, 255], // Color de fondo blanco
        textColor: [0, 0, 0], // Color de texto negro
        lineColor: [63, 166, 184], // Color de líneas negro
        lineWidth: 0.5, // Ancho de líneas
      },
      headStyles: {
        textalign: "center",
        fillColor: [176, 220, 228], // Color de  encabezado
        textColor: [0, 0, 0], // Color de texto negro para encabezado
      },
    });

    // Totales
    let finalY = doc.lastAutoTable.finalY + 10;
    let pageWidth = doc.internal.pageSize.width; // Obtiene el ancho de la página
    let rightAlignX = pageWidth - 15; // Ajusta la posición al margen derecho

    const sumaTotal = calcularSumaTotal(); // Calcular la suma total
    const sumaTotalFormateada = sumaTotal.toFixed(2);

    doc.text("Total:", rightAlignX - 42, finalY);
    doc.text(`${sumaTotalFormateada}`, rightAlignX, finalY, { align: "right" });

    // Pie de página
    doc.setFontSize(10);
    doc.text("Gracias por su confianza.", 105, finalY + 40, {
      align: "center",
    });
    doc.text(
      "Duitama, Boyaca, Colombia,  318 814 8937, efimant.oficial@gmail.com",
      105,
      finalY + 45,
      { align: "center" }
    );

    // Guardar el PDF
    doc.save("factura.pdf");

    // Convertir PDF a Blob y mostrarlo en un iframe
    let pdfData = doc.output("blob");
    let pdfURL = URL.createObjectURL(pdfData);
    let pdfFrame = document.getElementById("pdf-preview");
    if (pdfFrame) {
      pdfFrame.src = pdfURL;
    } else {
      console.warn("No se encontró el iframe con id 'pdf-preview'");
    }
  }
});
// Función para extraer datos específicos de la tabla
function obtenerDatosDeTabla() {
  let datos = [];
  document.querySelectorAll("#tabla-body tr").forEach((row) => {
    let celdas = row.querySelectorAll("td");
    let rowData = [
      celdas[0]?.innerText || "", // Placa
      celdas[1]?.innerText || "", // Cantidad
      celdas[2]?.innerText || "", // Descripción
      celdas[3]?.innerText || "", // Precio
      celdas[4]?.innerText || "", // Estado
      celdas[5]?.innerText || "", // Empresa
      celdas[6]?.innerText || "", // Total
    ];
    datos.push(rowData);
  });
  return datos;
}

function calcularSumaTotal() {
  let sumaTotal = 0;
  const filas = document.querySelectorAll("#tabla-body tr");

  filas.forEach((row) => {
    const celdas = row.querySelectorAll("td");
    const totalFila = parseFloat(celdas[6]?.innerText || 0); // Obtener el total de la fila
    sumaTotal += totalFila;
  });
  return sumaTotal;
}

// Función para enviar el PDF por WhatsApp
function enviarPorWhatsApp() {
  if (!doc) {
    var myModal = new bootstrap.Modal(document.getElementById("whatsappModal"));
    myModal.show();
    return;
  }

  let pdfBlob = doc.output("blob");
  let formData = new FormData();
  formData.append("file", pdfBlob, "factura.pdf");

  fetch("https://store1.gofile.io/uploadFile", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        let fileURL = data.data.downloadPage;
        const numero = "573188147937";
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
  localStorage.removeItem("datosTabla"); // Borra los datos guardados en el cache
}
