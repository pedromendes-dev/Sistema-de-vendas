#!/usr/bin/env node

import { config } from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcrypt";

// Carregar variáveis de ambiente
config();

console.log("🌱 Inserindo dados básicos...\n");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

async function insertBasicData() {
  try {
    // 1. Criar admin
    console.log("👤 Criando admin...");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await pool.query(
      `
      INSERT INTO admins (username, password, email, role, is_active) 
      VALUES ($1, $2, $3, $4, $5) 
      ON CONFLICT (username) DO NOTHING
    `,
      ["admin", hashedPassword, "admin@example.com", "super_admin", 1]
    );

    console.log("✅ Admin criado: admin / admin123");

    // 2. Criar atendentes
    console.log("\n👥 Criando atendentes...");

    const attendants = [
      [
        "João Silva",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        "2500.00",
      ],
      [
        "Maria Santos",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        "3200.00",
      ],
    ];

    for (const [name, imageUrl, earnings] of attendants) {
      await pool.query(
        `
        INSERT INTO attendants (name, image_url, earnings) 
        VALUES ($1, $2, $3) 
        ON CONFLICT DO NOTHING
      `,
        [name, imageUrl, earnings]
      );
    }

    console.log("✅ Atendentes criados");

    // 3. Criar vendas
    console.log("\n💰 Criando vendas...");

    const sales = [
      [1, "150.00", "Cliente A", "(11) 99999-9999", "clientea@email.com"],
      [1, "200.00", "Cliente B", "(11) 88888-8888", "clienteb@email.com"],
      [2, "300.00", "Cliente C", "(11) 77777-7777", "clientec@email.com"],
    ];

    for (const [
      attendantId,
      value,
      clientName,
      clientPhone,
      clientEmail,
    ] of sales) {
      await pool.query(
        `
        INSERT INTO sales (attendant_id, value, client_name, client_phone, client_email) 
        VALUES ($1, $2, $3, $4, $5) 
        ON CONFLICT DO NOTHING
      `,
        [attendantId, value, clientName, clientPhone, clientEmail]
      );
    }

    console.log("✅ Vendas criadas");

    console.log("\n🎉 Dados básicos inseridos com sucesso!");
    console.log("\n📋 Credenciais de acesso:");
    console.log("👤 Admin: admin");
    console.log("🔑 Senha: admin123");
    console.log("🌐 URL: http://localhost:5050/admin");
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await pool.end();
  }
}

insertBasicData();
