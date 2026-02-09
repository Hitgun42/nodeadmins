-- Script de inicialización de la base de datos
-- Sistema de Autenticación Basado en Roles

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS proyecto_real CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE proyecto_real;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'cliente') NOT NULL DEFAULT 'cliente',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos (ejemplo para demostrar búsqueda y paginación)
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    categoria VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar algunos productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES
('Laptop HP', 'Laptop HP 15.6" Intel Core i5 8GB RAM 256GB SSD', 599.99, 15, 'Electrónica'),
('Mouse Logitech', 'Mouse inalámbrico Logitech M185', 12.99, 50, 'Accesorios'),
('Teclado Mecánico', 'Teclado mecánico RGB retroiluminado', 79.99, 25, 'Accesorios'),
('Monitor Samsung', 'Monitor Samsung 24" Full HD', 149.99, 20, 'Electrónica'),
('Auriculares Sony', 'Auriculares inalámbricos con cancelación de ruido', 199.99, 30, 'Audio'),
('Webcam Logitech', 'Webcam HD 1080p con micrófono', 59.99, 40, 'Accesorios'),
('Disco Duro Externo', 'Disco duro externo 1TB USB 3.0', 49.99, 35, 'Almacenamiento'),
('Memoria USB', 'Memoria USB 64GB', 9.99, 100, 'Almacenamiento'),
('Tablet Samsung', 'Tablet Samsung Galaxy Tab 10.1"', 299.99, 18, 'Electrónica'),
('Impresora HP', 'Impresora multifunción HP DeskJet', 89.99, 12, 'Oficina'),
('Router TP-Link', 'Router inalámbrico AC1200', 39.99, 45, 'Redes'),
('Cable HDMI', 'Cable HDMI 2.0 2 metros', 7.99, 80, 'Accesorios'),
('Adaptador USB-C', 'Adaptador USB-C a USB 3.0', 14.99, 60, 'Accesorios'),
('Mousepad Gaming', 'Mousepad gaming XXL RGB', 24.99, 55, 'Accesorios'),
('Silla Gaming', 'Silla gaming ergonómica con reposabrazos', 249.99, 10, 'Muebles');

-- Mostrar confirmación
SELECT 'Base de datos inicializada correctamente' AS mensaje;
SELECT COUNT(*) AS total_productos FROM productos;
