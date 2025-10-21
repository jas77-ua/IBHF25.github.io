/**
 * Punto de entrada principal de la aplicación Sabadell NEXT
 */

import { appState } from './state/appState.js';
import { TransactionService } from './services/transactionService.js';
import { Balance } from './components/Balance.js';
import { Missions } from './components/Missions.js';
import { Transactions } from './components/Transactions.js';
import { Card } from './components/Card.js';
import { Accounts } from './components/Accounts.js';
import { Transfers } from './components/Transfers.js';
import { Statistics } from './components/Statistics.js';

const misionesData = [
    {
        id: 1,
        titulo: "Primer Ahorro Épico",
        descripcion: "Ahorra 50€ este mes y gana recompensas especiales",
        recompensa: 5,
        bonus: true,
        insignia: true,
        progreso: 65,
        completada: false,
        categoria: "ahorro"
    },
    {
        id: 2,
        titulo: "Cazador de Estafas", 
        descripcion: "Aprende a identificar 3 casos de phishing reales",
        recompensa: 3,
        bonus: false,
        insignia: true,
        progreso: 100,
        completada: false,
        categoria: "educacion"
    },
    {
        id: 3,
        titulo: "Inversor Novato",
        descripcion: "Simula una inversión de 1000€ en bolsa virtual",
        recompensa: 4,
        bonus: true,
        insignia: false,
        progreso: 100,
        completada: false,
        categoria: "educacion"
    },
    {
        id: 4,
        titulo: "Planificador Semanal",
        descripcion: "Crea tu primer presupuesto semanal y síguelo 7 días",
        recompensa: 6,
        bonus: false,
        insignia: true,
        progreso: 25,
        completada: false,
        categoria: "ahorro"
    },
    {
        id: 5,
        titulo: "Reto Ahorro 24/7",
        descripcion: "No gastes dinero en entretenimiento por 24 horas",
        recompensa: 8,
        bonus: true,
        insignia: true,
        progreso: 0,
        completada: false,
        categoria: "ahorro"
    },
    {
        id: 6,
        titulo: "Explorador Bancario",
        descripcion: "Descubre 3 funciones nuevas de la app",
        recompensa: 2,
        bonus: false,
        insignia: false,
        progreso: 33,
        completada: false,
        categoria: "recompensas"
    }
];

class App {
    constructor() {
        this.appState = appState;
        this.transactionService = new TransactionService(this.appState);

        // Componentes
        this.balanceComponent = null;
        this.missionsComponent = null;
        this.transactionsComponent = null;
        this.cardComponent = null;
        this.accountsComponent = null;
        this.transfersComponent = null;
        this.statisticsComponent = null;
        this.legalFooter = null;

        // Elementos del perfil
        this.perfilOverlay = document.getElementById('pagina-perfil');
        this.inputNombre = document.getElementById('perfil-nombre');
        this.inputEmail = document.getElementById('perfil-email');
        this.inputAvatarUrl = document.getElementById('perfil-avatar-url');
        this.imgAvatar = document.getElementById('perfil-avatar');
        this.MISIONES_KEY = 'app_misiones_v1';
        
        this.PERFIL_KEY = 'app_perfil_v1';
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        // Crear componentes
        this.balanceComponent = new Balance(this.appState);
        this.missionsComponent = new Missions(this.appState);
        this.transactionsComponent = new Transactions(this.appState);
        this.cardComponent = new Card(this.appState, (pagina) => this.navegarAPagina(pagina));
        this.accountsComponent = new Accounts(this.appState);
        this.transfersComponent = new Transfers(this.appState);
        this.statisticsComponent = new Statistics(this.appState);

        // Configurar callback de misiones
        this.missionsComponent.setOnMissionClick((misionId) => {
            this.handleCompletarMision(misionId);
        });

        // Inicializar transfers
        this.transfersComponent.init();

        // Configurar navegación
        this.setupNavigation();

        // Configurar eventos del perfil
        this.setupPerfilEvents();

        // Renderizar contenido inicial
        this.render();

        // Suscribirse a cambios de estado
        this.appState.subscribe(() => this.render());

        // Cargar datos del perfil
        this.cargarPerfilInicial();

        this.cargarDatosMisiones();

        this.setupLegalFooter();

        console.log('🚀 Aplicación Sabadell NEXT iniciada correctamente');
    }

    /**
     * Renderiza todos los componentes
     */
    render() {
        this.balanceComponent.render();
        this.missionsComponent.render();
        this.transactionsComponent.render();
        this.cardComponent.render();
        this.accountsComponent.render();
        this.transfersComponent.render();
        this.statisticsComponent.render();
    }

