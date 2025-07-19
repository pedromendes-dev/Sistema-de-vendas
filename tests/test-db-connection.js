import { config } from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

config();

async function testConnection() {
  try {
    console.log("Testing database connection...");

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    });

    const result = await pool.query(
      "SELECT username, password FROM admins WHERE username = $1",
      ["luiz"]
    );

    if (result.rows.length > 0) {
      console.log("✅ Admin found:", {
        username: result.rows[0].username,
        passwordLength: result.rows[0].password.length,
      });
    } else {
      console.log("❌ Admin not found");
    }

    await pool.end();
  } catch (error) {
    console.error("Database error:", error.message);
  }
}

testConnection();
