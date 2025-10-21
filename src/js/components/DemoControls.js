/**
 * Componente de Controles de Demo
 */
export class DemoControls {
    constructor(appState, transactionService) {
        this.appState = appState;
        this.transactionService = transactionService;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botón añadir dinero
        document.getElementById('añadir-dinero')?.addEventListener('click', () => {
            this.transactionService.simularTransaccion(20, 'Paga extra');
        });

        // Botón gastar dinero
        document.getElementById('gastar-dinero')?.addEventListener('click', () => {
            this.transactionService.simularTransaccion(-15, 'Compra juegos');
        });

        // Botón completar misión
        document.getElementById('completar-mision')?.addEventListener('click', () => {
            this.completarMisionAleatoria();
        });

        // Botón reiniciar demo
        document.getElementById('reiniciar-demo')?.addEventListener('click', () => {
            this.reiniciarDemo();
        });
    }

    completarMisionAleatoria() {
        const misionesIncompletas = this.appState.getMisionesIncompletas();
        
        if (misionesIncompletas.length > 0) {
            const misionAleatoria = misionesIncompletas[
                Math.floor(Math.random() * misionesIncompletas.length)
            ];
            this.transactionService.completarMision(misionAleatoria.id);
        } else {
            alert('¡Todas las misiones están completadas! 🏆');
        }
    }

    reiniciarDemo() {
        this.appState.reset();
        alert('Demo reiniciada 🔄');
    }
}