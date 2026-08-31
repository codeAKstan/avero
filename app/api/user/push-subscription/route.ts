import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/userAuth";
import { connectToDatabase } from "@/lib/mongodb";
import PushSubscription from "@/models/PushSubscription";

export async function POST(request: Request) {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscription } = await request.json();
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: "Invalid push subscription object." }, { status: 400 });
    }

    await connectToDatabase();

    // Upsert push subscription for user
    const pushSub = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        userId: sessionUser._id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userAgent: request.headers.get("user-agent") || undefined,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Browser push notification subscription registered successfully.",
      subscriptionId: pushSub._id,
    });
  } catch (error: any) {
    console.error("Error registering push subscription:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to register push subscription." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { endpoint } = await request.json();
    await connectToDatabase();

    if (endpoint) {
      await PushSubscription.deleteOne({ endpoint, userId: sessionUser._id });
    } else {
      await PushSubscription.deleteMany({ userId: sessionUser._id });
    }

    return NextResponse.json({
      success: true,
      message: "Push subscription removed successfully.",
    });
  } catch (error: any) {
    console.error("Error removing push subscription:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to remove push subscription." },
      { status: 500 }
    );
  }
}
