// Comprobar si hay sesión activa
const checkSession = () => {
    const session = localStorage.getItem('session');
    if (session) {
        window.location.href = './web/index.html';
    } else {
        window.location.href = './src/index/login.html';
    }
};

// Redirigir al login después de 3 segundos
setTimeout(checkSession, 3000);

// Redirigir inmediatamente si el usuario toca la pantalla
document.addEventListener('click', checkSession);

// Redirigir inmediatamente si presiona cualquier tecla
document.addEventListener('keydown', checkSession);

// Mostrar porcentaje de carga en consola (opcional)
let progress = 0;
const interval = setInterval(() => {
    progress += 33;
    console.log(`Cargando: ${progress}%`);
    if (progress >= 100) {
        clearInterval(interval);
    }
}, 1000);