import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Payment from "@/models/Payment";
import { verifyPaystackWebhookSignature } from "@/lib/paystack";
import { sendSubscriptionActivatedEmail, sendSubscriptionExpiredEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature") || "";

    const isValid = verifyPaystackWebhookSignature(signature, rawBody);
    if (!isValid) {
      console.warn("Paystack Webhook signature mismatch.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const { event: eventName, data } = event;

    await connectToDatabase();

    switch (eventName) {
      case "charge.success": {
        const reference = data.reference;
        const customerCode = data.customer?.customer_code;
        const userEmail = data.customer?.email;
        const metadataPlan = data.metadata?.plan || "pro_monthly";

        const daysToAdd = metadataPlan === "pro_annual" ? 365 : 30;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + daysToAdd);

        // Find user by email or customer code
        const user = await User.findOne({
          $or: [{ email: userEmail?.toLowerCase() }, { paystackCustomerCode: customerCode }],
        });

        if (user) {
          user.subscriptionPlan = "pro";
          user.subscriptionStatus = "active";
          user.paystackCustomerCode = customerCode || user.paystackCustomerCode;
          user.subscriptionExpiresAt = expiresAt;
          await user.save();

          try {
            await sendSubscriptionActivatedEmail({
              to: user.email,
              fullName: user.fullName,
              planName: metadataPlan === "pro_annual" ? "Pro Annual" : "Pro Monthly",
              expiresAt,
              isAdminGranted: false,
            });
          } catch (emailErr) {
            console.error("Failed to send subscription activation email from webhook:", emailErr);
          }
        }

        // Update payment log
        await Payment.findOneAndUpdate(
          { reference },
          {
            status: "success",
            paystackChannel: data.channel,
            paystackCustomerCode: customerCode,
          }
        );
        break;
      }

      case "subscription.create": {
        const customerCode = data.customer?.customer_code;
        const subscriptionCode = data.subscription_code;
        if (customerCode) {
          await User.findOneAndUpdate(
            { paystackCustomerCode: customerCode },
            { paystackSubscriptionCode: subscriptionCode, subscriptionStatus: "active" }
          );
        }
        break;
      }

      case "subscription.disable":
      case "invoice.payment_failed": {
        const customerCode = data.customer?.customer_code;
        const email = data.customer?.email;
        if (customerCode || email) {
          const user = await User.findOneAndUpdate(
            { $or: [{ paystackCustomerCode: customerCode }, { email: email?.toLowerCase() }] },
            { subscriptionStatus: "past_due", subscriptionPlan: "free" }
          );

          if (user) {
            try {
              await sendSubscriptionExpiredEmail({
                to: user.email,
                fullName: user.fullName,
              });
            } catch (emailErr) {
              console.error("Failed to send subscription expired email from webhook:", emailErr);
            }
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Paystack webhook event: ${eventName}`);
    }

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Error in /api/paystack/webhook:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook handling failed" },
      { status: 500 }
    );
  }
}
