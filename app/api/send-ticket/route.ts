import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const referralLink = email.split("@")[0];

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.SMT_USER,
        pass: process.env.SMT_PASS,
      },
    });

    const mailOptions = {
      from: "Darviz",
      to: email,
      subject: `Darviz Waitlist Confirmation`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
  <!-- Banner -->
  <img src="https://i.postimg.cc/Gm579M16/Gatekeepr-Ad.jpg"" alt="Waitlist Banner" style="width: 100%;  object-fit: cover;" />

  <!-- Body -->
  <div style="padding: 20px;">
    <h2 style="color: #333;">
      You're on the <strong>Waitlist</strong>! 🎉
    </h2>

    <p>Hi there,</p>
    <p>
      Thank you for joining the waitlist for <strong>Darviz</strong>!  
      We're excited to have you on board. You'll be one of the first to know when we launch.
    </p>

    <p>
      In the meantime, feel free to share your unique referral link to move up the list:
    </p>

    <div style="margin: 20px 0; text-align: center;">
      <a href="https://darviz.co?ref=${referralLink}" style="display: inline-block; padding: 12px 20px; background-color: #111; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Share & Move Up 🚀
      </a>
    </div>

    <p>
      We’ll keep you posted on updates, sneak peeks, and exclusive offers before launch day.
    </p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f8f8f8; padding: 16px; text-align: center; font-size: 12px; color: #777;">
    <p>Stay connected with us:</p>
    <p>
      <a href="https://www.instagram.com/gatekeepr.official/" style="color: #555;">Instagram</a> |
      <a href="https://www.facebook.com/GatekeeprOfficial" style="color: #555;">Facebook</a>
    </p>
    <p>© ${new Date().getFullYear()} Gatekeepr</p>
  </div>
</div>

`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, mailResponse });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
  }
}
