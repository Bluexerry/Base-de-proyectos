import AppError from '../utils/AppError.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Al menos 8 caracteres, una mayúscula, una minúscula y un número
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2)
        return next(new AppError('El nombre debe tener al menos 2 caracteres', 400, 'INVALID_NAME'));

    if (!email || !emailRegex.test(email))
        return next(new AppError('El formato del email no es válido', 400, 'INVALID_EMAIL_FORMAT'));

    if (!password || !passwordRegex.test(password))
        return next(new AppError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número', 400, 'WEAK_PASSWORD'));

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !emailRegex.test(email))
        return next(new AppError('El formato del email no es válido', 400, 'INVALID_EMAIL_FORMAT'));

    if (!password)
        return next(new AppError('La contraseña es requerida', 400, 'MISSING_PASSWORD'));

    next();
};

export default { validateRegister, validateLogin };
