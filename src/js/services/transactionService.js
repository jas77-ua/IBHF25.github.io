/**
 * Servicio de Transacciones
 * Contiene la lógica de negocio relacionada con transacciones y misiones
 */

import { TIPOS_TRANSACCION } from '../config/constants.js';

export class TransactionService {
    constructor(appState) {
        this.appState = appState;
    }

    /**
     * Simula una transacción (ingreso o gasto)
     */
    simularTransaccion(cantidad, descripcion, cuentaId = null) {
        const state = this.appState.getState();

        // Si no se especifica cuenta, usar la cuenta corriente principal
        let cuentaObjetivo;
        if (cuentaId) {
            cuentaObjetivo = state.cuentas.find(c => c.id === cuentaId);
        } else {
            // Buscar la primera cuenta corriente
            cuentaObjetivo = state.cuentas.find(c => c.tipo === 'Corriente') || state.cuentas[0];
        }

        if (cuentaObjetivo) {
            // Actualizar saldo de la cuenta
            const nuevoSaldo = cuentaObjetivo.saldo + cantidad;
            this.appState.updateSaldoCuenta(cuentaObjetivo.id, nuevoSaldo);
        }

        // Crear nueva transacción
        const nuevaTransaccion = {
            id: state.transacciones.length + 1,
            nombre: descripcion,
            cantidad: Math.abs(cantidad),
            fecha: 'Ahora mismo',
            tipo: cantidad > 0 ? TIPOS_TRANSACCION.POSITIVO : TIPOS_TRANSACCION.NEGATIVO,
            cuentaId: cuentaObjetivo ? cuentaObjetivo.id : null
        };

        // Añadir transacción al estado
        this.appState.addTransaccion(nuevaTransaccion);

        return nuevaTransaccion;
    }

    /**
     * Completa una misión
     */
    completarMision(idMision) {
        const mision = this.appState.getMision(idMision);

        if (!mision || mision.completada) {
            return null;
        }

        // Marcar misión como completada
        this.appState.updateMision(idMision, {
            completada: true,
            progreso: 100
        });

        // Procesar recompensa económica si existe
        if (mision.recompensa.includes('+€')) {
            const coincidenciaRecompensa = mision.recompensa.match(/\+€(\d+)/);
            if (coincidenciaRecompensa) {
                const cantidadRecompensa = parseInt(coincidenciaRecompensa[1]);
                this.simularTransaccion(cantidadRecompensa, `Recompensa: ${mision.titulo}`);
            }
        }

        return mision;
    }
}
