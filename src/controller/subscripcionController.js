import newsLetterService from '../service/newsLetterService.js';
import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import Newsletter from '../model/Newsletter.js';

/**
 * Suscribir un usuario al newsletter
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const suscripcionController = async (req, res, next) => {
    try {
        const { email, name } = req.body;

        // Validación básica
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'El email es requerido'
            });
        }

        // Suscribir al newsletter
        const resultado = await newsLetterService.suscripcion(email, name);

        logger.info(`Usuario suscrito al newsletter: ${email}`);

        res.status(201).json({
            success: true,
            message: 'Suscripción exitosa',
            data: resultado
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mostrar página de confirmación de desuscripción
 */
export const desuscripcionPorTokenController = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).send(`
                <html>
                    <head>
                        <title>Error de Desuscripción</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            .error { color: #d32f2f; }
                        </style>
                    </head>
                    <body>
                        <h1 class="error">Error</h1>
                        <p>El token es requerido para desuscribirse.</p>
                    </body>
                </html>
            `);
        }

        let email = '';
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            const subscriber = await Newsletter.findById(decoded.id);
            email = subscriber ? subscriber.email : '';
        } catch (error) {
            email = '';
        }

        return res.status(200).send(`
            <html>
                <head>
                    <title>Confirmar Desuscripción</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px;
                            background-color: #f5f5f5;
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 0 auto;
                            background: white;
                            padding: 40px;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .warning { color: #ff9800; }
                        .button-group {
                            margin-top: 30px;
                        }
                        a, button {
                            padding: 12px 30px;
                            margin: 0 10px;
                            font-size: 16px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            transition: background-color 0.3s;
                            text-decoration: none;
                            display: inline-block;
                        }
                        .btn-confirm {
                            background-color: #d32f2f;
                            color: white;
                        }
                        .btn-confirm:hover {
                            background-color: #b71c1c;
                        }
                        .btn-cancel {
                            background-color: #ccc;
                            color: #333;
                        }
                        .btn-cancel:hover {
                            background-color: #999;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="warning">⚠ Confirmar Desuscripción</h1>
                        <p>¿Estás seguro de que deseas desuscribirte ?</p>
                        <p>Ya no recibirás más correos de nosotros.</p>
                        
                        <div class="button-group">
                            <button type="button" class="btn-cancel" onclick="window.close();">
                                Cancelar
                            </button>
                            <form style="display: inline;" method="POST" action="/api/newsletter/desuscribirse/${token}">
                                <button type="submit" class="btn-confirm">
                                    Sí, desuscribirme
                                </button>
                            </form>
                        </div>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        next(error);
    }
};

/**
 * Procesar la desuscripción después de confirmar
 */
export const confirmarDesuscripcionController = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).send(`
                <html>
                    <head>
                        <title>Error</title>
                        <style>body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }</style>
                    </head>
                    <body>
                        <h1>Error</h1>
                        <p>Token inválido.</p>
                    </body>
                </html>
            `);
        }

        const resultado = await newsLetterService.desuscripcion(token);

        logger.info(`Usuario desuscrito del newsletter mediante token`);

        return res.status(200).send(`
            <html>
                <head>
                    <title>Desuscripción Exitosa</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px;
                            background-color: #f5f5f5;
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 0 auto;
                            background: white;
                            padding: 40px;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .success { color: #4caf50; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="success">✓ Desuscripción Exitosa</h1>
                        <p>Has sido desuscrito exitosamente .</p>
                        <p>Se ha enviado una confirmación a tu email: <strong>${resultado.email}</strong></p>
                        <p>Si cambias de opinión, puedes suscribirte nuevamente en cualquier momento.</p>
                        <hr>
                        <p style="color: #666; font-size: 12px;"></p>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        next(error);
    }
};

export default {
    suscripcionController,
    desuscripcionPorTokenController,
    confirmarDesuscripcionController
};