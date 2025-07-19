import { config } from "dotenv";
import { db } from "./server/db.ts";
import { admins } from "./shared/schema.ts";
import { eq } from "drizzle-orm";

config();

async function testAdmin() {
  try {
    console.log("Testing admin lookup...");

    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.username, "luiz"));

    if (admin) {
      console.log("✅ Admin found:", {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      });
    } else {
      console.log("❌ Admin not found");
    }

    // List all admins
    const allAdmins = await db.select().from(admins);
    console.log(
      "\nAll admins:",
      allAdmins.map((a) => ({ username: a.username, isActive: a.isActive }))
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testAdmin();
