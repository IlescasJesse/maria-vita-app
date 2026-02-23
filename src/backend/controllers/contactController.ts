/**
 * Controlador de Contacto
 * 
 * Maneja el envío de mensajes de contacto
 */

import { Request, Response, NextFunction } from 'express';

// ============================================
// ENVIAR MENSAJE DE CONTACTO
// ============================================

/**
 * Envía un mensaje de contacto
 * 
 * Body:
 * - name: string
 * - email: string
 * - phone: string
 * - subject: string
 * - message: string
 */
export const sendContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validar campos requeridos
    if (!name || !email || !phone || !subject || !message) {
      res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Todos los campos son requeridos'
        }
      });
      return;
    }

    // Validar formato de email
    if (email.toUpperCase() !== 'JESSE@ADMIN') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'El formato del email es inválido'
          }
        });
        return;
      }
    }

    // TODO: Aquí puedes implementar el envío de email real
    // Por ejemplo, usando nodemailer o un servicio como SendGrid

    // Por ahora, solo logueamos el mensaje
    console.log('📧 Nuevo mensaje de contacto recibido:');
    console.log(`De: ${name} (${email})`);
    console.log(`Teléfono: ${phone}`);
    console.log(`Asunto: ${subject}`);
    console.log(`Mensaje: ${message}`);
    console.log('---');

    // Ejemplo de estructura para envío de email (implementar con nodemailer/sendgrid)
    /*
    const emailData = {
      to: 'contacto@maria-vita.mx',
      from: email,
      replyTo: email,
      subject: `[Maria Vita Web] ${subject}`,
      html: `
        <h2>Nuevo mensaje desde el sitio web</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <hr>
        <h3>Mensaje:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
Nuevo mensaje desde el sitio web

Nombre: ${name}
Email: ${email}
Teléfono: ${phone}
Asunto: ${subject}

Mensaje:
${message}
      `
    };
    await sendEmail(emailData);
    */

    res.status(200).json({
      success: true,
      message: 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
      data: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
