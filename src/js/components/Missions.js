/**
 * Componente de Misiones
 */

export class Missions {
    constructor(appState) {
        this.appState = appState;
        this.contenedor = document.getElementById('contenedor-misiones');
    }

    /**
     * Renderiza todas las misiones
     */
    render() {
        const { misiones } = this.appState.getState();

        this.contenedor.innerHTML = misiones.map(mision => `
            <div class="tarjeta-mision">
                <div class="titulo-mision">
                    <i class="fi ${mision.icono}"></i> ${mision.titulo}
                </div>
                <div class="descripcion-mision">${mision.descripcion}</div>
                <div class="recompensa-mision">${mision.recompensa}</div>
                <div class="progreso-mision">
                    <div class="texto-progreso-mision">Progreso: ${mision.progreso}%</div>
                    <div class="barra-progreso-mision">
                        <div class="relleno-progreso-mision" style="width: ${mision.progreso}%"></div>
                    </div>
                </div>
                <button class="boton ${mision.completada ? 'boton-exito' : 'boton-principal'}"
                        data-mision-id="${mision.id}"
                        ${mision.completada ? 'disabled' : ''}>
                    ${mision.completada ? '<i class="fi fi-rr-check"></i> Completada' : 'Comenzar Misión'}
                </button>
            </div>
        `).join('');

        // Añadir event listeners a los botones (sin onclick inline)
        this.attachEventListeners();
    }

    /**
     * Añade event listeners a los botones de misión
     */
    attachEventListeners() {
        const botones = this.contenedor.querySelectorAll('button[data-mision-id]');
        botones.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const misionId = parseInt(e.target.getAttribute('data-mision-id'));
                this.handleMissionClick(misionId);
            });
        });
    }

    /**
     * Manejador del click en una misión
     * Nota: Este método será sobrescrito por el controlador principal
     */
    handleMissionClick(misionId) {
        console.log(`Misión ${misionId} clickeada`);
    }

    /**
     * Establece el callback para cuando se hace click en una misión
     */
    setOnMissionClick(callback) {
        this.handleMissionClick = callback;
    }
}
