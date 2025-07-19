#!/usr/bin/env node

import { config } from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcrypt";

// Carregar variáveis de ambiente
config();

console.log("🔐 Atualizando credenciais...\n");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

async function updateCredentials() {
  try {
    // Atualizar admin existente ou criar novo
    console.log("👤 Atualizando admin...");
    const hashedPassword = await bcrypt.hash("adm", 10);

    await pool.query(
      `
      UPDATE admins 
      SET username = $1, password = $2 
      WHERE username = 'admin'
    `,
      ["luiz", hashedPassword]
    );

    // Se não existir admin, criar um novo
    const result = await pool.query(
      "SELECT COUNT(*) FROM admins WHERE username = $1",
      ["luiz"]
    );
    if (result.rows[0].count === "0") {
      await pool.query(
        `
        INSERT INTO admins (username, password, email, role, is_active) 
        VALUES ($1, $2, $3, $4, $5) 
        ON CONFLICT (username) DO NOTHING
      `,
        ["luiz", hashedPassword, "luiz@example.com", "super_admin", 1]
      );
    }

    console.log("✅ Credenciais atualizadas!");
    console.log("\n📋 Novas credenciais de acesso:");
    console.log("👤 Usuário: luiz");
    console.log("🔑 Senha: adm");
    console.log("🌐 URL: http://localhost:5050/admin");
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await pool.end();
  }
}

updateCredentials();
