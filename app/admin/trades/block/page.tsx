'use client';

import React, { useState } from 'react';
import { Layers, ShieldCheck, Zap, ArrowRightLeft, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { db } from '../../../lib/mongodb/client';

export default function BlockTradePage() {
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('0.9');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!symbol || !amount || !discount) {
      alert('请完整填写协议交易参数');
      return;
    }

    setLoading(true);
    setSuccess(null);

    try {
      const response = await fetch('/api/trades/block/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'admin_1',
          symbol,
          amount: parseFloat(amount),
          discount: parseFloat(discount)
        })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(`大宗协议成交执行完成。成交代码: ${symbol}, 总额: ¥${parseFloat(amount).toLocaleString()}`);
        setSymbol('');
        setAmount('');
        setTimeout(() => setSuccess(null), 5000);
      } else {
        alert(result.msg || '协议成交执行失败');
      }
    } catch (error) {
      alert('协议网关连接异常');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header>
        <h2 className="text-4xl font-black text-white tracking-tighter mb-2">大宗交易 <span className="text-orange-600">BLOCK_DESK</span></h2>
        <p className="text-stone-500 font-medium">针对机构级大额虚拟头寸的非公开撮合通道，支持折价定价协议</p>
      </header>

      {success && (
        <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-2xl flex items-center gap-3 text-green-500 animate-fade-up shadow-lg">
          <CheckCircle2 size={18} />
          <span className="text-sm font-bold">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#121212] border border-stone-800 rounded-3xl p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
          
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
             <Layers className="text-orange-600" size={24} />
             协议成交录入中心
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">证券标的代码 / 名称</label>
              <input 
                type="text" 
                placeholder="600519 或 贵州茅台"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 font-mono text-stone-200 focus:border-orange-600 outline-none transition"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">协议折价率 (0.80 - 1.00)</label>
              <input 
                type="number" 
                step="0.01"
                min="0.8"
                max="1"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 font-mono text-stone-200 focus:border-orange-600 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-3 mb-10">
            <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">协议成交总额 (虚拟 UNIT)</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="50,000,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 font-mono text-2xl text-orange-500 outline-none transition"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-700 font-black">YUAN</span>
            </div>
          </div>

          <button 
            onClick={handleExecute}
            disabled={loading}
            className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-lg uppercase tracking-widest transition flex items-center justify-center gap-3 shadow-2xl shadow-orange-900/20 disabled:opacity-50"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
            {loading ? '协议撮合中...' : '确认并执行大宗协议成交'}
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-stone-900/50 border border-stone-800 p-8 rounded-3xl">
             <h4 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Info size={14} className="text-orange-600" />
                大宗合规参数矩阵
             </h4>
             <ul className="space-y-4 text-xs font-mono">
                <li className="flex justify-between border-b border-stone-800 pb-2">
                   <span className="text-stone-600">单笔最低门槛:</span>
                   <span className="text-stone-300">¥ 5,000,000</span>
                </li>
                <li className="flex justify-between border-b border-stone-800 pb-2">
                   <span className="text-stone-600">协议最大折价:</span>
                   <span className="text-stone-300">20.00%</span>
                </li>
                <li className="flex justify-between border-b border-stone-800 pb-2">
                   <span className="text-stone-600">协议印花税率:</span>
                   <span className="text-stone-300">免征 (虚拟)</span>
                </li>
             </ul>
          </div>

          <div className="bg-[#1a1a1a] border border-stone-800 p-8 rounded-3xl shadow-xl">
             <h4 className="text-lg font-bold text-white mb-4">近期机构大宗流水</h4>
             <div className="space-y-4">
                {[
                  { name: '贵州茅台', price: '1548.20', qty: '50万股', time: '14:20' },
                  { name: '宁德时代', price: '182.15', qty: '120万股', time: '11:05' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-stone-900 rounded-xl border border-stone-800 flex justify-between items-center group hover:border-orange-600/30 transition">
                    <div>
                      <p className="font-bold text-stone-200">{item.name}</p>
                      <p className="text-[10px] text-stone-600 font-mono">{item.time} | QTY: {item.qty}</p>
                    </div>
                    <ArrowRightLeft className="text-stone-700 group-hover:text-orange-600 transition" size={16} />
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-500 uppercase tracking-tighter">Done</p>
                      <p className="text-[10px] text-stone-600 font-mono">P: {item.price}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
