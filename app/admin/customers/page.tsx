'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../lib/mongodb/client';
import { UserPlus, DollarSign, Shield, ArrowUp, ArrowDown, Search, ExternalLink } from 'lucide-react';

export default function CustomersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([...db.users]);
  const [showOp, setShowOp] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const handleFund = (type: 'RECHARGE' | 'WITHDRAW') => {
    if (!showOp || !amount) return;
    const val = parseFloat(amount);
    if (type === 'RECHARGE') db.recharge(showOp, val);
    else db.withdraw(showOp, val);
    setUsers([...db.users]);
    setShowOp(null);
    setAmount('');
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">客户矩阵 <span className="text-orange-600">CUSTOMERS</span></h2>
          <p className="text-stone-500 font-medium">维护投资者生命周期，执行资金上下分审计指令</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-950 font-black rounded-xl hover:bg-white transition shadow-lg">
          <UserPlus size={18} />
          开设机构账户
        </button>
      </header>

      <div className="bg-[#121212] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 bg-[#181818] border-b border-stone-800 flex justify-between items-center">
           <div className="flex items-center gap-4 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2">
              <Search size={16} className="text-stone-600" />
              <input type="text" placeholder="快速检索用户..." className="bg-transparent border-none outline-none text-xs font-medium text-stone-400 w-64" />
           </div>
           <div className="flex gap-4">
              <div className="text-right">
                 <p className="text-[10px] font-black text-stone-600 uppercase">当前系统承载额</p>
                 <p className="text-sm font-mono font-bold text-orange-500">¥ 1.25 亿</p>
              </div>
           </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] bg-stone-900/20">
                <th className="px-8 py-5">投资者主体 / 系统标识</th>
                <th className="px-8 py-5">权限等级</th>
                <th className="px-8 py-5 text-right">可用余额 (UNIT)</th>
                <th className="px-8 py-5 text-right">资产估值</th>
                <th className="px-8 py-5 text-center">状态</th>
                <th className="px-8 py-5 text-right">审计操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-stone-800/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-center font-black text-orange-600 text-lg shadow-inner">
                        {u.username.substring(0, 1)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-base">{u.username}</span>
                        <span className="text-[10px] font-mono text-stone-600 tracking-wider uppercase">{u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1 rounded-full uppercase">
                      <Shield size={12} className="text-orange-500" />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-mono font-black text-stone-200">
                    ¥ {u.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-stone-500">
                    ¥ {u.totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                       <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => router.push(`/admin/system/users/${u.id}`)}
                        className="p-3 bg-stone-900 hover:bg-orange-600 hover:text-white rounded-xl transition text-stone-500 border border-stone-800"
                        title="详细审计与操作"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => setShowOp(u.id)}
                        className="p-3 bg-stone-900 hover:bg-stone-800 hover:text-stone-300 rounded-xl transition text-stone-500 border border-stone-800"
                        title="快速资金操作 (上下分)"
                      >
                        <DollarSign size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121212] border border-stone-800 w-full max-w-md rounded-3xl p-10 space-y-8 animate-fade-up shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black text-white">快速资金审计 <span className="text-orange-600">AUDIT</span></h3>
               <button onClick={() => setShowOp(null)} className="text-stone-600 hover:text-white">关闭</button>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">操作金额 (UNIT)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="请输入数值..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-xl font-mono text-orange-500 outline-none focus:border-orange-600 transition"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleFund('RECHARGE')}
                    className="py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-2 transition shadow-xl shadow-green-900/20"
                  >
                    <ArrowUp size={18} /> 指令: 上分
                  </button>
                  <button 
                    onClick={() => handleFund('WITHDRAW')}
                    className="py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-2 transition shadow-xl shadow-red-900/20"
                  >
                    <ArrowDown size={18} /> 指令: 下分
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
