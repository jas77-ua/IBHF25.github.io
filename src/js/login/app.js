function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🔒';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const dni = document.getElementById('dni').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Validación básica del DNI (solo formato)
    const dniRegex = /^[0-9]{8}[A-Z]$/i;
    
    if (!dniRegex.test(dni)) {
        errorMessage.textContent = 'Por favor, introduce un DNI válido (8 números + 1 letra)';
        errorMessage.style.display = 'block';
        return;
    }
    
    if (password.length < 4) {
        errorMessage.textContent = 'La contraseña debe tener al menos 4 caracteres';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Simulación de login exitoso
    errorMessage.style.display = 'none';
    
    // Mostrar pantalla de carga
    showLoadingScreen();
    
    // Simular autenticación
    setTimeout(() => {
        // Guardar sesión
        const sessionData = {
            dni: dni,
            timestamp: new Date().getTime(),
            expiresIn: 3600000 // 1 hora en milisegundos
        };
        localStorage.setItem('session', JSON.stringify(sessionData));
        
        // Redirigir a la app
        window.location.href = '../../web/index.html';
    }, 2000);
});

// Función para mostrar pantalla de carga
function showLoadingScreen() {
    const loadingHTML = `
        <div class="loading-screen">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h2>Accediendo a tu cuenta...</h2>
                <p>Preparando tu experiencia Sabadell First</p>
            </div>
        </div>
    `;
    
    document.body.innerHTML += loadingHTML;
}

// Efectos hover modernos para inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});

// Efecto adicional al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const appIcon = document.querySelector('.app-icon');
    setTimeout(() => {
        appIcon.style.transform = 'scale(1.1)';
        setTimeout(() => {
            appIcon.style.transform = 'scale(1)';
        }, 300);
    }, 500);
});