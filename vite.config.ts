import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Configuração do Vite
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo configura o Vite para desenvolvimento
 * e build da aplicação React.
 */

export default defineConfig({
  // Plugins
  plugins: [
    react({
      // Configurações do React
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],

  // Configurações de resolução
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@shared': resolve(__dirname, './shared'),
      '@server': resolve(__dirname, './server'),
      '@tests': resolve(__dirname, './tests'),
      '@utils': resolve(__dirname, './utils'),
      '@components': resolve(__dirname, './client/src/components'),
      '@pages': resolve(__dirname, './client/src/pages'),
      '@hooks': resolve(__dirname, './client/src/hooks'),
      '@lib': resolve(__dirname, './client/src/lib'),
      '@ui': resolve(__dirname, './client/src/components/ui'),
      '@types': resolve(__dirname, './shared/types'),
      '@validation': resolve(__dirname, './shared/validation'),
      '@constants': resolve(__dirname, './shared/constants'),
      '@utils': resolve(__dirname, './shared/utils'),
    },
  },

  // Configurações do servidor de desenvolvimento
  server: {
    port: 5173,
    host: 'localhost',
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Configurações de preview
  preview: {
    port: 4173,
    host: 'localhost',
    open: true,
  },

  // Configurações de build
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'client/index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts'],
          utils: ['date-fns', 'zod'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  // Configurações de otimização
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'recharts',
      'date-fns',
      'zod',
      'lucide-react',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },

  // Configurações de CSS
  css: {
    postcss: './postcss.config.js',
    modules: {
      localsConvention: 'camelCase',
    },
  },

  // Configurações de assets
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico'],

  // Configurações de define
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    __TEST__: JSON.stringify(process.env.NODE_ENV === 'test'),
  },

  // Configurações de esbuild
  esbuild: {
    target: 'esnext',
    format: 'esm',
    platform: 'browser',
  },

  // Configurações de worker
  worker: {
    format: 'es',
    plugins: [],
  },

  // Configurações de test
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
