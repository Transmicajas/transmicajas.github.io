/*Codigo para el FOOTER*/

const facturasBtn = document.getElementById("facturas-btn");
const clientesBtn = document.getElementById("clientes-btn");
const empresasBtn = document.getElementById("empresas-btn");

const contenidoFacturas = document.getElementById("contenido-facturas");
const contenidoClientes = document.getElementById("contenido-clientes");
const contenidoEmpresas = document.getElementById("contenido-empresas");

facturasBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Evita que el enlace recargue la página
  mostrarContenido(contenidoFacturas, facturasBtn);
});

clientesBtn.addEventListener("click", (event) => {
  event.preventDefault();
  mostrarContenido(contenidoClientes, clientesBtn);
});

empresasBtn.addEventListener("click", (event) => {
  event.preventDefault();
  mostrarContenido(contenidoEmpresas, empresasBtn);
});

function mostrarContenido(contenido, botonActivo) {
  // Oculta todos los contenidos
  contenidoFacturas.style.display = "none";
  contenidoClientes.style.display = "none";
  contenidoEmpresas.style.display = "none";

  // Muestra el contenido correspondiente
  contenido.style.display = "block";

  // Quita la clase "active" de todos los botones
  facturasBtn.classList.remove("active");
  clientesBtn.classList.remove("active");
  empresasBtn.classList.remove("active");

  // Agrega la clase "active" al botón correspondiente
  botonActivo.classList.add("active");
}

/*CODIGO PARA LOS FILTROS */

document.addEventListener("DOMContentLoaded", () => {
  const filterToggleBtn = document.getElementById("filterToggleBtn");
  const filterContainer = document.getElementById("filterContainer");

  // Mostrar/ocultar los filtros al hacer clic en el botón
  filterToggleBtn.addEventListener("click", () => {
    filterContainer.classList.toggle("active");
  });
});

let currentFilters = {
  fecha: "",
  placa: "",
  estado: "",
  empresa: "",
};

// Restablecer filtros
document.getElementById("btnSinFiltro").addEventListener("click", () => {
  currentFilters = { fecha: "", placa: "", estado: "", empresa: "" };
  document.getElementById("filterFecha").value = "";
  document.getElementById("filterPlaca").value = "";
  document.getElementById("filterEstado").value = "";
  document.getElementById("filterEmpresa").value = "";
  applyFilters(); // Vuelve a renderizar la tabla sin filtros
});

// Aplicar filtro de fecha
document.getElementById("filterFecha").addEventListener("change", function () {
  currentFilters.fecha = this.value;
  applyFilters();
});

// Aplicar filtro de placa
document.getElementById("filterPlaca").addEventListener("change", function () {
  currentFilters.placa = this.value;
  applyFilters();
});

// Aplicar filtro de estado
document.getElementById("filterEstado").addEventListener("change", function () {
  currentFilters.estado = this.value;
  applyFilters();
});

// Aplicar filtro de empresa
document
  .getElementById("filterEmpresa")
  .addEventListener("change", function () {
    currentFilters.empresa = this.value;
    applyFilters();
  });

// Función para aplicar los filtros
function applyFilters() {
  const data = JSON.parse(localStorage.getItem("tableData") || "[]");
  const filteredData = data.filter((row) => {
    return (
      (currentFilters.fecha === "" || row.fecha === currentFilters.fecha) &&
      (currentFilters.placa === "" || row.placa === currentFilters.placa) &&
      (currentFilters.estado === "" || row.estado === currentFilters.estado) &&
      (currentFilters.empresa === "" || row.empresa === currentFilters.empresa)
    );
  });
  renderTable(filteredData);
}
