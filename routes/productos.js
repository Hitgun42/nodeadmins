// Rutas de productos
// Disponible para todos los usuarios autenticados

const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');
const { verificarSesion } = require('../middleware/auth');

// Todas estas rutas requieren estar logueado
// Por eso usamos verificarSesion

// GET /api/productos - Listar productos (con paginación y búsqueda)
router.get('/', verificarSesion, ProductoController.listar);

// GET /api/productos/:id - Obtener un producto específico
router.get('/:id', verificarSesion, ProductoController.obtener);

// Exportar el router
module.exports = router;
