import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendWelcomeEmail({
  to,
  fullName,
  studentType,
  university,
  gradYear,
}: {
  to: string;
  fullName: string;
  studentType?: string;
  university?: string;
  gradYear?: string;
}) {
  const subject = "Welcome to AVERO ACADEMY - Your Account is Ready!";

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #2866e1;">
        <h1 style="color: #2866e1; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">AVERO ACADEMY</h1>
        <p style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; margin-top: 4px;">Nursing Council Exam Prep & Question Bank</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Welcome, ${fullName}!</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Thank you for joining <strong>AVERO ACADEMY</strong>. Your account has been initialized and is ready for your nursing council examination study sessions.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <h3 style="color: #2866e1; font-size: 14px; text-transform: uppercase; margin-top: 0; margin-bottom: 12px; font-weight: 700;">Your Student Profile:</h3>
          <ul style="color: #334155; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Full Name:</strong> ${fullName}</li>
            <li><strong>Registered Email:</strong> ${to}</li>
            <li><strong>Student Type:</strong> ${studentType || "General Nursing Candidate"}</li>
            <li><strong>Institution:</strong> ${university || "School of Nursing"}</li>
            <li><strong>Target Qualification Year:</strong> ${gradYear || "2026"}</li>
          </ul>
        </div>

        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          AVERO ACADEMY turns scattered professional examination past questions into an organized, subject-based, explanation-driven study system. You can now practice Anatomy, Pharmacology, Fundamentals of Nursing, and Medical-Surgical Nursing.
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} AVERO ACADEMY Technologies Inc. All rights reserved.</p>
        <p style="margin: 4px 0 0 0;">This email was sent to ${to}.</p>
      </div>
    </div>
  `;

  const textContent = `
Dear ${fullName},

Welcome to AVERO ACADEMY! Your account has been initialized and is ready.

Student Profile:
- Full Name: ${fullName}
- Email: ${to}
- Student Type: ${studentType || "Healthcare Candidate"}
- Institution: ${university || "School of Nursing"}
- Qualification Year: ${gradYear || "2026"}

Start practicing subject-categorized nursing council questions now!

Best regards,
The AVERO ACADEMY Team
  `;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS missing. Skipping actual SMTP email dispatch.");
    return {
      messageId: "mock-" + Date.now(),
      accepted: [to],
      content: textContent,
    };
  }

  const info = await transporter.sendMail({
    from: `"AVERO ACADEMY" <${EMAIL_USER}>`,
    to,
    subject,
    text: textContent,
    html: htmlContent,
  });

  return info;
}
