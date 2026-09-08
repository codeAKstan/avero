import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Setting from "@/models/Setting";

export async function GET() {
  try {
    await connectToDatabase();

    let settings = await Setting.findOne({ key: "site_settings" });
    if (!settings) {
      settings = await Setting.create({ key: "site_settings" });
    }

    return NextResponse.json({
      success: true,
      settings: {
        socialLinks: settings.socialLinks,
        siteName: settings.siteName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        address: settings.address,
        copyrightText: settings.copyrightText,
        isSubscriptionEnabled: settings.isSubscriptionEnabled !== false,
        monthlyPriceNaira: settings.monthlyPriceNaira || 5000,
        annualPriceNaira: settings.annualPriceNaira || 50000,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/settings:", error);
    // Return default settings fallback in case of error
    return NextResponse.json({
      success: true,
      settings: {
        socialLinks: {
          twitter: "https://twitter.com",
          facebook: "https://facebook.com",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
          youtube: "https://youtube.com",
          whatsapp: "",
          tiktok: "",
          telegram: "",
        },
        siteName: "AVERO ACADEMY",
        contactEmail: "support@avero.academy",
        contactPhone: "",
        address: "",
        copyrightText: "AVERO ACADEMY Technologies Inc. All rights reserved.",
        isSubscriptionEnabled: true,
        monthlyPriceNaira: 5000,
        annualPriceNaira: 50000,
      },
    });
  }
}
