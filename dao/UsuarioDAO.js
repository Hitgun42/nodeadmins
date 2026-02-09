// UsuarioDAO - Acceso a datos de usuarios
// Aquí están todas las funciones para trabajar con usuarios en la base de datos

const db = require('../config/database');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

class UsuarioDAO {

    // Crear un nuevo usuario
    static async crear(nombre, email, password, rol = 'cliente') {
        // Encriptar la contraseña con bcrypt (10 rondas de seguridad)
        const passwordEncriptada = await bcrypt.hash(password, 10);

        // Insertar el usuario en la base de datos
        const sql = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
        const [resultado] = await db.execute(sql, [nombre, email, passwordEncriptada, rol]);

        // Devolver el usuario que acabamos de crear
        return await this.buscarPorId(resultado.insertId);
    }

    // Buscar un usuario por su email
    static async buscarPorEmail(email) {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const [usuarios] = await db.execute(sql, [email]);

        // Si no encontramos el usuario, devolvemos null
        if (usuarios.length === 0) {
            return null;
        }

        // Crear un objeto Usuario con los datos de la base de datos
        const u = usuarios[0];
        return new Usuario(u.id, u.nombre, u.email, u.password, u.rol, u.activo);
    }

    // Buscar un usuario por su ID
    static async buscarPorId(id) {
        const sql = 'SELECT * FROM usuarios WHERE id = ?';
        const [usuarios] = await db.execute(sql, [id]);

        if (usuarios.length === 0) {
            return null;
        }

        const u = usuarios[0];
        return new Usuario(u.id, u.nombre, u.email, u.password, u.rol, u.activo);
    }

    // Listar usuarios con paginación y búsqueda
    static async listarConPaginacion(pagina = 1, limite = 10, busqueda = '') {
        // Calcular desde qué registro empezamos (offset)
        const offset = (pagina - 1) * limite;

        let sql = 'SELECT * FROM usuarios';
        let parametros = [];

        // Si hay búsqueda, filtrar por nombre o email
        if (busqueda) {
            sql += ' WHERE nombre LIKE ? OR email LIKE ?';
            parametros.push(`%${busqueda}%`, `%${busqueda}%`);
        }

        // Ordenar por los más recientes y aplicar límite y offset
        sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        parametros.push(limite, offset);

        const [usuarios] = await db.execute(sql, parametros);

        // Convertir cada fila en un objeto Usuario
        return usuarios.map(u => new Usuario(u.id, u.nombre, u.email, u.password, u.rol, u.activo));
    }

    // Contar cuántos usuarios hay en total (para la paginación)
    static async contarUsuarios(busqueda = '') {
        let sql = 'SELECT COUNT(*) as total FROM usuarios';
        let parametros = [];

        if (busqueda) {
            sql += ' WHERE nombre LIKE ? OR email LIKE ?';
            parametros.push(`%${busqueda}%`, `%${busqueda}%`);
        }

        const [resultado] = await db.execute(sql, parametros);
        return resultado[0].total;
    }

    // Verificar si existe al menos un usuario en la base de datos
    static async existeAlgunUsuario() {
        const sql = 'SELECT COUNT(*) as total FROM usuarios';
        const [resultado] = await db.execute(sql);
        return resultado[0].total > 0;
    }

    // Eliminar un usuario
    static async eliminar(id) {
        const sql = 'DELETE FROM usuarios WHERE id = ?';
        const [resultado] = await db.execute(sql, [id]);
        return resultado.affectedRows > 0; // Devuelve true si se eliminó
    }

    // Verificar si una contraseña es correcta
    static async verificarPassword(password, passwordEncriptada) {
        // bcrypt.compare compara la contraseña normal con la encriptada
        return await bcrypt.compare(password, passwordEncriptada);
    }
}

module.exports = UsuarioDAO;
