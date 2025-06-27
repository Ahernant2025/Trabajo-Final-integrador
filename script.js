// --- Importaciones de las funciones del profesor ---
import { validarSecreto } from 'https://desarrollo-aplicaciones.vercel.app/2024/code/validar-secreto.js';
import { calcularProximoFeriado } from 'https://desarrollo-aplicaciones.vercel.app/2024/code/calcular-proximo-feriado.js';

// --- 1. Constantes y elementos del DOM ---
const loginForm = document.getElementById('login-form');
const dniInput = document.getElementById('dni');
const palabraSecretaInput = document.getElementById('palabra-secreta');
const loginMessage = document.getElementById('login-message');
const loginSection = document.getElementById('login-section');
const feriadoSection = document.getElementById('feriado-section');
const feriadoInfo = document.getElementById('feriado-info');
const logoutButton = document.getElementById('logout-button');

// --- 2. Función de Autenticación ---
async function handleLogin(event) {
    event.preventDefault();
    const dniValue = dniInput.value;
    const secretoValue = palabraSecretaInput.value;
    loginMessage.textContent = 'Validando...';

    try {
        const esValido = await validarSecreto(dniValue, secretoValue);
        if (esValido) {
            loginSection.style.display = 'none';
            feriadoSection.style.display = 'block';
            loginMessage.textContent = '';
            fetchAndDisplayFeriado();
        } else {
            throw new Error('DNI o Palabra Secreta incorrectos.');
        }
    } catch (error) {
        loginMessage.textContent = error.message;
        palabraSecretaInput.value = '';
    }
}

// --- 3. Función para Cerrar Sesión ---
function handleLogout() {
    feriadoSection.style.display = 'none';
    loginSection.style.display = 'block';
    dniInput.value = '';
    palabraSecretaInput.value = '';
    loginMessage.textContent = '';
}

// --- 4. Función para Obtener y Mostrar Feriado ---
async function fetchAndDisplayFeriado() {
    const API_URL = 'https://api.argentinadatos.com/v1/feriados/';
    feriadoInfo.innerHTML = '<h2>Próximo Feriado</h2><p>Cargando...</p>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error de red: ${response.status}`);

        const feriados = await response.json();
        const proximoFeriado = calcularProximoFeriado(feriados);

        if (proximoFeriado) {
            const [year, month, day] = proximoFeriado.fecha.split('-');
            const fechaFormateada = `${day}/${month}/${year}`;

            // CORRECCIÓN FINAL: Usamos .nombre que es el campo correcto de la API
            feriadoInfo.innerHTML = `
                <h2>Próximo Feriado en Argentina</h2>
                <p><strong>Motivo:</strong> ${proximoFeriado.nombre}</p> 
                <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                <p><strong>Tipo:</strong> ${proximoFeriado.tipo}</p>
            `;
        } else {
            throw new Error('No se pudo determinar el próximo feriado.');
        }
    } catch (error) {
        console.error('Error al procesar feriados:', error);
        feriadoInfo.innerHTML = '<h2>Error</h2><p>No se pudo cargar la información del feriado.</p>';
    }
}

// --- 5. Event Listeners ---
loginForm.addEventListener('submit', handleLogin);
logoutButton.addEventListener('click', handleLogout);
