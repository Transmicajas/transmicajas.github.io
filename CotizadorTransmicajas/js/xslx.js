/*---------------------------------------------------CREAR XLSX ---------------------------------------------*/

document.addEventListener("click", function (event) {
  if (
    event.target.matches("#descargarExcel") ||
    event.target.matches("#descargarExcelModal")
  ) {
    let tabla = document.getElementById("tabla-body");
    let filas = tabla.getElementsByTagName("tr");
    let datos = [];

    // Agregar encabezados
    let encabezados = [
      "Placa",
      "Cantidad",
      "Descripción",
      "Precio",
      "Precio Venta",
      "Estado",
      "Empresa",
    ];
    datos.push(encabezados);

    // Recorrer las filas de la tabla
    for (let fila of filas) {
      let celdas = fila.getElementsByTagName("td");
      let filaData = [];
      for (let celda of celdas) {
        filaData.push(celda.textContent.trim());
      }
      datos.push(filaData);
    }

    // Crear un libro de trabajo y una hoja
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(datos);

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Registros");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, "datos_tabla.xlsx");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const descargarExcelBtn = document.getElementById("descargarExcel");

  if (!descargarExcelBtn) {
    console.error("El botón 'descargarExcel' no se encontró en el DOM.");
    return;
  }

  descargarExcelBtn.addEventListener("click", function () {
    const data = JSON.parse(localStorage.getItem("tableData") || "[]");

    if (data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const filteredData = data.map((row) => ({
      Fecha: row.fecha,
      Placa: row.placa,
      Cantidad: row.cantidad,
      Descripción: row.descripcion,
      Precio: row.precio,
      Preciov: row.Preciov,
      Empresa: row.empresa,
      Estado: row.estado,
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Filtrados");

    XLSX.writeFile(workbook, "datos_filtrados.xlsx");
  });
});
