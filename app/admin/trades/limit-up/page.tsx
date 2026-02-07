'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Timer, AlertTriangle, Crosshair, TrendingUp, Loader2, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/mongodb/client';

export default function LimitUpPage() {
  const [active, setActive] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [reserveAmount, setReserveAmount] = useState('');
  const [queue, setQueue] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  const handleStart = async () => {
    if (!symbol || !reserveAmount) {
      alert('请设置目标证券与预留封板资金');
      return;
    }

    setActive(true);
    setSuccess(null);
    setQueue(['ESTABLISHING_LINK...', 'SCANNING_BOARD...', 'CALCULATING_LATENCY...']);

    // Simulate board scanning and millisecond execution
    setTimeout(async () => {
      try {
        const response = await fetch('/api/trades/limit-up/trade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'admin_1',
            symbol,
            reserveAmount: parseFloat(reserveAmount)
          })
        });

        const result = await response.json();
        if (result.success) {
          setQueue(prev => [...prev, 'BOARD_LOCKED!', 'EXECUTING_FLASH_ORDER...', 'COMPLETE_IN_1.4ms']);
          setSuccess(`打板指令已执行。标的: ${symbol}, 封板价成交成功。`);
          setSymbol('');
          setReserveAmount('');
        } else {
          setQueue(prev => [...prev, `ABORTED: ${result.msg}`]);
          setActive(false);
        }
      } catch (error) {
        setQueue(prev => [...prev, 'CRITICAL_SYSTEM_ERROR']);
        setActive(false);
      }
    }, 2000);
  };

  const handleStop = () => {
    setActive(false);
    setQueue([]);
    setSuccess(null);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">一键打板 <span className="text-orange-600">FLASH_BOARD</span></h2>
          <p className="text-stone-500 font-medium">极速抢单系统，在虚拟引擎中模拟毫秒级涨停板封板操作</p>
        </div>
        <div className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-3 ${active ? 'bg-orange-600/20 border-orange-600 text-orange-500 animate-pulse shadow-[0_0_20px_rgba(255,69,0,0.2)]' : 'bg-stone-900 border-stone-800 text-stone-500'}`}>
           <div className={`w-2 h-2 rounded-full ${active ? 'bg-orange-600' : 'bg-stone-700'}`}></div>
           <span className="text-xs font-mono font-bold uppercase tracking-tight">{active ? 'FLASH_SCAN_ACTIVE' : 'Engine Idle'}</span>
        </div>
      </header>

      {success && (
        <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-2xl flex items-center gap-3 text-green-500 animate-fade-up">
          <CheckCircle2 size={18} />
          <span className="text-sm font-bold">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-[#121212] border border-stone-800 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none opacity-50"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">预监视证券 (代码/名称)</label>
                    <input 
                      type="text" 
                      placeholder="600519 或 贵州茅台"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      disabled={active}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-5 text-xl font-mono text-stone-200 focus:border-orange-600 outline-none transition disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">封单预留量 (虚拟 YUAN)</label>
                    <input 
                      type="number" 
                      placeholder="1,000,000"
                      value={reserveAmount}
                      onChange={(e) => setReserveAmount(e.target.value)}
                      disabled={active}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-5 text-xl font-mono text-stone-200 focus:border-orange-600 outline-none transition disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="p-6 bg-stone-900/50 border border-stone-800 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-stone-500 uppercase">实时预估涨停价:</span>
                      <span className="text-xl font-mono font-black text-red-500">1,892.55</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-stone-500 uppercase">当前板距 (EST):</span>
                      <span className="text-sm font-mono text-stone-300">0.42% (READY)</span>
                    </div>
                    <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                       <div className="w-[98%] h-full bg-red-600"></div>
                    </div>
                  </div>

                  <button 
                    onClick={active ? handleStop : handleStart}
                    className={`w-full py-6 rounded-2xl font-black text-2xl uppercase tracking-tighter transition shadow-2xl flex items-center justify-center gap-4 ${active ? 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20'}`}
                  >
                    {active ? <Zap size={28} className="animate-pulse" /> : <Crosshair size={28} />}
                    {active ? '中止抢单指令' : '确认锁定并加入队列'}
                  </button>
                </div>
              </div>
           </div>

           <div className="bg-[#121212] border border-stone-800 rounded-3xl p-8 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Timer size={20} className="text-orange-600" />
                 毫秒级执行实时序列
              </h3>
              <div className="space-y-3">
                 {queue.length > 0 ? queue.map((msg, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-stone-950 rounded-xl border border-stone-800 font-mono text-[11px] animate-fade-up">
                      <span className="text-stone-700">[LOG_T+{i*10}ms]</span>
                      <span className={msg.includes('LOCKED') ? 'text-red-500 font-bold' : 'text-stone-500 uppercase'}>{msg}</span>
                      <span className="text-stone-800">G_ENGINE_NODE_V3</span>
                   </div>
                 )) : (
                   <div className="py-10 text-center text-stone-800 italic uppercase font-black tracking-widest opacity-30 border border-dashed border-stone-800 rounded-2xl">
                     Awaiting FLASH_BOARD Initiation...
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-2xl">
                 <div className="flex items-center gap-3 text-red-500 mb-2">
                    <AlertTriangle size={18} />
                    <span className="text-xs font-black uppercase tracking-tight">高风险执行警告</span>
                 </div>
                 <p className="text-[10px] text-red-800 font-bold leading-relaxed uppercase">
                    一键打板将自动在涨停板瞬间执行最大可用额度。请确认风控阈值已调优，否则可能导致账户透支警报。
                 </p>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-stone-600 uppercase tracking-widest">打板热力全域监控</h4>
                 {[
                   { name: '隆基绿能', pct: '9.98%', status: 'FLASH_READY' },
                   { name: '宁德时代', pct: '8.42%', status: 'WATCHING' },
                   { name: '赛力斯', pct: '10.0%', status: 'LOCKED' },
                 ].map((s, i) => (
                   <div key={i} className="flex justify-between items-end border-b border-stone-800 pb-2 hover:border-orange-600/50 transition">
                      <div>
                        <p className="text-xs font-bold text-stone-200">{s.name}</p>
                        <p className={`text-[9px] font-mono font-black ${s.status === 'LOCKED' ? 'text-red-600' : 'text-stone-700'}`}>{s.status}</p>
                      </div>
                      <span className="text-sm font-mono font-black text-red-500">{s.pct}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 p-8 rounded-3xl text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-600/5 pointer-events-none blur-3xl"></div>
              <TrendingUp size={32} className="mx-auto text-orange-600 mb-4 relative z-10" />
              <h4 className="font-black text-white uppercase tracking-tighter text-xl relative z-10">全域扫描侦测</h4>
              <p className="text-xs text-stone-600 mt-2 relative z-10 uppercase font-bold">Auto-Scan v3 Enabled</p>
              <button className="relative z-10 mt-6 w-full py-3 bg-stone-800 text-stone-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-700 transition">开启后台自动追踪</button>
           </div>
        </div>
      </div>
    </div>
  );
}
