/**
 * Componente para mostrar las cuentas bancarias del usuario
 */

export class Accounts {
    constructor(appState) {
        this.appState = appState;
        this.container = document.getElementById('contenedor-cuentas');
    }

    /**
     * Renderiza todas las cuentas bancarias
     */
    render() {
        if (!this.container) return;

        const cuentas = this.appState.getState().cuentas;

        if (!cuentas || cuentas.length === 0) {
            this.container.innerHTML = '<p class="mensaje-vacio">No tienes cuentas bancarias registradas</p>';
            return;
        }

        // Calcular saldo total
        const saldoTotal = cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0);

        // Generar HTML de resumen
        const resumenHTML = this.renderResumen(saldoTotal, cuentas.length);

        // Generar HTML de las cuentas
        const cuentasHTML = cuentas.map(cuenta => this.renderCuenta(cuenta)).join('');

        this.container.innerHTML = `
            ${resumenHTML}
            <div class="lista-cuentas">
                ${cuentasHTML}
            </div>
        `;

        // Agregar event listeners para los botones de detalles
        this.setupEventListeners();
    }

    /**
     * Renderiza el resumen de cuentas
     */
    renderResumen(saldoTotal, totalCuentas) {
        return `
            <div class="resumen-cuentas">
                <div class="resumen-item">
                    <div class="resumen-label">Saldo Total</div>
                    <div class="resumen-valor saldo-total">${saldoTotal.toFixed(2)}€</div>
                </div>
                <div class="resumen-item">
                    <div class="resumen-label">Cuentas Activas</div>
                    <div class="resumen-valor">${totalCuentas}</div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza una tarjeta de cuenta individual
     */
    renderCuenta(cuenta) {
        const ibanFormateado = this.formatearIBAN(cuenta.iban);
        const saldoClass = cuenta.saldo >= 0 ? 'saldo-positivo' : 'saldo-negativo';

        return `
            <div class="tarjeta-cuenta" data-cuenta-id="${cuenta.id}" style="border-left: 4px solid ${cuenta.color}">
                <div class="cuenta-header">
                    <div class="cuenta-info-principal">
                        <div class="cuenta-icono" style="background: ${cuenta.color}20">
                            <i class="fi ${cuenta.icono}" style="color: ${cuenta.color}"></i>
                        </div>
                        <div class="cuenta-nombre-tipo">
                            <h3 class="cuenta-nombre">${cuenta.nombre}</h3>
                            <span class="cuenta-tipo">${cuenta.tipo}</span>
                        </div>
                    </div>
                    <div class="cuenta-estado ${cuenta.estado.toLowerCase()}">
                        <span class="estado-badge">${cuenta.estado}</span>
                    </div>
                </div>

                <div class="cuenta-saldo">
                    <div class="saldo-label">Saldo Disponible</div>
                    <div class="saldo-cantidad ${saldoClass}">${cuenta.saldo.toFixed(2)}€</div>
                </div>

                <div class="cuenta-iban">
                    <div class="iban-label">
                        <i class="fi fi-rr-credit-card"></i>
                        IBAN
                    </div>
                    <div class="iban-numero">${ibanFormateado}</div>
                    <button class="btn-copiar-iban" data-iban="${cuenta.iban}" title="Copiar IBAN">
                        <i class="fi fi-rr-copy"></i>
                    </button>
                </div>

                <div class="cuenta-acciones">
                    <button class="btn-accion btn-transferir" data-cuenta-id="${cuenta.id}">
                        <i class="fi fi-rr-arrow-right"></i>
                        Transferir
                    </button>
                    <button class="btn-accion btn-detalles" data-cuenta-id="${cuenta.id}">
                        <i class="fi fi-rr-chart-line-up"></i>
                        Movimientos
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Formatea el IBAN para mejor legibilidad
     */
    formatearIBAN(iban) {
        // Eliminar espacios existentes y agregar espacios cada 4 caracteres
        return iban.replace(/\s/g, '').match(/.{1,4}/g).join(' ');
    }

    /**
     * Configura los event listeners para las acciones
     */
    setupEventListeners() {
        // Copiar IBAN
        const btnsCopiar = document.querySelectorAll('.btn-copiar-iban');
        btnsCopiar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const iban = e.currentTarget.getAttribute('data-iban');
                this.copiarIBAN(iban, e.currentTarget);
            });
        });

        // Botones de transferir
        const btnsTransferir = document.querySelectorAll('.btn-transferir');
        btnsTransferir.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cuentaId = e.currentTarget.getAttribute('data-cuenta-id');
                this.mostrarTransferir(cuentaId);
            });
        });

        // Botones de detalles
        const btnsDetalles = document.querySelectorAll('.btn-detalles');
        btnsDetalles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cuentaId = e.currentTarget.getAttribute('data-cuenta-id');
                this.mostrarDetalles(cuentaId);
            });
        });
    }

    /**
     * Copia el IBAN al portapapeles
     */
    async copiarIBAN(iban, boton) {
        try {
            await navigator.clipboard.writeText(iban);

            // Feedback visual
            const iconoOriginal = boton.innerHTML;
            boton.innerHTML = '<i class="fi fi-rr-check"></i>';
            boton.classList.add('copiado');

            setTimeout(() => {
                boton.innerHTML = iconoOriginal;
                boton.classList.remove('copiado');
            }, 2000);

        } catch (err) {
            console.error('Error al copiar IBAN:', err);
            alert('No se pudo copiar el IBAN');
        }
    }

    /**
     * Muestra el diálogo de transferir
     */
    mostrarTransferir(cuentaId) {
        const cuenta = this.appState.getState().cuentas.find(c => c.id === parseInt(cuentaId));
        if (cuenta) {
            alert(`Funcionalidad de transferencia desde "${cuenta.nombre}" próximamente disponible`);
        }
    }

    /**
     * Muestra los detalles y movimientos de la cuenta
     */
    mostrarDetalles(cuentaId) {
        const cuenta = this.appState.getState().cuentas.find(c => c.id === parseInt(cuentaId));
        if (cuenta) {
            alert(`Ver movimientos de "${cuenta.nombre}" próximamente disponible`);
        }
    }
}
