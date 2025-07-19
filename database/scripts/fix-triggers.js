import { Pool } from "pg";
import { config } from "dotenv";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function fixTriggers() {
  console.log("🔧 Corrigindo triggers do banco de dados...\n");

  try {
    // 1. Remover triggers problemáticos
    console.log("1. Removendo triggers problemáticos...");

    const dropTriggers = [
      "DROP TRIGGER IF EXISTS trigger_update_attendant_earnings ON sales",
      "DROP TRIGGER IF EXISTS trigger_update_goal_progress ON sales",
      "DROP TRIGGER IF EXISTS trigger_update_leaderboard ON attendants",
      "DROP FUNCTION IF EXISTS update_attendant_earnings()",
      "DROP FUNCTION IF EXISTS update_goal_progress()",
      "DROP FUNCTION IF EXISTS update_leaderboard()",
    ];

    for (const dropQuery of dropTriggers) {
      try {
        await pool.query(dropQuery);
        console.log(`✅ Removido: ${dropQuery.split(" ")[2]}`);
      } catch (error) {
        console.log(`⚠️ Erro ao remover: ${error.message}`);
      }
    }

    // 2. Recriar funções corrigidas
    console.log("\n2. Recriando funções corrigidas...");

    const fixedFunctions = [
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
         VALUES (NEW.id, 0, 0, 0, 0, NOW())
         ON CONFLICT (attendant_id) DO UPDATE SET
           updated_at = NOW();
         RETURN NEW;
       END;
       $$ LANGUAGE plpgsql`,
    ];

    for (const functionQuery of fixedFunctions) {
      try {
        await pool.query(functionQuery);
        console.log(`✅ Função corrigida criada`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar função: ${error.message}`);
      }
    }

    // 3. Recriar triggers corrigidos
    console.log("\n3. Recriando triggers corrigidos...");

    const fixedTriggers = [
      `CREATE TRIGGER trigger_update_attendant_earnings
       AFTER INSERT OR UPDATE OR DELETE ON sales
       FOR EACH ROW EXECUTE FUNCTION update_attendant_earnings()`,

      `CREATE TRIGGER trigger_update_goal_progress
       AFTER INSERT OR UPDATE OR DELETE ON sales
       FOR EACH ROW EXECUTE FUNCTION update_goal_progress()`,

      `CREATE TRIGGER trigger_update_leaderboard
       AFTER INSERT ON attendants
       FOR EACH ROW EXECUTE FUNCTION update_leaderboard()`,
    ];

    for (const triggerQuery of fixedTriggers) {
      try {
        await pool.query(triggerQuery);
        console.log(`✅ Trigger corrigido criado`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar trigger: ${error.message}`);
      }
    }

    // 4. Testar triggers
    console.log("\n4. Testando triggers...");

    try {
      // Teste de trigger de attendant
      const testAttendant = await pool.query(
        `
        INSERT INTO attendants (name, image_url, earnings) 
        VALUES ($1, $2, $3) 
        RETURNING id
      `,
        ["Teste Trigger", "https://via.placeholder.com/150", "0.00"]
      );

      console.log(`✅ Trigger de attendant funcionando`);

      // Teste de trigger de sales
      await pool.query(
        `
        INSERT INTO sales (attendant_id, value, client_name) 
        VALUES ($1, $2, $3)
      `,
        [testAttendant.rows[0].id, "100.00", "Cliente Teste"]
      );

      console.log(`✅ Trigger de sales funcionando`);

      // Verificar se earnings foi atualizado
      const attendantCheck = await pool.query(
        `
        SELECT earnings FROM attendants WHERE id = $1
      `,
        [testAttendant.rows[0].id]
      );

      console.log(
        `✅ Earnings atualizado: R$ ${attendantCheck.rows[0].earnings}`
      );

      // Limpar dados de teste
      await pool.query(`
        DELETE FROM sales WHERE client_name = 'Cliente Teste'
      `);
      await pool.query(`
        DELETE FROM attendants WHERE name = 'Teste Trigger'
      `);
    } catch (error) {
      console.log(`❌ Erro no teste de trigger: ${error.message}`);
    }

    console.log("\n🎉 Triggers corrigidos com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante a correção:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar correção
fixTriggers().catch(console.error);
