'use client';

import React from 'react';
import { db } from '../../../lib/mongodb/client';
import { ArrowLeftRight, Clock, CheckCircle, Tag } from 'lucide-react';

export default function TradesHistoryPage() {
  const trades = db.trades;

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">成交日志 <span className="text-orange-600">TRADES</span></h2>
          <p className="text-stone-500 font-medium">全域虚拟成交记录流水，提供全透明交易指令审计</p>
        </div>
      </header>

      <div className="bg-[#121212] border border-stone-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-900/40 border-b border-stone-800 text-[10px] font-black text-stone-600 uppercase tracking-widest">
              <th className="px-8 py-5">成交时间 / 指令ID</th>
              <th className="px-8 py-5">证券名称</th>
              <th className="px-8 py-5">操作类型</th>
              <th className="px-8 py-5 text-right">成交价</th>
              <th className="px-8 py-5 text-right">数量</th>
              <th className="px-8 py-5 text-right">成交总额</th>
              <th className="px-8 py-5 text-center">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/50">
            {trades.map(t => (
              <tr key={t.id} className="hover:bg-stone-800/20 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-stone-300 text-xs flex items-center gap-2">
                      <Clock size={12} className="text-stone-600" />
                      {t.timestamp.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono text-stone-600 tracking-wider uppercase mt-1">{t.id}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-stone-900 border border-stone-800 rounded flex items-center justify-center text-stone-500">
                      <Tag size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{t.name}</span>
                      <span className="text-[10px] font-mono text-stone-600">{t.symbol}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest border ${
                    t.type === 'BUY' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    t.type === 'SELL' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    {t.type}
                  </span>
                </td>
                <td className="px-8 py-6 text-right font-mono text-stone-300">
                  {t.price.toFixed(2)}
                </td>
                <td className="px-8 py-6 text-right font-mono text-stone-400">
                  {t.quantity.toLocaleString()}
                </td>
                <td className="px-8 py-6 text-right font-mono font-bold text-stone-200">
                  ¥ {t.amount.toLocaleString()}
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center text-green-500">
                    <CheckCircle size={16} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {trades.length === 0 && (
          <div className="p-20 text-center text-stone-700 font-black italic text-2xl uppercase opacity-20">No Trading Data Recorded</div>
        )}
      </div>
    </div>
  );
}
