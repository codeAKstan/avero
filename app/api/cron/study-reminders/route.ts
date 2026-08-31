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

    // Get current time string in HH:MM format (24-hour)
    const now = new Date();
    const currentHours = now.getHours().toString().padStart(2, "0");
    const currentMinutes = now.getMinutes().toString().padStart(2, "0");
    const currentTimeStr = `${currentHours}:${currentMinutes}`; // e.g. "20:00"

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Query active users with email reminders enabled
    const users = await User.find({
      emailRemindersEnabled: { $ne: false },
      isSuspended: { $ne: true },
    });

    const dispatched: string[] = [];

    for (const user of users) {
      const preferredTime = user.preferredStudyTime || "20:00";
      
      // Compare hour part (e.g. "20") or full time string
      const prefHour = preferredTime.split(":")[0];
      const matchesHour = prefHour === currentHours || preferredTime === currentTimeStr;

      if (matchesHour) {
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
      currentTimeStr,
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
