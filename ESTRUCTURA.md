# 📁 Estructura del Proyecto - Sabadell NEXT

## 🎯 Objetivos de la Refactorización

✅ **Separación de concerns**: HTML, CSS y JavaScript completamente separados
✅ **Modularización**: Código organizado en módulos ES6 reutilizables
✅ **Escalabilidad**: Arquitectura preparada para crecer
✅ **Mantenibilidad**: Código más fácil de mantener y testear
✅ **Sin código inline**: Eliminados todos los `onclick` y estilos inline

---

## 📂 Estructura de Directorios

```
/
├── index.html                          # Punto de entrada HTML (limpio)
├── src/
│   ├── js/
│   │   ├── main.js                    # 🚀 Punto de entrada JS
│   │   ├── config/
│   │   │   └── constants.js           # Constantes y configuración global
│   │   ├── data/
│   │   │   └── initialState.js        # Estado inicial de la aplicación
│   │   ├── state/
│   │   │   └── appState.js            # Gestión centralizada del estado
│   │   ├── components/
│   │   │   ├── Balance.js             # Componente de saldo y progreso
│   │   │   ├── Missions.js            # Componente de misiones
│   │   │   ├── Transactions.js        # Componente de transacciones
│   │   │   └── Clock.js               # Componente de reloj
│   │   ├── services/
│   │   │   └── transactionService.js  # Lógica de negocio
│   │   └── utils/
│   │       └── helpers.js             # Funciones auxiliares
│   ├── css/
│   │   ├── main.css                   # 🎨 CSS principal (importa todos)
│   │   ├── base/
│   │   │   ├── variables.css          # Variables CSS (colores, espaciados)
│   │   │   └── reset.css              # Reset de estilos
│   │   ├── layout/
│   │   │   ├── statusBar.css          # Barra de estado
│   │   │   ├── header.css             # Encabezado con saldo
│   │   │   └── navigation.css         # Navegación inferior
│   │   └── components/
│   │       ├── missions.css           # Estilos de misiones
│   │       ├── transactions.css       # Estilos de transacciones
│   │       └── controls.css           # Botones y controles
│   └── assets/
│       └── favicon.ico
└── ESTRUCTURA.md                       # Este archivo
```

---

## 🔧 Arquitectura de JavaScript

### **1. Sistema de Módulos ES6**

Todo el JavaScript usa módulos ES6 con `import/export`:

```javascript
// constants.js
export const APP_CONFIG = { ... };

// main.js
import { APP_CONFIG } from './config/constants.js';
```

### **2. Gestión de Estado Centralizada**

El estado de la aplicación está centralizado en `appState.js`:

```javascript
import { appState } from './state/appState.js';

// Obtener estado
const { saldo, misiones } = appState.getState();

// Actualizar estado
appState.updateSaldo(150);

// Suscribirse a cambios
appState.subscribe(state => console.log('Estado actualizado:', state));
```

### **3. Patrón de Componentes**

Cada componente es una clase que:
- Recibe el estado en el constructor
- Tiene un método `render()` para actualizar la UI
- Gestiona sus propios event listeners

```javascript
class Balance {
    constructor(appState) { ... }
    render() { ... }
    animateSaldoChange() { ... }
}
```

### **4. Separación de Lógica de Negocio**

La lógica está en servicios (`transactionService.js`):

```javascript
transactionService.simularTransaccion(20, 'Paga extra');
transactionService.completarMision(1);
```

---

## 🎨 Arquitectura de CSS

### **1. Variables CSS Reutilizables**

Todos los colores, espaciados y tamaños están en `variables.css`:

```css
:root {
    --color-primario: #00A3E0;
    --espaciado-md: 15px;
    --border-radius-lg: 20px;
}
```

### **2. Organización por Capas**

- **Base**: Reset y variables globales
- **Layout**: Estructura general (header, navigation, statusBar)
- **Components**: Componentes específicos (missions, transactions, controls)

### **3. Imports en Cascada**

`main.css` importa todos los módulos en orden:

```css
@import 'base/variables.css';
@import 'base/reset.css';
@import 'layout/statusBar.css';
/* ... */
```

---

## 🚀 Flujo de la Aplicación

