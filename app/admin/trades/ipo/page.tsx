'use client';

import React, { useState } from 'react';
import { Rocket, Shield, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '@/lib/mongodb/client';

export default function IPOPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleApply = async (stockCode: string, name: string) => {
    setLoading(stockCode);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/trades/ipo/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'admin_1', // Assuming current user for demo
          stockCode,
          quantity: 1000 // Default quantity for demo
        })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(`已成功提交 ${name} (${stockCode}) 的申购指令`);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        alert(result.msg || '申购失败');
      }
    } catch (error) {
      alert('系统连接故障，请检查网关状态');
    } finally {
      setLoading(null);
    }
  };

  const stocks = [
    { name: '银河科技', code: '730121', price: '28.50', pe: '12.4', date: '2023-11-24' },
    { name: '重工智能', code: '732550', price: '12.30', pe: '22.1', date: '2023-11-24' },
    { name: '华夏半导体', code: '732668', price: '45.12', pe: '35.4', date: '2023-11-25' },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <header>
        <h2 className="text-4xl font-black text-white tracking-tighter mb-2">新股申购 <span className="text-orange-600">IPO_PORTAL</span></h2>
        <p className="text-stone-500 font-medium">访问一级市场资产发行通道，参与虚拟资本初始定价申购</p>
      </header>

      {success && (
        <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-2xl flex items-center gap-3 text-green-500 animate-fade-up">
          <CheckCircle2 size={18} />
          <span className="text-sm font-bold">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[80px]"></div>
              <div className="flex justify-between items-start mb-8">
                <div>
                   <h3 className="text-2xl font-black text-white mb-1">今日可申购 A-SHARE</h3>
                   <p className="text-stone-500 text-xs">实时拉取交易所初始发行清单</p>
                </div>
                <div className="px-3 py-1 bg-green-900/30 text-green-500 border border-green-800/30 rounded-lg text-[10px] font-black uppercase tracking-widest">
                   Live Gateway
                </div>
              </div>

              <div className="space-y-4">
                 {stocks.map(stock => (
                   <div key={stock.code} className="p-6 bg-stone-900/50 border border-stone-800 rounded-2xl flex flex-col md:flex-row items-center justify-between hover:border-stone-700 transition gap-6">
                      <div className="flex items-center gap-6 w-full md:w-auto">
                         <div className="w-12 h-12 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-center text-orange-600">
                            <Rocket size={24} />
                         </div>
                         <div>
                            <h4 className="font-bold text-white">{stock.name}</h4>
                            <p className="text-[10px] font-mono text-stone-600">CODE: {stock.code}</p>
                         </div>
                      </div>
                      <div className="flex gap-10 w-full md:w-auto justify-between md:justify-end">
                         <div className="text-right">
                            <p className="text-[10px] text-stone-600 uppercase font-black">发行价</p>
                            <p className="text-sm font-mono font-bold text-stone-200">¥ {stock.price}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] text-stone-600 uppercase font-black">市盈率</p>
                            <p className="text-sm font-mono font-bold text-stone-400">{stock.pe}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleApply(stock.code, stock.name)}
                        disabled={loading === stock.code}
                        className="w-full md:w-auto px-6 py-2 bg-stone-100 text-stone-950 rounded-xl text-xs font-black uppercase hover:bg-white transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading === stock.code ? <Loader2 size={14} className="animate-spin" /> : null}
                        {loading === stock.code ? '提交中...' : '立即申购'}
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-stone-900/50 border border-stone-800 p-6 rounded-3xl">
              <h4 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Shield size={14} className="text-orange-600" />
                 申购合规审计
              </h4>
              <div className="space-y-4 text-xs font-mono">
                 <div className="flex justify-between text-stone-600">
                    <span>可用申购头寸</span>
                    <span className="text-stone-300">¥ 1,200,000</span>
                 </div>
                 <div className="flex justify-between text-stone-600">
                    <span>系统配号成功率</span>
                    <span className="text-green-500 font-bold">12.42%</span>
                 </div>
                 <div className="pt-4 border-t border-stone-800 flex justify-between">
                    <span className="text-stone-500">资产负债表验证</span>
                    <span className="text-white">PASS</span>
                 </div>
              </div>
           </div>
           
           <div className="bg-orange-600 border border-orange-500 p-6 rounded-3xl text-white shadow-xl shadow-orange-900/20">
              <Zap size={24} className="mb-4" />
              <h4 className="font-black text-lg mb-1 italic">极速自动化申购</h4>
              <p className="text-[10px] text-orange-100 uppercase font-bold tracking-widest">Auto-Queue Enabled</p>
              <button 
                onClick={() => alert('全自动申购序列已启动，系统将自动监控新股发行并按最大可用头寸进行申购。')}
                className="w-full mt-6 py-3 bg-white text-orange-600 rounded-xl font-black text-xs uppercase hover:bg-orange-50 transition shadow-lg"
              >
                启动自动化申购流水
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
