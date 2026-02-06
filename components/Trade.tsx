
'use client';

import React, { useState } from 'react';
import { db } from '../lib/mongodb/client';
import { Search, ArrowDownCircle, ArrowUpCircle, Info, Zap } from 'lucide-react';
import { formatCurrency } from '../lib/utils/formatNumber';

export default function Trade() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [selectedStock, setSelectedStock] = useState<any>(null);

  const currentUser = db.users[0];

  const handleSearch = () => {
    const stock = db.stocks.find(s => s.symbol === symbol || s.name === symbol);
    if (stock) {
      setSelectedStock(stock);
    } else {
      alert('未找到证券标的');
    }
  };

  const handleTrade = () => {
    if (!selectedStock || !quantity) return;
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      alert('请输入有效的数量');
      return;
    }

    const res = db.executeTrade(
      currentUser.id,
      selectedStock.symbol,
      tradeType,
      qty,
      selectedStock.price
    );

    if (res.success) {
      alert(`${tradeType === 'BUY' ? '买入' : '卖出'}指令执行成功`);
      setQuantity('');
    } else {
      alert(`指令执行失败: ${res.msg}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-[#121212] border border-stone-800 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <Zap className="text-orange-600" size={28} />
                交易控制终端 <span className="text-stone-600 text-sm font-mono">T_TERMINAL_V1</span>
              </h3>
              <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800">
                <button 
                  onClick={() => setTradeType('BUY')}
                  className={`px-8 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tradeType === 'BUY' ? 'bg-red-600 text-white shadow-lg' : 'text-stone-600 hover:text-stone-400'}`}
                >
                  买入 / BUY
                </button>
                <button 
                  onClick={() => setTradeType('SELL')}
                  className={`px-8 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tradeType === 'SELL' ? 'bg-green-600 text-white shadow-lg' : 'text-stone-600 hover:text-stone-400'}`}
                >
                  卖出 / SELL
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">证券标的代码</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="600519"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-5 text-xl font-mono text-stone-200 outline-none focus:border-orange-600 transition"
                    />
                    <button 
                      onClick={handleSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-stone-600 hover:text-orange-600 transition"
                    >
                      <Search size={20} />
                    </button>
                  </div>
                </div>

                {selectedStock && (
                  <div className="p-6 bg-stone-900/50 border border-stone-800 rounded-3xl animate-fade-up">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xl font-bold text-white">{selectedStock.name}</p>
                        <p className="text-xs font-mono text-stone-500 uppercase">{selectedStock.symbol}.{selectedStock.market}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-mono font-black ${selectedStock.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {selectedStock.price.toFixed(2)}
                        </p>
                        <p className={`text-xs font-mono ${selectedStock.change >= 0 ? 'text-red-800' : 'text-green-800'}`}>
                          {selectedStock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">委托数量 (股)</label>
                  <input 
                    type="number" 
                    placeholder="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-5 text-xl font-mono text-stone-200 outline-none focus:border-orange-600 transition"
                  />
                </div>

                <div className="p-6 bg-[#0f0f0f] border border-stone-800 rounded-3xl space-y-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-600 uppercase">预估交易金额:</span>
                    <span className="text-stone-200 font-mono">
                      {selectedStock && quantity ? formatCurrency(selectedStock.price * parseInt(quantity)) : '¥ 0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-stone-600 uppercase">系统预估规费:</span>
                    <span className="text-stone-500 font-mono">
                      {selectedStock && quantity ? formatCurrency(selectedStock.price * parseInt(quantity) * 0.0005) : '¥ 0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleTrade}
              disabled={!selectedStock || !quantity}
              className={`w-full mt-10 py-6 rounded-3xl font-black text-2xl uppercase tracking-tighter transition shadow-2xl flex items-center justify-center gap-4 ${
                !selectedStock || !quantity 
                ? 'bg-stone-900 text-stone-700 border border-stone-800 cursor-not-allowed' 
                : tradeType === 'BUY' 
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20' 
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-green-900/20'
              }`}
            >
              {tradeType === 'BUY' ? <ArrowDownCircle size={28} /> : <ArrowUpCircle size={28} />}
              确认执行 {tradeType === 'BUY' ? '买入' : '卖出'} 指令
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl space-y-6 shadow-xl">
           <h4 className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-2">
             <Info size={14} className="text-orange-600" />
             账户可用头寸
           </h4>
           <div className="space-y-2">
             <p className="text-stone-500 text-xs">可用虚拟资金 (YUAN)</p>
             <p className="text-3xl font-mono font-black text-white">
               {formatCurrency(currentUser.balance)}
             </p>
           </div>
           <div className="pt-6 border-t border-stone-800 space-y-4">
             <div className="flex justify-between text-xs">
               <span className="text-stone-600">最大可买:</span>
               <span className="text-stone-300 font-mono">
                 {selectedStock ? Math.floor(currentUser.balance / (selectedStock.price * 1.0005)) : 0} 股
               </span>
             </div>
             <div className="flex justify-between text-xs">
               <span className="text-stone-600">当前权限等级:</span>
               <span className="text-orange-600 font-black uppercase tracking-widest">{currentUser.role}</span>
             </div>
           </div>
        </div>

        <div className="bg-stone-900/30 border border-stone-800 p-8 rounded-3xl">
           <h4 className="text-sm font-bold text-stone-200 mb-6 uppercase tracking-widest">五档买卖盘模拟</h4>
           <div className="space-y-2 font-mono text-[11px]">
              {[5,4,3,2,1].map(i => (
                <div key={`s-${i}`} className="flex justify-between">
                  <span className="text-stone-600 italic">卖 {i}</span>
                  <span className="text-green-500">{(selectedStock?.price || 100) + (i * 0.01)}</span>
                  <span className="text-stone-700">{Math.floor(Math.random() * 500)}</span>
                </div>
              ))}
              <div className="h-4 border-y border-stone-800/50 my-2"></div>
              {[1,2,3,4,5].map(i => (
                <div key={`b-${i}`} className="flex justify-between">
                  <span className="text-stone-600 italic">买 {i}</span>
                  <span className="text-red-500">{(selectedStock?.price || 100) - (i * 0.01)}</span>
                  <span className="text-stone-700">{Math.floor(Math.random() * 500)}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
