import express from 'express';
import { suscripcionController, desuscripcionPorTokenController, confirmarDesuscripcionController } from '../controller/subscripcionController.js';
import { validateSuscripcion } from '../middleware/validarSubscripcion.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /newsletter/suscribirse
 * Suscribir un usuario al newsletter
 * Body: {
 *   email: string (requerido) - email del usuario
 *   name: string (opcional) - nombre del usuario
 * }
 */
router.post('/suscribirse', contactLimiter, validateSuscripcion, suscripcionController);

/**
 * GET /newsletter/desuscribirse/:token
 * Desuscribir un usuario del newsletter usando token - Muestra página de confirmación
 * Params: {
 *   token: string (requerido) - token de desuscripción
 * }
 */
router.get('/desuscribirse/:token', desuscripcionPorTokenController);

/**
 * POST /newsletter/desuscribirse/:token
 * Procesar la desuscripción después de confirmar
 * Params: {
 *   token: string (requerido) - token de desuscripción
 * }
 */
router.post('/desuscribirse/:token', confirmarDesuscripcionController);

export default router;