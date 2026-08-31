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

    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Query users with email reminders enabled who haven't received a reminder today
    const users = await User.find({
      emailRemindersEnabled: { $ne: false },
      isSuspended: { $ne: true },
      $or: [
        { lastReminderSentDate: { $exists: false } },
        { lastReminderSentDate: null },
        { lastReminderSentDate: { $lt: startOfToday } },
      ],
    });

    const dispatched: string[] = [];

    for (const user of users) {
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

      // Dispatch reminder if user hasn't met their goal today
      if (questionsCompletedToday < goal) {
        try {
          await sendDailyStudyReminderEmail({
            to: user.email,
            fullName: user.fullName,
            dailyQuestionGoal: goal,
            preferredStudyTime: user.preferredStudyTime || "20:00",
          });

          // Mark user as reminded today
          user.lastReminderSentDate = now;
          await user.save();

          dispatched.push(user.email);
        } catch (sendErr) {
          console.error(`Failed to send cron reminder email to ${user.email}:`, sendErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      eligibleUsersCount: users.length,
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
