// Clase Producto - Representa un producto del sistema
// Esta clase es como una plantilla para crear objetos de producto

class Producto {
    // Constructor: se ejecuta cuando creamos un nuevo producto
    constructor(id, nombre, descripcion, precio, stock, categoria, activo) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
        this.activo = activo;
    }
}

// Exportamos la clase para usarla en otros archivos
module.exports = Producto;
