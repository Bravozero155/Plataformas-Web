// =============================================================
// Servidor HTTPS con Express - CIB302 Semana 5
// Autor: Pablo Martin Hartwig
// Descripción: Servidor web seguro que utiliza un certificado
//              SSL auto-firmado generado con OpenSSL.
// =============================================================

// Importar módulos necesarios
const https = require('https');   // Módulo nativo de Node.js para crear servidor HTTPS
const fs = require('fs');         // Módulo File System para leer archivos del certificado
const express = require('express'); // Framework web para manejar rutas y middleware

// Crear instancia de la aplicación Express
const app = express();

// Definir el puerto HTTPS (443 es el estándar para HTTPS)
const PORT = 443;

// ---------------------------------------------------------------
// Lectura síncrona de los archivos del certificado SSL
// Se usa readFileSync porque estos archivos deben estar disponibles
// ANTES de que el servidor inicie. Si se leyeran de forma asíncrona,
// el servidor podría intentar iniciar sin los certificados listos.
// ---------------------------------------------------------------
const sslOptions = {
  key: fs.readFileSync('./certs/private.key'),    // Clave privada RSA de 2048 bits
  cert: fs.readFileSync('./certs/certificate.crt') // Certificado auto-firmado X.509
};

// ---------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------

// Parsear JSON en el body de las peticiones
app.use(express.json());

// Middleware para registrar cada petición en consola (logging básico)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------------------------------------------------------------
// Rutas de la aplicación
// ---------------------------------------------------------------

// Ruta principal - Página de inicio
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Servidor HTTPS - CIB302</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #2c3e50; }
        .secure-badge {
          display: inline-block;
          background: #27ae60;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .info { 
          background: #ecf0f1; 
          padding: 15px; 
          border-radius: 5px;
          margin: 15px 0;
        }
        code {
          background: #2c3e50;
          color: #ecf0f1;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 14px;
        }
        a { color: #2980b9; }
      </style>
    </head>
    <body>
      <div class="container">
        <span class="secure-badge">HTTPS Activo</span>
        <h1>Servidor HTTPS - CIB302 Semana 5</h1>
        <p>Este servidor está protegido con un certificado SSL auto-firmado.</p>
        
        <div class="info">
          <strong>Protocolo:</strong> HTTPS (TLS/SSL)<br>
          <strong>Puerto:</strong> ${PORT}<br>
          <strong>Certificado:</strong> Auto-firmado con OpenSSL<br>
          <strong>Cifrado:</strong> RSA 2048 bits
        </div>

        <h2>Rutas disponibles</h2>
        <ul>
          <li><code>GET /</code> - Esta página de inicio</li>
          <li><code>GET /api/info</code> - <a href="/api/info">Información del servidor en JSON</a></li>
          <li><code>GET /api/ssl-status</code> - <a href="/api/ssl-status">Estado del certificado SSL</a></li>
        </ul>

        <h2>Nota sobre el certificado</h2>
        <p>Al acceder a este servidor, el navegador mostrará una advertencia de seguridad 
        porque el certificado es <strong>auto-firmado</strong> y no fue emitido por una 
        Autoridad Certificadora (CA) reconocida. Esto es esperado en entornos de desarrollo.</p>
      </div>
    </body>
    </html>
  `);
});

// Ruta API - Información del servidor (respuesta JSON)
app.get('/api/info', (req, res) => {
  res.json({
    servidor: 'CIB302 - Servidor HTTPS con Express',
    protocolo: 'HTTPS',
    puerto: PORT,
    certificado: 'Auto-firmado (OpenSSL)',
    algoritmo: 'RSA 2048 bits',
    validez: '365 días',
    node_version: process.version,
    plataforma: process.platform,
    fecha_consulta: new Date().toISOString()
  });
});

// Ruta API - Estado del certificado SSL
app.get('/api/ssl-status', (req, res) => {
  res.json({
    ssl_activo: true,
    tipo_certificado: 'Auto-firmado (self-signed)',
    emitido_por: 'OpenSSL - Generado localmente',
    organizacion: 'AIEP - CIB302',
    cn: 'localhost',
    algoritmo_clave: 'RSA',
    longitud_clave: '2048 bits',
    nota: 'Este certificado NO es confiable para navegadores porque no fue emitido por una CA reconocida.'
  });
});

// ---------------------------------------------------------------
// Crear y levantar el servidor HTTPS
// IMPORTANTE: No se usa app.listen() directamente.
// Se usa https.createServer() pasando las opciones SSL y la app
// de Express como handler de las peticiones.
// ---------------------------------------------------------------
const server = https.createServer(sslOptions, app);

server.listen(PORT, () => {
  console.log('==============================================');
  console.log(' Servidor HTTPS activo');
  console.log(`  URL: https://localhost:${PORT}`);
  console.log('  Certificado: Auto-firmado (OpenSSL)');
  console.log('  Presiona Ctrl+C para detener el servidor');
  console.log('==============================================');
});
