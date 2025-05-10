import nodemailer from "nodemailer";
import crypto from "crypto";

// Store OTPs in memory (in production, use Redis or similar)
const otpStore = new Map<string, { token: string; expires: number }>();

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.NEXT_SMTP_HOST,
    port: Number(process.env.NEXT_SMTP_PORT),
    secure: process.env.NEXT_SMTP_SECURE === "true",
    auth: {
      user: process.env.NEXT_SMTP_USER,
      pass: process.env.NEXT_SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NEXT_SMTP_FROM,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendVerificationEmail(email: string) {
  // Generate a secure random token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  // Store the token
  otpStore.set(email, { token, expires });

  // Create verification link with encoded email and token
  const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?email=${encodeURIComponent(email)}&token=${token}`;

  const emailText = `
    Welcome to Picto Story!
    
    Please click the link below to verify your email address:
    ${verificationLink}
    
    This link will expire in 24 hours.
    
    If you didn't request this email, you can safely ignore it.
  `;

  await sendEmail(email, "Verify your Picto Story account", emailText);
}

export function verifyToken(email: string, token: string): boolean {
  const storedData = otpStore.get(email);
  if (!storedData) return false;

  // Check if token matches and hasn't expired
  if (storedData.token === token && Date.now() < storedData.expires) {
    // Remove the used token
    otpStore.delete(email);
    return true;
  }

  return false;
}
