import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/userAuth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import ExamAttempt from "@/models/ExamAttempt";
import { sendDailyStudyReminderEmail } from "@/lib/email";

export async function GET() {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(sessionUser._id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Calculate questions completed today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayAttempts = await ExamAttempt.find({
      userId: sessionUser._id,
      createdAt: { $gte: startOfToday },
    });

    let questionsCompletedToday = 0;
    let timeSpentTodaySeconds = 0;
    for (const att of todayAttempts) {
      questionsCompletedToday += att.totalQuestions || 0;
      timeSpentTodaySeconds += att.timeTakenSeconds || 0;
    }

    return NextResponse.json({
      success: true,
      schedule: {
        dailyQuestionGoal: user.dailyQuestionGoal ?? 20,
        dailyStudyTimeMinutes: user.dailyStudyTimeMinutes ?? 30,
        preferredStudyTime: user.preferredStudyTime ?? "20:00",
        emailRemindersEnabled: user.emailRemindersEnabled !== false,
        currentStreakDays: user.currentStreakDays || (todayAttempts.length > 0 ? 1 : 0),
        questionsCompletedToday,
        timeSpentTodayMinutes: Math.round(timeSpentTodaySeconds / 60),
      },
    });
  } catch (error: any) {
    console.error("Error fetching study schedule:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load study schedule." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      dailyQuestionGoal,
      dailyStudyTimeMinutes,
      preferredStudyTime,
      emailRemindersEnabled,
      sendTestEmail,
    } = body;

    await connectToDatabase();
    
    const updateData: any = {};
    if (dailyQuestionGoal !== undefined) updateData.dailyQuestionGoal = Number(dailyQuestionGoal);
    if (dailyStudyTimeMinutes !== undefined) updateData.dailyStudyTimeMinutes = Number(dailyStudyTimeMinutes);
    if (preferredStudyTime !== undefined) updateData.preferredStudyTime = String(preferredStudyTime);
    if (emailRemindersEnabled !== undefined) updateData.emailRemindersEnabled = Boolean(emailRemindersEnabled);

    const user = await User.findByIdAndUpdate(
      sessionUser._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let reminderStatus = null;
    if (sendTestEmail) {
      try {
        reminderStatus = await sendDailyStudyReminderEmail({
          to: user.email,
          fullName: user.fullName,
          dailyQuestionGoal: user.dailyQuestionGoal || 20,
          preferredStudyTime: user.preferredStudyTime || "20:00",
        });
      } catch (eErr) {
        console.error("Error dispatching test study reminder email:", eErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: sendTestEmail
        ? `Preferences saved & test study reminder dispatched to ${user.email}!`
        : "Study schedule preferences updated successfully.",
      schedule: {
        dailyQuestionGoal: user.dailyQuestionGoal,
        dailyStudyTimeMinutes: user.dailyStudyTimeMinutes,
        preferredStudyTime: user.preferredStudyTime,
        emailRemindersEnabled: user.emailRemindersEnabled,
        currentStreakDays: user.currentStreakDays,
      },
      reminderStatus,
    });
  } catch (error: any) {
    console.error("Error updating study schedule:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update study schedule preferences." },
      { status: 500 }
    );
  }
}
