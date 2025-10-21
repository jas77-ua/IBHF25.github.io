/**
 * Funciones auxiliares y utilidades
 */

/**
 * Formatea una cantidad como moneda en euros
 */
export function formatCurrency(cantidad) {
    return `${cantidad.toFixed(2)}€`;
}

/**
 * Calcula el porcentaje de progreso
 */
export function calcularPorcentaje(actual, meta) {
    return Math.min((actual / meta) * 100, 100);
}

/**
 * Añade clase CSS temporalmente para animaciones
 */
export function addTemporaryClass(elemento, className, duration = 300) {
    elemento.classList.add(className);
    setTimeout(() => elemento.classList.remove(className), duration);
}

/**
 * Valida que un número sea positivo
 */
export function esNumeroPositivo(numero) {
    return typeof numero === 'number' && numero > 0;
}

/**
 * Debounce function para limitar llamadas
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
