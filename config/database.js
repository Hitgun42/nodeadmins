// Archivo de configuración de la base de datos MySQL
// Aquí creamos la conexión que usaremos en toda la aplicación

const mysql = require('mysql2/promise'); // Importamos MySQL con soporte para promesas
require('dotenv').config(); // Cargamos las variables de entorno del archivo .env

// Creamos la conexión a la base de datos
// Usamos las variables del archivo .env (o valores por defecto si no existen)
const conexion = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',      // Servidor de MySQL
    user: process.env.DB_USER || 'root',           // Usuario de MySQL
    password: process.env.DB_PASSWORD || '',       // Contraseña de MySQL
    database: process.env.DB_NAME || 'proyecto_real' // Nombre de la base de datos
});

// Exportamos la conexión para usarla en otros archivos
module.exports = conexion;
