
'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Shield, Cpu, Cloud, RefreshCw, Terminal, Search } from 'lucide-react';
import { db } from '../../../../lib/mongodb/client';

export default function LogsPage() {
  const [logs, setLogs] = useState([...db.logs]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setLogs([...db.logs]);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const filteredLogs = logs.filter(l => 
    l.event.toLowerCase().includes(filter.toLowerCase()) || 
    l.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-up pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">审计日志 <span className="text-orange-600">AUDIT_LOGS</span></h2>
          <p className="text-stone-500 font-medium">全量系统事件记录，支持核心安全审计与故障溯源</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 flex-1 md:w-64">
              <Search size={16} className="text-stone-600" />
              <input 
                type="text" 
                placeholder="过滤日志事件..." 
                className="bg-transparent border-none outline-none text-xs text-stone-300 w-full"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setLogs([...db.logs])}
             className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-500 hover:text-white transition shadow-lg"
           >
             <RefreshCw size={18} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '系统事件累计', count: logs.length.toLocaleString(), icon: <Cpu size={20} /> },
          { label: '安全合规级别', count: 'L3_HIGH', icon: <Shield size={20} /> },
          { label: '核心引擎负载', count: '0.12%', icon: <Activity size={20} /> },
          { label: '网关对账状态', count: 'SYNCED', icon: <Cloud size={20} /> },
        ].map(stat => (
          <div key={stat.label} className="bg-[#121212] border border-stone-800 p-6 rounded-2xl flex items-center gap-4 group hover:border-orange-600/30 transition-all shadow-xl">
             <div className="p-3 bg-stone-900 text-orange-600 rounded-xl border border-stone-800 shadow-inner group-hover:scale-110 transition-transform">
               {stat.icon}
             </div>
             <div>
               <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{stat.label}</p>
               <p className="text-xl font-mono font-bold text-white uppercase">{stat.count}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-[#121212] border border-stone-800 rounded-3xl overflow-hidden font-mono text-xs shadow-2xl">
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <Terminal size={14} className="text-orange-600" />
              <span className="text-stone-600 uppercase font-black tracking-widest">Galaxy_Event_Stream_Mirror v3.1</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse"></div>
             <span className="text-[10px] text-orange-600 uppercase font-bold tracking-tighter">Live Monitor</span>
           </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <div className="divide-y divide-stone-800/30 min-w-[800px] max-h-[600px] overflow-y-auto">
            {filteredLogs.length > 0 ? filteredLogs.map(log => (
              // Fix: Use _id as key since LogSchema defines _id
              <div key={log._id} className="p-4 flex items-center gap-6 hover:bg-stone-800/20 transition-colors group">
                <span className="text-stone-700 w-44 shrink-0 font-mono tabular-nums">{log.time.toLocaleString()}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black w-16 text-center border shrink-0 ${
                  log.type === 'SYS' ? 'bg-blue-900/10 text-blue-500 border-blue-900/20' :
                  log.type === 'AUTH' ? 'bg-purple-900/10 text-purple-500 border-purple-900/20' :
                  log.type === 'TRADE' ? 'bg-orange-900/10 text-orange-500 border-orange-900/20' :
                  log.type === 'DB' ? 'bg-green-900/10 text-green-500 border-green-900/20' :
                  log.type === 'NET' ? 'bg-cyan-900/10 text-cyan-500 border-cyan-900/20' :
                  'bg-stone-900/10 text-stone-500 border-stone-800/50'
                }`}>{log.type}</span>
                <span className="flex-1 text-stone-400 font-sans font-medium group-hover:text-stone-200 transition-colors">{log.event}</span>
                <span className={`font-black tracking-tighter shrink-0 w-12 text-right ${
                  log.status === 'OK' ? 'text-green-800' : 
                  log.status === 'WARN' ? 'text-orange-800' : 'text-red-800'
                }`}>{log.status}</span>
              </div>
            )) : (
              <div className="p-20 text-center text-stone-800 italic uppercase font-black">Waiting for system events or no results found...</div>
            )}
          </div>
        </div>
        
        <div className="p-6 text-center border-t border-stone-800 bg-stone-950/50">
           <p className="text-stone-700 uppercase text-[9px] font-black tracking-[0.3em]">EndOfLine // Galaxy Audit Terminal v3.1 // All events recorded</p>
        </div>
      </div>
    </div>
  );
}
