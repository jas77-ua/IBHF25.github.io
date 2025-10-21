/**
 * Componente de Estadísticas de Gastos
 */

export class Statistics {
    constructor(appState) {
        this.appState = appState;
        this.periodoActual = 'mes'; // día, semana, mes, año, todo

        // Configuración de categorías con iconos y colores
        this.categorias = {
            comida: { nombre: 'Comida y Restaurantes', icono: 'fi-rr-hamburger', color: '#FF6B6B' },
            ocio: { nombre: 'Ocio y Entretenimiento', icono: 'fi-rr-gamepad', color: '#4ECDC4' },
            suscripciones: { nombre: 'Suscripciones', icono: 'fi-rr-refresh', color: '#95E1D3' },
            compras: { nombre: 'Compras', icono: 'fi-rr-shopping-cart', color: '#F38181' },
            ropa: { nombre: 'Ropa y Moda', icono: 'fi-rr-shirt', color: '#AA96DA' },
            transporte: { nombre: 'Transporte', icono: 'fi-rr-car', color: '#FCBAD3' },
            ahorro: { nombre: 'Ahorro', icono: 'fi-rr-piggy-bank', color: '#00C853' },
            ingresos: { nombre: 'Ingresos', icono: 'fi-rr-arrow-trend-up', color: '#00D084' },
            otros: { nombre: 'Otros', icono: 'fi-rr-apps', color: '#95A5A6' }
        };
    }

    /**
     * Renderiza el componente
     */
    render() {
        const container = document.getElementById('contenedor-estadisticas');
        if (!container) return;

        const transacciones = this.appState.getState().transacciones;
        const transaccionesFiltradas = this.filtrarPorPeriodo(transacciones, this.periodoActual);

        const estadisticas = this.calcularEstadisticas(transaccionesFiltradas);
        const categorizado = this.categorizarGastos(transaccionesFiltradas);

        container.innerHTML = `
            ${this.renderFiltros()}
            ${this.renderResumen(estadisticas)}
            ${this.renderGastosPorCategoria(categorizado, estadisticas.totalGastos)}
            ${this.renderTransaccionesRecientes(transaccionesFiltradas)}
        `;

        this.setupEventListeners();
    }

    /**
     * Renderiza los filtros de período
     */
    renderFiltros() {
        return `
            <div class="filtros-periodo">
                <button class="btn-filtro ${this.periodoActual === 'dia' ? 'activo' : ''}" data-periodo="dia">
                    Hoy
                </button>
                <button class="btn-filtro ${this.periodoActual === 'semana' ? 'activo' : ''}" data-periodo="semana">
                    Semana
                </button>
                <button class="btn-filtro ${this.periodoActual === 'mes' ? 'activo' : ''}" data-periodo="mes">
                    Mes
                </button>
                <button class="btn-filtro ${this.periodoActual === 'año' ? 'activo' : ''}" data-periodo="año">
                    Año
                </button>
                <button class="btn-filtro ${this.periodoActual === 'todo' ? 'activo' : ''}" data-periodo="todo">
                    Todo
                </button>
            </div>
        `;
    }

