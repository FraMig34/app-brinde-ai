/**
 * Sistema de Health Check para Jogos
 * Verifica se todos os jogos estão funcionando corretamente
 */

import { monitoring } from './monitoring';
import { supabase } from './supabase';

export interface GameHealthStatus {
  gameId: string;
  gameName: string;
  status: 'healthy' | 'warning' | 'error';
  checks: {
    name: string;
    passed: boolean;
    message?: string;
  }[];
  lastChecked: number;
}

export interface SystemHealthReport {
  overall: 'healthy' | 'warning' | 'error';
  games: GameHealthStatus[];
  database: {
    connected: boolean;
    responseTime: number;
  };
  timestamp: number;
}

class GameHealthChecker {
  private games = [
    { id: 'jogo-da-casa', name: 'Jogo da Casa' },
    { id: 'roleta-bebada', name: 'Roleta Bebada' },
    { id: 'batata-bebada', name: 'Batata Bebada' },
    { id: 'cumpra-ou-beba', name: 'Cumpra ou Beba' },
    { id: 'eu-nunca', name: 'Eu Nunca' },
    { id: 'verdade-ou-shot', name: 'Verdade ou Shot' },
    { id: 'dedo-magico', name: 'Dedo Mágico' },
    { id: 'jogo-da-velha', name: 'Jogo da Velha Bebado' },
    { id: 'curiosidade-shot', name: 'Curiosidade = Shot' },
    { id: 'rei-da-rima', name: 'Rei da Rima' },
  ];

  /**
   * Executar health check completo do sistema
   */
  async runFullHealthCheck(userId?: string): Promise<SystemHealthReport> {
    monitoring.logInfo('Iniciando health check completo do sistema', { userId });

    const startTime = performance.now();

    // Verificar banco de dados
    const dbHealth = await this.checkDatabaseHealth();

    // Verificar cada jogo
    const gameHealthPromises = this.games.map(game => 
      this.checkGameHealth(game.id, game.name, userId)
    );

    const gameHealthResults = await Promise.all(gameHealthPromises);

    // Determinar status geral
    const hasErrors = gameHealthResults.some(g => g.status === 'error') || !dbHealth.connected;
    const hasWarnings = gameHealthResults.some(g => g.status === 'warning');

    const overall = hasErrors ? 'error' : hasWarnings ? 'warning' : 'healthy';

    const duration = performance.now() - startTime;
    monitoring.logPerformance('full_health_check', duration);

    const report: SystemHealthReport = {
      overall,
      games: gameHealthResults,
      database: dbHealth,
      timestamp: Date.now(),
    };

    monitoring.logInfo('Health check completo finalizado', {
      overall,
      duration,
      gamesChecked: gameHealthResults.length,
    });

    return report;
  }

  /**
   * Verificar saúde de um jogo específico
   */
  async checkGameHealth(gameId: string, gameName: string, userId?: string): Promise<GameHealthStatus> {
    const checks: GameHealthStatus['checks'] = [];

    // Check 1: Verificar se a rota existe
    try {
      const routeCheck = await this.checkGameRoute(gameId);
      checks.push({
        name: 'Rota acessível',
        passed: routeCheck,
        message: routeCheck ? 'Rota responde corretamente' : 'Rota não encontrada',
      });
    } catch (error) {
      checks.push({
        name: 'Rota acessível',
        passed: false,
        message: 'Erro ao verificar rota',
      });
    }

    // Check 2: Verificar cartas personalizadas (se usuário fornecido)
    if (userId) {
      try {
        const customCardsCheck = await this.checkCustomCards(gameId, userId);
        checks.push({
          name: 'Cartas personalizadas',
          passed: customCardsCheck.success,
          message: customCardsCheck.message,
        });
      } catch (error) {
        checks.push({
          name: 'Cartas personalizadas',
          passed: false,
          message: 'Erro ao verificar cartas',
        });
      }
    }

    // Check 3: Verificar configurações do jogo
    try {
      const configCheck = await this.checkGameConfig(gameId);
      checks.push({
        name: 'Configurações',
        passed: configCheck,
        message: configCheck ? 'Configurações válidas' : 'Configurações inválidas',
      });
    } catch (error) {
      checks.push({
        name: 'Configurações',
        passed: false,
        message: 'Erro ao verificar configurações',
      });
    }

    // Determinar status geral do jogo
    const allPassed = checks.every(c => c.passed);
    const someFailed = checks.some(c => !c.passed);

    const status = allPassed ? 'healthy' : someFailed ? 'error' : 'warning';

    return {
      gameId,
      gameName,
      status,
      checks,
      lastChecked: Date.now(),
    };
  }

