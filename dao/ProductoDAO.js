// ProductoDAO - Acceso a datos de productos
// Aquí están todas las funciones para trabajar con productos en la base de datos

const db = require('../config/database');
const Producto = require('../models/Producto');

class ProductoDAO {

    // Listar productos con paginación y búsqueda
    static async listarConPaginacion(pagina = 1, limite = 10, busqueda = '') {
        // Calcular desde qué registro empezamos (offset)
        const offset = (pagina - 1) * limite;

        let sql = 'SELECT * FROM productos WHERE activo = 1';
        let parametros = [];

        // Si hay búsqueda, filtrar por nombre, descripción o categoría
        if (busqueda) {
            sql += ' AND (nombre LIKE ? OR descripcion LIKE ? OR categoria LIKE ?)';
            parametros.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`);
        }

        // Ordenar por nombre y aplicar límite y offset
        sql += ' ORDER BY nombre ASC LIMIT ? OFFSET ?';
        parametros.push(limite, offset);

        const [productos] = await db.execute(sql, parametros);

        // Convertir cada fila en un objeto Producto
        return productos.map(p => new Producto(
            p.id,
            p.nombre,
            p.descripcion,
            p.precio,
            p.stock,
            p.categoria,
            p.activo
        ));
    }

    // Contar cuántos productos hay en total (para la paginación)
    static async contarProductos(busqueda = '') {
        let sql = 'SELECT COUNT(*) as total FROM productos WHERE activo = 1';
        let parametros = [];

        if (busqueda) {
            sql += ' AND (nombre LIKE ? OR descripcion LIKE ? OR categoria LIKE ?)';
            parametros.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`);
        }

        const [resultado] = await db.execute(sql, parametros);
        return resultado[0].total;
    }

    // Buscar un producto por su ID
    static async buscarPorId(id) {
        const sql = 'SELECT * FROM productos WHERE id = ?';
        const [productos] = await db.execute(sql, [id]);

        if (productos.length === 0) {
            return null;
        }

        const p = productos[0];
        return new Producto(p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria, p.activo);
    }
}

module.exports = ProductoDAO;
