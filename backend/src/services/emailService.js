import nodemailer from 'nodemailer';

function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE ?? 'true') === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
  };
}

function hasSmtpConfig(config) {
  return Boolean(config.host && config.user && config.pass && config.from);
}

function createTransporter(config) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function sendPasswordResetEmail({ to, name, resetUrl, expiresMinutes }) {
  const config = getSmtpConfig();
  const safeName = escapeHtml(name);
  const safeResetUrl = escapeHtml(resetUrl);

  if (!hasSmtpConfig(config)) {
    console.info('[email:dev] Configura SMTP para enviar correos reales.');
    console.info(`[email:dev] Link de recuperación para ${to}: ${resetUrl}`);
    return { skipped: true };
  }

  const transporter = createTransporter(config);

  await transporter.sendMail({
    from: config.from,
    to,
    subject: 'Recupera tu contraseña - Mapa de Reseñas',
    text: [
      `Hola${name ? ` ${name}` : ''},`,
      '',
      'Recibimos una solicitud para recuperar tu contraseña.',
      `Abre este enlace para crear una nueva contraseña: ${resetUrl}`,
      '',
      `Este enlace vence en ${expiresMinutes} minutos y solo puede usarse una vez.`,
      'Si no solicitaste este cambio, puedes ignorar este correo.',
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f2937">
        <h2>Recupera tu contraseña</h2>
        <p>Hola${safeName ? ` ${safeName}` : ''},</p>
        <p>Recibimos una solicitud para recuperar tu contraseña en Mapa de Reseñas.</p>
        <p>
          <a href="${safeResetUrl}" style="display:inline-block;background:#f59e0b;color:#111827;
          padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700">
            Crear nueva contraseña
          </a>
        </p>
        <p>Este enlace vence en ${expiresMinutes} minutos y solo puede usarse una vez.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      </div>
    `,
  });

  return { sent: true };
}
