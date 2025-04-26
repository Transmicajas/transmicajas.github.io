document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("whatsappRapido");
  const openBtn = document.getElementById("addWatRapido");
  const closeBtn = document.querySelector(".closeW3");
  const sendToMeBtn = document.getElementById("sendToMe");
  const sendToClientBtn = document.getElementById("sendToClient");
  const clientInput = document.getElementById("clientNumber");
  const selectedProductsTable = document.getElementById("selectedProducts");

  // Variable para almacenar los datos del último cliente
  let ultimoCliente = null;

  // Función para obtener el último cliente de las cotizaciones
  async function obtenerUltimoCliente() {
    try {
      const API_BASE_URL =
        "https://script.google.com/macros/s/AKfycbz14jtQ97kiKBiEW0tIeIczMLaEjIpIKoBYJKTy5ITNJ95LWCJDdS0YAUJO3pVAC92LLQ/exec";
      const response = await fetch(API_BASE_URL);

      if (!response.ok) throw new Error("Error al cargar clientes");

      const data = await response.json();
      if (data && data.length > 0) {
        // Ordenar por fecha descendente y tomar el más reciente
        const ultimaCotizacion = data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        )[0];

        ultimoCliente = {
          nombre: ultimaCotizacion.nombreCliente,
          celular: ultimaCotizacion.celularCliente,
          cedula: ultimaCotizacion.cedulaCliente,
          direccion: ultimaCotizacion.direccionCliente,
          numeroCotizacion: ultimaCotizacion.cuenta,
        };
      }
    } catch (error) {
      console.error("Error al obtener último cliente:", error);
      // Si hay error, simplemente no mostramos la info del cliente
      ultimoCliente = null;
    }
  }

  // Llamar a la función al cargar la página
  obtenerUltimoCliente();

  // Mostrar el modal
  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Cerrar el modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar el modal si se hace clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Función para generar el mensaje de WhatsApp con los datos de la tabla
  function generarMensaje() {
    let mensaje = "🧾 *COTIZACIÓN DE PRODUCTOS* 🧾\n\n";

    // Añadir información del cliente si está disponible
    if (ultimoCliente) {
      mensaje += "════════ INFORMACIÓN DEL CLIENTE ════════\n\n";
      mensaje += `👤 *Nombre:* ${ultimoCliente.nombre}\n`;
      mensaje += `📱 *Celular:* ${ultimoCliente.celular}\n`;
      mensaje += `🆔 *Cédula/NIT:* ${ultimoCliente.cedula}\n`;
      mensaje += `🏠 *Dirección:* ${ultimoCliente.direccion}\n`;
      mensaje += `📋 *Cotización #:* ${ultimoCliente.numeroCotizacion}\n\n`;
    }

    mensaje += "══════════ PRODUCTOS COTIZADOS ══════════\n\n";

    const filas = selectedProductsTable.querySelectorAll("tr.product-row");

    filas.forEach((fila, index) => {
      const columnas = fila.querySelectorAll("td");
      if (columnas.length >= 7) {
        const numero = columnas[0].textContent.trim();
        const nombre = columnas[1]
          .querySelector(".producto-nombre")
          .textContent.trim();
        const marca = columnas[1]
          .querySelector(".producto-marca")
          .textContent.trim();
        const referencia = columnas[1]
          .querySelector(".producto-referencia")
          .textContent.trim();
        const ubicacion = columnas[1]
          .querySelector(".producto-ubicacion")
          .textContent.trim();
        const precioVenta = columnas[3].textContent.trim();
        const cantidad = columnas[4].querySelector("input").value;
        const subtotal = columnas[5].textContent.trim();

        mensaje += `📌 *Producto ${numero}:* ${nombre}\n`;
        mensaje += `🔹 Marca: ${marca}\n`;
        mensaje += `🔹 Referencia: ${referencia}\n`;
        mensaje += `🔹 Ubicación: ${ubicacion}\n`;
        mensaje += `🔹 Precio unitario: ${precioVenta}\n`;
        mensaje += `🔹 Cantidad: ${cantidad || "1"}\n`;
        mensaje += `🔹 Subtotal: ${subtotal}\n\n`;
        mensaje += "────────────────────────────\n\n";
      }
    });

    const total = document.getElementById("totalCotizacion").textContent.trim();
    mensaje += "════════════════════════════\n";
    mensaje += `💰 *TOTAL A COTIZAR: ${total}*`;

    return encodeURIComponent(mensaje);
  }

  // Enviar a número fijo
  sendToMeBtn.addEventListener("click", () => {
    const mensaje = generarMensaje();
    const numero = "573213160824";
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
  });

  // Enviar al número del cliente
  sendToClientBtn.addEventListener("click", () => {
    const numeroCliente = clientInput.value.trim();
    if (!numeroCliente || !/^\d{10}$/.test(numeroCliente)) {
      alert("Por favor ingresa un número de celular válido (10 dígitos).");
      return;
    }
    const mensaje = generarMensaje();
    const numero = "57" + numeroCliente;
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
  });
});

