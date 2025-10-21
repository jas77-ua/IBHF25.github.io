/**
 * Componente de Transferencias y Pagos
 */

export class Transfers {
    constructor(appState) {
        this.appState = appState;
        this.tipoActual = null;
        this.limites = {
            bizum: 50,
            nacional: 3000,
            internacional: 5000,
            propia: Infinity
        };
    }

    /**
     * Inicializa el componente
     */
    init() {
        this.setupEventListeners();
    }

    /**
     * Renderiza el componente
     */
    render() {
        // Cargar cuentas en el select
        this.cargarCuentasEnSelect();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Opciones de transferencia
        document.getElementById('transferencia-propia')?.addEventListener('click', () =>
            this.mostrarFormulario('propia'));

        document.getElementById('bizum')?.addEventListener('click', () =>
            this.mostrarFormulario('bizum'));

        document.getElementById('transferencia-nacional')?.addEventListener('click', () =>
            this.mostrarFormulario('nacional'));

        document.getElementById('transferencia-internacional')?.addEventListener('click', () =>
            this.mostrarFormulario('internacional'));

        // Botones del formulario
        document.getElementById('btn-volver-form')?.addEventListener('click', () =>
            this.ocultarFormulario());

        document.getElementById('btn-cancelar-form')?.addEventListener('click', () =>
            this.ocultarFormulario());

        document.getElementById('btn-confirmar-form')?.addEventListener('click', () =>
            this.confirmarTransferencia());

        // Validación del importe en tiempo real
        document.getElementById('importe')?.addEventListener('input', (e) =>
            this.validarImporte(e.target.value));
    }

    /**
     * Muestra el formulario de transferencia según el tipo
     */
    mostrarFormulario(tipo) {
        this.tipoActual = tipo;

        // Ocultar grid, mostrar formulario
        document.querySelector('.grid-transferencias').style.display = 'none';
        document.getElementById('formulario-transferencia').style.display = 'block';

        // Actualizar título
        const titulos = {
            propia: 'Transferencia entre mis cuentas',
            bizum: 'Enviar Bizum',
            nacional: 'Transferencia Nacional',
            internacional: 'Transferencia Internacional'
        };
        document.getElementById('titulo-formulario').textContent = titulos[tipo];

        // Cargar campos dinámicos
        this.cargarCamposDinamicos(tipo);

        // Mostrar información del límite
        this.mostrarLimite(tipo);

        // Limpiar formulario
        this.limpiarFormulario();
    }

    /**
     * Oculta el formulario
     */
    ocultarFormulario() {
        document.querySelector('.grid-transferencias').style.display = '';
        document.getElementById('formulario-transferencia').style.display = 'none';
        document.getElementById('resumen-transferencia').style.display = 'none';
        this.limpiarFormulario();
    }

    /**
     * Carga los campos dinámicos según el tipo de transferencia
     */
    cargarCamposDinamicos(tipo) {
        const container = document.getElementById('campos-dinamicos');

        switch(tipo) {
            case 'propia':
                container.innerHTML = `
                    <div class="campo-form">
                        <label for="cuenta-destino">Hacia cuenta</label>
                        <select id="cuenta-destino" class="select-cuenta">
                            <option value="">Selecciona una cuenta</option>
                        </select>
                    </div>
                `;
                this.cargarCuentasEnDestino();
                break;

            case 'bizum':
                container.innerHTML = `
                    <div class="campo-form">
                        <label for="telefono-destino">Número de teléfono</label>
                        <input type="tel" id="telefono-destino" class="input-form"
                               placeholder="+34 600 00 00 00" pattern="[0-9]{9}">
                    </div>
                `;
                break;

            case 'nacional':
                container.innerHTML = `
                    <div class="campo-form">
                        <label for="iban-destino">IBAN del destinatario</label>
                        <input type="text" id="iban-destino" class="input-form"
                               placeholder="ES00 0000 0000 0000 0000 0000" maxlength="24">
                    </div>
                    <div class="campo-form">
                        <label for="beneficiario">Nombre del beneficiario</label>
                        <input type="text" id="beneficiario" class="input-form"
                               placeholder="Nombre completo">
                    </div>
                `;
                break;

            case 'internacional':
                container.innerHTML = `
                    <div class="campo-form">
                        <label for="iban-internacional">IBAN / Número de cuenta</label>
                        <input type="text" id="iban-internacional" class="input-form"
                               placeholder="IBAN o número de cuenta">
                    </div>
                    <div class="campo-form">
                        <label for="swift">Código SWIFT/BIC</label>
                        <input type="text" id="swift" class="input-form"
                               placeholder="AAAA BB CC DDD" maxlength="11">
                    </div>
                    <div class="campo-form">
                        <label for="beneficiario-int">Nombre del beneficiario</label>
                        <input type="text" id="beneficiario-int" class="input-form"
                               placeholder="Nombre completo">
                    </div>
                `;
                break;
        }
    }

