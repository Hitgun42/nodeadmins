// JavaScript para el dashboard
// Aquí manejamos la interfaz según el rol del usuario

// Variables globales
let paginaActual = 1;
let busquedaActual = '';
let paginaActualProductos = 1;
let busquedaActualProductos = '';

// Cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Verificar que el usuario esté logueado
    cargarUsuarioActual();

    // Manejar el formulario de registro de nuevos usuarios
    const form = document.getElementById('registroForm');
    if (form) {
        form.addEventListener('submit', registrarUsuario);
    }
});

// Cargar los datos del usuario actual
async function cargarUsuarioActual() {
    try {
        const respuesta = await fetch('/api/auth/me');

        if (!respuesta.ok) {
            // No hay sesión, redirigir al login
            window.location.href = 'index.html';
            return;
        }

        const datos = await respuesta.json();
        const usuario = datos.usuario;

        // Mostrar el nombre del usuario
        document.getElementById('nombreUsuario').textContent =
            `Hola, ${usuario.nombre} (${usuario.rol})`;

        // Mostrar la sección correspondiente según el rol
        if (usuario.rol === 'administrador') {
            document.getElementById('seccionAdmin').style.display = 'block';
            cargarUsuarios(); // Cargar la lista de usuarios
        } else {
            document.getElementById('seccionCliente').style.display = 'block';
        }

        // Mostrar productos para todos los usuarios
        document.getElementById('seccionProductos').style.display = 'block';
        cargarProductos(); // Cargar la lista de productos

    } catch (error) {
        console.error('Error al cargar usuario:', error);
        window.location.href = 'index.html';
    }
}

// Cerrar sesión
async function cerrarSesion() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// Mostrar el formulario de registro
function mostrarFormularioRegistro() {
    document.getElementById('formularioRegistro').style.display = 'block';
}

// Ocultar el formulario de registro
function ocultarFormularioRegistro() {
    document.getElementById('formularioRegistro').style.display = 'none';
    document.getElementById('registroForm').reset();
}