    /**
     * Renderiza el resumen de gastos/ingresos
     */
    renderResumen(estadisticas) {
        const balance = estadisticas.totalIngresos - estadisticas.totalGastos;
        const balanceClass = balance >= 0 ? 'positivo' : 'negativo';

        return `
            <div class="resumen-estadisticas">
                <div class="stat-card ingresos">
                    <div class="stat-icono">
                        <i class="fi fi-rr-arrow-trend-up"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-label">Ingresos</div>
                        <div class="stat-valor">${estadisticas.totalIngresos.toFixed(2)}€</div>
                    </div>
                </div>

                <div class="stat-card gastos">
                    <div class="stat-icono">
                        <i class="fi fi-rr-arrow-trend-down"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-label">Gastos</div>
                        <div class="stat-valor">${estadisticas.totalGastos.toFixed(2)}€</div>
                    </div>
                </div>

                <div class="stat-card balance ${balanceClass}">
                    <div class="stat-icono">
                        <i class="fi fi-rr-chart-line-up"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-label">Balance</div>
                        <div class="stat-valor ${balanceClass}">${balance.toFixed(2)}€</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza el desglose de gastos por categoría
     */
    renderGastosPorCategoria(categorizado, totalGastos) {
        if (totalGastos === 0) {
            return `
                <div class="seccion-categorias">
                    <h3 class="titulo-subseccion">
                        <i class="fi fi-rr-chart-pie"></i>
                        Gastos por Categoría
                    </h3>
                    <p class="mensaje-vacio">No hay gastos en este período</p>
                </div>
            `;
        }

        const categoriasOrdenadas = Object.entries(categorizado)
            .filter(([_, data]) => data.total > 0)
            .sort((a, b) => b[1].total - a[1].total);

        const categoriasHTML = categoriasOrdenadas.map(([categoria, data]) => {
            const porcentaje = (data.total / totalGastos) * 100;
            const config = this.categorias[categoria] || this.categorias.otros;

            return `
                <div class="categoria-item">
                    <div class="categoria-header">
                        <div class="categoria-info">
                            <div class="categoria-icono" style="background: ${config.color}20">
                                <i class="fi ${config.icono}" style="color: ${config.color}"></i>
                            </div>
                            <div class="categoria-nombre-count">
                                <div class="categoria-nombre">${config.nombre}</div>
                                <div class="categoria-count">${data.cantidad} transacciones</div>
                            </div>
                        </div>
                        <div class="categoria-monto">${data.total.toFixed(2)}€</div>
                    </div>
                    <div class="categoria-barra">
                        <div class="categoria-progreso" style="width: ${porcentaje}%; background: ${config.color}"></div>
                    </div>
                    <div class="categoria-porcentaje">${porcentaje.toFixed(1)}% del total</div>
                </div>
            `;
        }).join('');

        return `
            <div class="seccion-categorias">
                <h3 class="titulo-subseccion">
                    <i class="fi fi-rr-chart-pie"></i>
                    Gastos por Categoría
                </h3>
                <div class="lista-categorias">
                    ${categoriasHTML}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza las transacciones recientes del período
     */
    renderTransaccionesRecientes(transacciones) {
        const transaccionesGastos = transacciones
            .filter(t => t.tipo === 'negativo')
            .slice(0, 10);

        if (transaccionesGastos.length === 0) {
            return '';
        }

        const transaccionesHTML = transaccionesGastos.map(t => {
            const config = this.categorias[t.categoria] || this.categorias.otros;

            return `
                <div class="transaccion-reciente">
                    <div class="transaccion-icono" style="background: ${config.color}20">
                        <i class="fi ${config.icono}" style="color: ${config.color}"></i>
                    </div>
                    <div class="transaccion-detalles">
                        <div class="transaccion-nombre">${t.nombre}</div>
                        <div class="transaccion-fecha">${t.fecha}</div>
                    </div>
                    <div class="transaccion-cantidad negativa">-${t.cantidad.toFixed(2)}€</div>
                </div>
            `;
        }).join('');

        return `
            <div class="seccion-transacciones-recientes">
                <h3 class="titulo-subseccion">
                    <i class="fi fi-rr-list"></i>
                    Transacciones Recientes
                </h3>
                <div class="lista-transacciones-recientes">
                    ${transaccionesHTML}
                </div>
            </div>
        `;
    }

    /**
     * Filtra transacciones por período
     */
    filtrarPorPeriodo(transacciones, periodo) {
        const ahora = new Date();
        const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

        return transacciones.filter(t => {
            if (!t.fechaCompleta) return true; // Incluir si no tiene fecha

            const fechaTransaccion = new Date(t.fechaCompleta);

            switch(periodo) {
                case 'dia':
                    return fechaTransaccion >= inicioHoy;

                case 'semana':
                    const inicioDeSemana = new Date(inicioHoy);
                    inicioDeSemana.setDate(inicioDeSemana.getDate() - inicioHoy.getDay());
                    return fechaTransaccion >= inicioDeSemana;

                case 'mes':
                    const inicioDeMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
                    return fechaTransaccion >= inicioDeMes;

                case 'año':
                    const inicioDeAño = new Date(ahora.getFullYear(), 0, 1);
                    return fechaTransaccion >= inicioDeAño;

                case 'todo':
                default:
                    return true;
            }
        });
    }

    /**
     * Calcula estadísticas de las transacciones
     */
    calcularEstadisticas(transacciones) {
        const totalIngresos = transacciones
            .filter(t => t.tipo === 'positivo')
            .reduce((sum, t) => sum + t.cantidad, 0);

        const totalGastos = transacciones
            .filter(t => t.tipo === 'negativo')
            .reduce((sum, t) => sum + t.cantidad, 0);

        return {
            totalIngresos,
            totalGastos,
            numeroTransacciones: transacciones.length
        };
    }

    /**
     * Categoriza los gastos
     */
    categorizarGastos(transacciones) {
        const gastos = transacciones.filter(t => t.tipo === 'negativo');
        const categorizado = {};

        gastos.forEach(gasto => {
            const categoria = gasto.categoria || 'otros';

            if (!categorizado[categoria]) {
                categorizado[categoria] = {
                    total: 0,
                    cantidad: 0,
                    transacciones: []
                };
            }

            categorizado[categoria].total += gasto.cantidad;
            categorizado[categoria].cantidad += 1;
            categorizado[categoria].transacciones.push(gasto);
        });

        return categorizado;
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        const btnsFiltro = document.querySelectorAll('.btn-filtro');
        btnsFiltro.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.periodoActual = e.currentTarget.getAttribute('data-periodo');
                this.render();
            });
        });
    }
}
