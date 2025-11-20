/**
 * Sistema de Monitoramento e Logging
 * Rastreia erros, eventos e performance da aplicação
 */

export interface LogEvent {
  type: 'error' | 'warning' | 'info' | 'success' | 'game' | 'auth' | 'payment';
  message: string;
  details?: any;
  timestamp: number;
  userId?: string;
  gameId?: string;
  sessionId: string;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private logs: LogEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private sessionId: string;
  private maxLogs = 1000; // Máximo de logs em memória
  private maxMetrics = 500; // Máximo de métricas em memória

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeErrorHandlers();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeErrorHandlers() {
    // Capturar erros não tratados
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.logError('Erro não tratado', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack,
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.logError('Promise rejeitada não tratada', {
          reason: event.reason,
        });
      });
    }
  }

  /**
   * Registrar um log de evento
   */
  log(event: Omit<LogEvent, 'timestamp' | 'sessionId'>) {
    const logEvent: LogEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.logs.push(logEvent);

    // Limitar tamanho do array
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const emoji = this.getEmojiForType(event.type);
      console.log(`${emoji} [${event.type.toUpperCase()}]`, event.message, event.details || '');
    }

    // Enviar para serviço externo se configurado
    this.sendToExternalService(logEvent);
  }

  /**
   * Registrar erro
   */
  logError(message: string, details?: any, userId?: string) {
    this.log({
      type: 'error',
      message,
      details,
      userId,
    });
  }

  /**
   * Registrar aviso
   */
  logWarning(message: string, details?: any, userId?: string) {
    this.log({
      type: 'warning',
      message,
      details,
      userId,
    });
  }

  /**
   * Registrar informação
   */
  logInfo(message: string, details?: any, userId?: string) {
    this.log({
      type: 'info',
      message,
      details,
      userId,
    });
  }

  /**
   * Registrar sucesso
   */
  logSuccess(message: string, details?: any, userId?: string) {
    this.log({
      type: 'success',
      message,
      details,
      userId,
    });
  }

  /**
   * Registrar evento de jogo
   */
  logGameEvent(gameId: string, message: string, details?: any, userId?: string) {
    this.log({
      type: 'game',
      message,
      details,
      userId,
      gameId,
    });
  }

  /**
   * Registrar evento de autenticação
   */
  logAuthEvent(message: string, details?: any, userId?: string) {
    this.log({
      type: 'auth',
      message,
      details,
      userId,
    });
  }

  /**
   * Registrar evento de pagamento
   */
  logPaymentEvent(message: string, details?: any, userId?: string) {
    this.log({
      type: 'payment',
      message,
      details,
      userId,
    });
  }

  /**
   * Registrar métrica de performance
   */
  logPerformance(name: string, duration: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);

    // Limitar tamanho do array
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ [PERFORMANCE] ${name}: ${duration}ms`, metadata || '');
    }
  }

  /**
   * Medir tempo de execução de uma função
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.logPerformance(name, duration, metadata);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.logPerformance(name, duration, { ...metadata, error: true });
      throw error;
    }
  }

  /**
   * Obter todos os logs
   */
  getLogs(filter?: { type?: LogEvent['type']; userId?: string; gameId?: string }): LogEvent[] {
    let filtered = this.logs;

    if (filter?.type) {
      filtered = filtered.filter(log => log.type === filter.type);
    }

    if (filter?.userId) {
      filtered = filtered.filter(log => log.userId === filter.userId);
    }

    if (filter?.gameId) {
      filtered = filtered.filter(log => log.gameId === filter.gameId);
    }

    return filtered;
  }

  /**
   * Obter métricas de performance
   */
  getMetrics(filter?: { name?: string }): PerformanceMetric[] {
    if (filter?.name) {
      return this.metrics.filter(metric => metric.name === filter.name);
    }
    return this.metrics;
  }

  /**
   * Obter estatísticas de performance
   */
  getPerformanceStats(name: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    total: number;
  } | null {
    const metrics = this.getMetrics({ name });
    
    if (metrics.length === 0) return null;

    const durations = metrics.map(m => m.duration);
    const total = durations.reduce((sum, d) => sum + d, 0);

    return {
      count: metrics.length,
      avg: total / metrics.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      total,
    };
  }

  /**
   * Limpar logs antigos
   */
  clearOldLogs(olderThanMs: number = 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - olderThanMs;
    this.logs = this.logs.filter(log => log.timestamp > cutoff);
    this.metrics = this.metrics.filter(metric => metric.timestamp > cutoff);
  }

  /**
   * Exportar logs para JSON
   */
  exportLogs(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      logs: this.logs,
      metrics: this.metrics,
      exportedAt: Date.now(),
    }, null, 2);
  }

  /**
   * Obter resumo do sistema
   */
  getSystemSummary() {
    const errorCount = this.logs.filter(log => log.type === 'error').length;
    const warningCount = this.logs.filter(log => log.type === 'warning').length;
    const gameEventCount = this.logs.filter(log => log.type === 'game').length;

    return {
      sessionId: this.sessionId,
      totalLogs: this.logs.length,
      totalMetrics: this.metrics.length,
      errorCount,
      warningCount,
      gameEventCount,
      health: errorCount === 0 ? 'healthy' : errorCount < 10 ? 'warning' : 'critical',
    };
  }

  private getEmojiForType(type: LogEvent['type']): string {
    const emojis = {
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅',
      game: '🎮',
      auth: '🔐',
      payment: '💳',
    };
    return emojis[type] || '📝';
  }

  private async sendToExternalService(event: LogEvent) {
    // Aqui você pode integrar com serviços como:
    // - Sentry
    // - LogRocket
    // - DataDog
    // - Custom API endpoint
    
    // Exemplo básico (descomente para usar):
    /*
    if (event.type === 'error' && process.env.NEXT_PUBLIC_ERROR_REPORTING_URL) {
      try {
        await fetch(process.env.NEXT_PUBLIC_ERROR_REPORTING_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
      } catch (error) {
        console.error('Falha ao enviar log para serviço externo:', error);
      }
    }
    */
  }
}

// Instância singleton
export const monitoring = new MonitoringService();

// Hook React para usar o monitoring
export function useMonitoring() {
  return monitoring;
}

// Decorator para medir performance de funções
export function measurePerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return monitoring.measureAsync(name, () => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}
