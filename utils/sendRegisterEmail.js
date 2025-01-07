import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})
const sendRegisterEmail = async (to, verificationLink) => {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <kelsi.connelly@ethereal.email>', // Sender address
    to, // Recipient email
    subject: "Verify Your Email ✔", // Subject line
    text: `Hello! Please verify your email by clicking the link: ${verificationLink}`, // Plain text body
    html: `<p>Hello!</p><p>Please verify your email by clicking the link below:</p>
             <a href="${verificationLink}">Verify Email</a>`, // HTML body
  })
  console.log("Message sent: %s", info.messageId)
}
export default sendRegisterEmail