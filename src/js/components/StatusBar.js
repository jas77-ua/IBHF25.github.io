/**
 * Componente de Barra de Estado
 */
export class StatusBar {
    constructor() {
        this.horaElement = document.getElementById('hora-actual');
        this.updateClock();
        this.startClock();
    }

    updateClock() {
        const now = new Date();
        this.horaElement.textContent = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    startClock() {
        // Actualizar cada minuto
        setInterval(() => this.updateClock(), 60000);
    }
}