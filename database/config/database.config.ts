import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../shared/schema';

/**
 * Configuração do Banco de Dados
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo gerencia todas as configurações de conexão
 * com o banco de dados PostgreSQL usando Drizzle ORM.
 */

// Configurações de conexão do banco
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sistema_vendas',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Pool de conexões para gerenciar múltiplas conexões
const pool = new Pool(dbConfig);

// Configuração do Drizzle ORM com o pool de conexões
export const db = drizzle(pool, { schema });

// Função para testar a conexão com o banco
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error);
    return false;
  }
}

// Função para fechar todas as conexões (útil para testes)
export async function closeDatabaseConnection(): Promise<void> {
  await pool.end();
}

// Função para obter estatísticas do pool de conexões
export function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
}

// Middleware para verificar saúde da conexão
export async function healthCheck(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  timestamp: string;
}> {
  try {
    const isConnected = await testDatabaseConnection();
    
    if (isConnected) {
      return {
        status: 'healthy',
        message: 'Conexão com banco de dados funcionando normalmente',
        timestamp: new Date().toISOString(),
      };
    } else {
      return {
        status: 'unhealthy',
        message: 'Falha na conexão com banco de dados',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Erro na verificação de saúde: ${error}`,
      timestamp: new Date().toISOString(),
    };
  }
}

// Exporta o pool para uso direto quando necessário
export { pool };
