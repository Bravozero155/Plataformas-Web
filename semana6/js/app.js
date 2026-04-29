// ============================================
// SportyStyle - Tienda Virtual Deportiva
// Semana 6 - CIB302 Plataformas Web
// Autenticación con Auth0 + Session Storage
// ============================================

// =============================================
// CONFIGURACIÓN AUTH0
// =============================================
// >>> REEMPLAZA estos valores con los de tu aplicación Auth0 <<<
const AUTH0_DOMAIN = 'dev-40mvxmlu0nvedkoj.us.auth0.com';
const AUTH0_CLIENT_ID = 'ab1rFQBhEc0ApNOe3DbtNWsTccuqZiYX';
const AUTH0_REDIRECT_URI = window.location.origin + '/index.html';

let auth0Client = null;

// =============================================
// CATÁLOGO DE PRODUCTOS
// =============================================
const productos = [
    // --- Camisetas Deportivas ---
    {
        id: 'cam-001',
        nombre: 'Camiseta DryFit Pro',
        descripcion: 'Camiseta de entrenamiento con tecnología de secado rápido. Ideal para sesiones intensas de gimnasio.',
        precio: 24990,
        categoria: 'camisetas',
        imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'
    },
    {
        id: 'cam-002',
        nombre: 'Polera Running Ultra',
        descripcion: 'Polera liviana y transpirable diseñada para running de larga distancia. Costuras planas anti-roce.',
        precio: 19990,
        categoria: 'camisetas',
        imagen: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=300&fit=crop'
    },
    {
        id: 'cam-003',
        nombre: 'Tank Top CrossFit',
        descripcion: 'Musculosa holgada para entrenamientos de alta intensidad. Algodón premium con elastano.',
        precio: 15990,
        categoria: 'camisetas',
        imagen: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=300&fit=crop'
    },
    // --- Pantalones Deportivos ---
    {
        id: 'pan-001',
        nombre: 'Jogger Flex Motion',
        descripcion: 'Pantalón jogger con cintura elástica y bolsillos con cierre. Perfecto para gym y uso casual.',
        precio: 34990,
        categoria: 'pantalones',
        imagen: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=300&fit=crop'
    },
    {
        id: 'pan-002',
        nombre: 'Short Training Elite',
        descripcion: 'Short deportivo con malla interior. Tejido resistente al sudor con corte ergonómico.',
        precio: 22990,
        categoria: 'pantalones',
        imagen: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=300&fit=crop'
    },
    {
        id: 'pan-003',
        nombre: 'Calza Compresión Pro',
        descripcion: 'Calza larga de compresión para mejorar la circulación durante el ejercicio. Tecnología UV block.',
        precio: 29990,
        categoria: 'pantalones',
        imagen: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=300&fit=crop'
    },
    // --- Accesorios de Deporte ---
    {
        id: 'acc-001',
        nombre: 'Mochila Sport 40L',
        descripcion: 'Mochila deportiva con compartimento para laptop y bolsillo para botella. Resistente al agua.',
        precio: 45990,
        categoria: 'accesorios',
        imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
    },
    {
        id: 'acc-002',
        nombre: 'Botella Térmica 750ml',
        descripcion: 'Botella de acero inoxidable, mantiene bebidas frías 24h y calientes 12h. Libre de BPA.',
        precio: 18990,
        categoria: 'accesorios',
        imagen: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop'
    },
    {
        id: 'acc-003',
        nombre: 'Guantes Gym Pro',
        descripcion: 'Guantes de entrenamiento con muñequera integrada. Palma antideslizante reforzada.',
        precio: 12990,
        categoria: 'accesorios',
        imagen: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop'
    }
];

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    renderizarProductos();
    cargarCarritoDesdeSession();
    await inicializarAuth0();
});

// =============================================
// AUTH0 - AUTENTICACIÓN
// =============================================

/**
 * Inicializa el cliente Auth0 SPA SDK.
 * Verifica si hay un callback de login pendiente o una sesión activa.
 */
