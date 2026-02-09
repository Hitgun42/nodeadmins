// JavaScript para la página de registro
// Aquí manejamos el registro del primer administrador

// Cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si ya hay usuarios (si los hay, no deberían estar aquí)
    verificarAcceso();

    // Manejar el envío del formulario
    document.getElementById('registroForm').addEventListener('submit', registrar);
});

// Verificar si se puede acceder a esta página
async function verificarAcceso() {
    try {
        const respuesta = await fetch('/api/auth/verificar-primer-usuario');
        const datos = await respuesta.json();

        // Si ya hay usuarios, redirigir al login
        if (datos.hayUsuarios) {
            alert('Ya existe un administrador. Solo los administradores pueden crear usuarios.');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error al verificar acceso:', error);
    }
}

// Función para registrar el primer usuario
async function registrar(evento) {
    evento.preventDefault(); // Evitar que se recargue la página

    // Obtener los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Enviar petición al servidor
        const respuesta = await fetch('/api/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            // Registro exitoso
            mostrarMensaje('¡Registro exitoso! Redirigiendo al dashboard...', 'exito');

            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            // Mostrar error
            mostrarMensaje(datos.error, 'error');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        mostrarMensaje('Error al conectar con el servidor', 'error');
    }
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = 'mensaje ' + tipo;
    mensaje.style.display = 'block';
}