    /**
     * Maneja la finalización de una misión
     */
    handleCompletarMision(misionId) {
        const mision = this.transactionService.completarMision(misionId);

        if (mision) {
            this.balanceComponent.animateSaldoChange();
            alert(`🎉 ¡Misión completada! Recompensa: ${mision.recompensa}`);
        }
    }

    setupLegalFooter() {
        this.legalFooter = new LegalFooter();
    }

    /**
     * Configura la navegación inferior
     */
    setupNavigation() {
        const elementosNav = document.querySelectorAll('.elemento-nav');
        const menuItems = document.querySelectorAll('.menu-item');

        // Navegación inferior (desktop)
        elementosNav.forEach(elemento => {
            elemento.addEventListener('click', (e) => {
                // Obtener página
                const pagina = e.currentTarget.getAttribute('data-pagina');
                console.log(`Navegando a: ${pagina}`);

                // Manejar navegación específica
                this.navegarAPagina(pagina);
            });
        });

        // Navegación menú lateral (móvil)
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                // Obtener página
                const pagina = e.currentTarget.getAttribute('data-pagina');
                console.log(`Navegando a: ${pagina}`);

                // Cerrar menú móvil
                this.cerrarMenuMovil();

                // Manejar navegación específica
                this.navegarAPagina(pagina);
            });
        });

        // Configurar menú hamburguesa
        this.setupHamburgerMenu();
    }

    /**
     * Configura el menú hamburguesa para móviles
     */
    setupHamburgerMenu() {
        const botonHamburguesa = document.getElementById('boton-hamburguesa');
        const botonCerrar = document.getElementById('boton-cerrar-menu');
        const menuLateral = document.getElementById('menu-lateral');
        const menuOverlay = document.getElementById('menu-overlay');

        if (!botonHamburguesa || !menuLateral || !menuOverlay) return;

        // Abrir menú
        botonHamburguesa.addEventListener('click', () => {
            this.abrirMenuMovil();
        });

        // Cerrar menú con botón X
        if (botonCerrar) {
            botonCerrar.addEventListener('click', () => {
                this.cerrarMenuMovil();
            });
        }

        // Cerrar menú con overlay
        menuOverlay.addEventListener('click', () => {
            this.cerrarMenuMovil();
        });
    }

    /**
     * Abre el menú móvil
     */
    abrirMenuMovil() {
        const botonHamburguesa = document.getElementById('boton-hamburguesa');
        const menuLateral = document.getElementById('menu-lateral');
        const menuOverlay = document.getElementById('menu-overlay');

        botonHamburguesa.classList.add('activo');
        menuLateral.classList.add('abierto');
        menuOverlay.classList.add('visible');

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cierra el menú móvil
     */
    cerrarMenuMovil() {
        const botonHamburguesa = document.getElementById('boton-hamburguesa');
        const menuLateral = document.getElementById('menu-lateral');
        const menuOverlay = document.getElementById('menu-overlay');

        botonHamburguesa.classList.remove('activo');
        menuLateral.classList.remove('abierto');
        menuOverlay.classList.remove('visible');

        // Restaurar scroll del body
        document.body.style.overflow = '';
    }

    /**
     * Maneja la navegación entre páginas
     */
    navegarAPagina(pagina) {
        // Remover clase activo de todos los elementos de navegación
        document.querySelectorAll('.elemento-nav').forEach(nav => nav.classList.remove('activo'));
        document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('activo'));

        // Añadir clase activo al elemento correspondiente
        document.querySelectorAll(`[data-pagina="${pagina}"]`).forEach(el => {
            el.classList.add('activo');
        });

        // Cerrar perfil si está abierto
        this.cerrarPerfilOverlay();

        switch(pagina) {
            case 'inicio':
                console.log('Navegando a página de inicio');
                this.mostrarVista('inicio');
                break;
            case 'cuentas':
                console.log('Navegando a página de cuentas');
                this.mostrarVista('cuentas');
                break;
            case 'tarjetas':
                console.log('Navegando a página de tarjetas');
                this.mostrarVista('tarjetas');
                break;
            case 'transferencias':
                console.log('Navegando a página de transferencias');
                this.mostrarVista('transferencias');
                break;
            case 'misiones':
                console.log('Navegando a página de misiones');
                this.mostrarVista('misiones');
                break;
            case 'sabadingo':
                // Navegar a la página de SabaDingo
                this.navegarASabaDingo();
                break;
            case 'touch-share':
                // Navegar a la página de Touch & Share
                this.mostrarVista('touch-share');
                //this.navegarATouchShare();
                break;
            case 'estadisticas':
                console.log('Navegando a página de estadísticas');
                this.mostrarVista('estadisticas');
                break;
            case 'perfil':
                console.log('Navegando a página de perfil');
                // Abrir el overlay de perfil
                this.abrirPerfil();
                break;
            case 'misiones':
                console.log('Navegando a página de misiones');
                this.cerrarPerfilOverlay();
                // Ocultar sección inicio y mostrar misiones detalladas
                document.getElementById('seccion-inicio').style.display = 'none';
                document.getElementById('seccion-transacciones').style.display = 'none';
                document.getElementById('seccion-misiones-detalladas').style.display = 'block';
                this.renderMisionesDetalladas();
                break;
            case 'legal':
                this.legalFooter.mostrarFooter();
                break;
            default:
                console.log('Página no reconocida:', pagina);
        }
    }

    /**
     * Muestra una vista específica y oculta las demás
     */
    mostrarVista(nombreVista) {
        // Ocultar todas las vistas
        document.querySelectorAll('.vista-pagina').forEach(vista => {
            vista.style.display = 'none';
        });

        // Mostrar la vista seleccionada
        const vistaActiva = document.querySelector(`[data-vista="${nombreVista}"]`);
        if (vistaActiva) {
            vistaActiva.style.display = 'block';
        }

        // Mostrar/ocultar encabezado según la vista
        const encabezado = document.querySelector('[data-vista-header]');
        if (encabezado) {
            const vistaHeader = encabezado.getAttribute('data-vista-header');
            encabezado.style.display = (vistaHeader === nombreVista) ? 'block' : 'none';
        }

        // Si estamos en la vista de tarjetas, resetear el historial
        if (nombreVista === 'tarjetas') {
            const historialContainer = document.getElementById('historial-tarjeta-contenedor');
            const tarjetaDetalle = document.querySelector('.tarjeta-detalle');
            if (historialContainer) {
                historialContainer.style.display = 'none';
            }
            if (tarjetaDetalle) {
                tarjetaDetalle.style.display = 'block';
            }
        }

        // Hacer scroll al inicio del contenido
        const contenidoApp = document.querySelector('.contenido-app');
        if (contenidoApp) {
            contenidoApp.scrollTop = 0;
        }

        console.log(`Vista activa: ${nombreVista}`);
    }

    /**
     * Navega a la página de Touch & Share
     */
    navegarATouchShare() {
        // CAMBIA ESTA URL POR LA QUE TÚ QUIERAS
        const urlTouchShare = '../src/index/touch_share.html'; 
        
        // Redirigir a la página
        window.location.href = urlTouchShare;
        
        console.log('🔗 Navegando a Touch & Share:', urlTouchShare);
    }

    /**
     * Navega a la página de SabaDingo
     */
    navegarASabaDingo() {
        // CAMBIA ESTA URL POR LA RUTA A TU HTML DE SABADINGO
        const urlSabaDingo = '../src/index/sabaDingo.html';

        // Redirigir a la página
        window.location.href = urlSabaDingo;

        console.log('🎓 Navegando a SabaDingo:', urlSabaDingo);
    }


    /**
     * Configura los eventos del perfil
     */
    setupPerfilEvents() {
        const cerrarPerfil = document.getElementById('cerrar-perfil');
        const cerrarPerfil2 = document.getElementById('cerrar-perfil-2');
        const guardarPerfilBtn = document.getElementById('guardar-perfil');
        const logoutBtn = document.getElementById('logout-btn');

        if (cerrarPerfil) {
            cerrarPerfil.addEventListener('click', () => this.cerrarPerfilOverlay());
        }
        if (cerrarPerfil2) {
            cerrarPerfil2.addEventListener('click', () => this.cerrarPerfilOverlay());
        }
        if (guardarPerfilBtn) {
            guardarPerfilBtn.addEventListener('click', () => this.guardarPerfil());
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Actualizar avatar en tiempo real
        if (this.inputAvatarUrl) {
            this.inputAvatarUrl.addEventListener('input', (e) => {
                this.imgAvatar.src = e.target.value || '../src/assets/perfil.jpg';
            });
        }
    }

    /**
     * Abre el overlay del perfil
     */
    abrirPerfil() {
        const datos = JSON.parse(localStorage.getItem(this.PERFIL_KEY) || '{}');
        this.inputNombre.value = datos.nombre || 'Alex';
        this.inputEmail.value = datos.email || 'alex@ejemplo.com';
        this.inputAvatarUrl.value = datos.avatar || '../src/assets/perfil.jpg';
        this.imgAvatar.src = this.inputAvatarUrl.value;
        this.perfilOverlay.style.display = 'flex';
    }

    /**
     * Cierra el overlay del perfil
     */
    cerrarPerfilOverlay() {
        this.perfilOverlay.style.display = 'none';
    }

    /**
     * Guarda los datos del perfil
     */
    guardarPerfil() {
        const datos = {
            nombre: this.inputNombre.value.trim() || 'Alex',
            email: this.inputEmail.value.trim() || '',
            avatar: this.inputAvatarUrl.value.trim() || '../src/assets/perfil.jpg'
        };
        localStorage.setItem(this.PERFIL_KEY, JSON.stringify(datos));
        this.imgAvatar.src = datos.avatar;
        this.actualizarBienvenida(datos.nombre);

        // Actualizar el nombre en todas las tarjetas
        const { tarjetas } = this.appState.getState();
        const tarjetasActualizadas = tarjetas.map(tarjeta => ({
            ...tarjeta,
            titular: datos.nombre.toUpperCase()
        }));
        this.appState.updateTarjetas(tarjetasActualizadas);
        
        this.cerrarPerfilOverlay();
    }

    /**
     * Actualiza el mensaje de bienvenida
     */
    actualizarBienvenida(nombre) {
        const textoBienvenida = document.querySelector('.texto-bienvenida');
        if (textoBienvenida) {
            textoBienvenida.innerHTML = `¡Hola, ${nombre}! <i class="fi fi-rr-hand-wave"></i>`;
        }
    }

    /**
     * Cierra sesión
     */
    logout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            localStorage.removeItem(this.PERFIL_KEY);
            window.location.href = '../src/index/login.html';
        }
    }

    /**
     * Carga los datos iniciales del perfil
     */
    cargarPerfilInicial() {
        const datos = JSON.parse(localStorage.getItem(this.PERFIL_KEY) || '{}');
        if (datos.nombre) {
            this.actualizarBienvenida(datos.nombre);
            
            // Actualizar el nombre en todas las tarjetas
            const { tarjetas } = this.appState.getState();
            const tarjetasActualizadas = tarjetas.map(tarjeta => ({
                ...tarjeta,
                titular: datos.nombre.toUpperCase()
            }));
            this.appState.updateTarjetas(tarjetasActualizadas);
        }
    }

        /**
     * Renderiza las misiones en la vista detallada
     */
    renderMisionesDetalladas() {
        const contenedor = document.getElementById('misiones-detalladas-container');
        const misiones = this.appState.getMisiones();
        
        contenedor.innerHTML = misiones.map(mision => `
            <div class="mision-detallada ${mision.completada ? 'completada' : ''}" 
                data-categoria="${mision.categoria}">
                <div class="mision-header">
                    <div>
                        <div class="mision-titulo">${mision.titulo}</div>
                        <div class="mision-descripcion">${mision.descripcion}</div>
                    </div>
                    <div class="mision-recompensa ${mision.completada ? 'completada' : ''}">
                        ${mision.completada ? '✅ Completada' : `+${mision.recompensa}€`}
                    </div>
                </div>
                
                <div class="mision-detalles">
                    ${mision.bonus ? `<div class="bonus"><i class="fas fa-star"></i>+${mision.recompensa}€ bonus</div>` : ''}
                    ${mision.insignia ? `<div class="insignia"><i class="fas fa-medal"></i>Insignia</div>` : ''}
                </div>
                
                <div class="mision-progreso">
                    <div class="progreso-texto">
                        <span>Progreso</span>
                        <span>${mision.progreso}%</span>
                    </div>
                    <div class="barra-progreso-mision">
                        <div class="relleno-progreso-mision" style="width: ${mision.progreso}%"></div>
                    </div>
                </div>
                
                <button class="boton-mision ${mision.completada ? 'completada' : ''}" 
                        onclick="app.completarMision(${mision.id})"
                        ${mision.completada ? 'disabled' : ''}>
                    ${mision.completada ? '✅ Completada' : '🎯 Comenzar Misión'}
                </button>
            </div>
        `).join('');

        this.actualizarEstadisticasMisiones();
        this.configurarFiltrosMisiones();
    }

    /**
     * Maneja la finalización de una misión
     */
    completarMision(misionId) {
        const mision = this.appState.completarMision(misionId);

        if (mision) {
            this.mostrarNotificacion(`¡Misión completada! +${mision.recompensa}€ ganados`);
            this.guardarDatosMisiones();
            this.renderMisionesDetalladas();
        }
    }

    /**
     * Actualiza las estadísticas de misiones
     */
    actualizarEstadisticasMisiones() {
        const misionesCompletadas = this.appState.getMisiones().filter(m => m.completada).length;
        const totalRecompensas = this.appState.getMisiones()
            .filter(m => m.completada)
            .reduce((sum, m) => sum + m.recompensa, 0);
        const progresoTotal = Math.round((misionesCompletadas / this.appState.getMisiones().length) * 100);

        document.getElementById('misiones-completadas').textContent = misionesCompletadas;
        document.getElementById('total-recompensas').textContent = `${totalRecompensas}€`;
        document.getElementById('progreso-total').textContent = `${progresoTotal}%`;
    }

    /**
     * Configura los filtros de misiones
     */
    configurarFiltrosMisiones() {
        const filtros = document.querySelectorAll('.filtro-btn');
        
        filtros.forEach(filtro => {
            filtro.addEventListener('click', (e) => {
                filtros.forEach(f => f.classList.remove('activo'));
                e.target.classList.add('activo');
                
                const categoria = e.target.dataset.filtro;
                this.filtrarMisiones(categoria);
            });
        });
    }

    /**
     * Filtra las misiones por categoría
     */
    filtrarMisiones(categoria) {
        const misiones = document.querySelectorAll('.mision-detallada');
        
        misiones.forEach(mision => {
            if (categoria === 'todas' || mision.dataset.categoria === categoria) {
                mision.style.display = 'block';
            } else {
                mision.style.display = 'none';
            }
        });
    }

    /**
     * Guarda los datos de misiones en localStorage
     */
    guardarDatosMisiones() {
        const datos = {
            misiones: this.appState.misiones,
            saldo: this.appState.saldo,
            transacciones: this.appState.transacciones
        };
        localStorage.setItem(this.MISIONES_KEY, JSON.stringify(datos));
    }

    /**
     * Carga los datos de misiones desde localStorage
     */
    cargarDatosMisiones() {
        const datos = JSON.parse(localStorage.getItem(this.MISIONES_KEY) || '{}');
        if (datos.misiones) {
            this.appState.misiones = datos.misiones;
        }
        if (datos.saldo !== undefined) {
            this.appState.saldo = datos.saldo;
        }
        if (datos.transacciones) {
            this.appState.transacciones = datos.transacciones;
        }
    }
}

