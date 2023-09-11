const nodemailer = require("nodemailer");

require("dotenv").config();

const config = {
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.HOST_PASSWORD,
  },
};

const send = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(config);
  const emailOptions = {
    from: process.env.USER_EMAIL,
    to,
    subject,
    html,
  };
  return await transporter.sendMail(emailOptions);
};

module.exports = {
  send,
};
