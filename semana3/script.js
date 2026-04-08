// script.js — SecureNet Agency
// Proyecto Web Ciberseguridad - CIB302
// Taller de Plataformas Web

// navbar - efecto scroll y menú responsive

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Evento scroll: agrega clase para sombra al bajar la página
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Evento click en hamburguesa: abre/cierra menú en móvil
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Cierra el menú al hacer click en cualquier enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// terminal animada - simula audit

// lineas del terminal
const termLines = [
  { cls: 't-prompt', text: '$ securenet --audit target.cl' },
  { cls: 't-out',    text: '> Iniciando reconocimiento...' },
  { cls: 't-out',    text: '> Escaneando puertos abiertos...' },
  { cls: 't-warn',   text: '! Puerto 8080 expuesto (HTTP)' },
  { cls: 't-warn',   text: '! Certificado SSL vencido (443)' },
  { cls: 't-err',    text: '✗ Vulnerabilidad crítica: SQLi en /login' },
  { cls: 't-out',    text: '> Analizando headers de seguridad...' },
  { cls: 't-err',    text: '✗ CSP no configurado' },
  { cls: 't-err',    text: '✗ X-Frame-Options ausente' },
  { cls: 't-out',    text: '> Generando informe de vulnerabilidades...' },
  { cls: 't-ok',     text: '✓ Informe generado: report_2026.pdf' },
  { cls: 't-acc',    text: '→ 3 críticas · 5 medias · 2 bajas' },
];

const terminalBody = document.getElementById('terminalBody');

// mostrar terminal con delay
function renderTerminal() {
  termLines.forEach((line, i) => {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = `t-line ${line.cls}`;
      span.textContent = line.text;
      terminalBody.appendChild(span);

      // cursor al final
      if (i === termLines.length - 1) {
        setTimeout(() => {
          const cursor = document.createElement('span');
          cursor.className = 't-cursor';
          terminalBody.appendChild(cursor);
        }, 400);
      }
    }, i * 420); // 420ms de retraso entre cada línea
  });
}

// Inicia la animación de la terminal al cargar la página
renderTerminal();

// contador de estadísticas animado

/// anima contador de 0 al target

function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16); // Incremento por frame (60fps aprox)
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

// iniciar contador al hacer scroll
const statNums = document.querySelectorAll('.stat-num');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNums.forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      observer.disconnect(); // Solo se ejecuta una vez
    }
  });
}, { threshold: 0.5 });

if (statNums.length > 0) {
  observer.observe(statNums[0].closest('.hero-stats'));
}

// quiz de seguridad
// preguntas y puntajes
const quizData = [
  {
    pregunta: "¿Con qué frecuencia actualiza los sistemas y software de su empresa?",
    opciones: [
      { texto: "Automáticamente en cuanto hay actualizaciones",    pts: 3 },
      { texto: "Manualmente, al menos una vez al mes",             pts: 2 },
      { texto: "Solo cuando hay un problema visible",              pts: 1 },
      { texto: "No existe un proceso definido de actualizaciones", pts: 0 },
    ]
  },
  {
    pregunta: "¿Cuenta con autenticación de doble factor (2FA) en sus sistemas críticos?",
    opciones: [
      { texto: "Sí, en todos los sistemas críticos",    pts: 3 },
      { texto: "Solo en algunos sistemas",              pts: 2 },
      { texto: "No, solo contraseña",                   pts: 1 },
      { texto: "No sabría decir",                       pts: 0 },
    ]
  },
  {
    pregunta: "¿Realiza backups periódicos de los datos de su empresa?",
    opciones: [
      { texto: "Sí, backups automáticos diarios en la nube",  pts: 3 },
      { texto: "Backups semanales en disco externo",          pts: 2 },
      { texto: "Ocasionalmente, sin un plan definido",        pts: 1 },
      { texto: "No realizamos backups",                       pts: 0 },
    ]
  },
  {
    pregunta: "¿El personal de su empresa ha recibido capacitación en ciberseguridad?",
    opciones: [
      { texto: "Sí, entrenamiento formal anual con simulacros",  pts: 3 },
      { texto: "Hemos dado charlas informales",                  pts: 2 },
      { texto: "Solo el equipo de TI tiene conocimiento",        pts: 1 },
      { texto: "Ninguna capacitación",                           pts: 0 },
    ]
  },
  {
    pregunta: "¿Cuenta con un plan de respuesta a incidentes de seguridad?",
    opciones: [
      { texto: "Sí, documentado y probado regularmente",         pts: 3 },
      { texto: "Existe pero no se ha probado en la práctica",    pts: 2 },
      { texto: "No hay plan formal, se improvisa",               pts: 1 },
      { texto: "No, nunca lo hemos considerado",                 pts: 0 },
    ]
  },
];

