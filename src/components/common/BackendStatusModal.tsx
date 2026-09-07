import React, { useState, useEffect } from 'react';
import { apiClient, BackendHealth } from '../../services/apiClient';
import { Server, Database, CheckCircle2, AlertCircle, RefreshCw, Cpu, Code2, Globe, Shield } from 'lucide-react';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({ isOpen, onClose }) => {
  const [health, setHealth] = useState<BackendHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(() => apiClient.getCustomApiUrl() || apiClient.getApiBase());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    const h = await apiClient.checkHealth();
    setHealth(h);
    setLoading(false);
  };

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient.setCustomApiUrl(apiUrlInput.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    checkStatus();
  };

  const handleResetApiUrl = () => {
    apiClient.setCustomApiUrl('');
    setApiUrlInput(apiClient.getApiBase());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    checkStatus();
  };

  useEffect(() => {
    if (isOpen) {
      setApiUrlInput(apiClient.getCustomApiUrl() || apiClient.getApiBase());
      checkStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#081226]/95 border border-cyan-500/30 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Specular gloss glow */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-cyan-500/15 via-transparent to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                System & Database Architecture
              </h2>
              <p className="text-xs text-slate-400">
                Core Java REST API &bull; MySQL DBMS &bull; Modern Web UI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Live Status Cards */}
        <div className="my-5 space-y-3 relative z-10">
          {/* 1. Java Backend Status */}
          <div className="p-4 rounded-2xl bg-[#050c1a]/80 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${health?.online ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-white">Java REST API</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                    Port 8080
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {health?.online
                    ? `Running on JDK ${health.javaVersion || '25'} (FoundItServer.java)`
                    : 'Offline / Browser LocalStorage Active'}
                </p>
              </div>
            </div>
            <div>
              {health?.online ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Fallback Mode
                </span>
              )}
            </div>
          </div>

          {/* 2. MySQL Database Status */}
          <div className="p-4 rounded-2xl bg-[#050c1a]/80 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${health?.mysqlConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'}`}>
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-white">MySQL Database</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono">
                    foundit_db
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {health?.mysqlConnected
                    ? 'Connected via JDBC to localhost:3306 (XAMPP/MySQL)'
                    : 'Thread-Safe In-Memory Fallback (Start XAMPP MySQL to persist)'}
                </p>
              </div>
            </div>
            <div>
              {health?.mysqlConnected ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  MySQL Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  In-Memory Store
                </span>
              )}
          </div>

          {/* 3. Cross-Device Cloud Sync & API URL Configuration */}
          <div className="p-4 rounded-2xl bg-[#050c1a]/80 border border-cyan-500/20 text-left">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Backend API Endpoint (Multi-Device Sync)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {health?.resolvedApiUrl || apiUrlInput}
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400 mb-3">
              To see users and posts across multiple computers, all laptops must connect to the same deployed cloud backend URL (e.g. Railway or Render) instead of localhost.
            </p>

            <form onSubmit={handleSaveApiUrl} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={apiUrlInput}
                onChange={(e) => setApiUrlInput(e.target.value)}
                placeholder="https://your-backend.up.railway.app/api or http://localhost:8080/api"
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-cyan-500/30 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Save & Connect
                </button>
                <button
                  type="button"
                  onClick={handleResetApiUrl}
                  title="Reset to default URL"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </form>
            {saveSuccess && (
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Backend URL updated! Diagnostics refreshed.
              </p>
            )}
          </div>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 mb-4 relative z-10 text-left">
          <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5" />
            Full-Stack Technology Pipeline
          </h3>
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono py-1">
            <span className="bg-slate-800/80 px-2 py-1 rounded border border-white/10">HTML5 / CSS / JS</span>
            <span className="text-cyan-400">&rarr; HTTP REST &rarr;</span>
            <span className="bg-slate-800/80 px-2 py-1 rounded border border-white/10">Java (Port 8080)</span>
            <span className="text-cyan-400">&rarr; JDBC &rarr;</span>
            <span className="bg-slate-800/80 px-2 py-1 rounded border border-white/10">MySQL (Port 3306)</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 relative z-10">
          <button
            onClick={checkStatus}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Diagnostics</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs hover:opacity-95 transition-opacity cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