// Registrar un nuevo usuario (solo admin)
async function registrarUsuario(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    try {
        const respuesta = await fetch('/api/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password, rol })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            alert('Usuario creado correctamente');
            ocultarFormularioRegistro();
            cargarUsuarios(); // Recargar la lista
        } else {
            alert('Error: ' + datos.error);
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al conectar con el servidor');
    }
}

// Cargar la lista de usuarios con paginación
async function cargarUsuarios(pagina = 1, busqueda = '') {
    try {
        const respuesta = await fetch(
            `/api/usuarios?pagina=${pagina}&limite=10&busqueda=${busqueda}`
        );

        if (!respuesta.ok) {
            throw new Error('Error al cargar usuarios');
        }

        const datos = await respuesta.json();

        // Guardar la página actual
        paginaActual = pagina;
        busquedaActual = busqueda;

        // Mostrar los usuarios en la tabla
        mostrarUsuarios(datos.usuarios);

        // Mostrar la paginación
        mostrarPaginacion(datos.paginacion);

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Mostrar usuarios en la tabla
function mostrarUsuarios(usuarios) {
    const tbody = document.getElementById('listaUsuarios');
    tbody.innerHTML = ''; // Limpiar la tabla

    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td><span class="badge badge-${usuario.rol === 'administrador' ? 'admin' : 'cliente'}">${usuario.rol}</span></td>
            <td><span class="badge badge-${usuario.activo ? 'activo' : 'inactivo'}">${usuario.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button onclick="eliminarUsuario(${usuario.id})" class="btn btn-danger">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// Mostrar controles de paginación
function mostrarPaginacion(paginacion) {
    const div = document.getElementById('paginacion');
    div.innerHTML = '';

    // Botón anterior
    if (paginacion.paginaActual > 1) {
        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = '← Anterior';
        btnAnterior.className = 'btn btn-secondary';
        btnAnterior.onclick = () => cargarUsuarios(paginacion.paginaActual - 1, busquedaActual);
        div.appendChild(btnAnterior);
    }

    // Números de página
    for (let i = 1; i <= paginacion.totalPaginas; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.textContent = i;
        btnPagina.className = 'btn ' + (i === paginacion.paginaActual ? 'activo' : 'btn-secondary');
        btnPagina.onclick = () => cargarUsuarios(i, busquedaActual);
        div.appendChild(btnPagina);
    }

    // Botón siguiente
    if (paginacion.paginaActual < paginacion.totalPaginas) {
        const btnSiguiente = document.createElement('button');
        btnSiguiente.textContent = 'Siguiente →';
        btnSiguiente.className = 'btn btn-secondary';
        btnSiguiente.onclick = () => cargarUsuarios(paginacion.paginaActual + 1, busquedaActual);
        div.appendChild(btnSiguiente);
    }

    // Mostrar información
    const info = document.createElement('p');
    info.textContent = `Mostrando página ${paginacion.paginaActual} de ${paginacion.totalPaginas} (Total: ${paginacion.totalUsuarios} usuarios)`;
    info.style.marginTop = '10px';
    div.appendChild(info);
}

// Buscar usuarios (se ejecuta al escribir en el campo de búsqueda)
function buscarUsuarios() {
    const busqueda = document.getElementById('busqueda').value;
    cargarUsuarios(1, busqueda); // Volver a la página 1 con la nueva búsqueda
}

// Eliminar un usuario
async function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        return;
    }

    try {
        const respuesta = await fetch(`/api/usuarios/${id}`, {
            method: 'DELETE'
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            alert('Usuario eliminado correctamente');
            cargarUsuarios(paginaActual, busquedaActual); // Recargar la lista
        } else {
            alert('Error: ' + datos.error);
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al conectar con el servidor');
    }
}


// Cargar la lista de productos con paginación
async function cargarProductos(pagina = 1, busqueda = '') {
    try {
        const respuesta = await fetch(
            `/api/productos?pagina=${pagina}&limite=10&busqueda=${busqueda}`
        );

        if (!respuesta.ok) {
            throw new Error('Error al cargar productos');
        }

        const datos = await respuesta.json();

        // Guardar la página actual
        paginaActualProductos = pagina;
        busquedaActualProductos = busqueda;

        // Mostrar los productos en la tabla
        mostrarProductos(datos.productos);

        // Mostrar la paginación
        mostrarPaginacionProductos(datos.paginacion);

    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Mostrar productos en la tabla
function mostrarProductos(productos) {
    const tbody = document.getElementById('listaProductos');
    tbody.innerHTML = ''; // Limpiar la tabla

    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || 'Sin descripción'}</td>
            <td>$${parseFloat(producto.precio).toFixed(2)}</td>
            <td>${producto.stock}</td>
            <td><span class="badge badge-cliente">${producto.categoria}</span></td>
        `;
        tbody.appendChild(fila);
    });
}

// Mostrar controles de paginación para productos
function mostrarPaginacionProductos(paginacion) {
    const div = document.getElementById('paginacionProductos');
    div.innerHTML = '';

    // Botón anterior
    if (paginacion.paginaActual > 1) {
        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = '← Anterior';
        btnAnterior.className = 'btn btn-secondary';
        btnAnterior.onclick = () => cargarProductos(paginacion.paginaActual - 1, busquedaActualProductos);
        div.appendChild(btnAnterior);
    }

    // Números de página
    for (let i = 1; i <= paginacion.totalPaginas; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.textContent = i;
        btnPagina.className = 'btn ' + (i === paginacion.paginaActual ? 'activo' : 'btn-secondary');
        btnPagina.onclick = () => cargarProductos(i, busquedaActualProductos);
        div.appendChild(btnPagina);
    }

    // Botón siguiente
    if (paginacion.paginaActual < paginacion.totalPaginas) {
        const btnSiguiente = document.createElement('button');
        btnSiguiente.textContent = 'Siguiente →';
        btnSiguiente.className = 'btn btn-secondary';
        btnSiguiente.onclick = () => cargarProductos(paginacion.paginaActual + 1, busquedaActualProductos);
        div.appendChild(btnSiguiente);
    }

    // Mostrar información
    const info = document.createElement('p');
    info.textContent = `Mostrando página ${paginacion.paginaActual} de ${paginacion.totalPaginas} (Total: ${paginacion.totalProductos} productos)`;
    info.style.marginTop = '10px';
    div.appendChild(info);
}

// Buscar productos (se ejecuta al escribir en el campo de búsqueda)
function buscarProductos() {
    const busqueda = document.getElementById('busquedaProductos').value;
    cargarProductos(1, busqueda); // Volver a la página 1 con la nueva búsqueda
}
