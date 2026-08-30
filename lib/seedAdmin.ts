import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function ensureAdminUserExists() {
  try {
    await connectToDatabase();
    const adminEmail = "admin@avero.academy";
    
    let admin = await User.findOne({ email: adminEmail }).select("+passwordHash");

    if (!admin) {
      const hashedPassword = await bcrypt.hash("averoadmin123", 10);
      admin = await User.create({
        fullName: "Avero Superadmin",
        email: adminEmail,
        role: "admin",
        passwordHash: hashedPassword,
        isOnboarded: true,
        isSuspended: false,
      });
      console.log("✅ Superadmin seeded successfully: admin@avero.academy");
    } else {
      let updated = false;
      if (admin.role !== "admin") {
        admin.role = "admin";
        updated = true;
      }
      if (!admin.passwordHash) {
        admin.passwordHash = await bcrypt.hash("averoadmin123", 10);
        updated = true;
      }
      if (updated) {
        await admin.save();
        console.log("✅ Updated superadmin credentials/role.");
      }
    }
    return admin;
  } catch (error) {
    console.error("Error seeding admin user:", error);
    return null;
  }
}