/**
 * Sistema de Documentos Legales
 */
class LegalFooter {
    constructor() {
        this.footer = document.getElementById('footer-legal');
        this.botonFlotante = document.getElementById('boton-legal-flotante');
        this.botonCerrar = document.getElementById('cerrar-footer');
        this.tabs = document.querySelectorAll('.legal-tab');
        this.tabContents = document.querySelectorAll('.legal-tab-content');
        
        this.init();
    }
    
    init() {
        // Eventos del botón flotante
        this.botonFlotante.addEventListener('click', () => this.mostrarFooter());
        
        // Evento cerrar footer
        this.botonCerrar.addEventListener('click', () => this.ocultarFooter());
        
        // Eventos de tabs
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.cambiarTab(e));
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.footer.style.display !== 'none') {
                this.ocultarFooter();
            }
        });
        
        // Cerrar haciendo click fuera
        this.footer.addEventListener('click', (e) => {
            if (e.target === this.footer) {
                this.ocultarFooter();
            }
        });
    }
    
    mostrarFooter(tab = 'privacidad') {
        this.footer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.cambiarTabPorId(tab);
        
        // Ocultar navegación inferior temporalmente
        const navInferior = document.querySelector('.navegacion-inferior');
        if (navInferior) {
            navInferior.style.opacity = '0.3';
        }
    }
    
    ocultarFooter() {
        this.footer.style.display = 'none';
        document.body.style.overflow = '';
        
        // Restaurar navegación inferior
        const navInferior = document.querySelector('.navegacion-inferior');
        if (navInferior) {
            navInferior.style.opacity = '1';
        }
    }
    
    cambiarTab(e) {
        const tab = e.currentTarget;
        const tabId = tab.dataset.tab;
        
        this.cambiarTabPorId(tabId);
    }
    
    cambiarTabPorId(tabId) {
        // Remover activo de todos los tabs
        this.tabs.forEach(t => t.classList.remove('activo'));
        this.tabContents.forEach(c => c.classList.remove('activo'));
        
        // Activar tab seleccionado
        const tabActivo = document.querySelector(`[data-tab="${tabId}"]`);
        const contenidoActivo = document.getElementById(`${tabId}-content`);
        
        if (tabActivo && contenidoActivo) {
            tabActivo.classList.add('activo');
            contenidoActivo.classList.add('activo');
            
            // Scroll al inicio del contenido
            contenidoActivo.scrollTop = 0;
        }
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});