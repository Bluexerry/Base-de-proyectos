import express from 'express';
import {
    registerController,
    getAllUsersController,
    getUserController,
    deleteUserController
} from '../controller/authController.js';

const router = express.Router();

// Registrar usuario
router.post('/register', registerController);

// Obtener todos los usuarios
router.get('/users', getAllUsersController);

// Obtener usuario por ID
router.get('/users/:id', getUserController);

// Eliminar usuario
router.delete('/users/:id', deleteUserController);

export default router;