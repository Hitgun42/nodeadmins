// Middleware de autenticación
// Estos son "filtros" que verifican si un usuario puede acceder a ciertas rutas

// Verificar si el usuario está logueado
function verificarSesion(req, res, next) {
    // Si hay un usuario en la sesión, puede continuar
    if (req.session && req.session.usuario) {
        next(); // Continuar a la siguiente función
    } else {
        // Si no está logueado, devolver error 401 (No autorizado)
        res.status(401).json({ error: 'Debes iniciar sesión' });
    }
}

// Verificar si el usuario es administrador
function verificarAdmin(req, res, next) {
    // Primero verificamos que esté logueado
    if (!req.session || !req.session.usuario) {
        return res.status(401).json({ error: 'Debes iniciar sesión' });
    }

    // Verificamos si su rol es administrador
    if (req.session.usuario.rol === 'administrador') {
        next(); // Es admin, puede continuar
    } else {
        // No es admin, devolver error 403 (Prohibido)
        res.status(403).json({ error: 'Solo los administradores pueden hacer esto' });
    }
}

// Exportamos las funciones para usarlas en las rutas
module.exports = {
    verificarSesion,
    verificarAdmin
};
