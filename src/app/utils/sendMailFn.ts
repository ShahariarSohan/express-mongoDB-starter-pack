import nodemailer from "nodemailer";
import { prisma } from "../config/prisma";
import { envVariables } from "../config/env";

export const sendEmailFn = async (
  email: string,
  otp: number,
) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

 const transporter = nodemailer.createTransport({
   host: envVariables.SMTP_HOST,
   port: Number(envVariables.SMTP_PORT),
   secure: true, // true if using 465
   auth: {
     user: envVariables.SMTP_USER,
     pass: envVariables.SMTP_PASS,
   },
 });


  // Set up email data
  const mailOptions = {
    from: `"no-reply"<${envVariables.SMTP_FROM}>`, // Sender address
    to: email, // List of receivers
    subject: "Your OTP Code", // Subject line
    // text: `Your OTP code is ${otp}` // Plain text body
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); background-color: #ffffff; border: 1px solid #e0e0e0;">
  <h2 style="color: #2c3e50; margin-bottom: 10px;">🔐 One-Time Password (OTP)</h2>
  <p style="font-size: 16px; color: #555;">Hello, ${findUser?.name}</p>
  <p style="font-size: 16px; color: #555;">Your one-time password (OTP) for verification is:</p>

  <div style="text-align: center; margin: 30px 0;">
    <span style="display: inline-block; font-size: 28px; font-weight: bold; color: #2c3e50; padding: 15px 30px; border: 2px dashed #3498db; border-radius: 10px; background-color: #ecf5fc;">
      ${otp}
    </span>
  </div>

  <p style="font-size: 16px; color: #555;">Please enter this code within <strong>5 minutes</strong> to complete your verification.</p>
  <p style="font-size: 16px; color: #888; font-style: italic;">If you didn’t request this code, you can safely ignore this message.</p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

  <p style="font-size: 16px; color: #555;">Best regards,</p>
  <p style="font-size: 16px; color: #3498db; font-weight: bold;">${envVariables.SMTP_FROM} Team</p>
  <p style="font-size: 14px; color: #bbb; margin-top: 40px; text-align: center;">
    This is an automated message. Please do not reply to this email.
  </p>
</div>

                `, // HTML body
  };

  // Send mail with defined transport object
  await transporter.sendMail(mailOptions);
};
