/**
 * Sistema de Logging e Monitoramento de Segurança
 * 
 * Registra eventos importantes para auditoria e detecção de ameaças
 */

export enum SecurityEventType {
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT = 'INVALID_INPUT',
  CSRF_VIOLATION = 'CSRF_VIOLATION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  API_ERROR = 'API_ERROR',
}

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: Date;
  userId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  details?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Manter últimos 1000 eventos em memória

  /**
   * Registra evento de segurança
   */
  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
    };

    this.events.push(fullEvent);

    // Limitar tamanho do array
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Em produção, enviar para serviço de logging (Sentry, LogRocket, etc)
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(fullEvent);
    }

    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SECURITY] ${event.type}:`, fullEvent);
    }
  }

  /**
   * Obtém eventos recentes
   */
  getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Obtém eventos por tipo
   */
  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  /**
   * Obtém eventos por severidade
   */
  getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  /**
   * Detecta padrões suspeitos
   */
  detectSuspiciousPatterns(): {
    hasPattern: boolean;
    patterns: string[];
  } {
    const patterns: string[] = [];
    const recentEvents = this.getRecentEvents(50);

    // Múltiplas falhas de autenticação
    const authFailures = recentEvents.filter(
      e => e.type === SecurityEventType.AUTH_FAILURE
    );
    if (authFailures.length > 5) {
      patterns.push(`${authFailures.length} falhas de autenticação recentes`);
    }

    // Múltiplas violações de rate limit
    const rateLimitViolations = recentEvents.filter(
      e => e.type === SecurityEventType.RATE_LIMIT_EXCEEDED
    );
    if (rateLimitViolations.length > 3) {
      patterns.push(`${rateLimitViolations.length} violações de rate limit`);
    }

    // Múltiplas tentativas de CSRF
    const csrfViolations = recentEvents.filter(
      e => e.type === SecurityEventType.CSRF_VIOLATION
    );
    if (csrfViolations.length > 2) {
      patterns.push(`${csrfViolations.length} tentativas de CSRF detectadas`);
    }

    return {
      hasPattern: patterns.length > 0,
      patterns,
    };
  }

  /**
   * Limpa eventos antigos
   */
  clearOldEvents(olderThanHours: number = 24): void {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - olderThanHours);

    this.events = this.events.filter(
      event => event.timestamp > cutoffTime
    );
  }

  /**
   * Envia para serviço externo (implementar conforme necessidade)
   */
  private sendToExternalService(event: SecurityEvent): void {
    // Implementar integração com Sentry, LogRocket, etc
    // Exemplo:
    // if (event.severity === 'critical') {
    //   Sentry.captureException(new Error(`Security Event: ${event.type}`), {
    //     extra: event,
    //   });
    // }
  }

  /**
   * Gera relatório de segurança
   */
  generateSecurityReport(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    suspiciousPatterns: string[];
    recentCriticalEvents: SecurityEvent[];
  } {
    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};

    this.events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    });

    const { patterns } = this.detectSuspiciousPatterns();
    const criticalEvents = this.getEventsBySeverity('critical').slice(-10);

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      suspiciousPatterns: patterns,
      recentCriticalEvents: criticalEvents,
    };
  }
}

// Singleton instance
export const securityLogger = new SecurityLogger();

/**
 * Helper functions para logging rápido
 */
export const logAuthSuccess = (userId: string, ip?: string) => {
  securityLogger.log({
    type: SecurityEventType.AUTH_SUCCESS,
    userId,
    ip,
    severity: 'low',
  });
};

export const logAuthFailure = (ip?: string, details?: Record<string, unknown>) => {
  securityLogger.log({
    type: SecurityEventType.AUTH_FAILURE,
    ip,
    details,
    severity: 'medium',
  });
};

export const logRateLimitExceeded = (ip?: string, path?: string) => {
  securityLogger.log({
    type: SecurityEventType.RATE_LIMIT_EXCEEDED,
    ip,
    path,
    severity: 'medium',
  });
};

export const logInvalidInput = (
  path?: string,
  details?: Record<string, unknown>
) => {
  securityLogger.log({
    type: SecurityEventType.INVALID_INPUT,
    path,
    details,
    severity: 'low',
  });
};

export const logCsrfViolation = (ip?: string, path?: string) => {
  securityLogger.log({
    type: SecurityEventType.CSRF_VIOLATION,
    ip,
    path,
    severity: 'high',
  });
};

export const logSuspiciousActivity = (
  details: Record<string, unknown>,
  severity: SecurityEvent['severity'] = 'high'
) => {
  securityLogger.log({
    type: SecurityEventType.SUSPICIOUS_ACTIVITY,
    details,
    severity,
  });
};

export const logDataAccess = (
  userId: string,
  path?: string,
  details?: Record<string, unknown>
) => {
  securityLogger.log({
    type: SecurityEventType.DATA_ACCESS,
    userId,
    path,
    details,
    severity: 'low',
  });
};

export const logDataModification = (
  userId: string,
  path?: string,
  details?: Record<string, unknown>
) => {
  securityLogger.log({
    type: SecurityEventType.DATA_MODIFICATION,
    userId,
    path,
    details,
    severity: 'medium',
  });
};

export const logApiError = (
  path?: string,
  details?: Record<string, unknown>,
  severity: SecurityEvent['severity'] = 'medium'
) => {
  securityLogger.log({
    type: SecurityEventType.API_ERROR,
    path,
    details,
    severity,
  });
};
