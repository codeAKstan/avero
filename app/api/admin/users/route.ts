import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    await connectToDatabase();

    const query: any = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
      ];
    }

    if (role !== "all") {
      query.role = role;
    }

    if (status === "onboarded") {
      query.isOnboarded = true;
    } else if (status === "pending") {
      query.isOnboarded = false;
    } else if (status === "suspended") {
      query.isSuspended = true;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch users." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, role, password, studentType, university, gradYear } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Name and Email are required." }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 400 });
    }

    let passwordHash = undefined;
    if (role === "admin" || password) {
      passwordHash = await bcrypt.hash(password || "averoadmin123", 10);
    }

    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      role: role || "student",
      passwordHash,
      studentType,
      university,
      gradYear,
      isOnboarded: true,
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully.",
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create user." }, { status: 500 });
  }
}
