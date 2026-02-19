import Newsletter from '../model/Newsletter.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';
import contactoService from './contactoService.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

class NewsLetterService {
  /**
   * Suscribir un usuario al newsletter
   * @param {string} email - Email del usuario
   * @param {string} name - Nombre del usuario (opcional)
   * @returns {Promise<Object>} Resultado de la suscripción
   * @throws {AppError} Si hay error en la suscripción
   */
  async suscripcion(email, name = 'Suscriptor') {
    try {
      // Validar email
      if (!email || !this.isValidEmail(email)) {
        throw new AppError('Email inválido', 400, 'INVALID_EMAIL');
      }

      // Verificar si el usuario ya está suscrito
      const userExists = await Newsletter.findOne({ email });
      if (userExists) {
        throw new AppError('Este email ya está registrado en nuestro sistema', 400, 'EMAIL_ALREADY_REGISTERED');
      }

      // Crear usuario suscriptor
      const user = await Newsletter.create({
        name: name || 'Suscriptor',
        email,
        hashSubscription: true
      });

      // Generar token de desuscripción
      const unsubscribeToken = this.generateUnsubscribeToken(user._id);

      // Enviar email de confirmación con token
      await this.enviarEmailConfirmacion(user.email, user.name, unsubscribeToken);

      logger.info(`Nueva suscripción al newsletter: ${email}`);

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        unsubscribeToken: unsubscribeToken,
        message: 'Suscripción exitosa. Verifica tu email para confirmar.'
      };
    } catch (error) {
      if (error.code === 11000) {
        // Error de duplicidad de email
        throw new AppError('Este email ya está registrado', 400, 'EMAIL_DUPLICATE');
      }
      throw error;
    }
  }

  /**
   * Desuscribir un usuario usando un token
   * @param {string} token - Token de desuscripción
   * @returns {Promise<Object>} Resultado de la desuscripción
   * @throws {AppError} Si hay error en la desuscripción
   */
  async desuscripcion(token) {
    try {
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Buscar y actualizar el usuario (marcar como desuscrito)
      const user = await Newsletter.findByIdAndUpdate(
        decoded.id,
        { hashSubscription: false },
        { new: true }
      );
      
      if (!user) {
        throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
      }

      // Enviar email de confirmación de desuscripción
      await this.enviarEmailDesuscripcion(user.email, user.name);

      logger.info(`Desuscripción del newsletter: ${user.email}`);

      return {
        message: 'Desuscripción exitosa. Se ha enviado una confirmación a tu email.',
        email: user.email
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Token inválido o expirado', 401, 'INVALID_TOKEN');
      }
      if (error.name === 'TokenExpiredError') {
        throw new AppError('El token de desuscripción ha expirado', 401, 'TOKEN_EXPIRED');
      }
      throw error;
    }
  }

  /**
   * Genera un token de desuscripción
   * @param {string} userId - ID del usuario
   * @returns {string} Token de desuscripción
   */
  generateUnsubscribeToken(userId) {
    // Token con expiración de 90 días para desuscripción
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: '90d'
    });
  }

  /**
   * Valida el formato de un email
   * @param {string} email - Email a validar
   * @returns {boolean} True si el email es válido
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Envía email de confirmación de suscripción con enlace de desuscripción
   * @param {string} email - Email del suscriptor
   * @param {string} name - Nombre del suscriptor
   * @param {string} unsubscribeToken - Token de desuscripción
   * @throws {AppError} Si hay error al enviar el email
   */
  /**
 * Envía email de confirmación de suscripción con botón de desuscripción
 * @param {string} email - Email del suscriptor
 * @param {string} name - Nombre del suscriptor
 * @param {string} unsubscribeToken - Token de desuscripción
 * @throws {AppError} Si hay error al enviar el email
 */
async enviarEmailConfirmacion(email, name, unsubscribeToken) {
  try {
    const unsubscribeUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/newsletter/desuscribirse/${unsubscribeToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>¡Bienvenido a nuestro Newsletter!</h2>
        <p>Hola ${name},</p>
        <p>Gracias por suscribirte a nuestro newsletter. Ahora recibirás las últimas noticias y actualizaciones.</p>
        <p>Si no te suscribiste, ignore este email.</p>
        <hr style="margin: 20px 0;">
        <div style="text-align: center; margin: 20px 0;">
          <a href="${unsubscribeUrl}" style="display: inline-block; background-color: #d32f2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px;">
            Desuscribirse
          </a>
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">
          Si no puedes hacer click en el botón, copia y pega este enlace en tu navegador: <br/>
          ${unsubscribeUrl}
        </p>
        <p>Saludos,<br/>El equipo de Evenor</p>
      </div>
    `;

    await contactoService.enviarMail({
      to: email,
      subject: 'Bienvenido a nuestro Newsletter',
      html: htmlContent
    });
  } catch (error) {
    logger.error(`Error al enviar email de confirmación a ${email}`, { error: error.message });
    throw new AppError(`Error al enviar email de confirmación: ${error.message}`, 500);
  }
}

  /**
   * Envía email de confirmación de desuscripción
   * @param {string} email - Email del usuario desuscrito
   * @param {string} name - Nombre del usuario
   * @throws {AppError} Si hay error al enviar el email
   */
  async enviarEmailDesuscripcion(email, name) {
    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2>Desuscripción del Newsletter</h2>
          <p>Hola ${name},</p>
          <p>Lamentamos que te vayas. Has sido desuscrito exitosamente de nuestro newsletter.</p>
          <p>Si cambias de opinión, puedes suscribirte nuevamente en cualquier momento.</p>
          <p>Saludos,<br/>El equipo de Evenor</p>
        </div>
      `;

      await contactoService.enviarMail({
        to: email,
        subject: 'Confirmación de desuscripción del Newsletter',
        html: htmlContent
      });
    } catch (error) {
      logger.error(`Error al enviar email de desuscripción a ${email}`, { error: error.message });
      throw new AppError(`Error al enviar email de desuscripción: ${error.message}`, 500);
    }
  }
}

export default new NewsLetterService();