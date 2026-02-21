import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactData } from "@/lib/contact-data";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Send email to the contact email
    const { error } = await resend.emails.send({
      from: "Fractals Academy <onboarding@resend.dev>", // Use your verified domain: noreply@yourdomain.com
      to: contactData.email,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #a855f7, #ec4899); padding: 20px; border-radius: 10px 10px 0 0; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; }
              .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; border: 1px solid #e5e7eb; }
              .message-box { white-space: pre-wrap; }
              .footer { background: #1f2937; color: #9ca3af; padding: 15px 20px; border-radius: 0 0 10px 10px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📬 New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Phone</div>
                  <div class="value">${phone || "Not provided"}</div>
                </div>
                <div class="field">
                  <div class="label">Message</div>
                  <div class="value message-box">${message}</div>
                </div>
              </div>
              <div class="footer">
                This email was sent from the Fractals Academy contact form.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    // Optionally send confirmation email to the user
    await resend.emails.send({
      from: "Fractals Academy <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for contacting Fractals Academy",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #a855f7, #ec4899); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .content h2 { color: #1f2937; margin-top: 0; }
              .content p { color: #4b5563; }
              .highlight { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #a855f7; margin: 20px 0; }
              .footer { background: #1f2937; color: #9ca3af; padding: 20px; border-radius: 0 0 10px 10px; font-size: 12px; text-align: center; }
              .footer a { color: #a855f7; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Fractals Academy</h1>
              </div>
              <div class="content">
                <h2>Thank you for reaching out, ${name}!</h2>
                <p>We have received your message and will get back to you as soon as possible.</p>
                
                <div class="highlight">
                  <strong>Your message:</strong><br/>
                  ${message}
                </div>
                
                <p>In the meantime, feel free to:</p>
                <ul>
                  <li>Call us at <strong>${contactData.phone.display}</strong></li>
                  <li>WhatsApp us for quick responses</li>
                  <li>Browse our video lectures</li>
                </ul>
                
                <p>Best regards,<br/><strong>Fractals Academy Team</strong></p>
              </div>
              <div class="footer">
                © ${new Date().getFullYear()} Fractals Academy. All rights reserved.<br/>
                <a href="#">Unsubscribe</a>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