/*
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("whatsappRapido");
  const openBtn = document.getElementById("addWatRapido");
  const closeBtn = document.querySelector(".closeW3");
  const sendToMeBtn = document.getElementById("sendToMe");
  const sendToClientBtn = document.getElementById("sendToClient");
  const clientInput = document.getElementById("clientNumber");
  const selectedProductsTable = document.getElementById("selectedProducts");

  // Mostrar el modal
  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Cerrar el modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar el modal si se hace clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Función para generar el mensaje de WhatsApp con los datos de la tabla
  function generarMensaje() {
    let mensaje = "🧾 *COTIZACIÓN DE PRODUCTOS* 🧾\n\n";
    mensaje += "════════════════════════════\n\n";

    const filas = selectedProductsTable.querySelectorAll("tr.product-row");

    filas.forEach((fila, index) => {
      const columnas = fila.querySelectorAll("td");
      if (columnas.length >= 7) {
        // Ajustado a 7 columnas según tu estructura
        const numero = columnas[0].textContent.trim();
        const nombre = columnas[1]
          .querySelector(".producto-nombre")
          .textContent.trim();
        const marca = columnas[1]
          .querySelector(".producto-marca")
          .textContent.trim();
        const referencia = columnas[1]
          .querySelector(".producto-referencia")
          .textContent.trim();
        const ubicacion = columnas[1]
          .querySelector(".producto-ubicacion")
          .textContent.trim();
        const precioVenta = columnas[3].textContent.trim();
        const cantidad = columnas[4].querySelector("input").value;
        const subtotal = columnas[5].textContent.trim();

        mensaje += `📌 *Producto ${numero}:* ${nombre}\n`;
        mensaje += `🔹 Marca: ${marca}\n`;
        mensaje += `🔹 Referencia: ${referencia}\n`;
        mensaje += `🔹 Ubicación: ${ubicacion}\n`;
        mensaje += `🔹 Precio unitario: ${precioVenta}\n`;
        mensaje += `🔹 Cantidad: ${cantidad || "1"}\n`;
        mensaje += `🔹 Subtotal: ${subtotal}\n\n`;
        mensaje += "────────────────────────────\n\n";
      }
    });

    const total = document.getElementById("totalCotizacion").textContent.trim();
    mensaje += "════════════════════════════\n";
    mensaje += `💰 *TOTAL DE LA COTIZACION: ${total}*`;

    return encodeURIComponent(mensaje);
  }

  // Enviar a número fijo
  sendToMeBtn.addEventListener("click", () => {
    const mensaje = generarMensaje();
    const numero = "573115186410";
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
  });

  // Enviar al número del cliente
  sendToClientBtn.addEventListener("click", () => {
    const numeroCliente = clientInput.value.trim();
    if (!numeroCliente || !/^\d{10}$/.test(numeroCliente)) {
      alert("Por favor ingresa un número de celular válido (10 dígitos).");
      return;
    }
    const mensaje = generarMensaje();
    const numero = "57" + numeroCliente;
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
  });
});*/
