/**
 * Estado inicial de la aplicación
 */

import { APP_CONFIG, TIPOS_TRANSACCION } from '../config/constants.js';

export const initialState = {
    // El saldo se calcula dinámicamente desde las cuentas
    saldo: 0, // Fallback si no hay cuentas
    metaAhorro: APP_CONFIG.META_AHORRO_DEFAULT,
    
    tarjetas: [
        {
            id: 1,
            nombre: "Tarjeta Sabadell First",
            numero: "4532123456784321",
            bloqueada: false,
            titular: "Default",
            tipo: "Débito",
            vencimiento: "12/27",
            disponible: 500.00
        },
        {
            id: 2,
            nombre: "Tarjeta Sabadell Young",
            numero: "4532987656895",
            bloqueada: false,
            titular: "Default",
            tipo: "Prepago",
            vencimiento: "12/27",
            disponible: 150.00
        }
    ],

    cuentas: [
        {
            id: 1,
            nombre: "Cuenta Corriente Joven",
            tipo: "Corriente",
            iban: "ES91 2100 0418 4502 0005 1332",
            saldo: 127.80,
            estado: "Activa",
            color: "#42D9FF",
            icono: "fi-rr-wallet"
        },
        {
            id: 2,
            nombre: "Cuenta Ahorro Plus",
            tipo: "Ahorro",
            iban: "ES76 2100 0418 4512 0006 2443",
            saldo: 250.00,
            estado: "Activa",
            color: "#00C853",
            icono: "fi-rr-piggy-bank"
        },
        {
            id: 3,
            nombre: "Hucha Digital",
            tipo: "Ahorro",
            iban: "ES32 2100 0418 4522 0007 3554",
            saldo: 75.50,
            estado: "Activa",
            color: "#FF6B35",
            icono: "fi-rr-coins"
        }
    ],

    misiones: [
        {
            id: 1,
            titulo: "Primer Ahorro Épico",
            icono: "fi-rr-piggy-bank",
            descripcion: "Ahorra 50€ este mes y gana recompensas especiales",
            recompensa: "+5€ bonus + Insignia",
            completada: false,
            progreso: 65
        },
        {
            id: 2,
            titulo: "Cazador de Estafas",
            icono: "fi-rr-shield-check",
            descripcion: "Aprende a identificar 3 casos de phishing reales",
            recompensa: "Avatar Exclusivo",
            completada: false,
            progreso: 30
        },
        {
            id: 3,
            titulo: "Inversor Novato",
            icono: "fi-rr-chart-line-up",
            descripcion: "Simula una inversión de 1000€ en bolsa virtual",
            recompensa: "Desbloqueo Simulador Avanzado",
            completada: false,
            progreso: 10
        }
    ],

    transacciones: [
        {
            id: 1,
            nombre: "Paga Extra Papás",
            cantidad: 20,
            fecha: "Hoy, 10:30",
            tipo: TIPOS_TRANSACCION.POSITIVO,
            categoria: "ingresos",
            fechaCompleta: new Date()
        },
        {
            id: 2,
            nombre: "Steam - Videojuego",
            cantidad: 29.99,
            fecha: "Ayer, 16:45",
            tipo: TIPOS_TRANSACCION.NEGATIVO,
            categoria: "ocio",
            fechaCompleta: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
            id: 3,
            nombre: "Ahorro Automático",
            cantidad: 10,
            fecha: "11 Oct, 08:00",
            tipo: TIPOS_TRANSACCION.POSITIVO,
            categoria: "ahorro",
            fechaCompleta: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
            id: 4,
            nombre: "McDonald's",
            cantidad: 12.50,
            fecha: "14 Oct, 19:20",
            tipo: TIPOS_TRANSACCION.NEGATIVO,
            categoria: "comida",
            fechaCompleta: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        {
            id: 5,
            nombre: "Spotify Premium",
            cantidad: 9.99,
            fecha: "13 Oct, 12:00",
            tipo: TIPOS_TRANSACCION.NEGATIVO,
            categoria: "suscripciones",
            fechaCompleta: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
            id: 6,
            nombre: "Netflix",
            cantidad: 12.99,
            fecha: "10 Oct, 09:00",
            tipo: TIPOS_TRANSACCION.NEGATIVO,
            categoria: "suscripciones",
            fechaCompleta: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        },
        {
            id: 7,
            nombre: "Zara",
            cantidad: 45.00,
            fecha: "9 Oct, 17:30",
            tipo: TIPOS_TRANSACCION.NEGATIVO,
            categoria: "ropa",
            fechaCompleta: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
        },
        {
            id: 8,
            nombre: "Starbucks",
            cantidad: 5.20,
            fecha: "8 Oct, 11:15",
            tipo: TIPOS_TRANSACCION.NEGATIVO,
            categoria: "comida",
            fechaCompleta: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        {
            id: 9,
            nombre: "Cine Yelmo",
            cantidad: 8.50,
            fecha: "7 Oct, 20:00",
            tipo: TIPOS_TRANSACCION.NEGATIVO,
            categoria: "ocio",
            fechaCompleta: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
        },
        {
            id: 10,
            nombre: "Paga Mensual",
            cantidad: 50,
            fecha: "1 Oct, 08:00",
            tipo: TIPOS_TRANSACCION.POSITIVO,
            categoria: "ingresos",
            fechaCompleta: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000)
        },
        {
            id: 11,
            nombre: "Burger King",
            cantidad: 9.30,
            fecha: "5 Oct, 14:30",
            tipo: TIPOS_TRANSACCION.NEGATIVO,
            categoria: "comida",
            fechaCompleta: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
        },
        {
            id: 12,
            nombre: "Amazon - Auriculares",
            cantidad: 35.99,
            fecha: "3 Oct, 10:20",
            tipo: TIPOS_TRANSACCION.NEGATIVO,
            categoria: "compras",
            fechaCompleta: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
    ]
};
