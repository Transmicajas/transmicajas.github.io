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
  descripcion: "", // Nuevo filtro
};

// Restablecer filtros
document.getElementById("btnSinFiltro").addEventListener("click", () => {
  currentFilters = {
    fecha: "",
    placa: "",
    estado: "",
    empresa: "",
    descripcion: "", // Nuevo filtro
  };
  document.getElementById("filterFecha").value = "";
  document.getElementById("filterPlaca").value = "";
  document.getElementById("filterEstado").value = "";
  document.getElementById("filterEmpresa").value = "";
  document.getElementById("filterDescripcion").value = ""; // Nuevo input
  applyFilters();
});

// Aplicar filtro de fecha
document.getElementById("filterFecha").addEventListener("change", function () {
  currentFilters.fecha = this.value;
  applyFilters();
});

// Aplicar filtro de estado
document.getElementById("filterEstado").addEventListener("change", function () {
  currentFilters.estado = this.value;
  applyFilters();
});

// Aplicar filtro de placa (modificado para búsqueda parcial)
document.getElementById("filterPlaca").addEventListener("input", function () {
  currentFilters.placa = this.value.toLowerCase(); // Convertir a minúsculas para búsqueda case-insensitive
  applyFilters();
});
document
  .getElementById("filterEmpresa")
  .addEventListener("change", function () {
    currentFilters.empresa = this.value.toLowerCase();
    applyFilters();
  });

// Aplicar filtro de descripción (búsqueda parcial)
document
  .getElementById("filterDescripcion")
  .addEventListener("input", function () {
    currentFilters.descripcion = this.value.toLowerCase();
    applyFilters();
  });

// Función para aplicar los filtros (modificada)
function applyFilters() {
  const data = JSON.parse(localStorage.getItem("tableData") || "[]");

  const filteredData = data.filter((row) => {
    return (
      (currentFilters.fecha === "" || row.fecha === currentFilters.fecha) &&
      (currentFilters.placa === "" ||
        String(row.placa || "")
          .toLowerCase()
          .includes(currentFilters.placa)) &&
      (currentFilters.estado === "" || row.estado === currentFilters.estado) &&
      (currentFilters.empresa === "" ||
        String(row.empresa || "")
          .toLowerCase()
          .includes(currentFilters.empresa)) &&
      (currentFilters.descripcion === "" ||
        String(row.descripcion || "")
          .toLowerCase()
          .includes(currentFilters.descripcion))
    );
  });

  renderTable(filteredData);
}

let filterTimeout;

function setupDebouncedFilter(elementId, filterProperty) {
  document.getElementById(elementId).addEventListener("input", function () {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      currentFilters[filterProperty] = this.value.toLowerCase();
      applyFilters();
    }, 300);
  });
}

// Configura los filtros con debounce
setupDebouncedFilter("filterPlaca", "placa");
setupDebouncedFilter("filterDescripcion", "descripcion");

currentFilters.descripcion === "" ||
  (row.descripcion &&
    typeof row.descripcion === "string" &&
    row.descripcion.toLowerCase().includes(currentFilters.descripcion));

/*----------------------------------------LOGIN------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.querySelector(".password-toggle");
  const messageElement = document.getElementById("message");
  const loginButton = document.querySelector(".login-button");

  // Toggle para mostrar/ocultar contraseña
  passwordToggle.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Cambiar el icono
    if (type === "text") {
      passwordToggle.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
              `;
    } else {
      passwordToggle.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                  </svg>
              `;
    }
  });

  // Validación en tiempo real
  usernameInput.addEventListener("input", validateUsername);
  passwordInput.addEventListener("input", validatePassword);

  function validateUsername() {
    const username = usernameInput.value.trim();
    const errorElement = document.getElementById("username-error");

    if (username.length < 4) {
      showError(
        usernameInput,
        errorElement,
        "El usuario debe tener al menos 4 caracteres"
      );
      return false;
    } else {
      clearError(usernameInput, errorElement);
      return true;
    }
  }

  function validatePassword() {
    const password = passwordInput.value.trim();
    const errorElement = document.getElementById("password-error");

    if (password.length < 4) {
      showError(
        passwordInput,
        errorElement,
        "La contraseña debe tener al menos 4 caracteres"
      );
      return false;
    } else {
      clearError(passwordInput, errorElement);
      return true;
    }
  }

  function showError(input, errorElement, message) {
    input.classList.add("invalid");
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }

  function clearError(input, errorElement) {
    input.classList.remove("invalid");
    errorElement.textContent = "";
    errorElement.classList.remove("show");
  }

  // Envío del formulario
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (isUsernameValid && isPasswordValid) {
      // Intentar entrar en modo pantalla completa
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } catch (err) {
        console.warn("No se pudo activar pantalla completa:", err);
      }

      loginButton.classList.add("loading");

      setTimeout(function () {
        loginButton.classList.remove("loading");

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === "admin" && password === "123456") {
          showMessage("success", "Inicio de sesión exitoso!");
          // Aquí podrías redirigir a otra página:
          // window.location.href = "dashboard.html";
        } else {
          showMessage("error", "Usuario o contraseña incorrectos");
        }
      }, 1500);
    }
  });

  function showMessage(type, message) {
    messageElement.textContent = message;
    messageElement.className = "login-message show " + type;

    // Ocultar mensaje después de 5 segundos
    setTimeout(function () {
      messageElement.classList.remove("show");
    }, 5000);
  }
});

/*Modo Pantalla completa*/
const fullscreenButton = document.getElementById("fullscreen-button");

fullscreenButton.addEventListener("click", function () {
  if (!document.fullscreenElement) {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
});

// Cambiar el ícono cuando cambia el estado de pantalla completa
document.addEventListener("fullscreenchange", function () {
  if (document.fullscreenElement) {
    fullscreenButton.textContent = "🔲";
    fullscreenButton.title = "Salir de pantalla completa";
  } else {
    fullscreenButton.textContent = "🔳";
    fullscreenButton.title = "Pantalla completa";
  }
});
