import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import ExamAttempt from "@/models/ExamAttempt";
import { sendDailyStudyReminderEmail } from "@/lib/email";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Verify secret if CRON_SECRET is configured in environment
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron trigger." }, { status: 401 });
    }

    await connectToDatabase();

    // Get current time strings in both 24h (HH:MM) and 12h (hh:mm AM/PM) formats
    const now = new Date();
    const currentHours24 = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentMinutesStr = currentMinutes.toString().padStart(2, "0");

    const currentHours24Str = currentHours24.toString().padStart(2, "0");
    const currentTime24 = `${currentHours24Str}:${currentMinutesStr}`; // e.g. "16:40"

    const hours12 = currentHours24 % 12 || 12;
    const hours12Str = hours12.toString().padStart(2, "0");
    const ampm = currentHours24 >= 12 ? "PM" : "AM";
    const currentTime12 = `${hours12Str}:${currentMinutesStr} ${ampm}`; // e.g. "04:40 PM"
    const currentTime12Short = `${hours12}:${currentMinutesStr} ${ampm}`; // e.g. "4:40 PM"

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Query active users with email reminders enabled
    const users = await User.find({
      emailRemindersEnabled: { $ne: false },
      isSuspended: { $ne: true },
    });

    const dispatched: string[] = [];

    for (const user of users) {
      const preferredTime = (user.preferredStudyTime || "20:00").trim();
      
      // Check if preferredTime matches 24h, 12h, or hour portion
      const matchesTime =
        preferredTime === currentTime24 ||
        preferredTime.toUpperCase() === currentTime12 ||
        preferredTime.toUpperCase() === currentTime12Short ||
        preferredTime.startsWith(`${currentHours24Str}:`) ||
        preferredTime.startsWith(`${hours12Str}:`) ||
        preferredTime.startsWith(`${hours12}:`);

      if (matchesTime) {
        // Check if user has already achieved their daily goal today
        const todayAttempts = await ExamAttempt.find({
          userId: user._id,
          createdAt: { $gte: startOfToday },
        });

        let questionsCompletedToday = 0;
        for (const att of todayAttempts) {
          questionsCompletedToday += att.totalQuestions || 0;
        }

        const goal = user.dailyQuestionGoal || 20;

        // Dispatch reminder if user hasn't met their goal yet
        if (questionsCompletedToday < goal) {
          try {
            await sendDailyStudyReminderEmail({
              to: user.email,
              fullName: user.fullName,
              dailyQuestionGoal: goal,
              preferredStudyTime: user.preferredStudyTime || "20:00",
            });
            dispatched.push(user.email);
          } catch (sendErr) {
            console.error(`Failed to send cron reminder email to ${user.email}:`, sendErr);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      currentTime24,
      matchingUsersCount: users.length,
      dispatchedCount: dispatched.length,
      dispatchedEmails: dispatched,
    });
  } catch (error: any) {
    console.error("Cron study-reminders error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to execute study reminder cron job." },
      { status: 500 }
    );
  }
}
