
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../lib/mongodb/client';
import { Stock } from '../types/market';
import { TrendingUp, TrendingDown, Search, ArrowRightLeft } from 'lucide-react';
import { formatCurrency, formatPercent } from '../lib/utils/formatNumber';

export default function Market() {
  const [stocks, setStocks] = useState<Stock[]>([...db.stocks]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      db.updateMarket();
      setStocks([...db.stocks]);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filteredStocks = stocks.filter(s => 
    s.name.includes(search) || s.symbol.includes(search)
  );

  return (
    <div className="bg-[#121212] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 bg-[#181818] border-b border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 w-full max-w-md focus-within:border-orange-600 transition-colors">
          <Search size={18} className="text-stone-600" />
          <input 
            type="text" 
            placeholder="代码或名称搜索..." 
            className="bg-transparent border-none outline-none text-sm text-stone-200 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-[10px] font-black text-stone-600 uppercase">数据刷新间隔</p>
            <p className="text-sm font-mono font-bold text-orange-600">3,000 MS</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-900/40 border-b border-stone-800 text-[10px] font-black text-stone-600 uppercase tracking-widest">
              <th className="px-8 py-5">证券代码</th>
              <th className="px-8 py-5">名称</th>
              <th className="px-8 py-5 text-right">最新价</th>
              <th className="px-8 py-5 text-right">涨跌额</th>
              <th className="px-8 py-5 text-right">涨跌幅</th>
              <th className="px-8 py-5 text-right">成交量</th>
              <th className="px-8 py-5 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/30">
            {filteredStocks.map(stock => {
              const isUp = stock.change >= 0;
              return (
                <tr key={stock.symbol} className="hover:bg-stone-800/20 transition-colors group">
                  <td className="px-8 py-6 font-mono text-stone-500 group-hover:text-orange-500 transition-colors">
                    {stock.symbol}.{stock.market}
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-stone-200">{stock.name}</span>
                  </td>
                  <td className={`px-8 py-6 text-right font-mono font-bold ${isUp ? 'text-red-500' : 'text-green-500'}`}>
                    {stock.price.toFixed(2)}
                  </td>
                  <td className={`px-8 py-6 text-right font-mono ${isUp ? 'text-red-500' : 'text-green-500'}`}>
                    {isUp ? '+' : ''}{stock.change.toFixed(2)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className={`inline-flex items-center gap-1 font-mono font-bold ${isUp ? 'text-red-500' : 'text-green-500'}`}>
                      {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {formatPercent(stock.changePercent)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-stone-500">
                    {(stock.volume / 10000).toFixed(1)}万
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-500 hover:text-orange-500 hover:border-orange-600/50 transition-all">
                      <ArrowRightLeft size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
