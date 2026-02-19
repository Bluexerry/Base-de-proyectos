import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from '../routes/index.js';
import { errorHandler, notFound } from '../middleware/errorHandler.js';

/**
 * Configuración de Express
 */
const configureExpress = (app) => {
    // Middlewares básicos
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Logger solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Ruta raíz simple
    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'Backend Evenor API funcionando correctamente',
            version: '1.0.0',
            endpoints: {
                diagnostic: '/api/diagnostic',
            }
        });
    });

    // Rutas principales
    app.use('/api', routes);

    // Manejo de rutas no encontradas
    app.use(notFound);

    // Middleware de manejo de errores (debe ir al final)
    app.use(errorHandler);
};

export default configureExpress;