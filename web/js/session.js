// Verificar sesión antes de iniciar la app
function checkSession() {
    const sessionData = localStorage.getItem('session');
    if (!sessionData) {
        window.location.href = '../src/index/login.html';
        return;
    }

    try {
        const session = JSON.parse(sessionData);
        const now = new Date().getTime();
        const sessionExpires = session.timestamp + session.expiresIn;

        if (now > sessionExpires) {
            // Sesión expirada
            localStorage.removeItem('session');
            window.location.href = '../src/index/login.html';
            return;
        }
    } catch (e) {
        // Error al procesar la sesión
        localStorage.removeItem('session');
        window.location.href = '../src/index/login.html';
        return;
    }
}

// Ejecutar verificación de sesión
checkSession();