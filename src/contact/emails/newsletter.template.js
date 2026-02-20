import contactoService from '../../service/contactoService.js';
import AppError from '../../utils/AppError.js';
import logger from '../../utils/logger.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Envía email de confirmación de suscripción con botón de desuscripción
 * @param {string} email - Email del suscriptor
 * @param {string} unsubscribeToken - Token de desuscripción
 * @throws {AppError} Si hay error al enviar el email
 */
export async function enviarEmailConfirmacion(email, unsubscribeToken) {
  try {
    const unsubscribeUrl = `${FRONTEND_URL}/newsletter/desuscribirse/${unsubscribeToken}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header azul -->
        <tr>
          <td style="background:linear-gradient(135deg,#0066A1 0%,#003D5C 100%);padding:40px 48px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;margin-bottom:16px;">
              <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:1px;">CAINSA</span>
            </div>
            <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;">¡Bienvenido al Newsletter!</h1>
            <p style="color:rgba(255,255,255,0.75);font-size:15px;margin:0;">Caucho Industrial Salteras</p>
          </td>
        </tr>

        <!-- Cuerpo -->
        <tr>
          <td style="padding:48px;">
            <p style="color:#1a1a1a;font-size:18px;font-weight:600;margin:0 0 12px;">Hola 👋</p>
            <p style="color:#595959;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Gracias por suscribirte al newsletter de <strong>CAINSA</strong>. Recibirás en tu bandeja de entrada:
            </p>

            <!-- Lista de beneficios -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              ${[
                ['🆕', 'Novedades y catálogos de productos'],
                ['💡', 'Consejos técnicos sobre caucho industrial'],
                ['🎯', 'Ofertas especiales para clientes suscritos'],
              ].map(([icon, text]) => `
              <tr>
                <td style="padding:8px 0;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#f0f7ff;border-radius:8px;padding:10px 14px;vertical-align:top;">
                        <span style="font-size:18px;">${icon}</span>
                      </td>
                      <td style="padding:10px 0 10px 12px;color:#333;font-size:14px;vertical-align:middle;">${text}</td>
                    </tr>
                  </table>
                </td>
              </tr>`).join('')}
            </table>

            <!-- Separador -->
            <hr style="border:none;border-top:1px solid #eef0f3;margin:0 0 32px;">

            <!-- Sección desuscripción -->
            <p style="color:#888;font-size:13px;line-height:1.6;margin:0 0 20px;">
              Si en algún momento ya no deseas recibir nuestras comunicaciones, puedes darte de baja fácilmente con el botón de abajo. Sin preguntas, sin complicaciones.
            </p>

            <!-- Botón desuscripción -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${unsubscribeUrl}"
                     style="display:inline-block;background:#f5f5f5;color:#888888;font-size:12px;font-weight:500;text-decoration:none;padding:10px 24px;border-radius:8px;border:1px solid #e0e0e0;letter-spacing:0.3px;">
                    Cancelar suscripción
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #eef0f3;padding:24px 48px;text-align:center;">
            <p style="color:#aaa;font-size:12px;margin:0 0 6px;">
              © ${new Date().getFullYear()} CAINSA · Caucho Industrial Salteras
            </p>
            <p style="color:#aaa;font-size:11px;margin:0;">
              Av. de la Industria Nº 9, Polígono Industrial Malpesa · 41909 Salteras, Sevilla
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await contactoService.enviarMail({
      to: email,
      subject: '¡Bienvenido al newsletter de CAINSA! 🎉',
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
 * @throws {AppError} Si hay error al enviar el email
 */
export async function enviarEmailDesuscripcion(email) {
  try {
    const subscribeUrl = FRONTEND_URL;

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header gris -->
        <tr>
          <td style="background:linear-gradient(135deg,#4a4a4a 0%,#1a1a1a 100%);padding:40px 48px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.1);border-radius:12px;padding:12px 24px;margin-bottom:16px;">
              <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:1px;">CAINSA</span>
            </div>
            <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px;">Desuscripción confirmada</h1>
            <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0;">Hemos recibido tu solicitud</p>
          </td>
        </tr>

        <!-- Cuerpo -->
        <tr>
          <td style="padding:48px;text-align:center;">
            <div style="display:inline-block;background:#f9fafb;border-radius:50%;padding:20px;margin-bottom:24px;">
              <span style="font-size:40px;">👋</span>
            </div>
            <p style="color:#1a1a1a;font-size:18px;font-weight:600;margin:0 0 12px;">Hasta pronto</p>
            <p style="color:#595959;font-size:15px;line-height:1.7;margin:0 0 32px;max-width:440px;display:inline-block;">
              Tu email ha sido eliminado de nuestra lista de newsletter. Ya no recibirás más comunicaciones por este canal.
            </p>

            <hr style="border:none;border-top:1px solid #eef0f3;margin:0 0 32px;">

            <p style="color:#888;font-size:13px;margin:0 0 20px;">
              ¿Te arrepentiste? Puedes volver a suscribirte cuando quieras desde nuestra web.
            </p>

            <a href="${subscribeUrl}"
               style="display:inline-block;background:linear-gradient(135deg,#0066A1,#003D5C);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;letter-spacing:0.3px;">
              Volver a suscribirme
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #eef0f3;padding:24px 48px;text-align:center;">
            <p style="color:#aaa;font-size:12px;margin:0 0 6px;">
              © ${new Date().getFullYear()} CAINSA · Caucho Industrial Salteras
            </p>
            <p style="color:#aaa;font-size:11px;margin:0;">
              Av. de la Industria Nº 9, Polígono Industrial Malpesa · 41909 Salteras, Sevilla
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await contactoService.enviarMail({
      to: email,
      subject: 'Has cancelado tu suscripción al newsletter de CAINSA',
      html: htmlContent
    });
  } catch (error) {
    logger.error(`Error al enviar email de desuscripción a ${email}`, { error: error.message });
    throw new AppError(`Error al enviar email de desuscripción: ${error.message}`, 500);
  }
}
