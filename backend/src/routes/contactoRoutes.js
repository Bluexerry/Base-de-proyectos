import express from 'express';
import { enviarMailController } from '../controller/enviarMailController.js';
import { validateContacto } from '../middleware/contactoMiddleware.js';

const router = express.Router();

/**
 * POST /contacto/enviar
 * Envía un correo, confirmación y opcionalmente feedback
 * Body: {
 *   to: string (requerido) - email del destinatario
 *   subject: string (requerido) - asunto del correo
 *   html: string (requerido) - contenido HTML del correo
 *   text: string (opcional) - contenido de texto plano
 *   userEmail: string (opcional) - email del usuario que contacta
 *   userName: string (opcional) - nombre del usuario que contacta
 *   feedbackMessage: string (opcional) - respuesta/feedback para el usuario
 * }
 */
router.post('/enviar', validateContacto, enviarMailController);

export default router;