    /**
     * Carga las cuentas del usuario en el select de origen
     */
    cargarCuentasEnSelect() {
        const select = document.getElementById('cuenta-origen');
        if (!select) return;

        const { cuentas } = this.appState.getState();

        select.innerHTML = '<option value="">Selecciona una cuenta</option>';
        cuentas.forEach(cuenta => {
            const option = document.createElement('option');
            option.value = cuenta.id;
            option.textContent = `${cuenta.nombre} - ${cuenta.saldo.toFixed(2)}€`;
            select.appendChild(option);
        });
    }

    /**
     * Carga las cuentas en el select de destino (solo para transferencias propias)
     */
    cargarCuentasEnDestino() {
        const select = document.getElementById('cuenta-destino');
        if (!select) return;

        const { cuentas } = this.appState.getState();
        const cuentaOrigenId = parseInt(document.getElementById('cuenta-origen').value);

        select.innerHTML = '<option value="">Selecciona una cuenta</option>';
        cuentas.forEach(cuenta => {
            if (cuenta.id !== cuentaOrigenId) {
                const option = document.createElement('option');
                option.value = cuenta.id;
                option.textContent = `${cuenta.nombre} - ${cuenta.saldo.toFixed(2)}€`;
                select.appendChild(option);
            }
        });

        // Actualizar cuando cambie la cuenta origen
        document.getElementById('cuenta-origen')?.addEventListener('change', () => {
            this.cargarCuentasEnDestino();
        });
    }

    /**
     * Muestra el límite de la transferencia
     */
    mostrarLimite(tipo) {
        const infoLimite = document.getElementById('info-limite');
        if (!infoLimite) return;

        const limite = this.limites[tipo];
        if (limite === Infinity) {
            infoLimite.style.display = 'none';
        } else {
            infoLimite.style.display = 'block';
            infoLimite.textContent = `Límite máximo: ${limite}€`;
            infoLimite.className = 'info-limite';
        }
    }

    /**
     * Valida el importe ingresado
     */
    validarImporte(valor) {
        const importe = parseFloat(valor);
        const infoLimite = document.getElementById('info-limite');

        if (!importe || importe <= 0) {
            infoLimite.style.display = 'none';
            return false;
        }

        const limite = this.limites[this.tipoActual];
        if (importe > limite) {
            infoLimite.style.display = 'block';
            infoLimite.textContent = `⚠️ El importe supera el límite de ${limite}€`;
            infoLimite.classList.add('error');
            return false;
        } else {
            infoLimite.style.display = 'block';
            infoLimite.textContent = `✅ Importe válido (límite: ${limite}€)`;
            infoLimite.classList.remove('error');
            return true;
        }
    }

    /**
     * Confirma la transferencia
     */
    confirmarTransferencia() {
        // Validar datos
        const datos = this.obtenerDatosFormulario();

        if (!this.validarDatos(datos)) {
            return;
        }

        // Mostrar resumen
        this.mostrarResumen(datos);

        // Confirmar con el usuario
        if (confirm(`¿Confirmar transferencia de ${datos.importe}€?\n\n${datos.concepto || 'Sin concepto'}`)) {
            this.ejecutarTransferencia(datos);
        }
    }

    /**
     * Obtiene los datos del formulario
     */
    obtenerDatosFormulario() {
        const datos = {
            tipo: this.tipoActual,
            cuentaOrigen: parseInt(document.getElementById('cuenta-origen').value),
            importe: parseFloat(document.getElementById('importe').value),
            concepto: document.getElementById('concepto').value
        };

        // Campos específicos según tipo
        switch(this.tipoActual) {
            case 'propia':
                datos.cuentaDestino = parseInt(document.getElementById('cuenta-destino').value);
                break;
            case 'bizum':
                datos.telefono = document.getElementById('telefono-destino')?.value;
                break;
            case 'nacional':
                datos.iban = document.getElementById('iban-destino')?.value;
                datos.beneficiario = document.getElementById('beneficiario')?.value;
                break;
            case 'internacional':
                datos.iban = document.getElementById('iban-internacional')?.value;
                datos.swift = document.getElementById('swift')?.value;
                datos.beneficiario = document.getElementById('beneficiario-int')?.value;
                break;
        }

        return datos;
    }

