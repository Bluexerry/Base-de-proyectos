import contactoService from '../service/contactoService.js';
import logger from '../utils/logger.js';

/**
 * Procesa un contacto: envía confirmación al usuario y feedback simultáneamente
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
// Dirección fija de CAINSA — el destinatario nunca viene del cliente
const CAINSA_EMAIL = process.env.MAIL_USER;

export const enviarMailController = async (req, res, next) => {
    try {
        const { subject, html, text, userName, userEmail, feedbackMessage } = req.body;

        if (!subject || !html) {
            return res.status(400).json({
                success: false,
                message: 'Faltan parámetros requeridos: subject, html'
            });
        }

        // Enviar correo principal siempre a CAINSA
        const resultado = await contactoService.enviarMail({
            to: CAINSA_EMAIL,
            subject,
            html,
            text
        });

        // Enviar confirmación al usuario que hizo contacto
        let confirmacionEnviada = false;
        let feedbackEnviado = false;

        if (userEmail && userName) {
            // Enviar confirmación de recepción
            // El reference se puede usar para rastrear el contacto en futuras consultas o feedback
            await contactoService.enviarConfirmacionContacto({
                userEmail,
                userName,
                subject,
                reference: resultado.messageId.split('@')[0]
            });
            confirmacionEnviada = true;

            // Enviar feedback/respuesta si se proporciona
            if (feedbackMessage) {
                await contactoService.enviarFeedback({
                    userEmail,
                    userName,
                    subject,
                    message: feedbackMessage
                });
                feedbackEnviado = true;
            }
        }
        // Loguear el resultado del contacto
        logger.info(`Correo de contacto procesado`, { 
            destinatario: CAINSA_EMAIL,
            usuario: userName,
            confirmacionEnviada,
            feedbackEnviado,
            messageId: resultado.messageId
        });
        // Responder al cliente con el resultado del contacto
        res.status(200).json({
            success: true,
            message: 'Contacto procesado exitosamente',
            data: {
                confirmacionEnviada,
                feedbackEnviado
            }
        });
    } catch (error) {
        next(error);
    }
};

export default {
    enviarMailController
};