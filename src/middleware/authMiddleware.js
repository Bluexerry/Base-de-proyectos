import jwt from 'jsonwebtoken';
import config from '../config.js';
import AppError from '../utils/AppError.js';
import User from '../model/User.js';

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('No tienes permisos para realizar esta acción', 403, 'FORBIDDEN'));
        }
        next();
    };
};

export const protect = async (req, res, next) => {
    // Leer token desde cookie httpOnly (método seguro)
    const token = req.cookies?.token;

    if (!token) {
        return next(new AppError('No autorizado para acceder a esta ruta', 401, 'NO_TOKEN'));
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new AppError('El usuario ya no existe', 401, 'USER_NOT_FOUND'));
        }

        req.user = user;
        next();
    } catch (error) {
        next(new AppError('Token inválido', 401, 'INVALID_TOKEN'));
    }
};

export default { protect, restrictTo };