    /**
     * Valida los datos del formulario
     */
    validarDatos(datos) {
        if (!datos.cuentaOrigen) {
            alert('⚠️ Selecciona una cuenta de origen');
            return false;
        }

        if (!datos.importe || datos.importe <= 0) {
            alert('⚠️ Ingresa un importe válido');
            return false;
        }

        if (datos.importe > this.limites[datos.tipo]) {
            alert(`⚠️ El importe supera el límite de ${this.limites[datos.tipo]}€`);
            return false;
        }

        // Validaciones específicas
        if (datos.tipo === 'propia' && !datos.cuentaDestino) {
            alert('⚠️ Selecciona una cuenta de destino');
            return false;
        }

        if (datos.tipo === 'bizum' && !datos.telefono) {
            alert('⚠️ Ingresa un número de teléfono');
            return false;
        }

        if ((datos.tipo === 'nacional' || datos.tipo === 'internacional') && (!datos.iban || !datos.beneficiario)) {
            alert('⚠️ Completa todos los campos requeridos');
            return false;
        }

        return true;
    }

    /**
     * Muestra el resumen de la transferencia
     */
    mostrarResumen(datos) {
        const { cuentas } = this.appState.getState();
        const cuentaOrigen = cuentas.find(c => c.id === datos.cuentaOrigen);

        let destino = '';
        switch(datos.tipo) {
            case 'propia':
                const cuentaDestino = cuentas.find(c => c.id === datos.cuentaDestino);
                destino = cuentaDestino.nombre;
                break;
            case 'bizum':
                destino = datos.telefono;
                break;
            case 'nacional':
            case 'internacional':
                destino = datos.beneficiario;
                break;
        }

        document.getElementById('resumen-desde').textContent = cuentaOrigen.nombre;
        document.getElementById('resumen-hacia').textContent = destino;
        document.getElementById('resumen-importe').textContent = `${datos.importe.toFixed(2)}€`;
        document.getElementById('resumen-transferencia').style.display = 'block';
    }

    /**
     * Ejecuta la transferencia
     */
    ejecutarTransferencia(datos) {
        const { cuentas } = this.appState.getState();
        const cuentaOrigen = cuentas.find(c => c.id === datos.cuentaOrigen);

        // Verificar saldo suficiente
        if (cuentaOrigen.saldo < datos.importe) {
            alert('⚠️ Saldo insuficiente en la cuenta de origen');
            return;
        }

        // Actualizar saldo de origen
        this.appState.updateSaldoCuenta(datos.cuentaOrigen, cuentaOrigen.saldo - datos.importe);

        // Si es transferencia propia, actualizar destino
        if (datos.tipo === 'propia') {
            const cuentaDestino = cuentas.find(c => c.id === datos.cuentaDestino);
            this.appState.updateSaldoCuenta(datos.cuentaDestino, cuentaDestino.saldo + datos.importe);
        }

        // Agregar transacción
        const nuevaTransaccion = {
            id: Date.now(),
            nombre: datos.concepto || this.obtenerNombreTransaccion(datos),
            cantidad: datos.importe,
            fecha: 'Ahora mismo',
            tipo: 'negativo',
            cuentaId: datos.cuentaOrigen
        };
        this.appState.addTransaccion(nuevaTransaccion);

        // Mostrar éxito
        alert('✅ Transferencia realizada con éxito');

        // Volver al inicio
        this.ocultarFormulario();
    }

    /**
     * Obtiene el nombre de la transacción según el tipo
     */
    obtenerNombreTransaccion(datos) {
        switch(datos.tipo) {
            case 'propia': return 'Transferencia entre cuentas';
            case 'bizum': return `Bizum a ${datos.telefono}`;
            case 'nacional': return `Transferencia a ${datos.beneficiario}`;
            case 'internacional': return `Transfer. internacional a ${datos.beneficiario}`;
            default: return 'Transferencia';
        }
    }

    /**
     * Limpia el formulario
     */
    limpiarFormulario() {
        document.getElementById('cuenta-origen').value = '';
        document.getElementById('importe').value = '';
        document.getElementById('concepto').value = '';
        document.getElementById('campos-dinamicos').innerHTML = '';
        document.getElementById('resumen-transferencia').style.display = 'none';
        document.getElementById('info-limite').style.display = 'none';
    }
}
