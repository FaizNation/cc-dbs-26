const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'OpenJob API <openjob@example.com>',
      to: targetEmail,
      subject: 'Ada Lamaran Baru di Pekerjaan Anda!',
      text: content,
    };

    return this.transporter.sendMail(message);
  }
}

module.exports = MailSender;
