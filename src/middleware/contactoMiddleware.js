import AppError from '../utils/AppError.js';

/**
 * Middleware para validar los datos de contacto
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const validateContacto = (req, res, next) => {
    const { to, subject, html } = req.body;

    // Validar que los campos requeridos estén presentes
    // El campo "to" es requerido
    if (!to) {
        return next(new AppError('El campo "to" (destinatario) es requerido', 400, 'MISSING_FIELD_TO'));
    }
    // El campo "subject" es requerido
    if (!subject) {
        return next(new AppError('El campo "subject" (asunto) es requerido', 400, 'MISSING_FIELD_SUBJECT'));
    }
    // El campo "html" es requerido
    if (!html) {
        return next(new AppError('El campo "html" (contenido) es requerido', 400, 'MISSING_FIELD_HTML'));
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
        return next(new AppError('El formato del email no es válido', 400, 'INVALID_EMAIL_FORMAT'));
    }

    // Validar longitud del subject
    // El asunto debe tener al menos 3 caracteres
    // Esto es para evitar asuntos demasiado cortos que no sean informativos
    if (subject.trim().length < 3) {
        return next(new AppError('El asunto debe tener al menos 3 caracteres', 400, 'SUBJECT_TOO_SHORT'));
    }

    // Validar longitud del html
    if (html.trim().length < 10) {
        return next(new AppError('El contenido debe tener al menos 10 caracteres', 400, 'CONTENT_TOO_SHORT'));
    }

    next();
};

export default { validateContacto };