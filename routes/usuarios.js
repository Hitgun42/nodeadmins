// Rutas de gestión de usuarios
// Solo los administradores pueden acceder a estas rutas

const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const { verificarAdmin } = require('../middleware/auth');

// Todas estas rutas requieren ser administrador
// Por eso usamos verificarAdmin en todas

// GET /api/usuarios - Listar usuarios (con paginación y búsqueda)
router.get('/', verificarAdmin, UsuarioController.listar);

// GET /api/usuarios/:id - Obtener un usuario específico
router.get('/:id', verificarAdmin, UsuarioController.obtener);

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', verificarAdmin, UsuarioController.eliminar);

// Exportar el router
module.exports = router;
