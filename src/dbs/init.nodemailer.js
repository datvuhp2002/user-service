"use strict";

const nodeMailer = require("nodemailer");

const transport = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "thuctaplachong@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});
module.exports = transport;
