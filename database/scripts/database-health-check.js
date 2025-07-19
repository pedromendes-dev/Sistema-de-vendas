import { Pool } from "pg";
import { config } from "dotenv";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function healthCheck() {
  console.log("🔍 Iniciando verificação de saúde do banco de dados...\n");

  try {
    // 1. Verificar conexão
    console.log("1. Testando conexão...");
    const startTime = Date.now();
    await pool.query("SELECT NOW()");
    const connectionTime = Date.now() - startTime;
    console.log(`✅ Conexão OK (${connectionTime}ms)\n`);

    // 2. Verificar tabelas
    console.log("2. Verificando estrutura das tabelas...");
    const tables = [
      "attendants",
      "sales",
      "admins",
      "goals",
      "achievements",
      "leaderboard",
      "notifications",
    ];

    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ ${table}: ${result.rows[0].count} registros`);
      } catch (error) {
        console.log(`❌ ${table}: Erro - ${error.message}`);
      }
    }

    // 3. Verificar índices
    console.log("\n3. Verificando índices...");
    const indexResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);

    console.log(`✅ ${indexResult.rows.length} índices encontrados`);
    indexResult.rows.forEach((row) => {
      console.log(`   - ${row.tablename}.${row.indexname}`);
    });

    // 4. Verificar constraints
    console.log("\n4. Verificando constraints...");
    const constraintResult = await pool.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_type
    `);

    console.log(`✅ ${constraintResult.rows.length} constraints encontradas`);
    constraintResult.rows.forEach((row) => {
      console.log(
        `   - ${row.table_name}.${row.constraint_name} (${row.constraint_type})`
      );
    });

    // 5. Verificar performance
    console.log("\n5. Verificando performance...");

    // Verificar queries lentas
    const slowQueries = await pool.query(`
      SELECT 
        query,
        calls,
        total_time,
        mean_time,
        rows
      FROM pg_stat_statements 
      WHERE query LIKE '%SELECT%'
      ORDER BY mean_time DESC 
      LIMIT 5
    `);

    if (slowQueries.rows.length > 0) {
      console.log("⚠️ Queries mais lentas:");
      slowQueries.rows.forEach((row, index) => {
        console.log(
          `   ${index + 1}. ${row.query.substring(
            0,
            50
          )}... (${row.mean_time.toFixed(2)}ms)`
        );
      });
    } else {
      console.log("✅ Nenhuma query lenta detectada");
    }

    // 6. Verificar locks
    console.log("\n6. Verificando locks ativos...");
    const locks = await pool.query(`
      SELECT 
        l.pid,
        l.mode,
        l.granted,
        t.query
      FROM pg_locks l
      JOIN pg_stat_activity t ON l.pid = t.pid
      WHERE l.locktype = 'relation'
      AND l.database = (SELECT oid FROM pg_database WHERE datname = current_database())
    `);

    if (locks.rows.length > 0) {
      console.log(`⚠️ ${locks.rows.length} locks ativos encontrados`);
      locks.rows.forEach((row) => {
        console.log(
          `   - PID: ${row.pid}, Mode: ${row.mode}, Granted: ${row.granted}`
        );
      });
    } else {
      console.log("✅ Nenhum lock ativo");
    }

    // 7. Verificar conexões
    console.log("\n7. Verificando conexões ativas...");
    const connections = await pool.query(`
      SELECT 
        state,
        COUNT(*) as count
      FROM pg_stat_activity 
      WHERE datname = current_database()
      GROUP BY state
    `);

    connections.rows.forEach((row) => {
      console.log(`   - ${row.state}: ${row.count} conexões`);
    });

    // 8. Verificar tamanho das tabelas
    console.log("\n8. Verificando tamanho das tabelas...");
    const tableSizes = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    `);

    tableSizes.rows.forEach((row) => {
      console.log(`   - ${row.tablename}: ${row.size}`);
    });

    // 9. Verificar fragmentação
    console.log("\n9. Verificando fragmentação...");
    const fragmentation = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples
      FROM pg_stat_user_tables 
      ORDER BY n_dead_tup DESC
    `);

    fragmentation.rows.forEach((row) => {
      const deadRatio =
        row.dead_tuples > 0
          ? (
              (row.dead_tuples / (row.live_tuples + row.dead_tuples)) *
              100
            ).toFixed(2)
          : 0;
      console.log(`   - ${row.tablename}: ${deadRatio}% fragmentação`);
    });

    // 10. Recomendações
    console.log("\n10. Recomendações de otimização:");

    const recommendations = [];

    // Verificar se precisa de VACUUM
    const needsVacuum = fragmentation.rows.some(
      (row) => row.dead_tuples > row.live_tuples * 0.1
    );
    if (needsVacuum) {
      recommendations.push("🔄 Executar VACUUM para limpar fragmentação");
    }

    // Verificar se precisa de ANALYZE
    const needsAnalyze = await pool.query(`
      SELECT COUNT(*) as count 
      FROM pg_stat_user_tables 
      WHERE last_analyze IS NULL OR last_analyze < NOW() - INTERVAL '1 day'
    `);
    if (needsAnalyze.rows[0].count > 0) {
      recommendations.push("📊 Executar ANALYZE para atualizar estatísticas");
    }

    // Verificar configurações
    const settings = await pool.query(`
      SELECT name, setting, unit 
      FROM pg_settings 
      WHERE name IN ('work_mem', 'shared_buffers', 'effective_cache_size', 'maintenance_work_mem')
    `);

    settings.rows.forEach((row) => {
      console.log(`   - ${row.name}: ${row.setting}${row.unit || ""}`);
    });

    if (recommendations.length > 0) {
      console.log("\n⚠️ Recomendações:");
      recommendations.forEach((rec) => console.log(`   ${rec}`));
    } else {
      console.log("\n✅ Banco de dados está otimizado!");
    }

    console.log("\n🎉 Verificação de saúde concluída!");
  } catch (error) {
    console.error("❌ Erro durante a verificação:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar verificação
healthCheck().catch(console.error);
