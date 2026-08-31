import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER || "no-reply@avero.academy";
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_HOST = process.env.EMAIL_HOST || "mail.privateemail.com";
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 465);
const EMAIL_FROM = process.env.EMAIL_FROM || `"AVERO ACADEMY" <${EMAIL_USER}>`;

// Configure Nodemailer transporter (Supports Namecheap Private Email or custom SMTP)
const transporter = EMAIL_HOST.includes("gmail")
  ? nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    })
  : nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
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
    from: EMAIL_FROM,
    to,
    subject,
    text: textContent,
    html: htmlContent,
  });

  return info;
}

export async function sendPasswordResetEmail({
  to,
  fullName,
  resetUrl,
}: {
  to: string;
  fullName: string;
  resetUrl: string;
}) {
  const subject = "Reset Your Password - AVERO ACADEMY";

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #2866e1;">
        <h1 style="color: #2866e1; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">AVERO ACADEMY</h1>
        <p style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; margin-top: 4px;">Password Reset Request</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Hello, ${fullName}!</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          We received a request to reset your password for your AVERO ACADEMY account. Click the button below to choose a new password:
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}" style="background-color: #2866e1; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 12px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          If the button above does not work, copy and paste this URL into your browser:
        </p>
        <p style="color: #2866e1; font-size: 13px; word-break: break-all; background-color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <a href="${resetUrl}" style="color: #2866e1; text-decoration: underline;">${resetUrl}</a>
        </p>

        <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
          This link will expire in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} AVERO ACADEMY Technologies Inc. All rights reserved.</p>
        <p style="margin: 4px 0 0 0;">This security email was sent to ${to}.</p>
      </div>
    </div>
  `;

  const textContent = `
Dear ${fullName},

We received a request to reset your password for your AVERO ACADEMY account.

Reset link (expires in 1 hour):
${resetUrl}

If you did not request this, please ignore this message.

Best regards,
The AVERO ACADEMY Team
  `;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS missing. Skipping actual SMTP email dispatch for Password Reset.");
    console.log(`[PASSWORD RESET MOCK LINK] ${resetUrl}`);
    return {
      messageId: "mock-reset-" + Date.now(),
      accepted: [to],
      content: textContent,
      resetUrl,
    };
  }

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text: textContent,
    html: htmlContent,
  });

  return info;
}

export async function sendDailyStudyReminderEmail({
  to,
  fullName,
  dailyQuestionGoal,
  preferredStudyTime,
}: {
  to: string;
  fullName: string;
  dailyQuestionGoal: number;
  preferredStudyTime: string;
}) {
  const subject = "🔥 Daily Study Prompt - Keep Your AVERO ACADEMY Retention Streak Active!";

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #2866e1;">
        <h1 style="color: #2866e1; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">AVERO ACADEMY</h1>
        <p style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; margin-top: 4px;">Daily Study Habit Reminder</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #0f172a; font-size: 20px; margin-top: 0;">Time to practice, ${fullName}! 📚</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          This is your scheduled daily study prompt for <strong>${preferredStudyTime}</strong>. Consistent daily practice is the key to mastering your nursing council board examinations.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <h3 style="color: #2866e1; font-size: 14px; text-transform: uppercase; margin-top: 0; margin-bottom: 8px; font-weight: 700;">Today's Target:</h3>
          <p style="color: #334155; font-size: 16px; font-weight: bold; margin: 0;">
            🎯 ${dailyQuestionGoal} Practice Questions & Active Recall Flashcards
          </p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:3000/dashboard" style="background-color: #2866e1; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 12px; display: inline-block;">
            Start Today's Session Now
          </a>
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} AVERO ACADEMY Technologies Inc. All rights reserved.</p>
        <p style="margin: 4px 0 0 0;">You received this email because daily study reminders are enabled for ${to}.</p>
      </div>
    </div>
  `;

  const textContent = `
Dear ${fullName},

Time for today's study session (${preferredStudyTime})!

Today's Goal: ${dailyQuestionGoal} Questions & Active Recall Flashcards.

Log in now to keep your study streak active: http://localhost:3000/dashboard

Best regards,
The AVERO ACADEMY Team
  `;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS missing. Skipping actual SMTP email dispatch for Daily Reminder.");
    console.log(`[STUDY REMINDER MOCK DISPATCH] Sent to ${to} for goal ${dailyQuestionGoal} questions.`);
    return {
      messageId: "mock-reminder-" + Date.now(),
      accepted: [to],
      content: textContent,
    };
  }

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text: textContent,
    html: htmlContent,
  });

  return info;
}


