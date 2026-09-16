import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const plan = searchParams.get("plan") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    await connectToDatabase();

    const query: any = {};

    if (status !== "all") {
      query.status = status;
    }

    if (plan !== "all") {
      query.plan = plan;
    }

    // Build matching query for payments, supporting search by reference or populated user search
    let paymentQuery = Payment.find(query)
      .populate("userId", "fullName email role university subscriptionPlan")
      .sort({ createdAt: -1 });

    const allPayments = await paymentQuery.exec();

    // Perform search filtering in memory if search query exists (covers reference, user fullName, user email)
    let filteredPayments = allPayments;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filteredPayments = allPayments.filter((p: any) => {
        const refMatch = p.reference?.toLowerCase().includes(q);
        const customerCodeMatch = p.paystackCustomerCode?.toLowerCase().includes(q);
        const userNameMatch = p.userId?.fullName?.toLowerCase().includes(q);
        const userEmailMatch = p.userId?.email?.toLowerCase().includes(q);
        return refMatch || customerCodeMatch || userNameMatch || userEmailMatch;
      });
    }

    const total = filteredPayments.length;
    const skip = (page - 1) * limit;
    const paginatedPayments = filteredPayments.slice(skip, skip + limit);

    // Compute revenue stats
    const totalRevenue = allPayments
      .filter((p: any) => p.status === "success")
      .reduce((sum: number, p: any) => sum + (p.amountNaira || 0), 0);

    const successfulCount = allPayments.filter((p: any) => p.status === "success").length;
    const pendingCount = allPayments.filter((p: any) => p.status === "pending").length;
    const failedCount = allPayments.filter((p: any) => p.status === "failed").length;

    return NextResponse.json({
      success: true,
      payments: paginatedPayments,
      stats: {
        totalRevenue,
        totalTransactions: allPayments.length,
        successfulCount,
        pendingCount,
        failedCount,
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch transaction logs." }, { status: 500 });
  }
}
