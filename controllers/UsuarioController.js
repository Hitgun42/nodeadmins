// Controlador de usuarios
// Funciones para gestionar usuarios (solo para administradores)

const UsuarioDAO = require('../dao/UsuarioDAO');

class UsuarioController {

    // Listar usuarios con paginación y búsqueda
    static async listar(req, res) {
        try {
            // Obtener parámetros de la URL (query params)
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            const busqueda = req.query.busqueda || '';

            // Obtener usuarios y total
            const usuarios = await UsuarioDAO.listarConPaginacion(pagina, limite, busqueda);
            const total = await UsuarioDAO.contarUsuarios(busqueda);

            // Calcular total de páginas
            const totalPaginas = Math.ceil(total / limite);

            // Enviar respuesta (sin las contraseñas)
            res.json({
                usuarios: usuarios.map(u => ({
                    id: u.id,
                    nombre: u.nombre,
                    email: u.email,
                    rol: u.rol,
                    activo: u.activo
                })),
                paginacion: {
                    paginaActual: pagina,
                    totalPaginas: totalPaginas,
                    totalUsuarios: total,
                    usuariosPorPagina: limite
                }
            });

        } catch (error) {
            console.error('Error al listar usuarios:', error);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    // Obtener un usuario específico
    static async obtener(req, res) {
        try {
            const id = parseInt(req.params.id);
            const usuario = await UsuarioDAO.buscarPorId(id);

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Devolver sin la contraseña
            res.json({
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                activo: usuario.activo
            });

        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ error: 'Error al obtener usuario' });
        }
    }

    // Eliminar un usuario
    static async eliminar(req, res) {
        try {
            const id = parseInt(req.params.id);

            // No permitir que un admin se elimine a sí mismo
            if (req.session.usuario.id === id) {
                return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
            }

            const eliminado = await UsuarioDAO.eliminar(id);

            if (eliminado) {
                res.json({ mensaje: 'Usuario eliminado correctamente' });
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }

        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ error: 'Error al eliminar usuario' });
        }
    }
}

module.exports = UsuarioController;
