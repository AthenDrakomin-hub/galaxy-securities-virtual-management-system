'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '../../../../../lib/mongodb/client';
import { 
  ArrowLeft, 
  DollarSign, 
  ArrowUp, 
  ArrowDown, 
  History, 
  ShieldCheck, 
  User as UserIcon,
  CreditCard,
  Briefcase,
  TrendingUp
} from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = db.users.find(u => u.id === userId);
    if (found) setUser({...found});
    setLoading(false);
  }, [userId]);

  const handleOp = (type: 'RECHARGE' | 'WITHDRAW') => {
    if (!amount || !user) return;
    const val = parseFloat(amount);
    if (type === 'RECHARGE') db.recharge(user.id, val);
    else db.withdraw(user.id, val);
    
    const updated = db.users.find(u => u.id === userId);
    if (updated) setUser({...updated});
    
    setAmount('');
    setRemark('');
    alert('资金操作指令已由核心引擎执行完成');
  };

  if (loading) return <div className="p-20 text-center font-mono animate-pulse">SYSTEM_LOADING...</div>;
  if (!user) return <div className="p-20 text-center text-stone-500">用户标识 {userId} 不存在</div>;

  return (
    <div className="space-y-10 animate-fade-up pb-20">
      <header className="flex items-center gap-6">
        <button 
          onClick={() => router.push('/admin/customers')}
          className="p-3 bg-stone-900 border border-stone-800 rounded-2xl text-stone-500 hover:text-white transition shadow-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">账户审计 <span className="text-orange-600">{user.username}</span></h2>
          <p className="text-stone-500 font-medium uppercase text-xs tracking-widest mt-1">UID: {user.id} | 系统权限级别: {user.role}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-white"><DollarSign size={64} /></div>
                 <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-1">可用余额</p>
                 <p className="text-3xl font-mono font-black text-white">¥ {user.balance.toLocaleString()}</p>
              </div>
              <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-white"><Briefcase size={64} /></div>
                 <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-1">资产总值估值</p>
                 <p className="text-3xl font-mono font-black text-stone-400">¥ {user.totalAssets.toLocaleString()}</p>
              </div>
              <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-white"><TrendingUp size={64} /></div>
                 <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-1">累计盈亏总计</p>
                 <p className={`text-3xl font-mono font-black ${user.totalProfit >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                   {user.totalProfit >= 0 ? '+' : ''}¥ {user.totalProfit.toLocaleString()}
                 </p>
              </div>
           </div>

           <div className="bg-[#0f0f0f] border border-stone-800 rounded-[2.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none"></div>
              <h3 className="text-2xl font-black text-white flex items-center gap-4 relative z-10">
                 <CreditCard size={28} className="text-orange-600" />
                 资金流水直接指令 (上下分)
              </h3>
              
              <div className="space-y-8 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">操作金额 (YUAN)</label>
                       <input 
                         type="number" 
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         placeholder="0.00"
                         className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-5 text-2xl font-mono text-orange-500 outline-none focus:border-orange-600 transition"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest">审计备注 (OPTIONAL)</label>
                       <input 
                         type="text" 
                         value={remark}
                         onChange={(e) => setRemark(e.target.value)}
                         placeholder="如：客户入金、系统奖励..."
                         className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-5 text-stone-300 outline-none focus:border-orange-600 transition"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <button 
                      onClick={() => handleOp('RECHARGE')}
                      className="py-6 bg-green-600 hover:bg-green-700 text-white rounded-3xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition shadow-2xl shadow-green-900/20"
                    >
                      <ArrowUp size={24} /> 执行上分指令
                    </button>
                    <button 
                      onClick={() => handleOp('WITHDRAW')}
                      className="py-6 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition shadow-2xl shadow-red-900/20"
                    >
                      <ArrowDown size={24} /> 执行下分指令
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-10">
           <div className="bg-[#121212] border border-stone-800 rounded-3xl p-8 space-y-8 shadow-xl">
              <div className="flex flex-col items-center">
                 <div className="w-24 h-24 bg-stone-900 border border-stone-800 rounded-[2rem] flex items-center justify-center text-orange-600 mb-4 shadow-inner">
                    <UserIcon size={48} />
                 </div>
                 <h4 className="text-xl font-bold text-white uppercase tracking-tight">{user.username}</h4>
                 <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[10px] font-mono text-stone-600 uppercase font-black">Account_Active</span>
                 </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-stone-800">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-bold uppercase tracking-widest">开设时间</span>
                    <span className="text-stone-300 font-mono">{new Date(user.createTime).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-bold uppercase tracking-widest">最后成交</span>
                    <span className="text-stone-300 font-mono">14:52:12</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-bold uppercase tracking-widest">安全验证</span>
                    <span className="text-green-500 font-black flex items-center gap-1"><ShieldCheck size={14} /> VERIFIED</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#121212] border border-stone-800 rounded-3xl p-8 shadow-xl">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <History size={20} className="text-orange-600" />
                 近期审计流水
              </h4>
              <div className="space-y-4">
                 {[
                   { type: 'BUY', amount: '-¥ 1,200', time: '14:20' },
                   { type: 'RECH', amount: '+¥ 5,000', time: '11:05' },
                   { type: 'SELL', amount: '+¥ 3,450', time: '09:30' },
                 ].map((log, i) => (
                   <div key={i} className="flex justify-between items-center p-3 bg-stone-950 rounded-xl border border-stone-800">
                      <span className={`text-[10px] font-black p-1 rounded ${log.type === 'RECH' ? 'bg-green-600/10 text-green-500' : 'bg-stone-900 text-stone-500'}`}>{log.type}</span>
                      <span className="text-xs font-mono font-bold text-stone-300">{log.amount}</span>
                      <span className="text-[10px] font-mono text-stone-700">{log.time}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
