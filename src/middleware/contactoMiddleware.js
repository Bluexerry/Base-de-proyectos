import AppError from '../utils/AppError.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateContacto = (req, res, next) => {
    const { subject, html, userEmail } = req.body;
    if (!subject) return next(new AppError('El campo "subject" es requerido', 400, 'MISSING_FIELD_SUBJECT'));
    if (!html) return next(new AppError('El campo "html" es requerido', 400, 'MISSING_FIELD_HTML'));
    if (subject.trim().length < 3) return next(new AppError('El asunto debe tener al menos 3 caracteres', 400, 'SUBJECT_TOO_SHORT'));
    if (subject.trim().length > 100) return next(new AppError('El asunto no puede superar 100 caracteres', 400, 'SUBJECT_TOO_LONG'));
    if (html.trim().length < 10) return next(new AppError('El contenido debe tener al menos 10 caracteres', 400, 'CONTENT_TOO_SHORT'));
    if (html.trim().length > 5000) return next(new AppError('El contenido no puede superar 5000 caracteres', 400, 'CONTENT_TOO_LONG'));
    if (userEmail && !emailRegex.test(userEmail)) return next(new AppError('El formato del email de contacto no es válido', 400, 'INVALID_USER_EMAIL'));
    next();
};

export default { validateContacto };
