#!/usr/bin/env node

import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../shared/schema.js";
import bcrypt from "bcrypt";

console.log("🌱 Inserindo dados iniciais...\n");

// Verificar DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.log("❌ DATABASE_URL não encontrada");
  console.log("Certifique-se de que o arquivo .env está configurado");
  process.exit(1);
}

// Conectar ao banco
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seedDatabase() {
  try {
    // 1. Criar admin padrão
    console.log("👤 Criando admin padrão...");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await db
      .insert(schema.admins)
      .values({
        username: "admin",
        password: hashedPassword,
        email: "admin@example.com",
        role: "super_admin",
        isActive: 1,
      })
      .onConflictDoNothing();

    console.log("✅ Admin criado: admin / admin123");

    // 2. Criar atendentes de exemplo
    console.log("\n👥 Criando atendentes de exemplo...");

    const attendants = [
      {
        name: "João Silva",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        earnings: "2500.00",
      },
      {
        name: "Maria Santos",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        earnings: "3200.00",
      },
      {
        name: "Pedro Costa",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        earnings: "1800.00",
      },
    ];

    for (const attendant of attendants) {
      await db
        .insert(schema.attendants)
        .values(attendant)
        .onConflictDoNothing();
    }

    console.log("✅ Atendentes criados");

    // 3. Criar vendas de exemplo
    console.log("\n💰 Criando vendas de exemplo...");

    const sales = [
      {
        attendantId: 1,
        value: "150.00",
        clientName: "Cliente A",
        clientPhone: "(11) 99999-9999",
        clientEmail: "clientea@email.com",
      },
      {
        attendantId: 1,
        value: "200.00",
        clientName: "Cliente B",
        clientPhone: "(11) 88888-8888",
        clientEmail: "clienteb@email.com",
      },
      {
        attendantId: 2,
        value: "300.00",
        clientName: "Cliente C",
        clientPhone: "(11) 77777-7777",
        clientEmail: "clientec@email.com",
      },
    ];

    for (const sale of sales) {
      await db.insert(schema.sales).values(sale).onConflictDoNothing();
    }

    console.log("✅ Vendas criadas");

    // 4. Criar metas de exemplo
    console.log("\n🎯 Criando metas de exemplo...");

    const goals = [
      {
        attendantId: 1,
        title: "Meta Mensal",
        description: "Meta de vendas para o mês",
        targetValue: "5000.00",
        currentValue: "350.00",
        goalType: "monthly",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        isActive: 1,
      },
      {
        attendantId: 2,
        title: "Meta Semanal",
        description: "Meta de vendas para a semana",
        targetValue: "1000.00",
        currentValue: "300.00",
        goalType: "weekly",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-01-21"),
        isActive: 1,
      },
    ];

    for (const goal of goals) {
      await db.insert(schema.goals).values(goal).onConflictDoNothing();
    }

    console.log("✅ Metas criadas");

    // 5. Criar conquistas de exemplo
    console.log("\n🏆 Criando conquistas de exemplo...");

    const achievements = [
      {
        attendantId: 1,
        title: "Primeira Venda",
        description: "Realizou a primeira venda do mês",
        icon: "🎯",
        badgeColor: "#10b981",
        pointsAwarded: 50,
      },
      {
        attendantId: 2,
        title: "Meta Atingida",
        description: "Atingiu a meta semanal",
        icon: "🏆",
        badgeColor: "#f59e0b",
        pointsAwarded: 100,
      },
    ];

    for (const achievement of achievements) {
      await db
        .insert(schema.achievements)
        .values(achievement)
        .onConflictDoNothing();
    }

    console.log("✅ Conquistas criadas");

    // 6. Criar notificações de exemplo
    console.log("\n🔔 Criando notificações de exemplo...");

    const notifications = [
      {
        type: "sale",
        title: "Nova Venda",
        message: "João Silva realizou uma venda de R$ 150,00",
        attendantId: 1,
        isRead: 0,
        priority: "normal",
      },
      {
        type: "achievement",
        title: "Conquista Desbloqueada",
        message: 'Maria Santos desbloqueou a conquista "Meta Atingida"',
        attendantId: 2,
        isRead: 0,
        priority: "high",
      },
    ];

    for (const notification of notifications) {
      await db
        .insert(schema.notifications)
        .values(notification)
        .onConflictDoNothing();
    }

    console.log("✅ Notificações criadas");

    console.log("\n🎉 Dados iniciais inseridos com sucesso!");
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

seedDatabase();
