import { config } from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcrypt";

config();

async function testLoginDirect() {
  try {
    console.log("Testing login directly...");

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    });

    const username = "luiz";
    const password = "adm";

    // Get admin by username
    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      console.log("❌ Admin not found");
      return;
    }

    const admin = result.rows[0];
    console.log("✅ Admin found:", {
      username: admin.username,
      isActive: admin.is_active,
      passwordHash: admin.password.substring(0, 20) + "...",
    });

    // Check if account is active
    if (admin.is_active === 0) {
      console.log("❌ Account is inactive");
      return;
    }

    // Verify password
    let isValidPassword = false;
    if (admin.password.startsWith("$2")) {
      // Password is hashed
      isValidPassword = await bcrypt.compare(password, admin.password);
    } else {
      // Plain text password (temporary)
      isValidPassword = admin.password === password;
    }

    console.log("Password verification result:", isValidPassword);

    if (isValidPassword) {
      console.log("✅ Login successful!");
    } else {
      console.log("❌ Invalid password");
    }

    await pool.end();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testLoginDirect();
