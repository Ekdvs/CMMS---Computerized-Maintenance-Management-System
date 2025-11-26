import transporter from "./mailer";


export const sendWelcomeEmail = async (user,verifyurl) => {
  try {
    await  transporter.sendMail({
      from: `"Online Shopping" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Welcome to My App 🎉",
      html: welcomeEmailTemplate(user,verifyurl), //  Import template
    });
    console.log(" Welcome email sent successfully!");
  } catch (err) {
    console.error(" Failed to send email:", err);
  }
};