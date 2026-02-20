import Newsletter from '../model/Newsletter.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { enviarEmailConfirmacion, enviarEmailDesuscripcion } from '../contact/emails/newsletter.template.js';

class NewsLetterService {
  /**
   * Suscribir un usuario al newsletter
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Resultado de la suscripcion
   * @throws {AppError} Si hay error en la suscripcion
   */
  async suscripcion(email) {
    try {
      if (!email || !this.isValidEmail(email)) {
        throw new AppError('Email inválido', 400, 'INVALID_EMAIL');
      }

      const userExists = await Newsletter.findOne({ email });

      if (userExists) {
        if (userExists.hashSubscription === true) {
          throw new AppError('Este email ya está suscrito al newsletter', 400, 'EMAIL_ALREADY_SUBSCRIBED');
        }
        userExists.hashSubscription = true;
        await userExists.save();
        const unsubscribeToken = this.generateUnsubscribeToken(userExists._id);
        await enviarEmailConfirmacion(userExists.email, unsubscribeToken);
        logger.info(`Reactivacion de suscripcion al newsletter: ${email}`);
        return {
          id: userExists._id,
          email: userExists.email,
          unsubscribeToken,
          message: 'Suscripción reactivada. Verifica tu email para confirmar.'
        };
      }

      const user = await Newsletter.create({
        email,
        hashSubscription: true
      });

      const unsubscribeToken = this.generateUnsubscribeToken(user._id);
      await enviarEmailConfirmacion(user.email, unsubscribeToken);

      logger.info(`Nueva suscripcion al newsletter: ${email}`);

      return {
        id: user._id,
        email: user.email,
        unsubscribeToken: unsubscribeToken,
        message: 'Suscripción exitosa. Verifica tu email para confirmar.'
      };
    } catch (error) {
      if (error.code === 11000) {
        const existing = await Newsletter.findOne({ email });
        if (existing && existing.hashSubscription === false) {
          existing.hashSubscription = true;
          await existing.save();
          const unsubscribeToken = this.generateUnsubscribeToken(existing._id);
          await enviarEmailConfirmacion(existing.email, unsubscribeToken);
          logger.info(`Reactivacion de suscripcion al newsletter (desde 11000): ${email}`);
          return {
            id: existing._id,
            email: existing.email,
            unsubscribeToken,
            message: 'Suscripción reactivada. Verifica tu email para confirmar.'
          };
        }
        throw new AppError('Este email ya está suscrito al newsletter', 400, 'EMAIL_ALREADY_SUBSCRIBED');
      }
      throw error;
    }
  }

  /**
   * Desuscribir un usuario usando un token
   * @param {string} token - Token de desuscripcion
   * @returns {Promise<Object>} Resultado de la desuscripcion
   * @throws {AppError} Si hay error en la desuscripcion
   */
  async desuscripcion(token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);

      const user = await Newsletter.findByIdAndUpdate(
        decoded.id,
        { hashSubscription: false },
        { new: true }
      );

      if (!user) {
        throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
      }

      await enviarEmailDesuscripcion(user.email);

      logger.info(`Desuscripcion del newsletter: ${user.email}`);

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
   * Genera un token de desuscripcion
   * @param {string} userId - ID del usuario
   * @returns {string} Token de desuscripcion
   */
  generateUnsubscribeToken(userId) {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: '7d'
    });
  }

  /**
   * Valida el formato de un email
   * @param {string} email - Email a validar
   * @returns {boolean} True si el email es valido
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default new NewsLetterService();
