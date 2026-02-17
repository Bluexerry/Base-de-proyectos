/**
 * Plantilla de email de confirmación de contacto recibido
 * @param {Object} data - Datos de la confirmación
 * @param {string} data.userName - Nombre del usuario
 * @param {string} data.userEmail - Email del usuario
 * @param {string} data.subject - Asunto del mensaje
 * @returns {string} HTML del email
 */
export const confirmationTemplate = (data) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 60px; height: 60px; background-color: #28a745; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 32px;">✓</span>
                    </div>
                    <h2 style="color: #28a745; margin: 0;">¡Mensaje recibido!</h2>
                </div>
                
                <p style="color: #666; font-size: 16px;">Hola ${data.userName || 'Usuario'},</p>
                
                <p style="color: #666; font-size: 14px;">
                    Confirmamos que hemos recibido tu mensaje correctamente. Nos pondremos en contacto contigo lo antes posible.
                </p>
                
                <div style="background-color: #e8f5e9; padding: 20px; border-radius: 6px; margin: 25px 0;">
                    <p style="margin: 10px 0; color: #333;"><strong>Detalles de tu mensaje:</strong></p>
                    <p style="margin: 8px 0; color: #666; font-size: 14px;">
                        <strong>Asunto:</strong> ${data.subject}
                    </p>
                    <p style="margin: 8px 0; color: #666; font-size: 14px;">
                        <strong>Email:</strong> ${data.userEmail}
                    </p>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                    Te enviaremos una respuesta a través de este email. 
                    Por favor, mantén este mensaje como referencia de tu contacto.
                </p>
                
                <p style="color: #666; font-size: 14px;">
                    Si recibiste esta confirmación por error, ignora este mensaje.
                </p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="color: #999; font-size: 12px; margin: 0;">
                    Saludos cordiales,<br/>
                    <strong>El equipo de Evenor</strong>
                </p>
            </div>
        </div>
    `;
};