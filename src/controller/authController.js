import * as authService from '../service/authService.js';
import logger from '../utils/logger.js';

// Opciones comunes para la cookie httpOnly del JWT
const cookieOptions = {
    httpOnly: true,                                          // No accesible desde JS
    secure: process.env.NODE_ENV === 'production',          // Solo HTTPS en producción
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,                        // 7 días en ms
    path: '/'
};

export const registerController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.registerUser(name, email, password);
        logger.info(`Usuario registrado: ${email}`);
        res.cookie('token', result.token, cookieOptions);
        res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', data: { user: result.user } });
    } catch (error) {
        next(error);
    }
};

export const getAllUsersController = async (req, res, next) => {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const getUserController = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (req, res, next) => {
    try {
        await authService.deleteUser(req.params.id);
        logger.info(`Usuario eliminado: ${req.params.id}`);
        res.status(200).json({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        logger.info(`Login exitoso: ${email}`);
        res.cookie('token', result.token, cookieOptions);
        res.status(200).json({ success: true, message: 'Login exitoso', data: { user: result.user } });
    } catch (error) {
        next(error);
    }
};

export const logoutController = (req, res) => {
    res.clearCookie('token', { path: '/' });
    res.status(200).json({ success: true, message: 'Sesión cerrada exitosamente' });
};

export default { registerController, loginController, getAllUsersController, getUserController, deleteUserController, logoutController };