'use client';

import React, { useState } from 'react';
import { Settings, Save, Database, ShieldAlert, Cpu, CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '../../../../lib/mongodb/client';

export default function SettingsPage() {
  const [fee, setFee] = useState('0.0005');
  const [syncFreq, setSyncFreq] = useState('5000');
  const [maxTrade, setMaxTrade] = useState('10,000,000');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setSuccess(false);
    
    // Simulate API call to update settings
    setTimeout(() => {
      db.addLog('SYS', `全局参数更新: 费率 ${fee}, 同步频率 ${syncFreq}ms`, 'OK');
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const handleClearHistory = () => {
    if (confirm('确认清除系统所有交易历史数据？此操作不可撤销。')) {
      db.trades = [];
      db.addLog('WARN', '系统所有交易流水已由管理员手动清除', 'WARN');
      alert('历史数据已清空');
    }
  };

  return (
    <div className="space-y-10 animate-fade-up pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">系统配置 <span className="text-orange-600">SETTINGS</span></h2>
          <p className="text-stone-500 font-medium">管控银河引擎核心参数、交易费率与安全边界</p>
        </div>
        {success && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 text-green-500 rounded-xl border border-green-800/30 animate-fade-up">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">配置已持久化</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
           <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl shadow-xl">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                 <Cpu size={20} className="text-orange-500" />
                 核心交易引擎参数
              </h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">虚拟交易默认手续费率</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 font-mono text-stone-300 outline-none focus:border-orange-600 transition" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 font-bold uppercase text-[10px]">Basis</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">跨域行情同步频率 (MS)</label>
                    <input 
                      type="text" 
                      value={syncFreq}
                      onChange={(e) => setSyncFreq(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 font-mono text-stone-300 outline-none focus:border-orange-600 transition" 
                    />
                 </div>
              </div>
           </div>

           <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl shadow-xl">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                 <ShieldAlert size={20} className="text-orange-500" />
                 全域风险控制阈值
              </h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center p-5 bg-stone-950 rounded-2xl border border-stone-800 group hover:border-orange-600/30 transition">
                    <div>
                       <p className="text-sm font-bold text-stone-200">启用异常交易自动锁闭机制</p>
                       <p className="text-[10px] text-stone-600 uppercase mt-1">检测到非对称波动时自动熔断网关</p>
                    </div>
                    <div className="w-12 h-6 bg-orange-600 rounded-full flex items-center justify-end px-1 shadow-inner cursor-pointer">
                       <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">单笔最大虚拟委托限额 (YUAN)</label>
                    <input 
                      type="text" 
                      value={maxTrade}
                      onChange={(e) => setMaxTrade(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 font-mono text-stone-300 outline-none focus:border-orange-600 transition" 
                    />
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-[#0f0f0f] border border-stone-800 p-8 rounded-3xl shadow-2xl h-fit relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-white"><Database size={120} /></div>
             <h3 className="text-lg font-bold mb-8 flex items-center gap-3 relative z-10">
                <Database size={20} className="text-orange-600" />
                资产数据库维护终端
             </h3>
             <div className="space-y-6 relative z-10">
                <p className="text-xs text-stone-500 leading-relaxed uppercase font-medium">
                   银河虚拟证券引擎当前运行在 <span className="text-orange-600 font-bold font-mono tracking-tighter">RAM_SIM_3.1</span>。
                   所有持久化快照已映射至本地集群。建议在非交易时段执行物理对账镜像同步。
                </p>
                <div className="space-y-3">
                   <button 
                     onClick={() => alert('全库镜像对账已启动，正在重新校准所有虚拟资产头寸...')}
                     className="w-full py-4 bg-stone-900 border border-stone-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-stone-800 transition shadow-lg"
                   >
                     执行全库快照镜像 (SNAPSHOT)
                   </button>
                   <button 
                     onClick={handleClearHistory}
                     className="w-full py-4 bg-red-900/10 border border-red-900/20 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-900/20 transition"
                   >
                     物理清除全域交易日志历史
                   </button>
                </div>
             </div>
             
             <div className="mt-12 pt-8 border-t border-stone-800 relative z-10">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full py-5 bg-stone-100 text-stone-950 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-white transition flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] disabled:opacity-50"
                >
                   {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                   {loading ? '正在同步参数...' : '保存全局配置指令'}
                </button>
             </div>
          </div>

          <div className="p-8 bg-stone-900/30 border border-stone-800 rounded-3xl">
             <div className="flex items-center gap-3 text-stone-600 mb-4">
               <Settings size={18} />
               <h4 className="text-xs font-black uppercase tracking-widest">系统元信息</h4>
             </div>
             <div className="space-y-2 text-[10px] font-mono text-stone-700">
               <p>VERSION: GALAXY_V3.1.2_STABLE</p>
               <p>KERNEL_BUILD: 20231124_PROD_SIM</p>
               <p>API_GATEWAY: CLOUD_READY_MIRROR</p>
               <p>UPTIME: 14D 02H 12M 45S</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
