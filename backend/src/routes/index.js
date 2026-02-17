import express from 'express';
import authRoutes from './authRoutes.js';
import contactoRoutes from './contactoRoutes.js';
import newsLetterRoutes from './newsLetterRoutes.js';

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de contacto
router.use('/contacto', contactoRoutes);

// Rutas de newsletter
router.use('/newsletter', newsLetterRoutes);

export default router;