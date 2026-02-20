import AppError from '../utils/AppError.js';

export const validateSuscripcion = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('El campo "email" es requerido', 400, 'MISSING_EMAIL'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new AppError('El formato del email no es válido', 400, 'INVALID_EMAIL_FORMAT'));
    }

    next();
};

export default { validateSuscripcion };