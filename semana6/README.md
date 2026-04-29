# SportyStyle - Tienda Virtual Deportiva

Mini aplicación web para una tienda virtual de ropa deportiva, desarrollada como actividad sumativa de la Semana 6 del ramo CIB302 - Taller de Plataformas Web.

## Funcionalidades

- **Catálogo de productos**: 9 productos en 3 categorías (camisetas, pantalones, accesorios).
- **Autenticación con Auth0**: Login/logout usando Auth0 SPA SDK. Los tokens JWT son gestionados automáticamente por Auth0.
- **Carrito de compras con Session Storage**: Los productos seleccionados se almacenan en Session Storage y persisten durante la navegación.
- **Formulario de pago simulado**: Validación de nombre, dirección, correo electrónico y teléfono.
- **Pantalla de confirmación**: Resumen del pedido con detalles de productos y datos de envío.

## Estructura del Proyecto

```
SportyStyle/
├── index.html          # Estructura HTML principal
├── css/
│   └── styles.css      # Estilos de la tienda
├── js/
│   └── app.js          # Lógica: Auth0, carrito, validaciones
├── img/                # Imágenes (se cargan desde Unsplash CDN)
└── README.md           # Documentación
```

## Configuración

1. Crear una cuenta en [Auth0](https://auth0.com).
2. Crear una aplicación tipo **Single Page Application**.
3. Configurar las URLs permitidas en Auth0 (callback, logout, web origins).
4. Editar `js/app.js` y reemplazar `AUTH0_DOMAIN` y `AUTH0_CLIENT_ID` con tus valores.
5. Abrir `index.html` con Live Server (VS Code) o cualquier servidor local.

## Flujo de Autenticación (Auth0)

1. El usuario hace clic en "Iniciar Sesión".
2. Se redirige a la página de login de Auth0 (Universal Login).
3. Auth0 autentica al usuario y redirige de vuelta con un código de autorización.
4. El SDK de Auth0 intercambia el código por tokens de forma transparente.
5. La aplicación muestra un mensaje de bienvenida con el nombre del usuario.
6. Al cerrar sesión, se limpia Session Storage y se hace logout en Auth0.

## Selección de Productos y Session Storage

- Los productos se renderizan dinámicamente desde un array de objetos en JavaScript.
- Al hacer clic en "Agregar al Carrito", el producto se guarda en `sessionStorage` bajo la clave `sportystyle_carrito`.
- El carrito se muestra en un panel lateral con nombre, precio, cantidad y total.
- Los datos persisten mientras la pestaña del navegador esté abierta.
- Al cerrar sesión o completar la compra, se ejecuta `sessionStorage.removeItem()` para limpiar los datos.

## Tecnologías

- HTML5, CSS3, JavaScript ES6+
- Auth0 SPA SDK v2.0
- Session Storage (Web Storage API)

## Autor

Pablo Martín Hartwig - AIEP 2026