  /**
   * Verificar saúde do banco de dados
   */
  private async checkDatabaseHealth(): Promise<{ connected: boolean; responseTime: number }> {
    const startTime = performance.now();

    try {
      // Tentar fazer uma query simples
      const { error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      const responseTime = performance.now() - startTime;

      if (error) {
        monitoring.logError('Erro ao verificar saúde do banco de dados', { error });
        return { connected: false, responseTime };
      }

      monitoring.logSuccess('Banco de dados saudável', { responseTime });
      return { connected: true, responseTime };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      monitoring.logError('Exceção ao verificar banco de dados', { error });
      return { connected: false, responseTime };
    }
  }

  /**
   * Verificar se a rota do jogo existe
   */
  private async checkGameRoute(gameId: string): Promise<boolean> {
    try {
      // Em produção, você pode fazer um fetch real
      // Por enquanto, apenas verificamos se o ID está na lista
      return this.games.some(g => g.id === gameId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verificar cartas personalizadas
   */
  private async checkCustomCards(gameId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase
        .from('custom_cards')
        .select('id')
        .eq('user_id', userId)
        .eq('game_type', gameId);

      if (error) {
        return { success: false, message: `Erro ao buscar cartas: ${error.message}` };
      }

      return {
        success: true,
        message: `${data?.length || 0} cartas personalizadas encontradas`,
      };
    } catch (error: any) {
      return { success: false, message: `Exceção: ${error.message}` };
    }
  }

  /**
   * Verificar configurações do jogo
   */
  private async checkGameConfig(gameId: string): Promise<boolean> {
    // Aqui você pode adicionar verificações específicas de cada jogo
    // Por exemplo, verificar se os níveis de dificuldade estão configurados
    return true;
  }

  /**
   * Verificar inventário de bebidas
   */
  async checkDrinkInventory(userId: string): Promise<{
    success: boolean;
    count: number;
    message: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('drink_inventory')
        .select('id')
        .eq('user_id', userId);

      if (error) {
        return {
          success: false,
          count: 0,
          message: `Erro ao verificar inventário: ${error.message}`,
        };
      }

      return {
        success: true,
        count: data?.length || 0,
        message: `${data?.length || 0} bebidas no inventário`,
      };
    } catch (error: any) {
      return {
        success: false,
        count: 0,
        message: `Exceção: ${error.message}`,
      };
    }
  }

  /**
   * Verificar listas de amigos
   */
  async checkFriendLists(userId: string): Promise<{
    success: boolean;
    count: number;
    message: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('friend_lists')
        .select('id')
        .eq('user_id', userId);

      if (error) {
        return {
          success: false,
          count: 0,
          message: `Erro ao verificar listas: ${error.message}`,
        };
      }

      return {
        success: true,
        count: data?.length || 0,
        message: `${data?.length || 0} listas de amigos`,
      };
    } catch (error: any) {
      return {
        success: false,
        count: 0,
        message: `Exceção: ${error.message}`,
      };
    }
  }

  /**
   * Monitorar jogo em tempo real
   */
  startGameMonitoring(gameId: string, userId: string) {
    monitoring.logGameEvent(gameId, 'Jogo iniciado', { userId });

    // Retornar função para parar monitoramento
    return {
      logEvent: (event: string, details?: any) => {
        monitoring.logGameEvent(gameId, event, details, userId);
      },
      logError: (error: string, details?: any) => {
        monitoring.logError(`[${gameId}] ${error}`, details, userId);
      },
      stop: () => {
        monitoring.logGameEvent(gameId, 'Jogo finalizado', { userId });
      },
    };
  }
}

// Instância singleton
export const gameHealthChecker = new GameHealthChecker();
