import express from 'express';
import diagnosticRoutes from './diagnosticRoutes.js';

const router = express.Router();

// Ruta de diagnóstico
router.use('/diagnostic', diagnosticRoutes);

export default router;