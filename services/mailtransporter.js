const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  await transport.sendMail(
    {
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("E-mail sent:", info.response);
      }
    }
  );
};

module.exports = { sendMail };