async function inicializarAuth0() {
    try {
        auth0Client = await auth0.createAuth0Client({
            domain: AUTH0_DOMAIN,
            clientId: AUTH0_CLIENT_ID,
            authorizationParams: {
                redirect_uri: AUTH0_REDIRECT_URI
            }
        });

        // Si volvemos de Auth0 con un código de autorización
        if (window.location.search.includes('code=') &&
            window.location.search.includes('state=')) {
            await auth0Client.handleRedirectCallback();
            // Limpiar la URL de los parámetros de Auth0
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Verificar si el usuario ya está autenticado
        await actualizarUIAuth();

    } catch (error) {
        console.error('Error al inicializar Auth0:', error);
    }
}

/**
 * Inicia el flujo de login redirigiendo a Auth0.
 */
async function iniciarSesion() {
    if (!auth0Client) {
        alert('Error: Auth0 no está inicializado. Verifica la configuración.');
        return;
    }
    await auth0Client.loginWithRedirect();
}

/**
 * Cierra la sesión del usuario.
 * Limpia Session Storage y redirige a Auth0 para logout.
 */
async function cerrarSesion() {
    // Limpiar el carrito de Session Storage
    sessionStorage.removeItem('sportystyle_carrito');
    actualizarContadorCarrito();

    // Logout de Auth0
    await auth0Client.logout({
        logoutParams: {
            returnTo: AUTH0_REDIRECT_URI
        }
    });
}

/**
 * Actualiza la interfaz según el estado de autenticación.
 * Muestra/oculta botones de login/logout y mensaje de bienvenida.
 */
async function actualizarUIAuth() {
    const isAuthenticated = await auth0Client.isAuthenticated();
    const btnLogin = document.getElementById('btn-login');
    const userInfo = document.getElementById('user-info');
    const welcomeMsg = document.getElementById('welcome-msg');

    if (isAuthenticated) {
        const user = await auth0Client.getUser();
        btnLogin.style.display = 'none';
        userInfo.style.display = 'flex';
        welcomeMsg.textContent = `Hola, ${user.name || user.email}`;
    } else {
        btnLogin.style.display = 'inline-block';
        userInfo.style.display = 'none';
    }
}

// =============================================
// RENDERIZADO DE PRODUCTOS
// =============================================

/**
 * Renderiza las tarjetas de productos en sus respectivas grids por categoría.
 */
function renderizarProductos() {
    const gridCamisetas = document.getElementById('grid-camisetas');
    const gridPantalones = document.getElementById('grid-pantalones');
    const gridAccesorios = document.getElementById('grid-accesorios');

    productos.forEach(producto => {
        const card = crearCardProducto(producto);
        if (producto.categoria === 'camisetas') {
            gridCamisetas.appendChild(card);
        } else if (producto.categoria === 'pantalones') {
            gridPantalones.appendChild(card);
        } else if (producto.categoria === 'accesorios') {
            gridAccesorios.appendChild(card);
        }
    });
}

/**
 * Crea el elemento HTML de una tarjeta de producto.
 */
function crearCardProducto(producto) {
    const card = document.createElement('div');
    card.className = 'producto-card';
    card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img"
             onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(producto.nombre)}'">
        <div class="producto-info">
            <h4 class="producto-nombre">${producto.nombre}</h4>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <p class="producto-precio">$${formatearPrecio(producto.precio)}</p>
            <button class="btn btn-add" onclick="agregarAlCarrito('${producto.id}')">
                Agregar al Carrito
            </button>
        </div>
    `;
    return card;
}

// =============================================
// CARRITO DE COMPRAS + SESSION STORAGE
// =============================================

/**
 * Obtiene el carrito actual desde Session Storage.
 * @returns {Array} Array de objetos {id, nombre, precio, cantidad}
 */
function obtenerCarrito() {
    const data = sessionStorage.getItem('sportystyle_carrito');
    return data ? JSON.parse(data) : [];
}

/**
 * Guarda el carrito en Session Storage.
 */
function guardarCarrito(carrito) {
    sessionStorage.setItem('sportystyle_carrito', JSON.stringify(carrito));
}

/**
 * Carga el carrito desde Session Storage y actualiza la UI.
 */
function cargarCarritoDesdeSession() {
    actualizarVistaCarrito();
    actualizarContadorCarrito();
}

/**
 * Agrega un producto al carrito.
 * Si ya existe, incrementa la cantidad.
 */
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    let carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === productoId);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    actualizarVistaCarrito();
    actualizarContadorCarrito();
    mostrarToast(`${producto.nombre} agregado al carrito`);
}

/**
 * Modifica la cantidad de un producto en el carrito.
 * Si la cantidad llega a 0, elimina el producto.
 */
function cambiarCantidad(productoId, delta) {
    let carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === productoId);

    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(i => i.id !== productoId);
        }
        guardarCarrito(carrito);
        actualizarVistaCarrito();
        actualizarContadorCarrito();
    }
}

/**
 * Elimina un producto del carrito.
 */
function eliminarDelCarrito(productoId) {
    let carrito = obtenerCarrito().filter(i => i.id !== productoId);
    guardarCarrito(carrito);
    actualizarVistaCarrito();
    actualizarContadorCarrito();
}

/**
 * Actualiza la vista del panel lateral del carrito.
 */
function actualizarVistaCarrito() {
    const container = document.getElementById('carrito-items');
    const totalEl = document.getElementById('carrito-total-precio');
    const btnCheckout = document.getElementById('btn-checkout');
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        container.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        totalEl.textContent = '$0';
        btnCheckout.disabled = true;
        return;
    }

    let total = 0;
    container.innerHTML = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <div class="carrito-item">
                <div class="carrito-item-info">
                    <div class="carrito-item-nombre">${item.nombre}</div>
                    <div class="carrito-item-precio">$${formatearPrecio(item.precio)} c/u</div>
                </div>
                <div class="carrito-item-cantidad">
                    <button class="btn-qty" onclick="cambiarCantidad('${item.id}', -1)">−</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-qty" onclick="cambiarCantidad('${item.id}', 1)">+</button>
                </div>
                <button class="btn-remove" onclick="eliminarDelCarrito('${item.id}')" title="Eliminar">🗑️</button>
            </div>
        `;
    }).join('');

    totalEl.textContent = `$${formatearPrecio(total)}`;
    btnCheckout.disabled = false;
}

