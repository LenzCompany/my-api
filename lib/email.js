import nodemailer from "nodemailer";

// Konfigurasi transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ndaabotzmd@gmail.com", // Email pengirim
    pass: "udqz fqqq soni kcsl", // Password atau App Password
  },
});

// Fungsi untuk mengirim email verifikasi
export const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: "ndaabotzmd@gmail.com",
    to: email,
    subject: "Email Verification",
    html: `
      <h1>Verifikasi Email Anda</h1>
      <p>Klik link di bawah ini untuk memverifikasi email Anda:</p>
      <a href="https://api.ndaa-dv.web.id/api/verify?token=${verificationToken}">Verifikasi Email</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email verifikasi berhasil dikirim");
  } catch (error) {
    console.error("Gagal mengirim email verifikasi:", error);
  }
};

export default transporter;
