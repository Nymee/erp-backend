const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,      // This matches your .env file
    pass: process.env.EMAIL_PASS, // This matches your .env file
  },
});

const sendMail = async (receipient_details, subject, text) => {
  try {
    console.log("inside mail", to, process.env.EMAIL, process.env.EMAIL_PASS)
    await transporter.sendMail({
      from: process.env.EMAIL,  // This matches your .env file
      to: receipient_details.to,
      subject: receipient_details.subject,
      text:receipient_details.text
    });
    console.log(`Mail sent to ${to}`);
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err;
  }
};

module.exports = sendMail;  