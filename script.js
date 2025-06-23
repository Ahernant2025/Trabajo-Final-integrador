// --- 1. Constantes y elementos del DOM ---
// Aquí guardamos referencias a los elementos HTML con los que vamos a interactuar
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('login-message');
const loginSection = document.getElementById('login-section');
const feriadoSection = document.getElementById('feriado-section');
const feriadoNombre = document.getElementById('feriado-nombre');
const feriadoFecha = document.getElementById('feriado-fecha');
const feriadoTipo = document.getElementById('feriado-tipo');
const logoutButton = document.getElementById('logout-button');

// Define tu contraseña secreta aquí. Puedes cambiarla si quieres.
// Ojo: Para tu trabajo final, podrías necesitar integrar la función validarSecreto() del profesor
// Si usas la contraseña fija, la cambiarías aquí:
const CORRECT_PASSWORD = 'seguridad'; 

// --- 2. Función de Autenticación ---
function handleLogin(event) {
    // Evita que el formulario se envíe de la manera tradicional y recargue la página
    event.preventDefault(); 

    const enteredPassword = passwordInput.value; // Obtiene la contraseña ingresada por el usuario

    if (enteredPassword === CORRECT_PASSWORD) {
        // Si la contraseña es correcta, ocultamos la sección de login y mostramos la de feriado
        loginSection.style.display = 'none';
        feriadoSection.style.display = 'block';
        loginMessage.textContent = ''; // Limpiamos cualquier mensaje de error anterior
        fetchFeriado(); // Llamamos a la función para obtener los datos del feriado
    } else {
        // Si la contraseña es incorrecta, mostramos un mensaje de error
        loginMessage.textContent = 'Contraseña incorrecta. Intenta de nuevo.';
        passwordInput.value = ''; // Limpiamos el campo de la contraseña
    }
}

// --- 3. Función para Cerrar Sesión ---
function handleLogout() {
    // Oculta la sección del feriado y muestra la de login
    feriadoSection.style.display = 'none';
    loginSection.style.display = 'block';
    passwordInput.value = ''; // Limpia el campo de contraseña
    loginMessage.textContent = ''; // Limpia cualquier mensaje
    feriadoNombre.textContent = 'Cargando...'; // Restablece el mensaje de carga
    feriadoFecha.textContent = '';
    feriadoTipo.textContent = '';
}

// --- 4. Función para Obtener Datos del Feriado (desde una API) ---
async function fetchFeriado() {
    // URL de la API de feriados argentinos
    const API_URL = 'https://nolaborables.com.ar/api/v2/next?country=Argentina';
    
    try {
        const response = await fetch(API_URL); // Realiza la petición a la API
        if (!response.ok) {
            // Si la respuesta no es exitosa (ej. error 404, 500), lanzamos un error
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json(); // Convierte la respuesta a formato JSON
        
        // Verificamos si la API devolvió un feriado
        if (data && data.nombre && data.fecha && data.tipo) {
            feriadoNombre.textContent = `Nombre: ${data.nombre}`;
            feriadoFecha.textContent = `Fecha: ${data.fecha}`;
            feriadoTipo.textContent = `Tipo: ${data.tipo}`;
        } else {
            feriadoNombre.textContent = 'No se encontró información del próximo feriado.';
            feriadoFecha.textContent = '';
            feriadoTipo.textContent = '';
        }
    } catch (error) {
        // Captura cualquier error que ocurra durante la petición o el procesamiento
        console.error('Hubo un problema al obtener el feriado:', error);
        feriadoNombre.textContent = 'Error al cargar el feriado. Intenta más tarde.';
        feriadoFecha.textContent = '';
        feriadoTipo.textContent = '';
    }
}

// --- 5. Event Listeners (Escuchadores de eventos) ---
// Estos son los que "escuchan" cuándo ocurren ciertas acciones
loginForm.addEventListener('submit', handleLogin); // Cuando se envía el formulario de login
logoutButton.addEventListener('click', handleLogout); // Cuando se hace clic en el botón de cerrar sesión
