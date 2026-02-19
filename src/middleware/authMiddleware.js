import jwt from 'jsonwebtoken';
import config from '../config.js';
import AppError from '../utils/AppError.js';

export const protect = async (req, res, next) => {
    let token;

    // Obtener token del header
    // El token se espera en el header de autorización con el formato "Bearer <token>"
    //bearer es un esquema de autenticación que se utiliza para enviar 
    // tokens de acceso en las solicitudes HTTP.
    // req.headers.authorization es donde se encuentra el 
    // token en el header de la solicitud.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       //req.headers.authorization.split(' ')[1] se utiliza para extraer
       //  el token del header. 
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('No autorizado para acceder a esta ruta', 401, 'NO_TOKEN'));
    }

    try {
        // Verificar token
        // jwt.verify se utiliza para verificar la validez del token utilizando la clave secreta definida en config.jwtSecret.
        // Si el token es válido, se decodifica y se asigna a req.user para que esté disponible en los 
        // siguientes middleware o controladores.
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        next(new AppError('Token inválido', 401, 'INVALID_TOKEN'));
    }
};

export default { protect };