// Escapa caracteres HTML para prevenir inyección en plantillas de email
const e = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * Plantilla de email de feedback/respuesta a contacto
 * @param {Object} data - Datos del feedback
 * @param {string} data.userName - Nombre del usuario
 * @param {string} data.subject - Asunto del mensaje original
 * @param {string} data.message - Mensaje de respuesta
 * @returns {string} HTML del email
 */
export const feedbackTemplate = (data) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Gracias por tu mensaje</h2>
                <p style="color: #666; font-size: 16px;">Hola ${e(data.userName) || 'Usuario'},</p>
                
                <p style="color: #666; font-size: 14px;">
                    Hemos recibido tu mensaje exitosamente y nos complace que te hayas puesto en contacto con nosotros.
                </p>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                    <p style="margin: 0; color: #666;"><strong>Asunto:</strong> ${e(data.subject)}</p>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                    ${e(data.message) || 'Nuestro equipo revisará tu consulta y te responderemos lo antes posible.'}
                </p>
                
                <p style="color: #666; font-size: 14px;">
                    Si tienes alguna pregunta adicional, no dudes en contactarnos nuevamente.
                </p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="color: #999; font-size: 12px; margin: 0;">
                    Saludos cordiales,<br/>
                    <strong>El equipo de CAINSA</strong>
                </p>
            </div>
        </div>
    `;
};