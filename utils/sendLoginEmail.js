import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})
const sendLoginEmail = async (to) => {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <kelsi.connelly@ethereal.email>', // Sender address
    to, // Recipient email
    subject: "Welcome Back to Our Service!", // Subject line
    text: `Hello! We're glad to see you again. You have successfully logged in. If this wasn't you, please contact our support team immediately.\n\nBest regards,\nThe Team`, // Plain text body
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Welcome Back!</h2>
          <p>We're thrilled to see you again. You have successfully logged in to your account.</p>
          <p>If this wasn't you, please secure your account immediately by contacting our support team.</p>
          <p>Thank you for choosing us!</p>
          <p>Best regards,<br />The Team</p>
        </div>
      `,
  })
  console.log("Message sent: %s", info.messageId)
}
export default sendLoginEmail