1. **Carga inicial** (`index.html`)
   - Carga `main.css` (que importa todos los CSS)
   - Carga `main.js` como módulo (`type="module"`)

2. **Inicialización** (`main.js`)
   - Crea instancia de `appState` con datos iniciales
   - Crea instancia de `transactionService`
   - Crea componentes (Balance, Missions, Transactions, Clock)
   - Renderiza todos los componentes
   - Configura event listeners (sin código inline)
   - Inicia el reloj

3. **Interacción del usuario**
   - Usuario hace click en botón
   - Event listener captura el evento
   - Se llama al servicio correspondiente
   - El servicio actualiza el estado
   - El estado notifica a los componentes suscritos
   - Los componentes se re-renderizan automáticamente

---

## 📋 Mejoras Implementadas

### **JavaScript**

✅ Eliminados `onclick` inline → Eventos con `addEventListener`
✅ Código monolítico → 9 archivos modulares
✅ Datos hardcodeados → Separados en `initialState.js`
✅ Funciones globales → Métodos de clase encapsulados
✅ Sin gestión de estado → Estado centralizado con patrón Observable
✅ Lógica mezclada → Separada en servicios

### **CSS**

✅ Un archivo de 402 líneas → 9 archivos organizados
✅ Valores hardcodeados → Variables CSS reutilizables
✅ Estilos mezclados → Separados por responsabilidad
✅ Difícil de mantener → Fácil de encontrar y modificar

### **HTML**

✅ Completamente limpio
✅ Sin JavaScript inline
✅ Sin estilos inline
✅ Referencias actualizadas a módulos

---

## 🔄 Cómo Añadir Nuevas Funcionalidades

### **1. Añadir una nueva página/vista**

```javascript
// 1. Crear componente en src/js/components/NuevaPagina.js
export class NuevaPagina {
    constructor(appState) { ... }
    render() { ... }
}

// 2. Importar y usar en main.js
import { NuevaPagina } from './components/NuevaPagina.js';
```

### **2. Añadir nuevos datos**

```javascript
// Editar src/js/data/initialState.js
export const initialState = {
    // ... datos existentes
    nuevosDatos: [ ... ]
};
```

### **3. Añadir nueva lógica de negocio**

```javascript
// Crear método en src/js/services/transactionService.js
nuevaFuncionalidad() {
    // Lógica aquí
    this.appState.updateState({ ... });
}
```

### **4. Añadir nuevos estilos**

```css
/* Crear archivo en src/css/components/nuevo.css */
.nuevo-componente { ... }

/* Importar en src/css/main.css */
@import 'components/nuevo.css';
```

---

## 🧪 Testing (Preparado para)

La nueva estructura facilita el testing:

```javascript
// Test unitario de un componente
import { Balance } from './components/Balance.js';
import { appState } from './state/appState.js';

test('Balance renderiza correctamente', () => {
    const balance = new Balance(appState);
    balance.render();
    // Assertions...
});
```

---

## 📝 Notas Importantes

- **Módulos ES6**: Requiere servidor HTTP (no funciona con `file://`)
- **Compatibilidad**: Navegadores modernos (ES6+)
- **Archivos antiguos**: Renombrados a `.old` para referencia
- **Imports de CSS**: No todos los navegadores soportan `@import` en producción, considerar usar un bundler

---

## 🎓 Principios Aplicados

- **Single Responsibility Principle**: Cada módulo tiene una única responsabilidad
- **Separation of Concerns**: HTML, CSS y JS completamente separados
- **DRY (Don't Repeat Yourself)**: Variables y funciones reutilizables
- **Observable Pattern**: Sistema de suscripciones para cambios de estado
- **Component Pattern**: UI dividida en componentes reutilizables
- **Service Pattern**: Lógica de negocio en servicios dedicados

---

## 🚀 Próximos Pasos Sugeridos

1. **Bundler**: Webpack/Vite para optimizar producción
2. **TypeScript**: Añadir tipos para mayor robustez
3. **Testing**: Jest/Vitest para tests unitarios
4. **Router**: Sistema de rutas para navegación real
5. **API**: Conectar con backend real
6. **State Management**: Considerar Zustand/Redux si crece mucho

---

**Refactorización completada por Claude Code** 🤖
