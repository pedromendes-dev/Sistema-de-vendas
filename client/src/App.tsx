import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useRouteChange } from "@/hooks/useRouteChange";

// Páginas principais do sistema
import Home from "@/pages/home";
import Ranking from "@/pages/ranking";
import History from "@/pages/history";
import Attendants from "@/pages/attendants";
import Goals from "@/pages/goals";
import Admin from "@/pages/admin";
import Dashboard from "@/pages/dashboard";
import SoundTest from "@/pages/sound-test";
import Clients from "@/pages/clients";
import NotFound from "@/pages/not-found";

/**
 * Sistema de Vendas - Aplicação Principal
 * Desenvolvido por Pedro Mendes
 * 
 * Este componente gerencia toda a navegação e estrutura da aplicação,
 * incluindo roteamento, gerenciamento de estado e tratamento de erros.
 */

function Router() {
  // Hook personalizado para garantir refresh adequado entre rotas
  useRouteChange();
  
  return (
    <Switch>
      {/* Rota principal - Página inicial */}
      <Route path="/" component={Home} />
      
      {/* Dashboard - Visão geral do sistema */}
      <Route path="/dashboard" component={Dashboard} />
      
      {/* Ranking - Competição saudável entre atendentes */}
      <Route path="/ranking" component={Ranking} />
      
      {/* Histórico - Acompanhamento de vendas */}
      <Route path="/history" component={History} />
      
      {/* Atendentes - Gestão da equipe */}
      <Route path="/attendants" component={Attendants} />
      
      {/* Metas - Definição e acompanhamento de objetivos */}
      <Route path="/goals" component={Goals} />
      
      {/* Clientes - Base de dados de clientes */}
      <Route path="/clients" component={Clients} />
      
      {/* Admin - Configurações do sistema */}
      <Route path="/admin" component={Admin} />
      
      {/* Teste de som - Configuração de notificações */}
      <Route path="/sound-test" component={SoundTest} />
      
      {/* Página 404 - Rota não encontrada */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Sistema de notificações toast */}
        <Toaster />
        
        {/* Roteador principal da aplicação */}
        <Router />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
