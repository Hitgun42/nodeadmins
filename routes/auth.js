// Rutas de autenticación
// Aquí definimos las URLs para login, registro, etc.

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// POST /api/auth/registro - Registrar un nuevo usuario
router.post('/registro', AuthController.registrar);

// POST /api/auth/login - Iniciar sesión
router.post('/login', AuthController.login);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', AuthController.logout);

// GET /api/auth/me - Obtener usuario actual
router.get('/me', AuthController.obtenerUsuarioActual);

// GET /api/auth/verificar-primer-usuario - Ver si hay usuarios en la BD
router.get('/verificar-primer-usuario', AuthController.verificarPrimerUsuario);

// Exportar el router
module.exports = router;
