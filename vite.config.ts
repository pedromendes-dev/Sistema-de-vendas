import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Configuração do Vite para o Sistema de Vendas
 * Desenvolvido por Pedro Mendes
 * 
 * Esta configuração otimiza o desenvolvimento e build da aplicação React,
 * incluindo aliases para importações mais limpas e configurações de segurança.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Plugin principal para React
  plugins: [react()],
  
  // Aliases para importações mais limpas e organizadas
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),        // Código fonte principal
      "@shared": path.resolve(__dirname, "shared"),         // Código compartilhado
      "@assets": path.resolve(__dirname, "assets"),         // Imagens e recursos
    },
  },
  
  // Define o diretório raiz como 'client' para melhor organização
  root: path.resolve(__dirname, "client"),
  
  // Configurações de build para produção
  build: {
    outDir: "dist",           // Diretório de saída
    emptyOutDir: true,        // Limpa o diretório antes do build
  },
  
  // Configurações de segurança do servidor de desenvolvimento
  server: {
    fs: {
      strict: true,           // Restringe acesso ao sistema de arquivos
      deny: ["**/.*"],        // Bloqueia acesso a arquivos ocultos
    },
  },
});
