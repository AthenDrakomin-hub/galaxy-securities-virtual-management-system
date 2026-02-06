'use client';

import React from 'react';
import Market from '../../../components/Market';

export default function MarketPage() {
  return (
    <div className="space-y-8 animate-fade-up">
       <header>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">实时数据镜像 <span className="text-orange-600">MARKET</span></h2>
          <p className="text-stone-500 font-medium">高速行情总线，同步全球核心交易所资产数据</p>
       </header>
       <Market />
    </div>
  );
}
