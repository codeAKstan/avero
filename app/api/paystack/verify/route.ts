import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/userAuth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Payment from "@/models/Payment";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { sendSubscriptionActivatedEmail } from "@/lib/email";

export async function GET(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "Transaction reference is required." }, { status: 400 });
    }

    await connectToDatabase();
    const verification = await verifyPaystackTransaction(reference);

    if (verification.status === "success") {
      const planType = verification.metadata?.plan || "pro_monthly";
      const daysToAdd = planType === "pro_annual" ? 365 : 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);

      // Update User to Pro
      await User.findByIdAndUpdate(user._id, {
        subscriptionPlan: "pro",
        subscriptionStatus: "active",
        paystackCustomerCode: verification.customer.customer_code,
        subscriptionExpiresAt: expiresAt,
      });

      // Update Payment record
      await Payment.findOneAndUpdate(
        { reference },
        {
          status: "success",
          paystackChannel: verification.channel,
          paystackCustomerCode: verification.customer.customer_code,
        }
      );

      try {
        await sendSubscriptionActivatedEmail({
          to: user.email,
          fullName: user.fullName,
          planName: planType === "pro_annual" ? "Pro Annual" : "Pro Monthly",
          expiresAt,
          isAdminGranted: false,
        });
      } catch (emailErr) {
        console.error("Failed to send subscription activation email from verify endpoint:", emailErr);
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully! Welcome to Avero Pro.",
        subscriptionPlan: "pro",
        expiresAt,
      });
    } else {
      await Payment.findOneAndUpdate({ reference }, { status: "failed" });
      return NextResponse.json(
        { success: false, error: "Payment verification failed or was not completed." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in /api/paystack/verify:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify transaction." },
      { status: 500 }
    );
  }
}
