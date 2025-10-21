# IBHF25

### Proyecto Sabadell Teens

###### Idea:
> Creación de una APP para menores

Qué problemas resuelve
 - Falta de acceso a Sabadell para menores.
 - Captación de nuevos clientes. A la larga se quedan en Sabadell.
 - Falta de educación financiera en los más jóvenes: ir introduciendo la mentalidad inversora antes 
 - Eliminar ideas malas y mitos sobre las entidades bancarias.
   
Público objetivo
 - Menores de edad entre 14 y 17 años.

Cuota de mercado
 - En 2025: +2.5 Millones de jóvenes entre 14 y 17 años.

Pantallas esenciales de una app de banca
Autenticación y Seguridad

Login/Inicio de sesión: Con opciones de usuario/contraseña, biometría (huella, Face ID)
Registro: Para nuevos usuarios
Recuperación de contraseña
Verificación de identidad: OTP, código SMS, email

Pantallas Principales

Home/Dashboard: Vista general con resumen de cuentas, movimientos recientes, accesos rápidos
Menú principal: Navegación entre secciones

Cuentas y Saldos

Lista de cuentas: Todas las cuentas del usuario
Detalle de cuenta: Saldo, movimientos, información de la cuenta
Movimientos/Historial: Transacciones detalladas con filtros

Transferencias y Pagos

Nueva transferencia: Formulario para enviar dinero
Gestión de beneficiarios: Añadir, editar, eliminar contactos
Confirmación de transferencia: Resumen antes de ejecutar
Comprobante: Recibo de la operación realizada

Tarjetas

Mis tarjetas: Lista de tarjetas de débito/crédito
Detalle de tarjeta: Saldo, límite, movimientos, opciones (bloquear, activar)

Otras Funcionalidades Básicas
Para los padres/tutores:
 - limites de gasto(semanal o mensual)
 - resumen de gastos(semanal o mensual)
 - según el resumen de gastos hacer recomendaciones ajustadas.

Agrega amigos:
 - sin acceso a ver el dinero que tienen los demás.
 - ranking de los mas ahorradores.
 - misiones conjuntas de gasto responsable.
   
Cashback: 
 - cada vez que compran, un porcentaje va a una hucha de ahorro automático.
 - habitos saludables 5% cashback, si no 0%.
 - 
 - “Has recuperado 0,40 €. Si hicieras esto cada semana, ahorrarías 20 € al año”.

Notificaciones: Centro de alertas y mensajes
Perfil/Configuración: Datos personales, preferencias, seguridad
Ayuda/Soporte: FAQ, chat, contacto
Cerrar sesión


---

## Estructura del Proyecto

```
IBHF25/
├── src/                    # Código fuente
│   ├── css/               # Hojas de estilo
│   │   └── styles.css     # Estilos principales
│   ├── js/                # JavaScript
│   │   └── app.js         # Lógica de la aplicación
│   └── assets/            # Recursos (imágenes, iconos, etc.)
├── index.html             # Página principal
├── Dockerfile             # Configuración de contenedor
├── .gitignore             # Archivos ignorados por Git
└── README.md              # Documentación
```

## Despliegue

### Con Docker/Podman:

```bash
# Construir la imagen
docker build -t sabadell-first .

# Crear el pod
podman pod create --name sabadell-first -p 8080:80

# Ejecutar el contenedor
podman run -d --pod sabadell-first --name sabadell-first-container ibhf25
```

### Desarrollo local:

Simplemente abre `index.html` en tu navegador, o usa un servidor local:

```bash
# Con Python
python -m http.server 8080

# Con Node.js (npx)
npx serve

# Con PHP
php -S localhost:8080
```

Accede a la aplicación en: `http://localhost:8080`
