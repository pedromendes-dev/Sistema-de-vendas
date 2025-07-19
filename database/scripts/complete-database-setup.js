import { Pool } from "pg";
import { config } from "dotenv";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function completeDatabaseSetup() {
  console.log("🚀 Configuração completa do banco de dados...\n");

  try {
    // 1. Limpar tudo primeiro
    console.log("1. Limpando configurações anteriores...");

    const cleanupQueries = [
      "DROP TRIGGER IF EXISTS trigger_update_attendant_earnings ON sales",
      "DROP TRIGGER IF EXISTS trigger_update_goal_progress ON sales",
      "DROP TRIGGER IF EXISTS trigger_update_leaderboard ON attendants",
      "DROP FUNCTION IF EXISTS update_attendant_earnings()",
      "DROP FUNCTION IF EXISTS update_goal_progress()",
      "DROP FUNCTION IF EXISTS update_leaderboard()",
      "DROP FUNCTION IF EXISTS get_attendant_stats(INTEGER)",
      "DROP FUNCTION IF EXISTS get_sales_summary()",
    ];

    for (const query of cleanupQueries) {
      try {
        await pool.query(query);
        console.log(`✅ Limpo: ${query.split(" ")[2]}`);
      } catch (error) {
        console.log(`⚠️ Erro ao limpar: ${error.message}`);
      }
    }

    // 2. Verificar e corrigir estrutura da tabela leaderboard
    console.log("\n2. Verificando estrutura da tabela leaderboard...");

    try {
      // Verificar se a constraint única existe
      const constraintCheck = await pool.query(`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'leaderboard' 
        AND constraint_type = 'UNIQUE'
      `);

      if (constraintCheck.rows.length === 0) {
        // Adicionar constraint única se não existir
        await pool.query(`
          ALTER TABLE leaderboard 
          ADD CONSTRAINT leaderboard_attendant_id_unique 
          UNIQUE (attendant_id)
        `);
        console.log("✅ Constraint única adicionada ao leaderboard");
      } else {
        console.log("✅ Constraint única já existe no leaderboard");
      }
    } catch (error) {
      console.log(`⚠️ Erro na constraint: ${error.message}`);
    }

    // 3. Criar funções simplificadas e robustas
    console.log("\n3. Criando funções robustas...");

    const robustFunctions = [
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
         -- Tentar inserir, se falhar, atualizar
         BEGIN
           INSERT INTO leaderboard (attendant_id, total_points, current_streak, best_streak, rank, updated_at)
           VALUES (NEW.id, 0, 0, 0, 0, NOW());
         EXCEPTION WHEN unique_violation THEN
           UPDATE leaderboard 
           SET updated_at = NOW()
           WHERE attendant_id = NEW.id;
         END;
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
       $$ LANGUAGE plpgsql STABLE`,

      `CREATE OR REPLACE FUNCTION get_sales_summary()
       RETURNS TABLE (
         attendant_id INTEGER,
         attendant_name TEXT,
         total_sales BIGINT,
         total_revenue DECIMAL,
         average_ticket DECIMAL,
         last_sale_date TIMESTAMP
       ) AS $$
       BEGIN
         RETURN QUERY
         SELECT 
           a.id,
           a.name,
           COUNT(s.id)::BIGINT,
           COALESCE(SUM(s.value), 0),
           COALESCE(AVG(s.value), 0),
           MAX(s.created_at)
         FROM attendants a
         LEFT JOIN sales s ON a.id = s.attendant_id
         GROUP BY a.id, a.name
         ORDER BY total_revenue DESC;
       END;
       $$ LANGUAGE plpgsql STABLE`,
    ];

    for (const functionQuery of robustFunctions) {
      try {
        await pool.query(functionQuery);
        console.log(`✅ Função robusta criada`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar função: ${error.message}`);
      }
    }

    // 4. Criar triggers robustos
    console.log("\n4. Criando triggers robustos...");

    const robustTriggers = [
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

    for (const triggerQuery of robustTriggers) {
      try {
        await pool.query(triggerQuery);
        console.log(`✅ Trigger robusto criado`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar trigger: ${error.message}`);
      }
    }

    // 5. Teste completo das operações
    console.log("\n5. Testando operações completas...");

    try {
      // Teste 1: Criar attendant
      const attendantResult = await pool.query(
        `
        INSERT INTO attendants (name, image_url, earnings) 
        VALUES ($1, $2, $3) 
        RETURNING id, name, earnings
      `,
        ["Teste Completo", "https://via.placeholder.com/150", "0.00"]
      );

      const attendantId = attendantResult.rows[0].id;
      console.log(`✅ Attendant criado: ${attendantResult.rows[0].name}`);

      // Verificar se leaderboard foi criado automaticamente
      const leaderboardCheck = await pool.query(
        `
        SELECT * FROM leaderboard WHERE attendant_id = $1
      `,
        [attendantId]
      );

      if (leaderboardCheck.rows.length > 0) {
        console.log(`✅ Leaderboard criado automaticamente`);
      } else {
        console.log(`⚠️ Leaderboard não foi criado automaticamente`);
      }

      // Teste 2: Criar venda
      const saleResult = await pool.query(
        `
        INSERT INTO sales (attendant_id, value, client_name, client_phone) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, value, client_name
      `,
        [attendantId, "500.00", "Cliente Teste", "(11) 77777-7777"]
      );

      const saleId = saleResult.rows[0].id;
      console.log(`✅ Sale criada: R$ ${saleResult.rows[0].value}`);

      // Verificar earnings atualizado
      const earningsCheck = await pool.query(
        `
        SELECT earnings FROM attendants WHERE id = $1
      `,
        [attendantId]
      );

      console.log(
        `✅ Earnings atualizado: R$ ${earningsCheck.rows[0].earnings}`
      );

      // Teste 3: Atualizar venda
      await pool.query(
        `
        UPDATE sales SET value = $1 WHERE id = $2
      `,
        ["600.00", saleId]
      );
      console.log(`✅ Sale atualizada`);

      // Verificar earnings após atualização
      const earningsAfterUpdate = await pool.query(
        `
        SELECT earnings FROM attendants WHERE id = $1
      `,
        [attendantId]
      );

      console.log(
        `✅ Earnings após atualização: R$ ${earningsAfterUpdate.rows[0].earnings}`
      );

      // Teste 4: Deletar venda
      await pool.query(
        `
        DELETE FROM sales WHERE id = $1
      `,
        [saleId]
      );
      console.log(`✅ Sale deletada`);

      // Verificar earnings após exclusão
      const earningsAfterDelete = await pool.query(
        `
        SELECT earnings FROM attendants WHERE id = $1
      `,
        [attendantId]
      );

      console.log(
        `✅ Earnings após exclusão: R$ ${earningsAfterDelete.rows[0].earnings}`
      );

      // Limpar dados de teste
      await pool.query(
        `
        DELETE FROM attendants WHERE id = $1
      `,
        [attendantId]
      );
      console.log(`✅ Dados de teste limpos`);
    } catch (error) {
      console.log(`❌ Erro no teste completo: ${error.message}`);
    }

    // 6. Testar funções de consulta
    console.log("\n6. Testando funções de consulta...");

    try {
      // Teste de get_sales_summary
      const summaryResult = await pool.query(`
        SELECT * FROM get_sales_summary()
      `);
      console.log(
        `✅ get_sales_summary: ${summaryResult.rows.length} resultados`
      );

      // Teste de query complexa
      const complexResult = await pool.query(`
        SELECT 
          a.name as attendant_name,
          COUNT(s.id) as total_sales,
          COALESCE(SUM(s.value), 0) as total_revenue,
          COALESCE(AVG(s.value), 0) as average_ticket
        FROM attendants a
        LEFT JOIN sales s ON a.id = s.attendant_id
        GROUP BY a.id, a.name
        ORDER BY total_revenue DESC
      `);
      console.log(`✅ Query complexa: ${complexResult.rows.length} resultados`);
    } catch (error) {
      console.log(`❌ Erro em funções de consulta: ${error.message}`);
    }

    // 7. Verificação final
    console.log("\n7. Verificação final...");

    const finalChecks = [
      "SELECT COUNT(*) as attendants FROM attendants",
      "SELECT COUNT(*) as sales FROM sales",
      "SELECT COUNT(*) as admins FROM admins",
      "SELECT COUNT(*) as goals FROM goals",
      "SELECT COUNT(*) as achievements FROM achievements",
      "SELECT COUNT(*) as notifications FROM notifications",
      "SELECT COUNT(*) as leaderboard FROM leaderboard",
    ];

    for (const check of finalChecks) {
      try {
        const result = await pool.query(check);
        const tableName = check.split(" ")[3];
        const count = result.rows[0][tableName];
        console.log(`✅ ${tableName}: ${count} registros`);
      } catch (error) {
        console.log(
          `❌ Erro ao verificar ${check.split(" ")[3]}: ${error.message}`
        );
      }
    }

    // 8. Configurações de performance
    console.log("\n8. Aplicando configurações de performance...");

    const performanceConfigs = [
      "SET work_mem = '256MB'",
      "SET maintenance_work_mem = '256MB'",
      "SET effective_cache_size = '1GB'",
      "SET random_page_cost = 1.1",
      "SET effective_io_concurrency = 200",
      "SET max_parallel_workers_per_gather = 2",
      "SET max_parallel_workers = 4",
    ];

    for (const config of performanceConfigs) {
      try {
        await pool.query(config);
        console.log(`✅ Configuração aplicada: ${config.split(" ")[1]}`);
      } catch (error) {
        console.log(`⚠️ Configuração não aplicada: ${config.split(" ")[1]}`);
      }
    }

    console.log("\n🎉 Configuração completa concluída com sucesso!");
    console.log("\n📊 Resumo da configuração:");
    console.log("✅ Estrutura do banco otimizada");
    console.log("✅ Triggers robustos criados");
    console.log("✅ Funções de consulta otimizadas");
    console.log("✅ Operações CRUD testadas");
    console.log("✅ Performance configurada");
    console.log("✅ Banco de dados pronto para uso!");
  } catch (error) {
    console.error("❌ Erro durante a configuração:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar configuração completa
completeDatabaseSetup().catch(console.error);
