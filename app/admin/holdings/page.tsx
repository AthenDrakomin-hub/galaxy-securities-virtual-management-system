'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/mongodb/client';
import { Briefcase, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import styles from './holdings.module.css';

export default function HoldingsPage() {
  const [holdings, setHoldings] = useState([...db.holdings]);

  useEffect(() => {
    const timer = setInterval(() => {
      db.updateMarket();
      setHoldings([...db.holdings]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const totalMarketValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0);
  const totalProfit = holdings.reduce((sum, h) => sum + (h.currentPrice - h.avgPrice) * h.quantity, 0);

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">资产持仓 <span className="text-orange-600">HOLDINGS</span></h2>
          <p className="text-stone-500 font-medium">实时监控系统内所有虚拟资产的分布与动态盈亏</p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-stone-900 border border-stone-800 rounded-xl">
              <p className="text-[10px] text-stone-600 font-black uppercase">总市值估值</p>
              <p className="text-lg font-mono font-bold text-stone-200">¥ {totalMarketValue.toLocaleString()}</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121212] border border-stone-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600/10 text-orange-600 rounded-lg">
              <PieChart size={20} />
            </div>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">持仓分布</h3>
          </div>
          <div className="space-y-4">
            {holdings.map(h => (
              <div key={h.symbol} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">{h.name}</span>
                  <span className="text-stone-300 font-mono">{((h.currentPrice * h.quantity / totalMarketValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div 
                    className={`h-full rounded-full ${styles.holdingBarInner}`}
                    style={{ '--holding-width': `${(h.currentPrice * h.quantity / totalMarketValue) * 100}%` } as React.CSSProperties}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-[#121212] border border-stone-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-900/40 border-b border-stone-800 text-[10px] font-black text-stone-600 uppercase tracking-widest">
                <th className="px-8 py-5">证券标的</th>
                <th className="px-8 py-5 text-right">持仓数量</th>
                <th className="px-8 py-5 text-right">成本 / 现价</th>
                <th className="px-8 py-5 text-right">市值估值</th>
                <th className="px-8 py-5 text-right">浮动盈亏</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50">
              {holdings.map(h => {
                const profit = (h.currentPrice - h.avgPrice) * h.quantity;
                const isUp = profit >= 0;
                return (
                  <tr key={h.symbol} className="hover:bg-stone-800/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{h.name}</span>
                        <span className="text-[10px] font-mono text-stone-600 uppercase tracking-widest">{h.symbol}.{h.market}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono text-stone-300">
                      {h.quantity.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-right font-mono text-xs">
                      <div className="text-stone-500">{h.avgPrice.toFixed(2)}</div>
                      <div className={h.currentPrice >= h.avgPrice ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                        {h.currentPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono text-stone-200">
                      ¥ {(h.currentPrice * h.quantity).toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className={`flex items-center justify-end gap-1 font-mono font-bold ${isUp ? 'text-red-500' : 'text-green-500'}`}>
                        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isUp ? '+' : ''}{profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-[10px] font-mono ${isUp ? 'text-red-800' : 'text-green-800'}`}>
                        {((h.currentPrice - h.avgPrice) / h.avgPrice * 100).toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {holdings.length === 0 && (
            <div className="p-12 text-center text-stone-600 italic">当前账户无持仓数据</div>
          )}
        </div>
      </div>
    </div>
  );
}
