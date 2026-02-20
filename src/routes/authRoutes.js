import express from 'express';
import {
    registerController,
    loginController,
    getAllUsersController,
    getUserController,
    deleteUserController,
    logoutController
} from '../controller/authController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateRegister, validateLogin } from '../middleware/authValidation.js';

const router = express.Router();

// Registrar usuario
router.post('/register', authLimiter, validateRegister, registerController);

// Login
router.post('/login', authLimiter, validateLogin, loginController);

// Logout (limpia la cookie)
router.post('/logout', logoutController);

// Obtener todos los usuarios (solo admin)
router.get('/users', protect, restrictTo('admin'), getAllUsersController);

// Obtener usuario por ID (requiere autenticación)
router.get('/users/:id', protect, getUserController);

// Eliminar usuario (solo admin)
router.delete('/users/:id', protect, restrictTo('admin'), deleteUserController);

export default router;