/**
 * Actualiza el contador del carrito en el navbar.
 */
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById('cart-count').textContent = total;
}

/**
 * Abre/cierra el panel lateral del carrito.
 */
function toggleCarrito() {
    const panel = document.getElementById('carrito-panel');
    const overlay = document.getElementById('overlay');
    panel.classList.toggle('abierto');
    overlay.classList.toggle('visible');
}

// =============================================
// CHECKOUT Y PAGO
// =============================================

/**
 * Navega a la sección de checkout.
 * Requiere autenticación con Auth0.
 */
async function irAlCheckout() {
    // Verificar autenticación
    if (auth0Client) {
        const isAuthenticated = await auth0Client.isAuthenticated();
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para proceder al pago.');
            await iniciarSesion();
            return;
        }
    }

    // Cerrar carrito lateral
    const panel = document.getElementById('carrito-panel');
    const overlay = document.getElementById('overlay');
    panel.classList.remove('abierto');
    overlay.classList.remove('visible');

    // Mostrar sección checkout
    document.getElementById('seccion-catalogo').style.display = 'none';
    document.getElementById('seccion-checkout').style.display = 'block';

    // Renderizar resumen
    renderizarResumenCheckout();
}

/**
 * Renderiza el resumen del pedido en la sección de checkout.
 */
