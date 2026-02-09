// Clase Usuario - Representa un usuario del sistema
// Esta clase es como una plantilla para crear objetos de usuario

class Usuario {
    // Constructor: se ejecuta cuando creamos un nuevo usuario
    constructor(id, nombre, email, password, rol, activo) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password; // Contraseña hasheada (encriptada)
        this.rol = rol;           // Puede ser 'administrador' o 'cliente'
        this.activo = activo;     // true o false
    }
}

// Exportamos la clase para usarla en otros archivos
module.exports = Usuario;
