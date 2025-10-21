/**
 * Componente de Balance y Progreso de Ahorro
 */

import { APP_CONFIG } from '../config/constants.js';

export class Balance {
    constructor(appState) {
        this.appState = appState;
        this.elementoSaldo = document.getElementById('saldo');
        this.textoProgreso = document.getElementById('texto-progreso');
        this.rellenoProgreso = document.getElementById('relleno-progreso');
    }

    /**
     * Renderiza el saldo y progreso
     */
    render() {
        const { metaAhorro } = this.appState.getState();

        // Obtener saldo total de todas las cuentas
        const saldo = this.appState.getSaldoTotal();

        // Actualizar saldo
        this.elementoSaldo.textContent = `${saldo.toFixed(2)}€`;

        // Actualizar progreso
        const progreso = (saldo / metaAhorro) * 100;
        const porcentajeProgreso = Math.min(progreso, 100);

        this.textoProgreso.textContent = `${Math.round(porcentajeProgreso)}%`;
        this.rellenoProgreso.style.width = `${porcentajeProgreso}%`;
    }

    /**
     * Anima el cambio de saldo
     */
    animateSaldoChange() {
        this.elementoSaldo.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.elementoSaldo.style.transform = 'scale(1)';
        }, APP_CONFIG.DURACION_ANIMACION_SALDO_MS);
    }
}