function renderizarResumenCheckout() {
    const container = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total-precio');
    const carrito = obtenerCarrito();
    let total = 0;

    container.innerHTML = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <div class="checkout-item">
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${formatearPrecio(subtotal)}</span>
            </div>
        `;
    }).join('');

    totalEl.textContent = `$${formatearPrecio(total)}`;
}

/**
 * Vuelve al catálogo de productos desde el checkout.
 */
function volverAlCatalogo() {
    document.getElementById('seccion-checkout').style.display = 'none';
    document.getElementById('seccion-catalogo').style.display = 'block';
}

/**
 * Procesa el formulario de pago con validaciones.
 */
function procesarPago(event) {
    event.preventDefault();

    // Limpiar errores previos
    limpiarErrores();

    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();

    let valido = true;

    // Validar nombre (mínimo 3 caracteres, solo letras y espacios)
    if (nombre.length < 3) {
        mostrarError('nombre', 'El nombre debe tener al menos 3 caracteres.');
        valido = false;
    }

    // Validar dirección (mínimo 5 caracteres)
    if (direccion.length < 5) {
        mostrarError('direccion', 'La dirección debe tener al menos 5 caracteres.');
        valido = false;
    }

    // Validar email (debe contener @ y un dominio válido)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        mostrarError('email', 'Ingresa un correo electrónico válido (ej: correo@gmail.com).');
        valido = false;
    }

    // Validar teléfono (solo dígitos, entre 8 y 12 caracteres)
    const regexTelefono = /^\d{8,12}$/;
    if (!regexTelefono.test(telefono)) {
        mostrarError('telefono', 'El teléfono debe contener solo números (8 a 12 dígitos).');
        valido = false;
    }

    if (!valido) return;

    // Proceso exitoso: mostrar confirmación
    mostrarConfirmacion(nombre, direccion, email, telefono);
}

/**
 * Muestra un mensaje de error debajo de un campo del formulario.
 */
function mostrarError(campo, mensaje) {
    const input = document.getElementById(campo);
    const errorEl = document.getElementById(`error-${campo}`);
    input.classList.add('invalid');
    input.classList.remove('valid');
    errorEl.textContent = mensaje;
}

/**
 * Limpia todos los mensajes de error del formulario.
 */
function limpiarErrores() {
    const campos = ['nombre', 'direccion', 'email', 'telefono'];
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        const errorEl = document.getElementById(`error-${campo}`);
        input.classList.remove('invalid', 'valid');
        errorEl.textContent = '';
    });
}

/**
 * Muestra la pantalla de confirmación con los detalles del pedido.
 */
function mostrarConfirmacion(nombre, direccion, email, telefono) {
    const carrito = obtenerCarrito();
    let total = 0;

    const productosHTML = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <div class="confirmacion-producto">
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${formatearPrecio(subtotal)}</span>
            </div>
        `;
    }).join('');

    document.getElementById('confirmacion-detalle').innerHTML = `
        <h4>Detalles del Pedido:</h4>
        ${productosHTML}
        <div class="confirmacion-total">Total: $${formatearPrecio(total)}</div>
        <hr style="margin: 1rem 0; border: 1px solid #ddd;">
        <h4>Datos de Envío:</h4>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
    `;

    // Limpiar carrito de Session Storage
    sessionStorage.removeItem('sportystyle_carrito');
    actualizarContadorCarrito();

    // Mostrar sección de confirmación
    document.getElementById('seccion-checkout').style.display = 'none';
    document.getElementById('seccion-confirmacion').style.display = 'flex';
}

/**
 * Reinicia la tienda para una nueva compra.
 */
function nuevaCompra() {
    document.getElementById('seccion-confirmacion').style.display = 'none';
    document.getElementById('seccion-catalogo').style.display = 'block';
    document.getElementById('form-pago').reset();
    actualizarVistaCarrito();
}

// =============================================
// UTILIDADES
// =============================================

/**
 * Formatea un número como precio chileno (con puntos de miles).
 */
function formatearPrecio(precio) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Muestra una notificación toast temporal.
 */
function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 2500);
}
