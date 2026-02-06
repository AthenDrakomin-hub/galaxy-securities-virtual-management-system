
import React from 'react';
import Trade from '../../../../components/Trade';
import { db } from '../../../../lib/mongodb/client';

export default function BasicTradePage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">常规交易 <span className="text-orange-600">BASIC_TRADE</span></h2>
          <p className="text-stone-500 font-medium">直连A股及港股核心柜台，提供极速买入/卖出撮合能力</p>
        </div>
        <div className="flex bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 gap-6">
           <div className="text-center">
              <p className="text-[9px] text-stone-600 uppercase font-black">沪深行情</p>
              <p className="text-xs font-mono text-red-500">3,124.50 (+0.8%)</p>
           </div>
           <div className="text-center">
              <p className="text-[9px] text-stone-600 uppercase font-black">恒生指数</p>
              <p className="text-xs font-mono text-green-500">18,420.12 (-0.2%)</p>
           </div>
        </div>
      </header>

      <Trade />
    </div>
  );
}
