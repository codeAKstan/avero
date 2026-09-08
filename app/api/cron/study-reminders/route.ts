import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import ExamAttempt from "@/models/ExamAttempt";
import PushSubscription from "@/models/PushSubscription";
import { sendDailyStudyReminderEmail, sendSubscriptionExpiringSoonEmail, sendSubscriptionExpiredEmail } from "@/lib/email";

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

    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Process expiring & expired subscriptions
    const proUsers = await User.find({
      subscriptionPlan: "pro",
      subscriptionExpiresAt: { $exists: true, $ne: null },
    });

    const expiringSoonEmailsSent: string[] = [];
    const expiredEmailsSent: string[] = [];

    for (const proUser of proUsers) {
      if (!proUser.subscriptionExpiresAt) continue;

      const expiresAt = new Date(proUser.subscriptionExpiresAt);

      // 1. Subscription has EXPIRED
      if (expiresAt <= now) {
        proUser.subscriptionPlan = "free";
        proUser.subscriptionStatus = "past_due";
        proUser.lastExpiredNoticeSentDate = now;
        await proUser.save();

        try {
          await sendSubscriptionExpiredEmail({
            to: proUser.email,
            fullName: proUser.fullName,
          });
          expiredEmailsSent.push(proUser.email);
        } catch (expErr) {
          console.error(`Failed to send subscription expired email to ${proUser.email}:`, expErr);
        }
      }
      // 2. Subscription is EXPIRING SOON (within 3 days)
      else if (expiresAt <= threeDaysFromNow) {
        const hasSentExpiringNoticeRecently =
          proUser.lastExpiringNoticeSentDate &&
          now.getTime() - new Date(proUser.lastExpiringNoticeSentDate).getTime() < 3 * 24 * 60 * 60 * 1000;

        if (!hasSentExpiringNoticeRecently) {
          const diffMs = expiresAt.getTime() - now.getTime();
          const daysLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

          try {
            await sendSubscriptionExpiringSoonEmail({
              to: proUser.email,
              fullName: proUser.fullName,
              expiresAt,
              daysLeft,
            });
            expiringSoonEmailsSent.push(proUser.email);

            proUser.lastExpiringNoticeSentDate = now;
            await proUser.save();
          } catch (warnErr) {
            console.error(`Failed to send expiring soon email to ${proUser.email}:`, warnErr);
          }
        }
      }
    }

    // Query active users with email or push reminders enabled
    const users = await User.find({
      isSuspended: { $ne: true },
      $or: [
        { emailRemindersEnabled: { $ne: false } },
        { pushRemindersEnabled: { $ne: false } },
      ],
    });

    const dispatchedEmail: string[] = [];
    const dispatchedPush: string[] = [];

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

      // If daily goal is not met yet today
      if (questionsCompletedToday < goal) {
        const leadTime = user.reminderLeadTimeMinutes || 0;
        const hasBeenRemindedToday = user.lastReminderSentDate && user.lastReminderSentDate >= startOfToday;
        const hasBeenAdvanceRemindedToday = user.lastAdvanceReminderSentDate && user.lastAdvanceReminderSentDate >= startOfToday;

        let isAdvanceWindow = false;
        if (leadTime > 0 && !hasBeenAdvanceRemindedToday) {
          isAdvanceWindow = true;
        }

        const shouldSendMain = !hasBeenRemindedToday;

        if (shouldSendMain || isAdvanceWindow) {
          // 1. Dispatch Email if enabled
          if (user.emailRemindersEnabled !== false) {
            try {
              await sendDailyStudyReminderEmail({
                to: user.email,
                fullName: user.fullName,
                dailyQuestionGoal: goal,
                preferredStudyTime: isAdvanceWindow
                  ? `${user.preferredStudyTime || "20:00"} (${leadTime}m advance notice)`
                  : user.preferredStudyTime || "20:00",
              });
              dispatchedEmail.push(user.email);
            } catch (sendErr) {
              console.error(`Failed to send cron reminder email to ${user.email}:`, sendErr);
            }
          }

          // 2. Mark reminder dates on user model
          if (isAdvanceWindow) {
            user.lastAdvanceReminderSentDate = now;
          } else {
            user.lastReminderSentDate = now;
          }
          await user.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      activeUsersCount: users.length,
      dispatchedEmailCount: dispatchedEmail.length,
      dispatchedEmails: dispatchedEmail,
      expiringSoonEmailsSent,
      expiredEmailsSent,
    });
  } catch (error: any) {
    console.error("Cron study-reminders error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to execute study reminder cron job." },
      { status: 500 }
    );
  }
}
