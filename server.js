// Servidor principal de la aplicación
// Aquí configuramos Express y arrancamos el servidor

const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// Importar las rutas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(cors()); // Permitir peticiones desde otros dominios
app.use(express.json()); // Para leer JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Para leer formularios

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

// Servir archivos estáticos (HTML, CSS, JS del frontend)
app.use(express.static('public'));

// Configurar las rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'El servidor funciona correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✓ Servidor iniciado en http://localhost:${PORT}`);
    console.log(`✓ Abre tu navegador en http://localhost:${PORT}`);
});
