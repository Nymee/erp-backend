const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (receipient_details) => {
  try {
    console.log("inside mail", receipient_details.to, process.env.EMAIL, process.env.EMAIL_PASS);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: receipient_details.to,
      subject: receipient_details.subject,
      text: receipient_details.text,
    });

    console.log(`Mail sent to ${receipient_details.to}`);
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err;
  }
};

module.exports = sendMail;
