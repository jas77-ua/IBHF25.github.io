/**
 * Componente de Transacciones
 */

export class Transactions {
    constructor(appState) {
        this.appState = appState;
        this.contenedor = document.getElementById('contenedor-transacciones');
    }

    /**
     * Renderiza todas las transacciones
     */
    render() {
        const { transacciones } = this.appState.getState();

        this.contenedor.innerHTML = transacciones.map(transaccion => `
            <div class="elemento-transaccion">
                <div class="info-transaccion">
                    <div class="nombre-transaccion">${transaccion.nombre}</div>
                    <div class="fecha-transaccion">${transaccion.fecha}</div>
                </div>
                <div class="cantidad-transaccion ${transaccion.tipo}">
                    ${transaccion.tipo === 'positivo' ? '+' : '-'}${transaccion.cantidad.toFixed(2)}€
                </div>
            </div>
        `).join('');
    }
}
