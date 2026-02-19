import nodemailer from 'nodemailer';
import config from '../config.js';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';
import { confirmationTemplate } from '../contact/emails/confirmation.template.js';
import { feedbackTemplate } from '../contact/emails/feedback.template.js';
// Este servicio se encarga de manejar toda la lógica relacionada con el contacto a través del formulario de contacto
// Incluye la lógica para enviar correos de contacto, confirmación y feedback 
class ContactoService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.mailHost,
      port: config.mailPort,
      secure: config.mailPort === 465,
      auth: {
        user: config.mailUser,
        pass: config.mailPass
      }
    });
  }

  /**
   * Envía un correo genérico
   * @param {Object} mailOptions - Opciones del correo
   * @returns {Promise<Object>} Resultado del envío
   */
  // Esta función es la base para enviar cualquier correo, se puede usar para enviar correos personalizados o específicos
  // Se asume que los parámetros mínimos requeridos son to, subject y html, pero se pueden agregar más opciones según sea necesario
  async enviarMail(mailOptions) {
    try {
      if (!mailOptions.to || !mailOptions.subject || !mailOptions.html) {
        throw new AppError('Faltan parámetros requeridos: to, subject, html', 400);
      }
// El resultado del envío se loguea para seguimiento, y en caso de error se lanza una excepción con un mensaje claro
      const resultado = await this.transporter.sendMail({
        from: config.mailUser,
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text || '',
        html: mailOptions.html
      });
// El messageId se puede usar para rastrear el correo enviado en los logs o para futuras referencias
      logger.info(`Correo enviado a ${mailOptions.to}`, { messageId: resultado.messageId });
      return resultado;
    } catch (error) {
      logger.error(`Error al enviar correo a ${mailOptions.to}`, { error: error.message });
      throw new AppError(`Error al enviar correo: ${error.message}`, 500);
    }
  }

  /**
   * Envía email de confirmación de contacto al usuario
   * @param {Object} data - Datos para generar la confirmación
   * @param {string} data.userEmail - Email del usuario
   * @param {string} data.userName - Nombre del usuario
   * @param {string} data.subject - Asunto del mensaje
   * @param {string} [data.reference] - Número de referencia (opcional)
   * @returns {Promise<Object>} Resultado del envío
   */
  // Esta función genera un correo de confirmación personalizado usando una plantilla, y lo envía al usuario que hizo contacto
  // El reference es opcional pero puede ser útil para que el usuario tenga un número de referencia para futuras consultas o seguimiento
  async enviarConfirmacionContacto(data) {
    try {
      const htmlContent = confirmationTemplate({
        userName: data.userName,
        userEmail: data.userEmail,
        subject: data.subject,
        reference: data.reference || null
      });

      const resultado = await this.enviarMail({
        to: data.userEmail,
        subject: 'Confirmación de tu mensaje de contacto',
        html: htmlContent
      });

      logger.info(`Confirmación de contacto enviada a ${data.userEmail}`);
      return resultado;
    } catch (error) {
      logger.error(`Error al enviar confirmación a ${data.userEmail}`, { error: error.message });
      throw error;
    }
  }

  /**
   * Envía email de feedback/respuesta al usuario
   * @param {Object} data - Datos para generar el feedback
   * @param {string} data.userEmail - Email del usuario
   * @param {string} data.userName - Nombre del usuario
   * @param {string} data.subject - Asunto original
   * @param {string} data.message - Mensaje de respuesta
   * @returns {Promise<Object>} Resultado del envío
   */
  async enviarFeedback(data) {
    try {
      const htmlContent = feedbackTemplate({
        userName: data.userName,
        subject: data.subject,
        message: data.message
      });

      const resultado = await this.enviarMail({
        to: data.userEmail,
        subject: `Respuesta a tu consulta: ${data.subject}`,
        html: htmlContent
      });

      logger.info(`Feedback enviado a ${data.userEmail}`);
      return resultado;
      // El feedback es una respuesta personalizada al usuario,
      // se puede usar para responder a consultas específicas o para dar seguimiento a un contacto
    } catch (error) {
      logger.error(`Error al enviar feedback a ${data.userEmail}`, { error: error.message });
      throw error;
    }
  }
}

export default new ContactoService();