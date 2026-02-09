// JavaScript para la página de login
// Aquí manejamos el formulario de inicio de sesión

// Cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si ya hay una sesión activa
    verificarSesion();

    // Verificar si hay usuarios en la base de datos
    verificarPrimerUsuario();

    // Manejar el envío del formulario
    document.getElementById('loginForm').addEventListener('submit', login);
});

// Función para verificar si ya hay sesión activa
async function verificarSesion() {
    try {
        const respuesta = await fetch('/api/auth/me');
        if (respuesta.ok) {
            // Ya hay sesión, redirigir al dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
    }
}

// Función para verificar si hay usuarios (para mostrar el enlace de registro)
async function verificarPrimerUsuario() {
    try {
        const respuesta = await fetch('/api/auth/verificar-primer-usuario');
        const datos = await respuesta.json();

        // Si no hay usuarios, mostrar el enlace de registro
        if (!datos.hayUsuarios) {
            document.getElementById('registroLink').style.display = 'block';
        }
    } catch (error) {
        console.error('Error al verificar usuarios:', error);
    }
}

// Función para hacer login
async function login(evento) {
    evento.preventDefault(); // Evitar que se recargue la página

    // Obtener los datos del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Enviar petición al servidor
        const respuesta = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            // Login exitoso, redirigir al dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Mostrar error
            mostrarMensaje(datos.error, 'error');
        }
    } catch (error) {
        console.error('Error en login:', error);
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
