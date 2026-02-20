// Escapa caracteres HTML para prevenir inyección en plantillas de email
const e = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const feedbackTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 16px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#003D5C 0%,#0066A1 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
                <div style="display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.18);border-radius:50%;width:72px;height:72px;margin-bottom:18px;">
                  <span style="font-size:36px;line-height:1;">&#128172;</span>
                </div>
                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Gracias por contactarnos</h1>
                <p style="margin:10px 0 0;color:rgba(255,255,255,0.72);font-size:14px;">Hemos recibido tu consulta · CAINSA</p>
              </td>
            </tr>

            <!-- Cuerpo -->
            <tr>
              <td style="background:#ffffff;padding:40px;">
                <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#1a1a1a;">Hola, ${e(data.userName) || 'Usuario'} &#128075;</p>
                <p style="margin:0 0 32px;font-size:15px;color:#555;line-height:1.7;">
                  Nos alegra que te hayas puesto en contacto con nosotros. Nuestro equipo revisará tu consulta y te responderá en breve.
                </p>

                <!-- Asunto -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="background:#f7fafd;border-left:5px solid #0066A1;border-radius:0 10px 10px 0;padding:16px 20px;">
                      <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.1px;color:#0066A1;margin-bottom:6px;">Asunto del mensaje</p>
                      <p style="margin:0;font-size:16px;color:#1a1a1a;font-weight:600;">${e(data.subject)}</p>
                    </td>
                  </tr>
                </table>

                <!-- Mensaje -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbf0;border:1px solid #f0e0a0;border-radius:12px;margin-bottom:28px;">
                  <tr>
                    <td style="padding:14px 22px;background:#fff5d6;border-bottom:1px solid #f0e0a0;border-radius:12px 12px 0 0;">
                      <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8a6000;">Mensaje</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 22px;">
                      <p style="margin:0;font-size:15px;color:#444;line-height:1.75;">${e(data.message) || 'Nuestro equipo revisará tu consulta y te responderemos lo antes posible.'}</p>
                    </td>
                  </tr>
                </table>

                <!-- Pasos -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafd;border:1px solid #dde8f0;border-radius:12px;margin-bottom:32px;overflow:hidden;">
                  <tr>
                    <td style="padding:14px 24px;background:#eef4fb;border-bottom:1px solid #dde8f0;">
                      <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#0066A1;">&#128336; ¿Qué ocurre ahora?</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 24px;border-bottom:1px solid #eef2f6;">
                      <p style="margin:0;font-size:14px;color:#444;"><span style="display:inline-block;background:#0066A1;color:#fff;font-weight:700;font-size:11px;border-radius:4px;padding:2px 7px;margin-right:10px;">01</span>Revisamos tu consulta en detalle</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 24px;border-bottom:1px solid #eef2f6;">
                      <p style="margin:0;font-size:14px;color:#444;"><span style="display:inline-block;background:#0066A1;color:#fff;font-weight:700;font-size:11px;border-radius:4px;padding:2px 7px;margin-right:10px;">02</span>Un especialista prepara la respuesta</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 24px;">
                      <p style="margin:0;font-size:14px;color:#444;"><span style="display:inline-block;background:#0066A1;color:#fff;font-weight:700;font-size:11px;border-radius:4px;padding:2px 7px;margin-right:10px;">03</span>Te contactamos en el menor tiempo posible</p>
                    </td>
                  </tr>
                </table>

                <hr style="border:none;border-top:1px solid #eee;margin:0 0 28px;">

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="https://cauchoindustrialsalteras.com" style="display:inline-block;background:linear-gradient(135deg,#003D5C,#0066A1);color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 36px;border-radius:8px;letter-spacing:0.3px;">Visitar nuestra web &#8594;</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f7fafd;border-radius:0 0 16px 16px;padding:24px 40px;border-top:1px solid #dde8f0;text-align:center;">
                <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#003D5C;">CAINSA &#8212; Caucho Industrial Salteras</p>
                <p style="margin:0;font-size:12px;color:#aaa;">Este es un mensaje automático. Por favor no respondas directamente a este correo.</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
    `;
};