# CIB302 - Servidor HTTPS con Express y Certificado SSL Auto-firmado

**Semana 5 - Taller de Plataformas Web (AIEP)**

## Descripción
Servidor web seguro implementado con Node.js y Express, utilizando un certificado SSL auto-firmado generado con OpenSSL.

## Requisitos
- Node.js v18 o superior
- OpenSSL instalado

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Bravozero155/Plataformas-Web.git
cd Plataformas-Web

# Instalar dependencias
npm install

# Generar certificado SSL auto-firmado
npm run generate-cert

# Iniciar el servidor (requiere permisos de administrador por puerto 443)
sudo node server.js
```

## Estructura del proyecto
```
├── server.js          # Servidor HTTPS con Express
├── package.json       # Dependencias y scripts
├── certs/             # Carpeta para certificados (excluida de git)
│   ├── private.key    # Clave privada RSA 2048 bits
│   └── certificate.crt # Certificado X.509 auto-firmado
├── .gitignore         # Archivos excluidos del repositorio
└── README.md          # Este archivo
```

## Rutas disponibles
- `GET /` - Página de inicio con información del servidor
- `GET /api/info` - Información del servidor en JSON
- `GET /api/ssl-status` - Estado del certificado SSL

## Autor
Pablo Martin Hartwig

## Asignatura
Taller de Plataformas Web (CIB302) - AIEP
