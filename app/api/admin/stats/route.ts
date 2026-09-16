import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Category from "@/models/Category";
import Course from "@/models/Course";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();

    const [
      totalUsers,
      totalStudents,
      totalEducators,
      totalAdmins,
      onboardedUsers,
      totalProUsers,
      activeProUsers,
      expiredProUsers,
      totalCategories,
      totalCourses,
      publishedCourses,
      recentUsers,
      successfulPayments,
      totalTransactions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "educator" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ isOnboarded: true }),
      User.countDocuments({ subscriptionPlan: "pro" }),
      User.countDocuments({
        subscriptionPlan: "pro",
        $or: [
          { subscriptionExpiresAt: { $gt: now } },
          { subscriptionExpiresAt: null },
          { subscriptionExpiresAt: { $exists: false } },
        ],
      }),
      User.countDocuments({
        subscriptionPlan: "pro",
        subscriptionExpiresAt: { $lte: now },
      }),
      Category.countDocuments(),
      Course.countDocuments(),
      Course.countDocuments({ status: "Published" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("fullName email role university createdAt isOnboarded subscriptionPlan subscriptionExpiresAt"),
      Payment.find({ status: "success" }).select("amountNaira"),
      Payment.countDocuments(),
    ]);

    const totalRevenue = successfulPayments.reduce((sum, p) => sum + (p.amountNaira || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalEducators,
        totalAdmins,
        onboardedUsers,
        onboardedPercentage: totalUsers > 0 ? Math.round((onboardedUsers / totalUsers) * 100) : 0,
        totalProUsers,
        activeProUsers,
        expiredProUsers,
        proPercentage: totalUsers > 0 ? Math.round((totalProUsers / totalUsers) * 100) : 0,
        totalCategories,
        totalCourses,
        publishedCourses,
        totalRevenue,
        totalTransactions,
        successfulTransactions: successfulPayments.length,
      },
      recentUsers,
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch dashboard stats." }, { status: 500 });
  }
}
