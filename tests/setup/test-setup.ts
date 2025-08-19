/**
 * Configuração de Testes
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo configura o ambiente de testes
 * com todas as dependências e configurações necessárias.
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { config } from 'dotenv';
import path from 'path';

// ========================================
// CONFIGURAÇÃO DE AMBIENTE
// ========================================

// Carrega variáveis de ambiente de teste
config({ path: path.resolve(process.cwd(), '.env.test') });

// Configurações específicas para testes
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/sistema_vendas_test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.LOG_LEVEL = 'error'; // Apenas erros em testes

// ========================================
// MOCKS GLOBAIS
// ========================================

// Mock do sistema de arquivos para testes
vi.mock('fs', () => ({
  default: {
    ...vi.importActual('fs'),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(() => false),
    mkdirSync: vi.fn(),
  },
}));

// Mock do logger para não poluir os testes
vi.mock('../shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    performance: vi.fn(),
    access: vi.fn(),
    security: vi.fn(),
    database: vi.fn(),
  },
  createContextLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  })),
  createUserLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  })),
}));

// ========================================
// UTILITÁRIOS DE TESTE
// ========================================

/**
 * Gera dados de teste válidos
 */
export const testData = {
  users: {
    admin: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Administrador Teste',
      email: 'admin@test.com',
      password: 'Admin123!',
      permissionLevel: 'admin' as const,
      status: 'active' as const,
    },
    attendant: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Atendente Teste',
      email: 'atendente@test.com',
      password: 'Atendente123!',
      permissionLevel: 'attendant' as const,
      status: 'active' as const,
    },
  },
  clients: {
    individual: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Cliente Pessoa Física',
      type: 'individual' as const,
      email: 'cliente@test.com',
      phone: '11999999999',
      cpf: '12345678901',
    },
    company: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Empresa Teste LTDA',
      type: 'company' as const,
      email: 'empresa@test.com',
      phone: '11888888888',
      cnpj: '12345678000199',
    },
  },
  sales: {
    basic: {
      id: '550e8400-e29b-41d4-a716-446655440004',
      amount: 100.00,
      status: 'completed' as const,
      paymentType: 'cash' as const,
      attendantId: '550e8400-e29b-41d4-a716-446655440001',
      clientId: '550e8400-e29b-41d4-a716-446655440002',
    },
  },
  goals: {
    daily: {
      id: '550e8400-e29b-41d4-a716-446655440005',
      title: 'Meta Diária Teste',
      type: 'daily' as const,
      target: 1000.00,
      current: 500.00,
      status: 'in_progress' as const,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

/**
 * Gera dados aleatórios para testes
 */
export function generateRandomData<T extends Record<string, any>>(
  template: T,
  overrides: Partial<T> = {}
): T {
  const randomId = () => `test-${Math.random().toString(36).substr(2, 9)}`;
  const randomEmail = () => `test-${Math.random().toString(36).substr(2, 9)}@test.com`;
  const randomName = () => `Teste ${Math.random().toString(36).substr(2, 9)}`;

  const defaults: Partial<T> = {
    id: randomId(),
    email: randomEmail(),
    name: randomName(),
    ...overrides,
  };

  return { ...template, ...defaults };
}

/**
 * Limpa dados de teste
 */
export function cleanupTestData(): void {
  // Implementar limpeza de dados de teste
  // Esta função deve ser chamada após cada teste
}

/**
 * Aguarda um tempo específico (útil para testes assíncronos)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Verifica se um objeto tem as propriedades esperadas
 */
export function expectObjectShape<T>(obj: any, expectedShape: T): void {
  Object.keys(expectedShape).forEach(key => {
    expect(obj).toHaveProperty(key);
  });
}

/**
 * Verifica se uma resposta da API tem o formato correto
 */
export function expectApiResponse(response: any): void {
  expect(response).toHaveProperty('success');
  expect(response).toHaveProperty('timestamp');
  expect(response).toHaveProperty('path');
  
  if (response.success) {
    expect(response).toHaveProperty('data');
  } else {
    expect(response).toHaveProperty('error');
    expect(response).toHaveProperty('message');
  }
}

// ========================================
// CONFIGURAÇÃO DE TESTES
// ========================================

/**
 * Configuração global antes de todos os testes
 */
beforeAll(async () => {
  // Configurações globais que devem ser executadas uma vez
  console.log('🚀 Iniciando configuração de testes...');
  
  // Aqui você pode configurar:
  // - Banco de dados de teste
  // - Servidor de teste
  // - Mocks globais
  // - etc.
});

/**
 * Configuração antes de cada teste
 */
beforeEach(async () => {
  // Configurações que devem ser executadas antes de cada teste
  // - Limpar banco de dados
  // - Resetar mocks
  // - Preparar dados de teste
});

/**
 * Limpeza após cada teste
 */
afterEach(async () => {
  // Limpeza após cada teste
  cleanupTestData();
  
  // Resetar todos os mocks
  vi.clearAllMocks();
});

/**
 * Limpeza global após todos os testes
 */
afterAll(async () => {
  // Limpeza global
  console.log('🧹 Finalizando testes...');
  
  // Aqui você pode:
  // - Fechar conexões de banco
  // - Parar servidores de teste
  // - Limpar arquivos temporários
  // - etc.
});

// ========================================
// CONFIGURAÇÕES ESPECÍFICAS
// ========================================

/**
 * Configuração para testes de integração
 */
export const integrationTestConfig = {
  database: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/sistema_vendas_test',
    resetOnEachTest: true,
  },
  server: {
    port: 0, // Porta aleatória para evitar conflitos
    host: 'localhost',
  },
  timeout: {
    short: 1000, // 1 segundo
    medium: 5000, // 5 segundos
    long: 10000, // 10 segundos
  },
};

/**
 * Configuração para testes unitários
 */
export const unitTestConfig = {
  timeout: 1000,
  retries: 1,
  coverage: {
    enabled: true,
    threshold: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

// ========================================
// HELPERS DE ASSERTION
// ========================================

/**
 * Verifica se uma função lança um erro específico
 */
export async function expectThrowsAsync(
  method: () => Promise<any>,
  errorType?: any,
  errorMessage?: string
): Promise<void> {
  try {
    await method();
    throw new Error('Expected method to throw an error');
  } catch (error) {
    if (errorType) {
      expect(error).toBeInstanceOf(errorType);
    }
    if (errorMessage) {
      expect(error.message).toContain(errorMessage);
    }
  }
}

/**
 * Verifica se uma função não lança erro
 */
export async function expectNoThrowsAsync(
  method: () => Promise<any>
): Promise<void> {
  try {
    await method();
  } catch (error) {
    throw new Error(`Expected method to not throw, but it threw: ${error}`);
  }
}

// ========================================
// EXPORTAÇÕES
// ========================================

export {
  testData,
  generateRandomData,
  cleanupTestData,
  wait,
  expectObjectShape,
  expectApiResponse,
  integrationTestConfig,
  unitTestConfig,
  expectThrowsAsync,
  expectNoThrowsAsync,
};
