/**
 * Gestión centralizada del estado de la aplicación
 */

import { initialState } from '../data/initialState.js';

class AppState {
    constructor() {
        this.state = { ...initialState };
        this.listeners = [];
    }

    /**
     * Obtiene el estado actual
     */
    getState() {
        return this.state;
    }

    /**
     * Actualiza el estado y notifica a los listeners
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    /**
     * Actualiza el saldo
     */
    updateSaldo(nuevoSaldo) {
        this.setState({ saldo: nuevoSaldo });
    }

    /**
     * Añade una transacción
     */
    addTransaccion(transaccion) {
        const transacciones = [transaccion, ...this.state.transacciones];
        this.setState({ transacciones });
    }

    /**
     * Actualiza una misión
     */
    updateMision(idMision, cambios) {
        const misiones = this.state.misiones.map(mision =>
            mision.id === idMision ? { ...mision, ...cambios } : mision
        );
        this.setState({ misiones });
    }

    /**
     * Obtiene una misión por ID
     */
    getMision(idMision) {
        return this.state.misiones.find(m => m.id === idMision);
    }

    /**
     * Obtiene misiones no completadas
     */
    getMisionesIncompletas() {
        return this.state.misiones.filter(m => !m.completada);
    }

    /**
     * Calcula el saldo total de todas las cuentas
     */
    getSaldoTotal() {
        if (!this.state.cuentas || this.state.cuentas.length === 0) {
            return this.state.saldo || 0;
        }
        return this.state.cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0);
    }

    /**
     * Obtiene el saldo de la cuenta principal (primera cuenta corriente)
     */
    getSaldoPrincipal() {
        if (!this.state.cuentas || this.state.cuentas.length === 0) {
            return this.state.saldo || 0;
        }
        const cuentaPrincipal = this.state.cuentas.find(c => c.tipo === 'Corriente') || this.state.cuentas[0];
        return cuentaPrincipal.saldo;
    }

    /**
     * Actualiza el saldo de una cuenta específica
     */
    updateSaldoCuenta(cuentaId, nuevoSaldo) {
        const cuentas = this.state.cuentas.map(cuenta =>
            cuenta.id === cuentaId ? { ...cuenta, saldo: nuevoSaldo } : cuenta
        );
        this.setState({ cuentas });
    }

    /**
     * Actualiza el estado de la tarjeta
     */
    updateTarjetas(tarjetas) {
        this.setState({ tarjetas });
    }

    /**
     * Reinicia el estado a los valores iniciales
     */
    reset() {
        this.state = JSON.parse(JSON.stringify(initialState));
        this.notifyListeners();
    }

    /**
     * Suscribe un listener para cambios de estado
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notifica a todos los listeners
     */
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Singleton: exportamos una única instancia
export const appState = new AppState();
