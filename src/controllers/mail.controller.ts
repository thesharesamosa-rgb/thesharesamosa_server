import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../customResponses/ErrorHandler";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, location, message } = req.body;

  if (!email || !name || !message || !location || !phone) {
    return next(new ErrorHandler("Missing field", 400));
  }

  try {
    // Send email to The Share Samosa internal team
    const { error } = await resend.emails.send({
      from: "thesharesamosa@gmail.com",
      to: ["thesharesamosa@gmail.com"],
      subject: `📩 New Inquiry from ${name} - The Share Samosa`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Franchise Inquiry</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f6f6f6; padding: 30px; }
    .email-container {
      max-width: 600px; margin: auto; background: #fff; padding: 30px;
      border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header { font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #d35400; }
    .section { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .value { margin-top: 5px; color: #222; }
    .button {
      display: inline-block; padding: 10px 20px; background: #e67e22; color: white;
      text-decoration: none; border-radius: 6px; font-weight: bold;
    }
    .button:hover { background: #ca6518; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">🍴 New Franchise Inquiry - The Share Samosa</div>
    <div class="section">
      <div class="label">Name:</div>
      <div class="value">${name}</div>
    </div>
    <div class="section">
      <div class="label">Email:</div>
      <div class="value">${email}</div>
    </div>
    <div class="section">
      <div class="label">Phone:</div>
      <div class="value">${phone}</div>
    </div>
    <div class="section">
      <div class="label">Location:</div>
      <div class="value">${location}</div>
    </div>
    <div class="section">
      <div class="label">Message:</div>
      <div class="value">${message}</div>
    </div>
    <div class="section">
      <a href="mailto:${email}?subject=Reply%20to%20your%20inquiry&body=Hi%20${encodeURIComponent(
        name
      )},%0A%0AThanks%20for%20reaching%20out%20to%20The%20Share%20Samosa..."
        class="button">Reply to ${name}</a>
    </div>
  </div>
</body>
</html>
      `,
    });

    if (error) {
      return next(new ErrorHandler("Failed to send email to The Share Samosa team", 500));
    }

    // Send thank-you email to user
    await resend.emails.send({
      from: "thesharesamosa@gmail.com",
      to: [email],
      subject: `Thanks for contacting The Share Samosa!`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Thank You for Contacting The Share Samosa</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
  <table style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <tr>
      <td>
        <h2 style="color: #e67e22;">Hi ${name},</h2>
        <p style="font-size: 16px; color: #333;">
          Thank you for reaching out to <strong>The Share Samosa</strong>. 🍴<br>
          We’ve received your inquiry and our team will get back to you shortly.
        </p>
        <h4 style="margin-top: 30px; color: #555;">Your Details:</h4>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Location:</b> ${location}</p>
        <blockquote style="font-size: 15px; color: #444; margin: 10px 0; padding: 10px 15px; background-color: #f2f2f2; border-left: 4px solid #e67e22;">
          ${message}
        </blockquote>
        <p style="font-size: 16px; color: #333;">If your message is urgent, you can reach us directly at 
          <a href="mailto:thesharesamosa@gmail.com" style="color: #e67e22;">thesharesamosa@gmail.com</a>.
        </p>
        <p style="margin-top: 30px; font-size: 16px; color: #333;">
          Best regards,<br>
          The Share Samosa Team
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 14px; color: #777;">
          📞 +91-7004689636<br>
          🌐 <a href="https://thesharesamosa.com" style="color: #e67e22;">thesharesamosa.com</a><br>
          📧 <a href="mailto:kunal@sharesamosa.com" style="color: #e67e22;">thesharesamosa@gmail.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (err) {
    return next(new ErrorHandler("Something went wrong while sending emails", 500));
  }
};

export { mailSender };
