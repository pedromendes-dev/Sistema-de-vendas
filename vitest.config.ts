import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

/**
 * Configuração do Vitest
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo configura o ambiente de testes
 * usando Vitest para execução rápida e eficiente.
 */

export default defineConfig({
  // Configuração de testes
  test: {
    // Ambiente de teste
    environment: 'node',
    
    // Configurações globais
    globals: true,
    
    // Setup dos testes
    setupFiles: ['./tests/setup/test-setup.ts'],
    
    // Configurações de cobertura
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.*',
        '**/*.spec.*',
        'server-entry.js',
        'vite.config.ts',
        'tailwind.config.ts',
        'postcss.config.js',
        'components.json',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    
    // Configurações de timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Configurações de retry
    retry: 1,
    
    // Configurações de pool
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    
    // Configurações de isolamento
    isolate: true,
    
    // Configurações de threads
    threads: false,
    
    // Configurações de watch
    watch: false,
    
    // Configurações de UI (opcional)
    ui: false,
    
    // Configurações de relatórios
    reporters: ['verbose'],
    
    // Configurações de output
    outputFile: {
      json: './coverage/test-results.json',
      junit: './coverage/junit.xml',
    },
    
    // Configurações de ambiente
    env: {
      NODE_ENV: 'test',
      TESTING: 'true',
    },
    
    // Configurações de include/exclude
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '**/*.d.ts',
      '**/*.config.*',
    ],
  },
  
  // Configurações de resolução
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@shared': resolve(__dirname, './shared'),
      '@server': resolve(__dirname, './server'),
      '@tests': resolve(__dirname, './tests'),
      '@utils': resolve(__dirname, './utils'),
    },
  },
  
  // Configurações de plugins
  plugins: [],
  
  // Configurações de build
  build: {
    target: 'node18',
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'SistemaVendas',
      fileName: 'sistema-vendas',
    },
    rollupOptions: {
      external: [
        'express',
        'pg',
        'bcryptjs',
        'jsonwebtoken',
        'cors',
        'helmet',
        'compression',
        'express-rate-limit',
        'dotenv',
        'drizzle-orm',
        'drizzle-zod',
        'zod',
        'nanoid',
        'date-fns',
        'memoize',
        'memoizee',
        'ws',
      ],
    },
  },
  
  // Configurações de define
  define: {
    __TEST__: JSON.stringify(true),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },
  
  // Configurações de esbuild
  esbuild: {
    target: 'node18',
    format: 'esm',
    platform: 'node',
  },
  
  // Configurações de optimizeDeps
  optimizeDeps: {
    include: [
      'express',
      'pg',
      'bcryptjs',
      'jsonwebtoken',
      'cors',
      'helmet',
      'compression',
      'express-rate-limit',
      'dotenv',
      'drizzle-orm',
      'drizzle-zod',
      'zod',
      'nanoid',
      'date-fns',
      'memoize',
      'memoizee',
      'ws',
    ],
    exclude: [
      'vitest',
      '@vitest/ui',
      '@vitest/coverage-v8',
    ],
  },
  
  // Configurações de server
  server: {
    port: 5174, // Porta diferente do Vite principal
    host: 'localhost',
  },
  
  // Configurações de preview
  preview: {
    port: 4174,
    host: 'localhost',
  },
});
