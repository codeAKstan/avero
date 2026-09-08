import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminFromSession } from "@/lib/adminAuth";
import Setting from "@/models/Setting";

export async function GET() {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    let settings = await Setting.findOne({ key: "site_settings" });
    if (!settings) {
      settings = await Setting.create({ key: "site_settings" });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/settings:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getAdminFromSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      socialLinks,
      siteName,
      contactEmail,
      contactPhone,
      address,
      copyrightText,
      isSubscriptionEnabled,
      monthlyPriceNaira,
      annualPriceNaira,
      paystackMonthlyPlanCode,
      paystackAnnualPlanCode,
    } = body;

    await connectToDatabase();

    let settings = await Setting.findOne({ key: "site_settings" });
    if (!settings) {
      settings = new Setting({ key: "site_settings" });
    }

    if (socialLinks !== undefined) {
      settings.socialLinks = {
        twitter: socialLinks.twitter?.trim() ?? "",
        facebook: socialLinks.facebook?.trim() ?? "",
        instagram: socialLinks.instagram?.trim() ?? "",
        linkedin: socialLinks.linkedin?.trim() ?? "",
        youtube: socialLinks.youtube?.trim() ?? "",
        whatsapp: socialLinks.whatsapp?.trim() ?? "",
        tiktok: socialLinks.tiktok?.trim() ?? "",
        telegram: socialLinks.telegram?.trim() ?? "",
      };
    }

    if (siteName !== undefined) settings.siteName = siteName.trim();
    if (contactEmail !== undefined) settings.contactEmail = contactEmail.trim();
    if (contactPhone !== undefined) settings.contactPhone = contactPhone.trim();
    if (address !== undefined) settings.address = address.trim();
    if (copyrightText !== undefined) settings.copyrightText = copyrightText.trim();
    if (isSubscriptionEnabled !== undefined) settings.isSubscriptionEnabled = Boolean(isSubscriptionEnabled);
    if (monthlyPriceNaira !== undefined) settings.monthlyPriceNaira = Number(monthlyPriceNaira);
    if (annualPriceNaira !== undefined) settings.annualPriceNaira = Number(annualPriceNaira);
    if (paystackMonthlyPlanCode !== undefined) settings.paystackMonthlyPlanCode = paystackMonthlyPlanCode.trim();
    if (paystackAnnualPlanCode !== undefined) settings.paystackAnnualPlanCode = paystackAnnualPlanCode.trim();

    await settings.save();

    return NextResponse.json({
      success: true,
      message: "Admin settings updated successfully.",
      settings,
    });
  } catch (error: any) {
    console.error("Error in PUT /api/admin/settings:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update settings." },
      { status: 500 }
    );
  }
}
