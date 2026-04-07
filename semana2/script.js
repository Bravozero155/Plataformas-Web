// ============================================================
// script.js - Validación del formulario con eventos DOM y promesas
// ============================================================

// --- Referencias a elementos del DOM ---
const formulario = document.getElementById("formulario");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputMensaje = document.getElementById("mensaje");
const btnEnviar = document.getElementById("btn-enviar");
const estadoEnvio = document.getElementById("estado-envio");

// --- Expresión regular para validar formato de correo electrónico ---
// Verifica: texto@texto.dominio (mínimo 2 caracteres en dominio)
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ============================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================

/**
 * Muestra un mensaje de error debajo del campo indicado.
 * Recibe el elemento span de error y el texto del mensaje.
 */
function mostrarError(spanError, mensaje) {
    spanError.textContent = mensaje;
    spanError.style.display = "block";
}

/**
 * Limpia el mensaje de error de un campo específico.
 */
function limpiarError(spanError) {
    spanError.textContent = "";
    spanError.style.display = "none";
}

/**
 * Valida un campo individual.
 * Retorna true si el campo es válido, false si no.
 */
function validarCampo(input, spanErrorId, mensajeVacio, validacionExtra) {
    const spanError = document.getElementById(spanErrorId);
    const valor = input.value.trim();

    // Verificar si el campo está vacío (campo obligatorio)
    if (valor === "") {
        mostrarError(spanError, mensajeVacio);
        input.classList.add("campo-error");
        return false;
    }

    // Si hay una validación adicional (como regex para correo)
    if (validacionExtra && !validacionExtra(valor)) {
        mostrarError(spanError, "Ingresa un correo electrónico válido.");
        input.classList.add("campo-error");
        return false;
    }

    // Campo válido: limpiar error y marcar como válido
    limpiarError(spanError);
    input.classList.remove("campo-error");
    input.classList.add("campo-valido");
    return true;
}

/**
 * Ejecuta la validación completa de todos los campos del formulario.
 * Retorna true solo si todos los campos son válidos.
 */
function validarFormulario() {
    // Validar cada campo individualmente
    const nombreValido = validarCampo(
        inputNombre,
        "error-nombre",
        "El nombre es obligatorio."
    );

    // Para el correo, se pasa la función de validación con RegExp
    const correoValido = validarCampo(
        inputCorreo,
        "error-correo",
        "El correo electrónico es obligatorio.",
        function (valor) {
            return regexCorreo.test(valor);
        }
    );

    const mensajeValido = validarCampo(
        inputMensaje,
        "error-mensaje",
        "El mensaje es obligatorio."
    );

    // Retorna true solo si los tres campos son válidos
    return nombreValido && correoValido && mensajeValido;
}

// ============================================================
// EVENTOS DOM
// ============================================================

// --- Evento "blur": valida cada campo cuando el usuario sale de él ---
inputNombre.addEventListener("blur", function () {
    validarCampo(inputNombre, "error-nombre", "El nombre es obligatorio.");
});

inputCorreo.addEventListener("blur", function () {
    validarCampo(
        inputCorreo,
        "error-correo",
        "El correo electrónico es obligatorio.",
        function (valor) {
            return regexCorreo.test(valor);
        }
    );
});

inputMensaje.addEventListener("blur", function () {
    validarCampo(inputMensaje, "error-mensaje", "El mensaje es obligatorio.");
});

// --- Evento "input": limpia el error mientras el usuario escribe ---
inputNombre.addEventListener("input", function () {
    if (inputNombre.value.trim() !== "") {
        limpiarError(document.getElementById("error-nombre"));
        inputNombre.classList.remove("campo-error");
    }
});

inputCorreo.addEventListener("input", function () {
    if (inputCorreo.value.trim() !== "") {
        limpiarError(document.getElementById("error-correo"));
        inputCorreo.classList.remove("campo-error");
    }
});

inputMensaje.addEventListener("input", function () {
    if (inputMensaje.value.trim() !== "") {
        limpiarError(document.getElementById("error-mensaje"));
        inputMensaje.classList.remove("campo-error");
    }
});

// ============================================================
// SIMULACIÓN DE ENVÍO CON PROMESA (Promise)
// ============================================================

/**
 * Simula el envío de datos al servidor usando una Promesa.
 * - Espera 2 segundos (simula latencia de red).
 * - Tiene un 30% de probabilidad de fallo (reject) para demostrar
 *   el manejo de errores en el envío.
 */
function enviarDatos(datos) {
    return new Promise(function (resolve, reject) {
        console.log("Enviando datos...", datos);

        // setTimeout simula la espera de 2 segundos del servidor
        setTimeout(function () {
            // Math.random() genera un número entre 0 y 1
            // Si es menor a 0.3 (30% de probabilidad), se simula un error
            if (Math.random() < 0.3) {
                reject("Error del servidor: no se pudo procesar la solicitud.");
            } else {
                resolve("Mensaje enviado correctamente.");
            }
        }, 2000);
    });
}

// ============================================================
// EVENTO SUBMIT - Orquesta validación + envío
// ============================================================

formulario.addEventListener("submit", function (evento) {
    // Prevenir el envío real del formulario (comportamiento por defecto)
    evento.preventDefault();

    // Limpiar mensaje de estado anterior
    estadoEnvio.textContent = "";
    estadoEnvio.className = "estado-envio";

    // Paso 1: Validar todos los campos
    if (!validarFormulario()) {
        // Si la validación falla, no continuar con el envío
        return;
    }

    // Paso 2: Recopilar los datos del formulario
    const datos = {
        nombre: inputNombre.value.trim(),
        correo: inputCorreo.value.trim(),
        mensaje: inputMensaje.value.trim()
    };

    // Paso 3: Deshabilitar el botón y mostrar estado de carga
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    estadoEnvio.textContent = "Procesando el envío, por favor espera...";
    estadoEnvio.className = "estado-envio estado-cargando";

    // Paso 4: Llamar a la función que retorna la Promesa
    enviarDatos(datos)
        .then(function (mensajeExito) {
            // Si la promesa se resuelve (resolve): envío exitoso
            estadoEnvio.textContent = mensajeExito;
            estadoEnvio.className = "estado-envio estado-exito";

            // Limpiar los campos del formulario tras envío exitoso
            formulario.reset();
            // Remover clases de validación visual
            [inputNombre, inputCorreo, inputMensaje].forEach(function (input) {
                input.classList.remove("campo-valido");
            });
        })
        .catch(function (mensajeError) {
            // Si la promesa es rechazada (reject): error en el envío
            estadoEnvio.textContent = mensajeError;
            estadoEnvio.className = "estado-envio estado-error";
        })
        .finally(function () {
            // Se ejecuta siempre, haya éxito o error
            // Restaurar el botón a su estado original
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar";
        });
});
