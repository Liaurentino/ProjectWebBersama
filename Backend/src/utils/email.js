const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
  },
})

const sendResetEmail = async (to, resetUrl) => {
  await transporter.sendMail({
    from: `"Produktif App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset Password - Produktif',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #1e293b;">Reset Password</h2>
        <p>Klik tombol di bawah untuk reset password kamu. Link berlaku <strong>15 menit</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Reset Password
        </a>
        <p style="margin-top:16px;color:#64748b;font-size:13px;">
          Jika kamu tidak meminta reset password, abaikan email ini.
        </p>
      </div>
    `,
  })
}

module.exports = { sendResetEmail }