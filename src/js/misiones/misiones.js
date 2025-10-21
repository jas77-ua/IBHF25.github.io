// script.js

// Seleccionar todos los botones de misión
const missionButtons = document.querySelectorAll('.mission-button');

// Añadir evento a cada botón
missionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const missionCard = this.closest('.mission-card');
        const missionTitle = missionCard.querySelector('.mission-title').textContent;
        
        // Guardar el texto original
        const originalText = this.textContent;
        
        // Cambiar texto del botón temporalmente
        this.textContent = '¡Misión Iniciada!';
        this.style.background = '#00B894';
        
        // Restaurar después de 2 segundos
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
        }, 2000);
        
        // Mostrar notificación
        //showNotification(`¡Has comenzado la misión: ${missionTitle}!`);
        
        // Aumentar progreso (simulación)
        increaseProgress(missionCard);
    });
});

// Función para aumentar el progreso
function increaseProgress(missionCard) {
    const progressFill = missionCard.querySelector('.progress-fill');
    const progressText = missionCard.querySelector('.progress-text');
    
    const currentWidth = parseFloat(progressFill.style.width) || 0;
    const newWidth = Math.min(100, currentWidth + 10);
    
    progressFill.style.width = `${newWidth}%`;
    progressText.textContent = `Progreso: ${Math.round(newWidth)}%`;
    
    // Si llega al 100%, mostrar mensaje de completado
    if (newWidth >= 100) {
        setTimeout(() => {
            //showNotification('¡Misión completada! Recompensa desbloqueada.');
        }, 500);
    }
}

// Función para mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-weight: 600;
        max-width: 300px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Efecto de aparición progresiva de las tarjetas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const missionCards = document.querySelectorAll('.mission-card');
    
    missionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
// Simular progreso automático cada 10 segundos (solo para demostración)
setInterval(() => {
    const randomIndex = Math.floor(Math.random() * missionButtons.length);
    const randomCard = missionButtons[randomIndex].closest('.mission-card');
    increaseProgress(randomCard);
}, 10000);