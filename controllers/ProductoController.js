// Controlador de productos
// Funciones para ver productos (disponible para todos los usuarios logueados)

const ProductoDAO = require('../dao/ProductoDAO');

class ProductoController {

    // Listar productos con paginación y búsqueda
    static async listar(req, res) {
        try {
            // Obtener parámetros de la URL (query params)
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            const busqueda = req.query.busqueda || '';

            // Obtener productos y total
            const productos = await ProductoDAO.listarConPaginacion(pagina, limite, busqueda);
            const total = await ProductoDAO.contarProductos(busqueda);

            // Calcular total de páginas
            const totalPaginas = Math.ceil(total / limite);

            // Enviar respuesta
            res.json({
                productos: productos,
                paginacion: {
                    paginaActual: pagina,
                    totalPaginas: totalPaginas,
                    totalProductos: total,
                    productosPorPagina: limite
                }
            });

        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    }

    // Obtener un producto específico
    static async obtener(req, res) {
        try {
            const id = parseInt(req.params.id);
            const producto = await ProductoDAO.buscarPorId(id);

            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.json(producto);

        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({ error: 'Error al obtener producto' });
        }
    }
}

module.exports = ProductoController;