let quizIndex    = 0;   // Pregunta actual
let quizScore    = 0;   // Puntaje acumulado
let selectedOpt  = null; // Opción seleccionada en la pregunta actual

const quizContent = document.getElementById('quizContent');

// mostrar pregunta actual
function renderQuestion() {
  const q = quizData[quizIndex];
  const progress = ((quizIndex) / quizData.length) * 100;
  selectedOpt = null;

  quizContent.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-bar">
        <div class="quiz-bar-fill" style="width: ${progress}%"></div>
      </div>
      <span class="quiz-step-label">Pregunta ${quizIndex + 1} / ${quizData.length}</span>
    </div>
    <p class="quiz-question">${q.pregunta}</p>
    <div class="quiz-options" id="quizOptions"></div>
    <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
      <button class="btn-primary" id="btnNext" disabled>
        ${quizIndex < quizData.length - 1 ? 'Siguiente →' : 'Ver resultado'}
      </button>
    </div>
  `;

  // opciones con eventos
  const optionsContainer = document.getElementById('quizOptions');
  q.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = op.texto;

  // seleccionar opción
    btn.addEventListener('click', () => {
      // Remueve selección previa
      optionsContainer.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedOpt = i;
      document.getElementById('btnNext').disabled = false;
    });

    optionsContainer.appendChild(btn);
  });

  // botón siguiente
  document.getElementById('btnNext').addEventListener('click', () => {
    if (selectedOpt === null) return;
    quizScore += q.opciones[selectedOpt].pts;
    quizIndex++;
    if (quizIndex < quizData.length) {
      renderQuestion();
    } else {
      renderResult();
    }
  });
}

// mostrar resultado
function renderResult() {
  const maxScore = quizData.length * 3; // 15 puntos máximo
  const pct = Math.round((quizScore / maxScore) * 100);

 // calcular nivel
  let nivel, color, mensaje;
  if (pct >= 80) {
    nivel   = "ALTO";
    color   = "#39d353";
    mensaje = "Tu empresa tiene una postura de seguridad sólida. Recomendamos una auditoría periódica para mantener y mejorar los controles existentes.";
  } else if (pct >= 50) {
    nivel   = "MEDIO";
    color   = "#ffd700";
    mensaje = "Hay áreas de mejora importantes. Un plan de seguridad estructurado y capacitación al equipo pueden elevar significativamente tu protección.";
  } else {
    nivel   = "BAJO";
    color   = "#ff4444";
    mensaje = "Tu empresa presenta riesgos serios. Te recomendamos una consultoría urgente para establecer controles básicos de seguridad.";
  }

  quizContent.innerHTML = `
    <div class="quiz-result">
      <div class="result-score" style="color: ${color}">${pct}%</div>
      <div class="result-label" style="color: ${color}">NIVEL DE SEGURIDAD: ${nivel}</div>
      <p class="result-msg">${mensaje}</p>
      <button class="quiz-restart" id="btnRestart">Volver a intentar</button>
    </div>
  `;

   // reiniciar
  document.getElementById('btnRestart').addEventListener('click', () => {
    quizIndex = 0;
    quizScore = 0;
    renderQuestion();
  });
}

// iniciar quiz
renderQuestion();

// formulario de contacto con validación

const form         = document.getElementById('contactForm');
const inputNombre  = document.getElementById('nombre');
const inputCorreo  = document.getElementById('correo');
const inputMensaje = document.getElementById('mensaje');
const btnEnviar    = document.getElementById('btnEnviar');
const feedback     = document.getElementById('feedback');

const errorNombre  = document.getElementById('error-nombre');
const errorCorreo  = document.getElementById('error-correo');
const errorMensaje = document.getElementById('error-mensaje');

// regex para validar
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;

// validaciones
function validarNombre() {
  const v = inputNombre.value.trim();
  if (!v) return mostrarError(inputNombre, errorNombre, 'El nombre es obligatorio.'), false;
  if (!regexNombre.test(v)) return mostrarError(inputNombre, errorNombre, 'Solo letras y espacios (mínimo 2 caracteres).'), false;
  return limpiarError(inputNombre, errorNombre), true;
}

function validarCorreo() {
  const v = inputCorreo.value.trim();
  if (!v) return mostrarError(inputCorreo, errorCorreo, 'El correo es obligatorio.'), false;
  if (!regexCorreo.test(v)) return mostrarError(inputCorreo, errorCorreo, 'Formato inválido (ej: usuario@correo.com).'), false;
  return limpiarError(inputCorreo, errorCorreo), true;
}

function validarMensaje() {
  const v = inputMensaje.value.trim();
  if (!v) return mostrarError(inputMensaje, errorMensaje, 'El mensaje es obligatorio.'), false;
  if (v.length < 10) return mostrarError(inputMensaje, errorMensaje, 'Mínimo 10 caracteres.'), false;
  return limpiarError(inputMensaje, errorMensaje), true;
}

function mostrarError(campo, el, msg) { campo.classList.remove('valid'); campo.classList.add('invalid'); el.textContent = msg; }
function limpiarError(campo, el) { campo.classList.remove('invalid'); campo.classList.add('valid'); el.textContent = ''; }
function mostrarFeedback(msg, tipo) { feedback.textContent = msg; feedback.className = `feedback ${tipo}`; }

// eventos blur e input
inputNombre.addEventListener('blur', validarNombre);
inputCorreo.addEventListener('blur', validarCorreo);
inputMensaje.addEventListener('blur', validarMensaje);
inputNombre.addEventListener('input', () => { if (inputNombre.classList.contains('invalid')) validarNombre(); });
inputCorreo.addEventListener('input', () => { if (inputCorreo.classList.contains('invalid')) validarCorreo(); });
inputMensaje.addEventListener('input', () => { if (inputMensaje.classList.contains('invalid')) validarMensaje(); });

// simular envío al servidor
function simularEnvio(datos) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() < 0.3
        ? reject(new Error('Error del servidor. Intente nuevamente.'))
        : resolve(`Mensaje enviado correctamente. Nos contactaremos con ${datos.nombre} a la brevedad.`);
    }, 2000);
  });
}

// submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validarNombre() | !validarCorreo() | !validarMensaje()) {
    mostrarFeedback('Corrija los errores antes de enviar.', 'error');
    return;
  }
  const datos = { nombre: inputNombre.value.trim(), correo: inputCorreo.value.trim() };
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';
  mostrarFeedback('Procesando su mensaje...', 'loading');

  simularEnvio(datos)
    .then(msg => {
      mostrarFeedback(msg, 'success');
      form.reset();
      [inputNombre, inputCorreo, inputMensaje].forEach(c => c.classList.remove('valid','invalid'));
    })
    .catch(err => mostrarFeedback(err.message, 'error'))
    .finally(() => { btnEnviar.disabled = false; btnEnviar.textContent = 'Enviar mensaje'; });
});
