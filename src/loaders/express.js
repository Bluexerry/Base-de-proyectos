import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import routes from '../routes/index.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { errorHandler, notFound } from '../middleware/errorHandler.js';

/**
 * Configuración de Express
 */
const configureExpress = (app) => {
    // Cabeceras de seguridad HTTP
    app.use(helmet());

    // Parser de cookies (necesario para leer JWT de cookie httpOnly)
    app.use(cookieParser());

    // Middlewares básicos
    // CORS restringido al origen del frontend.
    // En producción, FRONTEND_URL debe apuntar al dominio real.
    // credentials:true permite enviar cookies y cabeceras de autorización.
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    }));

    // Límite de tamaño del body para prevenir ataques DoS
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Sanitización contra NoSQL injection
    // express-mongo-sanitize no es compatible con Express 5 (req.query es read-only)
    // Se sanitizan manualmente body y params
    app.use((req, res, next) => {
        req.body = mongoSanitize.sanitize(req.body);
        req.params = mongoSanitize.sanitize(req.params);
        next();
    });

    // Logger solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Ruta raíz simple
    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'CAINSA API funcionando correctamente',
            version: '1.0.0'
        });
    });

    // Rutas principales (con rate limiting general)
    app.use('/api', apiLimiter, routes);

    // Manejo de rutas no encontradas
    app.use(notFound);

    // Middleware de manejo de errores (debe ir al final)
    app.use(errorHandler);
};

export default configureExpress;