"use client";

import { useState, useEffect } from "react";
import { Activity, AlertCircle, CheckCircle, Clock, Database, Gamepad2, RefreshCw, TrendingUp, XCircle } from "lucide-react";
import { gameHealthChecker, type SystemHealthReport } from "@/lib/game-health-checker";
import { monitoring } from "@/lib/monitoring";

interface SystemHealthDashboardProps {
  userId?: string;
}

export function SystemHealthDashboard({ userId }: SystemHealthDashboardProps) {
  const [healthReport, setHealthReport] = useState<SystemHealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    runHealthCheck();
  }, [userId]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        runHealthCheck();
      }, 30000); // Atualizar a cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [autoRefresh, userId]);

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const report = await gameHealthChecker.runFullHealthCheck(userId);
      setHealthReport(report);
      setLastUpdate(Date.now());
    } catch (error) {
      monitoring.logError('Erro ao executar health check', { error });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
    }
  };

  const getStatusText = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'Saudável';
      case 'warning':
        return 'Atenção';
      case 'error':
        return 'Erro';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR');
  };

  if (!healthReport && !isLoading) {
    return (
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">Nenhum relatório de saúde disponível</p>
          <button
            onClick={runHealthCheck}
            className="px-4 py-2 bg-[#00FF00] text-[#0D0D0D] rounded-xl font-bold hover:bg-[#00FF00]/90 transition-all"
          >
            Executar Health Check
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-[#00FF00]" />
          <h2 className="text-2xl font-bold">Monitoramento do Sistema</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#00FF00] focus:ring-[#00FF00]"
            />
            Auto-atualizar (30s)
          </label>
          
          <button
            onClick={runHealthCheck}
            disabled={isLoading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Overall Status */}
      {healthReport && (
        <div className={`rounded-2xl p-6 border ${getStatusColor(healthReport.overall)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(healthReport.overall)}
              <div>
                <h3 className="text-xl font-bold">Status Geral: {getStatusText(healthReport.overall)}</h3>
                <p className="text-sm text-gray-400">
                  Última verificação: {formatTimestamp(lastUpdate)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-[#00FF00]">
                {healthReport.games.filter(g => g.status === 'healthy').length}/{healthReport.games.length}
              </div>
              <p className="text-xs text-gray-400">Jogos saudáveis</p>
            </div>
          </div>
        </div>
      )}

      {/* Database Status */}
      {healthReport && (
        <div className={`rounded-2xl p-6 border ${healthReport.database.connected ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className={`w-5 h-5 ${healthReport.database.connected ? 'text-green-400' : 'text-red-400'}`} />
              <div>
                <h3 className="font-bold">Banco de Dados</h3>
                <p className="text-sm text-gray-400">
                  {healthReport.database.connected ? 'Conectado' : 'Desconectado'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{healthReport.database.responseTime.toFixed(0)}ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Games Status */}
      {healthReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthReport.games.map((game) => (
            <div
              key={game.gameId}
              className={`rounded-xl p-4 border ${getStatusColor(game.status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-[#00FF00]" />
                  <h4 className="font-bold text-sm">{game.gameName}</h4>
                </div>
                {getStatusIcon(game.status)}
              </div>

              <div className="space-y-2">
                {game.checks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{check.name}</span>
                    {check.passed ? (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                ))}
              </div>

              {game.checks.some(c => !c.passed) && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-red-400">
                    {game.checks.find(c => !c.passed)?.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* System Summary */}
      {healthReport && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#00FF00]" />
            <h3 className="font-bold">Resumo do Sistema</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Total de Jogos</p>
              <p className="text-2xl font-bold">{healthReport.games.length}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 mb-1">Saudáveis</p>
              <p className="text-2xl font-bold text-green-400">
                {healthReport.games.filter(g => g.status === 'healthy').length}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 mb-1">Avisos</p>
              <p className="text-2xl font-bold text-yellow-400">
                {healthReport.games.filter(g => g.status === 'warning').length}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 mb-1">Erros</p>
              <p className="text-2xl font-bold text-red-400">
                {healthReport.games.filter(g => g.status === 'error').length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !healthReport && (
        <div className="bg-white/5 rounded-2xl p-12 border border-white/10">
          <div className="flex flex-col items-center justify-center gap-4">
            <RefreshCw className="w-8 h-8 animate-spin text-[#00FF00]" />
            <p className="text-gray-400">Executando health check...</p>
          </div>
        </div>
      )}
    </div>
  );
}
