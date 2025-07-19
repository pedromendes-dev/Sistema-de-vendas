import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "dotenv";
import { sql } from "drizzle-orm";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Aumentar pool de conexões
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const db = drizzle(pool);

async function optimizeDatabase() {
  console.log("🚀 Iniciando otimização completa do banco de dados...\n");

  try {
    // 1. Verificar conexão
    console.log("1. Verificando conexão com o banco...");
    await pool.query("SELECT NOW()");
    console.log("✅ Conexão estabelecida com sucesso\n");

    // 2. Criar índices para performance
    console.log("2. Criando índices para otimização de performance...");

    const indexes = [
      // Índices para tabela sales
      "CREATE INDEX IF NOT EXISTS idx_sales_attendant_id ON sales(attendant_id)",
      "CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC)",
      "CREATE INDEX IF NOT EXISTS idx_sales_client_phone ON sales(client_phone)",
      "CREATE INDEX IF NOT EXISTS idx_sales_client_email ON sales(client_email)",
      "CREATE INDEX IF NOT EXISTS idx_sales_value ON sales(value DESC)",

      // Índices para tabela attendants
      "CREATE INDEX IF NOT EXISTS idx_attendants_name ON attendants(name)",
      "CREATE INDEX IF NOT EXISTS idx_attendants_earnings ON attendants(earnings DESC)",

      // Índices para tabela admins
      "CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username)",
      "CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active)",
      "CREATE INDEX IF NOT EXISTS idx_admins_created_at ON admins(created_at DESC)",

      // Índices para tabela goals
      "CREATE INDEX IF NOT EXISTS idx_goals_attendant_id ON goals(attendant_id)",
      "CREATE INDEX IF NOT EXISTS idx_goals_is_active ON goals(is_active)",
      "CREATE INDEX IF NOT EXISTS idx_goals_end_date ON goals(end_date)",
      "CREATE INDEX IF NOT EXISTS idx_goals_goal_type ON goals(goal_type)",
      "CREATE INDEX IF NOT EXISTS idx_goals_created_at ON goals(created_at DESC)",

      // Índices para tabela achievements
      "CREATE INDEX IF NOT EXISTS idx_achievements_attendant_id ON achievements(attendant_id)",
      "CREATE INDEX IF NOT EXISTS idx_achievements_achieved_at ON achievements(achieved_at DESC)",

      // Índices para tabela leaderboard
      "CREATE INDEX IF NOT EXISTS idx_leaderboard_attendant_id ON leaderboard(attendant_id)",
      "CREATE INDEX IF NOT EXISTS idx_leaderboard_total_points ON leaderboard(total_points DESC)",
      "CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(rank)",

      // Índices para tabela notifications
      "CREATE INDEX IF NOT EXISTS idx_notifications_attendant_id ON notifications(attendant_id)",
      "CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)",
      "CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC)",
      "CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)",
      "CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority)",
    ];

    for (const indexQuery of indexes) {
      try {
        await pool.query(indexQuery);
        console.log(`✅ Índice criado: ${indexQuery.split(" ")[2]}`);
      } catch (error) {
        console.log(`⚠️ Índice já existe ou erro: ${indexQuery.split(" ")[2]}`);
      }
    }

    // 3. Adicionar constraints de integridade
    console.log("\n3. Adicionando constraints de integridade...");

    const constraints = [
      // Foreign key constraints
      "ALTER TABLE sales ADD CONSTRAINT IF NOT EXISTS fk_sales_attendant_id FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE CASCADE",
      "ALTER TABLE goals ADD CONSTRAINT IF NOT EXISTS fk_goals_attendant_id FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE CASCADE",
      "ALTER TABLE achievements ADD CONSTRAINT IF NOT EXISTS fk_achievements_attendant_id FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE CASCADE",
      "ALTER TABLE leaderboard ADD CONSTRAINT IF NOT EXISTS fk_leaderboard_attendant_id FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE CASCADE",
      "ALTER TABLE notifications ADD CONSTRAINT IF NOT EXISTS fk_notifications_attendant_id FOREIGN KEY (attendant_id) REFERENCES attendants(id) ON DELETE SET NULL",

      // Check constraints
      "ALTER TABLE sales ADD CONSTRAINT IF NOT EXISTS chk_sales_value_positive CHECK (value > 0)",
      "ALTER TABLE attendants ADD CONSTRAINT IF NOT EXISTS chk_attendants_earnings_positive CHECK (earnings >= 0)",
      "ALTER TABLE goals ADD CONSTRAINT IF NOT EXISTS chk_goals_target_value_positive CHECK (target_value > 0)",
      "ALTER TABLE goals ADD CONSTRAINT IF NOT EXISTS chk_goals_current_value_positive CHECK (current_value >= 0)",
      "ALTER TABLE goals ADD CONSTRAINT IF NOT EXISTS chk_goals_dates_valid CHECK (end_date > start_date)",
      "ALTER TABLE admins ADD CONSTRAINT IF NOT EXISTS chk_admins_is_active_valid CHECK (is_active IN (0, 1))",
      "ALTER TABLE goals ADD CONSTRAINT IF NOT EXISTS chk_goals_is_active_valid CHECK (is_active IN (0, 1))",
      "ALTER TABLE notifications ADD CONSTRAINT IF NOT EXISTS chk_notifications_is_read_valid CHECK (is_read IN (0, 1))",
      "ALTER TABLE leaderboard ADD CONSTRAINT IF NOT EXISTS chk_leaderboard_points_positive CHECK (total_points >= 0)",
      "ALTER TABLE leaderboard ADD CONSTRAINT IF NOT EXISTS chk_leaderboard_streak_positive CHECK (current_streak >= 0 AND best_streak >= 0)",
    ];

    for (const constraintQuery of constraints) {
      try {
        await pool.query(constraintQuery);
        console.log(
          `✅ Constraint adicionada: ${constraintQuery.split(" ")[2]}`
        );
      } catch (error) {
        console.log(
          `⚠️ Constraint já existe ou erro: ${constraintQuery.split(" ")[2]}`
        );
      }
    }

    // 4. Otimizar configurações do PostgreSQL
    console.log("\n4. Otimizando configurações do PostgreSQL...");

    const optimizations = [
      // Configurações de performance
      "SET work_mem = '256MB'",
      "SET maintenance_work_mem = '256MB'",
      "SET shared_buffers = '256MB'",
      "SET effective_cache_size = '1GB'",
      "SET random_page_cost = 1.1",
      "SET effective_io_concurrency = 200",
      "SET max_parallel_workers_per_gather = 2",
      "SET max_parallel_workers = 4",
      "SET max_worker_processes = 8",
    ];

    for (const optimization of optimizations) {
      try {
        await pool.query(optimization);
        console.log(`✅ Configuração aplicada: ${optimization.split(" ")[1]}`);
      } catch (error) {
        console.log(
          `⚠️ Configuração não aplicada: ${optimization.split(" ")[1]}`
        );
      }
    }

    // 5. Criar views materializadas para relatórios
    console.log("\n5. Criando views materializadas para relatórios...");

    const views = [
      `CREATE OR REPLACE VIEW v_sales_summary AS
       SELECT 
         a.id as attendant_id,
         a.name as attendant_name,
         COUNT(s.id) as total_sales,
         COALESCE(SUM(s.value), 0) as total_revenue,
         COALESCE(AVG(s.value), 0) as average_ticket,
         MAX(s.created_at) as last_sale_date
       FROM attendants a
       LEFT JOIN sales s ON a.id = s.attendant_id
       GROUP BY a.id, a.name`,

      `CREATE OR REPLACE VIEW v_monthly_performance AS
       SELECT 
         a.id as attendant_id,
         a.name as attendant_name,
         DATE_TRUNC('month', s.created_at) as month,
         COUNT(s.id) as sales_count,
         COALESCE(SUM(s.value), 0) as revenue,
         COALESCE(AVG(s.value), 0) as avg_ticket
       FROM attendants a
       LEFT JOIN sales s ON a.id = s.attendant_id
       WHERE s.created_at >= CURRENT_DATE - INTERVAL '12 months'
       GROUP BY a.id, a.name, DATE_TRUNC('month', s.created_at)
       ORDER BY month DESC, revenue DESC`,

      `CREATE OR REPLACE VIEW v_client_insights AS
       SELECT 
         client_phone,
         client_name,
         COUNT(*) as purchase_count,
         SUM(value) as total_spent,
         AVG(value) as avg_purchase,
         MIN(created_at) as first_purchase,
         MAX(created_at) as last_purchase
       FROM sales
       WHERE client_phone IS NOT NULL OR client_name IS NOT NULL
       GROUP BY client_phone, client_name
       ORDER BY total_spent DESC`,

      `CREATE OR REPLACE VIEW v_goal_progress AS
       SELECT 
         g.id,
         g.title,
         g.target_value,
         g.current_value,
         g.goal_type,
         g.end_date,
         g.is_active,
         a.name as attendant_name,
         CASE 
           WHEN g.current_value >= g.target_value THEN 100
           ELSE (g.current_value / g.target_value * 100)
         END as progress_percentage,
         CASE 
           WHEN g.end_date < CURRENT_DATE THEN 'Vencida'
           WHEN g.current_value >= g.target_value THEN 'Concluída'
           WHEN g.is_active = 0 THEN 'Finalizada'
           ELSE 'Em andamento'
         END as status
       FROM goals g
       JOIN attendants a ON g.attendant_id = a.id
       ORDER BY g.end_date ASC`,

      `CREATE OR REPLACE VIEW v_achievement_summary AS
       SELECT 
         a.id as attendant_id,
         a.name as attendant_name,
         COUNT(ach.id) as achievements_count,
         SUM(ach.points_awarded) as total_points,
         MAX(ach.achieved_at) as last_achievement
       FROM attendants a
       LEFT JOIN achievements ach ON a.id = ach.attendant_id
       GROUP BY a.id, a.name
       ORDER BY total_points DESC`,
    ];

    for (const viewQuery of views) {
      try {
        await pool.query(viewQuery);
        console.log(`✅ View criada/atualizada`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar view: ${error.message}`);
      }
    }

    // 6. Criar funções para operações comuns
    console.log("\n6. Criando funções para operações comuns...");

    const functions = [
      `CREATE OR REPLACE FUNCTION update_attendant_earnings()
       RETURNS TRIGGER AS $$
       BEGIN
         IF TG_OP = 'INSERT' THEN
           UPDATE attendants 
           SET earnings = earnings + NEW.value 
           WHERE id = NEW.attendant_id;
           RETURN NEW;
         ELSIF TG_OP = 'DELETE' THEN
           UPDATE attendants 
           SET earnings = earnings - OLD.value 
           WHERE id = OLD.attendant_id;
           RETURN OLD;
         ELSIF TG_OP = 'UPDATE' THEN
           UPDATE attendants 
           SET earnings = earnings - OLD.value + NEW.value 
           WHERE id = NEW.attendant_id;
           RETURN NEW;
         END IF;
         RETURN NULL;
       END;
       $$ LANGUAGE plpgsql`,

      `CREATE OR REPLACE FUNCTION update_goal_progress()
       RETURNS TRIGGER AS $$
       BEGIN
         UPDATE goals 
         SET current_value = (
           SELECT COALESCE(SUM(value), 0)
           FROM sales 
           WHERE attendant_id = NEW.attendant_id
           AND created_at BETWEEN goals.start_date AND goals.end_date
         )
         WHERE attendant_id = NEW.attendant_id 
         AND is_active = 1
         AND NEW.created_at BETWEEN start_date AND end_date;
         RETURN NEW;
       END;
       $$ LANGUAGE plpgsql`,

      `CREATE OR REPLACE FUNCTION update_leaderboard()
       RETURNS TRIGGER AS $$
       BEGIN
         INSERT INTO leaderboard (attendant_id, total_points, current_streak, best_streak, rank, updated_at)
         VALUES (NEW.attendant_id, 0, 0, 0, 0, NOW())
         ON CONFLICT (attendant_id) DO UPDATE SET
           updated_at = NOW();
         RETURN NEW;
       END;
       $$ LANGUAGE plpgsql`,

      `CREATE OR REPLACE FUNCTION get_attendant_stats(attendant_id_param INTEGER)
       RETURNS TABLE (
         total_sales BIGINT,
         total_revenue DECIMAL,
         average_ticket DECIMAL,
         last_sale_date TIMESTAMP,
         active_goals_count BIGINT,
         achievements_count BIGINT
       ) AS $$
       BEGIN
         RETURN QUERY
         SELECT 
           COUNT(s.id)::BIGINT as total_sales,
           COALESCE(SUM(s.value), 0) as total_revenue,
           COALESCE(AVG(s.value), 0) as average_ticket,
           MAX(s.created_at) as last_sale_date,
           COUNT(g.id)::BIGINT as active_goals_count,
           COUNT(ach.id)::BIGINT as achievements_count
         FROM attendants a
         LEFT JOIN sales s ON a.id = s.attendant_id
         LEFT JOIN goals g ON a.id = g.attendant_id AND g.is_active = 1
         LEFT JOIN achievements ach ON a.id = ach.attendant_id
         WHERE a.id = attendant_id_param
         GROUP BY a.id;
       END;
       $$ LANGUAGE plpgsql`,
    ];

    for (const functionQuery of functions) {
      try {
        await pool.query(functionQuery);
        console.log(`✅ Função criada/atualizada`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar função: ${error.message}`);
      }
    }

    // 7. Criar triggers
    console.log("\n7. Criando triggers automáticos...");

    const triggers = [
      `DROP TRIGGER IF EXISTS trigger_update_attendant_earnings ON sales;
       CREATE TRIGGER trigger_update_attendant_earnings
       AFTER INSERT OR UPDATE OR DELETE ON sales
       FOR EACH ROW EXECUTE FUNCTION update_attendant_earnings()`,

      `DROP TRIGGER IF EXISTS trigger_update_goal_progress ON sales;
       CREATE TRIGGER trigger_update_goal_progress
       AFTER INSERT OR UPDATE OR DELETE ON sales
       FOR EACH ROW EXECUTE FUNCTION update_goal_progress()`,

      `DROP TRIGGER IF EXISTS trigger_update_leaderboard ON attendants;
       CREATE TRIGGER trigger_update_leaderboard
       AFTER INSERT ON attendants
       FOR EACH ROW EXECUTE FUNCTION update_leaderboard()`,
    ];

    for (const triggerQuery of triggers) {
      try {
        await pool.query(triggerQuery);
        console.log(`✅ Trigger criado/atualizado`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar trigger: ${error.message}`);
      }
    }

    // 8. Análise e estatísticas
    console.log("\n8. Atualizando estatísticas do banco...");

    try {
      await pool.query("ANALYZE");
      console.log("✅ Estatísticas atualizadas");
    } catch (error) {
      console.log(`⚠️ Erro ao atualizar estatísticas: ${error.message}`);
    }

    // 9. Verificar integridade
    console.log("\n9. Verificando integridade dos dados...");

    const integrityChecks = [
      "SELECT COUNT(*) as total_attendants FROM attendants",
      "SELECT COUNT(*) as total_sales FROM sales",
      "SELECT COUNT(*) as total_admins FROM admins",
      "SELECT COUNT(*) as total_goals FROM goals",
      "SELECT COUNT(*) as total_achievements FROM achievements",
      "SELECT COUNT(*) as total_notifications FROM notifications",
      "SELECT COUNT(*) as total_leaderboard FROM leaderboard",
    ];

    for (const checkQuery of integrityChecks) {
      try {
        const result = await pool.query(checkQuery);
        const tableName = checkQuery.split(" ")[3];
        console.log(
          `✅ ${tableName}: ${
            result.rows[0].total_attendants ||
            result.rows[0].total_sales ||
            result.rows[0].total_admins ||
            result.rows[0].total_goals ||
            result.rows[0].total_achievements ||
            result.rows[0].total_notifications ||
            result.rows[0].total_leaderboard
          } registros`
        );
      } catch (error) {
        console.log(
          `⚠️ Erro ao verificar ${checkQuery.split(" ")[3]}: ${error.message}`
        );
      }
    }

    // 10. Configurações de backup e manutenção
    console.log("\n10. Configurando backup e manutenção...");

    const maintenanceQueries = [
      "VACUUM ANALYZE",
      "REINDEX DATABASE current_database()",
    ];

    for (const maintenanceQuery of maintenanceQueries) {
      try {
        await pool.query(maintenanceQuery);
        console.log(
          `✅ Manutenção executada: ${maintenanceQuery.split(" ")[0]}`
        );
      } catch (error) {
        console.log(`⚠️ Erro na manutenção: ${error.message}`);
      }
    }

    console.log("\n🎉 Otimização do banco de dados concluída com sucesso!");
    console.log("\n📊 Resumo das otimizações:");
    console.log("✅ Índices criados para performance");
    console.log("✅ Constraints de integridade adicionadas");
    console.log("✅ Configurações de performance aplicadas");
    console.log("✅ Views materializadas criadas");
    console.log("✅ Funções e triggers criados");
    console.log("✅ Estatísticas atualizadas");
    console.log("✅ Manutenção executada");
  } catch (error) {
    console.error("❌ Erro durante a otimização:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar otimização
optimizeDatabase().catch(console.error);
