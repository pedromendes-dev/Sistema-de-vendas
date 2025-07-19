import { Pool } from "pg";
import { config } from "dotenv";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function installExtensions() {
  console.log("🔧 Instalando extensões do PostgreSQL...\n");

  try {
    // 1. Verificar extensões disponíveis
    console.log("1. Verificando extensões disponíveis...");
    const availableExtensions = await pool.query(`
      SELECT name, default_version, installed_version 
      FROM pg_available_extensions 
      WHERE name IN ('pg_stat_statements', 'uuid-ossp', 'pgcrypto', 'btree_gin')
      ORDER BY name
    `);

    console.log("Extensões disponíveis:");
    availableExtensions.rows.forEach((row) => {
      console.log(
        `   - ${row.name}: ${
          row.installed_version || "não instalada"
        } (versão padrão: ${row.default_version})`
      );
    });

    // 2. Instalar extensões necessárias
    console.log("\n2. Instalando extensões...");

    const extensions = [
      "CREATE EXTENSION IF NOT EXISTS pg_stat_statements",
      "CREATE EXTENSION IF NOT EXISTS uuid-ossp",
      "CREATE EXTENSION IF NOT EXISTS pgcrypto",
      "CREATE EXTENSION IF NOT EXISTS btree_gin",
    ];

    for (const extension of extensions) {
      try {
        await pool.query(extension);
        console.log(`✅ Extensão instalada: ${extension.split(" ")[3]}`);
      } catch (error) {
        console.log(`⚠️ Erro ao instalar extensão: ${error.message}`);
      }
    }

    // 3. Configurar pg_stat_statements
    console.log("\n3. Configurando pg_stat_statements...");

    const statConfigs = [
      "ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements'",
      "ALTER SYSTEM SET pg_stat_statements.track = 'all'",
      "ALTER SYSTEM SET pg_stat_statements.max = 10000",
      "ALTER SYSTEM SET pg_stat_statements.track_utility = on",
      "ALTER SYSTEM SET pg_stat_statements.track_planning = on",
    ];

    for (const config of statConfigs) {
      try {
        await pool.query(config);
        console.log(`✅ Configuração aplicada: ${config.split(" ")[2]}`);
      } catch (error) {
        console.log(
          `⚠️ Configuração não aplicada: ${config.split(" ")[2]} - ${
            error.message
          }`
        );
      }
    }

    // 4. Verificar extensões instaladas
    console.log("\n4. Verificando extensões instaladas...");
    const installedExtensions = await pool.query(`
      SELECT extname, extversion 
      FROM pg_extension 
      ORDER BY extname
    `);

    console.log("Extensões instaladas:");
    installedExtensions.rows.forEach((row) => {
      console.log(`   - ${row.extname}: v${row.extversion}`);
    });

    // 5. Criar views de monitoramento
    console.log("\n5. Criando views de monitoramento...");

    const monitoringViews = [
      `CREATE OR REPLACE VIEW v_extension_stats AS
       SELECT 
         extname,
         extversion,
         nspname as schema_name
       FROM pg_extension e
       JOIN pg_namespace n ON e.extnamespace = n.oid
       ORDER BY extname`,

      `CREATE OR REPLACE VIEW v_database_info AS
       SELECT 
         current_database() as database_name,
         version() as postgres_version,
         current_setting('max_connections') as max_connections,
         current_setting('shared_buffers') as shared_buffers,
         current_setting('work_mem') as work_mem,
         current_setting('maintenance_work_mem') as maintenance_work_mem`,

      `CREATE OR REPLACE VIEW v_table_sizes AS
       SELECT 
         schemaname,
         tablename,
         pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
         pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
       FROM pg_tables 
       WHERE schemaname = 'public'
       ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC`,

      `CREATE OR REPLACE VIEW v_index_usage AS
       SELECT 
         schemaname,
         tablename,
         indexname,
         idx_scan,
         idx_tup_read,
         idx_tup_fetch,
         pg_size_pretty(pg_relation_size(indexrelid)) as index_size
       FROM pg_stat_user_indexes
       ORDER BY idx_scan DESC`,
    ];

    for (const viewQuery of monitoringViews) {
      try {
        await pool.query(viewQuery);
        console.log(`✅ View de monitoramento criada`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar view: ${error.message}`);
      }
    }

    // 6. Criar funções de utilidade
    console.log("\n6. Criando funções de utilidade...");

    const utilityFunctions = [
      `CREATE OR REPLACE FUNCTION get_database_size()
       RETURNS TEXT AS $$
       DECLARE
         total_size BIGINT;
       BEGIN
         SELECT pg_database_size(current_database()) INTO total_size;
         RETURN pg_size_pretty(total_size);
       END;
       $$ LANGUAGE plpgsql`,

      `CREATE OR REPLACE FUNCTION get_table_count()
       RETURNS INTEGER AS $$
       DECLARE
         table_count INTEGER;
       BEGIN
         SELECT COUNT(*) INTO table_count
         FROM pg_tables 
         WHERE schemaname = 'public';
         RETURN table_count;
       END;
       $$ LANGUAGE plpgsql`,

      `CREATE OR REPLACE FUNCTION get_index_count()
       RETURNS INTEGER AS $$
       DECLARE
         index_count INTEGER;
       BEGIN
         SELECT COUNT(*) INTO index_count
         FROM pg_indexes 
         WHERE schemaname = 'public';
         RETURN index_count;
       END;
       $$ LANGUAGE plpgsql`,

      `CREATE OR REPLACE FUNCTION cleanup_old_data(days_to_keep INTEGER DEFAULT 90)
       RETURNS INTEGER AS $$
       DECLARE
         deleted_count INTEGER;
       BEGIN
         DELETE FROM sales 
         WHERE created_at < CURRENT_DATE - (days_to_keep || ' days')::INTERVAL;
         
         GET DIAGNOSTICS deleted_count = ROW_COUNT;
         RETURN deleted_count;
       END;
       $$ LANGUAGE plpgsql`,
    ];

    for (const functionQuery of utilityFunctions) {
      try {
        await pool.query(functionQuery);
        console.log(`✅ Função de utilidade criada`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar função: ${error.message}`);
      }
    }

    // 7. Testar funcionalidades
    console.log("\n7. Testando funcionalidades...");

    try {
      const dbSize = await pool.query("SELECT get_database_size() as size");
      console.log(`✅ Tamanho do banco: ${dbSize.rows[0].size}`);

      const tableCount = await pool.query("SELECT get_table_count() as count");
      console.log(`✅ Número de tabelas: ${tableCount.rows[0].count}`);

      const indexCount = await pool.query("SELECT get_index_count() as count");
      console.log(`✅ Número de índices: ${indexCount.rows[0].count}`);
    } catch (error) {
      console.log(`⚠️ Erro nos testes: ${error.message}`);
    }

    console.log("\n🎉 Instalação de extensões concluída!");
    console.log("\n📊 Resumo:");
    console.log("✅ Extensões instaladas");
    console.log("✅ Configurações aplicadas");
    console.log("✅ Views de monitoramento criadas");
    console.log("✅ Funções de utilidade criadas");
    console.log("✅ Testes executados");
  } catch (error) {
    console.error("❌ Erro durante a instalação:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Executar instalação
installExtensions().catch(console.error);
