#!/usr/bin/env node

import { config } from "dotenv";
import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

// Carregar variáveis de ambiente
config();

console.log("🌱 Inserindo dados de exemplo...\n");

// Verificar DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.log("❌ DATABASE_URL não encontrada");
  console.log("Certifique-se de que o arquivo .env está configurado");
  process.exit(1);
}

// Conectar ao banco
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function insertSampleData() {
  try {
    // 1. Criar admin padrão
    console.log("👤 Criando admin padrão...");
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

    // 2. Criar atendentes de exemplo
    console.log("\n👥 Criando atendentes de exemplo...");

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
      [
        "Pedro Costa",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        "1800.00",
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

    // 3. Criar vendas de exemplo
    console.log("\n💰 Criando vendas de exemplo...");

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

    // 4. Criar metas de exemplo
    console.log("\n🎯 Criando metas de exemplo...");

    const goals = [
      [
        1,
        "Meta Mensal",
        "Meta de vendas para o mês",
        "5000.00",
        "350.00",
        "monthly",
        "2024-01-01",
        "2024-01-31",
      ],
      [
        2,
        "Meta Semanal",
        "Meta de vendas para a semana",
        "1000.00",
        "300.00",
        "weekly",
        "2024-01-15",
        "2024-01-21",
      ],
    ];

    for (const [
      attendantId,
      title,
      description,
      targetValue,
      currentValue,
      goalType,
      startDate,
      endDate,
    ] of goals) {
      await pool.query(
        `
        INSERT INTO goals (attendant_id, title, description, target_value, current_value, goal_type, start_date, end_date, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        ON CONFLICT DO NOTHING
      `,
        [
          attendantId,
          title,
          description,
          targetValue,
          currentValue,
          goalType,
          startDate,
          endDate,
          1,
        ]
      );
    }

    console.log("✅ Metas criadas");

    // 5. Criar conquistas de exemplo
    console.log("\n🏆 Criando conquistas de exemplo...");

    const achievements = [
      [
        1,
        "Primeira Venda",
        "Realizou a primeira venda do mês",
        "🎯",
        "#10b981",
        50,
      ],
      [2, "Meta Atingida", "Atingiu a meta semanal", "🏆", "#f59e0b", 100],
    ];

    for (const [
      attendantId,
      title,
      description,
      icon,
      badgeColor,
      pointsAwarded,
    ] of achievements) {
      await pool.query(
        `
        INSERT INTO achievements (attendant_id, title, description, icon, badge_color, points_awarded) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        ON CONFLICT DO NOTHING
      `,
        [attendantId, title, description, icon, badgeColor, pointsAwarded]
      );
    }

    console.log("✅ Conquistas criadas");

    // 6. Criar notificações de exemplo
    console.log("\n🔔 Criando notificações de exemplo...");

    const notifications = [
      [
        "sale",
        "Nova Venda",
        "João Silva realizou uma venda de R$ 150,00",
        1,
        0,
        "normal",
      ],
      [
        "achievement",
        "Conquista Desbloqueada",
        'Maria Santos desbloqueou a conquista "Meta Atingida"',
        2,
        0,
        "high",
      ],
    ];

    for (const [
      type,
      title,
      message,
      attendantId,
      isRead,
      priority,
    ] of notifications) {
      await pool.query(
        `
        INSERT INTO notifications (type, title, message, attendant_id, is_read, priority) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        ON CONFLICT DO NOTHING
      `,
        [type, title, message, attendantId, isRead, priority]
      );
    }

    console.log("✅ Notificações criadas");

    console.log("\n🎉 Dados de exemplo inseridos com sucesso!");
    console.log("\n📋 Credenciais de acesso:");
    console.log("👤 Admin: admin");
    console.log("🔑 Senha: admin123");
    console.log("🌐 URL: http://localhost:3000/admin");
  } catch (error) {
    console.error("❌ Erro ao inserir dados:", error);
  } finally {
    await pool.end();
  }
}

insertSampleData();
