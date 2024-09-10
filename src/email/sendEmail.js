import nodemailer from "nodemailer";
// import { userModel } from "../../database/models/user.model.js";

export async function sendEmail(email,code) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abdelrahmanmohammed851@gmail.com",
      pass: "ykejlphmzcmmwlgw",
    },
  });

  const info = await transporter.sendMail({
    from: `Admin " <abdelrahmanmohammed851@gmail.com>`, // sender address
    to: `${email}`, // list of receivers
    subject: "Email Verification", // Subject line
    text: `Email Verification Code: ${code}`, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
}
