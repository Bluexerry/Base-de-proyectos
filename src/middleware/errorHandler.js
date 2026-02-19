import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

// Manejar errores de MongoDB duplicados
const handleDuplicateKeyError = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    return new AppError(`El valor ${value} ya existe. Por favor use otro valor`, 400, 'DUPLICATE_VALUE');
};

// Manejar errores de validación de Mongoose
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Datos inválidos. ${errors.join('. ')}`;
    return new AppError(message, 400, 'VALIDATION_ERROR');
};

// Manejar errores de ID de Mongo inválido
const handleCastError = (err) => {
    return new AppError(`ID inválido: ${err.value}`, 400, 'INVALID_ID');
};

// Manejar errores de JWT
const handleJWTError = () => {
    return new AppError('Token inválido. Por favor inicie sesión de nuevo', 401, 'INVALID_TOKEN');
};

// Manejar errores de expiración de JWT
const handleJWTExpiredError = () => {
    return new AppError('Su token ha expirado. Por favor inicie sesión de nuevo', 401, 'EXPIRED_TOKEN');
};

// Respuesta de error para desarrollo
const sendErrorDev = (err, res) => {
    logger.error(`Error en desarrollo: ${err.message}`, {
        stack: err.stack,
        statusCode: err.statusCode
    });
    
    res.status(err.statusCode || 500).json({
        success: false,
        status: err.status,
        message: err.message,
        errorCode: err.errorCode,
        error: err,
        stack: err.stack,
    });
};

// Respuesta de error para producción
const sendErrorProd = (err, res) => {
    // Errores operacionales (conocidos) se envían al cliente
    if (err.isOperational) {
        logger.error(`Error operacional: ${err.message}`, {
            statusCode: err.statusCode,
            errorCode: err.errorCode
        });
        
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            errorCode: err.errorCode
        });
    }
    // Errores de programación o desconocidos no se envían al cliente
    else {
        // Registrar error en el servidor
        logger.error('Error desconocido 💥', {
            message: err.message,
            stack: err.stack
        });

        // Enviar mensaje genérico
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Algo salió mal'
        });
    }
};

/**
 * Middleware para manejo centralizado de errores
 */
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Comprobación del entorno actual
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Manejo de errores específicos...
        if (err.name === 'CastError') error = handleCastError(err);
        if (err.code === 11000) error = handleDuplicateKeyError(err);
        if (err.name === 'ValidationError') error = handleValidationError(err);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

// Middleware para capturar errores 404
export const notFound = (req, res, next) => {
    logger.warn(`Ruta no encontrada: ${req.originalUrl}`);
    const error = new AppError(`Ruta no encontrada - ${req.originalUrl}`, 404, 'NOT_FOUND');
    next(error);
};