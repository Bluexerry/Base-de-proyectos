import * as authService from '../service/authService.js';
import logger from '../utils/logger.js';

// Registrar usuario
export const registerController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        const result = await authService.registerUser(name, email, password);
        
        logger.info(`Usuario registrado: ${email}`);
        
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Obtener todos los usuarios
export const getAllUsersController = async (req, res, next) => {
    try {
        const users = await authService.getAllUsers();
        
        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// Obtener usuario por ID
export const getUserController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await authService.getUserById(id);
        
        res.status(200).json({
            success: true,
            message: 'Usuario obtenido exitosamente',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Eliminar usuario
export const deleteUserController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await authService.deleteUser(id);
        
        logger.info(`Usuario eliminado: ${id}`);
        
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

// Login usuario
// Recibe email y password, verifica credenciales y devuelve el token JWT.
// El token debe guardarse en el frontend (localStorage) para usarlo en peticiones protegidas.
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        logger.info(`Login exitoso: ${email}`);
        res.status(200).json({ success: true, message: 'Login exitoso', data: result });
    } catch (error) {
        // next(error) pasa el error al middleware errorHandler para que lo gestione
        next(error);
    }
};

export default {
    registerController,
    loginController,
    getAllUsersController,
    getUserController,
    deleteUserController
};