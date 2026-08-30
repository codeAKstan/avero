import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Category from "@/models/Category";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalUsers,
      totalStudents,
      totalEducators,
      totalAdmins,
      onboardedUsers,
      totalCategories,
      totalCourses,
      publishedCourses,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "educator" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ isOnboarded: true }),
      Category.countDocuments(),
      Course.countDocuments(),
      Course.countDocuments({ status: "Published" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("fullName email role university createdAt isOnboarded"),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalEducators,
        totalAdmins,
        onboardedUsers,
        onboardedPercentage: totalUsers > 0 ? Math.round((onboardedUsers / totalUsers) * 100) : 0,
        totalCategories,
        totalCourses,
        publishedCourses,
      },
      recentUsers,
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch dashboard stats." }, { status: 500 });
  }
}
