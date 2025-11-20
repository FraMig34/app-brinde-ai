"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/custom/navigation";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { SystemHealthDashboard } from "@/components/custom/system-health-dashboard";
import { monitoring } from "@/lib/monitoring";
import { Activity, Download, Trash2, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function MonitoringPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [systemSummary, setSystemSummary] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadLogs();
      loadSystemSummary();
      
      // Atualizar logs a cada 5 segundos
      const interval = setInterval(() => {
        loadLogs();
        loadSystemSummary();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user, filterType]);

  const loadLogs = () => {
    const filter = filterType === 'all' ? undefined : { type: filterType as any };
    const allLogs = monitoring.getLogs(filter);
    setLogs(allLogs.slice(-50).reverse()); // Últimos 50 logs
  };

  const loadSystemSummary = () => {
    const summary = monitoring.getSystemSummary();
    setSystemSummary(summary);
  };

  const handleExportLogs = () => {
    const json = monitoring.exportLogs();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brinde-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (confirm('Tem certeza que deseja limpar todos os logs?')) {
      monitoring.clearOldLogs(0);
      loadLogs();
      loadSystemSummary();
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00FF00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />

      <section className="relative px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-8 h-8 text-[#00FF00]" />
              <h1 className="text-4xl font-bold">Monitoramento do Sistema</h1>
            </div>
            <p className="text-gray-400">
              Acompanhe a saúde e performance de todos os jogos em tempo real
            </p>
          </div>

          {/* System Summary Cards */}
          {systemSummary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Total de Logs</p>
                <p className="text-2xl font-bold">{systemSummary.totalLogs}</p>
              </div>
              
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                <p className="text-xs text-gray-400 mb-1">Erros</p>
                <p className="text-2xl font-bold text-red-400">{systemSummary.errorCount}</p>
              </div>
              
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                <p className="text-xs text-gray-400 mb-1">Avisos</p>
                <p className="text-2xl font-bold text-yellow-400">{systemSummary.warningCount}</p>
              </div>
              
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <p className="text-2xl font-bold text-green-400 capitalize">{systemSummary.health}</p>
              </div>
            </div>
          )}

          {/* Health Dashboard */}
          <div className="mb-8">
            <SystemHealthDashboard userId={user.id} />
          </div>

          {/* Logs Section */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Logs do Sistema</h2>
              
              <div className="flex items-center gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#00FF00]/50"
                >
                  <option value="all">Todos</option>
                  <option value="error">Erros</option>
                  <option value="warning">Avisos</option>
                  <option value="success">Sucessos</option>
                  <option value="info">Informações</option>
                  <option value="game">Jogos</option>
                  <option value="auth">Autenticação</option>
                </select>

                <button
                  onClick={handleExportLogs}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </button>

                {isAdmin && (
                  <button
                    onClick={handleClearLogs}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl font-medium transition-colors flex items-center gap-2 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum log encontrado</p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border ${getLogColor(log.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getLogIcon(log.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-500">
                            {formatTimestamp(log.timestamp)}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-white/10 rounded uppercase font-bold">
                            {log.type}
                          </span>
                          {log.gameId && (
                            <span className="text-xs px-2 py-0.5 bg-[#00FF00]/20 text-[#00FF00] rounded">
                              {log.gameId}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm font-medium mb-1">{log.message}</p>
                        
                        {log.details && (
                          <details className="text-xs text-gray-400 mt-2">
                            <summary className="cursor-pointer hover:text-gray-300">
                              Ver detalhes
                            </summary>
                            <pre className="mt-2 p-2 bg-black/30 rounded overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
