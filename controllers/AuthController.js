// Controlador de autenticación
// Aquí están las funciones para login, registro y logout

const UsuarioDAO = require('../dao/UsuarioDAO');

class AuthController {

    // Registrar un nuevo usuario
    static async registrar(req, res) {
        try {
            const { nombre, email, password, rol } = req.body;

            // Verificar que lleguen todos los datos
            if (!nombre || !email || !password) {
                return res.status(400).json({ error: 'Faltan datos obligatorios' });
            }

            // Verificar si ya existe un usuario con ese email
            const usuarioExistente = await UsuarioDAO.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
            }

            // Verificar si hay usuarios en la base de datos
            const hayUsuarios = await UsuarioDAO.existeAlgunUsuario();

            let rolFinal;
            if (!hayUsuarios) {
                // Si no hay usuarios, el primero será administrador
                rolFinal = 'administrador';
            } else {
                // Si ya hay usuarios, solo un admin puede crear usuarios
                if (!req.session.usuario || req.session.usuario.rol !== 'administrador') {
                    return res.status(403).json({ error: 'Solo los administradores pueden registrar usuarios' });
                }
                // El rol viene del formulario (el admin decide)
                rolFinal = rol || 'cliente';
            }

            // Crear el usuario
            const nuevoUsuario = await UsuarioDAO.crear(nombre, email, password, rolFinal);

            // Si es el primer usuario, lo logueamos automáticamente
            if (!hayUsuarios) {
                req.session.usuario = {
                    id: nuevoUsuario.id,
                    nombre: nuevoUsuario.nombre,
                    email: nuevoUsuario.email,
                    rol: nuevoUsuario.rol
                };
            }

            res.json({
                mensaje: 'Usuario registrado correctamente',
                usuario: {
                    id: nuevoUsuario.id,
                    nombre: nuevoUsuario.nombre,
                    email: nuevoUsuario.email,
                    rol: nuevoUsuario.rol
                }
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ error: 'Error al registrar usuario' });
        }
    }

    // Iniciar sesión
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Verificar que lleguen los datos
            if (!email || !password) {
                return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
            }

            // Buscar el usuario por email
            const usuario = await UsuarioDAO.buscarPorEmail(email);
            if (!usuario) {
                return res.status(401).json({ error: 'Email o contraseña incorrectos' });
            }

            // Verificar la contraseña
            const passwordCorrecta = await UsuarioDAO.verificarPassword(password, usuario.password);
            if (!passwordCorrecta) {
                return res.status(401).json({ error: 'Email o contraseña incorrectos' });
            }

            // Verificar si el usuario está activo
            if (!usuario.activo) {
                return res.status(403).json({ error: 'Tu cuenta está desactivada' });
            }

            // Guardar el usuario en la sesión (sin la contraseña)
            req.session.usuario = {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            };

            res.json({
                mensaje: 'Sesión iniciada correctamente',
                usuario: req.session.usuario
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }

    // Cerrar sesión
    static async logout(req, res) {
        req.session.destroy((error) => {
            if (error) {
                return res.status(500).json({ error: 'Error al cerrar sesión' });
            }
            res.json({ mensaje: 'Sesión cerrada correctamente' });
        });
    }

    // Obtener el usuario actual (el que está logueado)
    static async obtenerUsuarioActual(req, res) {
        if (req.session && req.session.usuario) {
            res.json({ usuario: req.session.usuario });
        } else {
            res.status(401).json({ error: 'No hay sesión activa' });
        }
    }

    // Verificar si existe algún usuario (para saber si mostrar el registro público)
    static async verificarPrimerUsuario(req, res) {
        try {
            const hayUsuarios = await UsuarioDAO.existeAlgunUsuario();
            res.json({ hayUsuarios });
        } catch (error) {
            console.error('Error al verificar usuarios:', error);
            res.status(500).json({ error: 'Error al verificar usuarios' });
        }
    }
}

module.exports = AuthController;
