import rateLimit from 'express-rate-limit';

// Limitar intentos de login/register: 10 peticiones por 15 minutos por IP
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: {
        success: false,
        status: 'fail',
        message: 'Demasiados intentos. Por favor espera 15 minutos antes de intentarlo de nuevo.',
        errorCode: 'TOO_MANY_REQUESTS'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limitar envíos de contacto/newsletter: 5 peticiones por hora por IP
export const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5,
    message: {
        success: false,
        status: 'fail',
        message: 'Demasiados envíos desde esta IP. Por favor espera 1 hora.',
        errorCode: 'TOO_MANY_REQUESTS'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limitar peticiones generales a la API: 100 por 15 minutos por IP
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        status: 'fail',
        message: 'Demasiadas peticiones desde esta IP. Por favor espera 15 minutos.',
        errorCode: 'TOO_MANY_REQUESTS'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default { authLimiter, contactLimiter, apiLimiter };
