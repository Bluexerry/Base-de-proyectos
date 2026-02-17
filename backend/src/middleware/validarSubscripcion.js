import AppError from '../utils/AppError.js';

/**
 * Middleware para validar los datos de suscripción al newsletter
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const validateSuscripcion = (req, res, next) => {
    const { email, name } = req.body;

    // Validar que el email esté presente
    if (!email) {
        return next(new AppError('El campo "email" es requerido', 400, 'MISSING_EMAIL'));
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new AppError('El formato del email no es válido', 400, 'INVALID_EMAIL_FORMAT'));
    }

    // Validar que el email no esté vacío
    if (email.trim().length === 0) {
        return next(new AppError('El email no puede estar vacío', 400, 'EMPTY_EMAIL'));
    }

    // Validar que el name no sea demasiado largo
    if (name && name.trim().length > 100) {
        return next(new AppError('El nombre no puede tener más de 100 caracteres', 400, 'NAME_TOO_LONG'));
    }

    // Validar que el name tenga al menos 2 caracteres si se proporciona
    if (name && name.trim().length < 2) {
        return next(new AppError('El nombre debe tener al menos 2 caracteres', 400, 'NAME_TOO_SHORT'));
    }

    next();
};

export default { validateSuscripcion };