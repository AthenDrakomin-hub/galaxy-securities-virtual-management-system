
'use client';

import React, { useState } from 'react';
import { db } from '@/lib/mongodb/client';
import { UserPlus, Settings, DollarSign, Activity, X, Shield, PlusCircle, Loader2 } from 'lucide-react';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([...db.users]);
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<'CLIENT' | 'OPERATOR' | 'ADMIN'>('CLIENT');
  const [newBalance, setNewBalance] = useState('100000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    if (!newUsername) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newUser = db.createUser(newUsername, newRole, parseFloat(newBalance));
      setUsers([...db.users]);
      setIsSubmitting(false);
      setShowModal(false);
      setNewUsername('');
      alert('系统账号开设成功');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-up pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">权限与主体 <span className="text-orange-600">USER_OPS</span></h2>
          <p className="text-stone-500 font-medium">管理银河虚拟证券接入主体，执行核心安全审计与权限下发</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-stone-100 text-stone-950 rounded-xl font-black uppercase text-xs hover:bg-white transition flex items-center gap-2 shadow-xl"
        >
           <UserPlus size={16} /> 录入新系统主体
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
           { label: '系统注册主体', value: users.length.toString(), color: 'text-white' },
           { label: '今日资金流水', value: '¥ 45.2M', color: 'text-orange-600' },
           { label: '待处理审批', value: '00', color: 'text-stone-500' },
           { label: '活跃引擎节点', value: 'Mirror_Alpha', color: 'text-green-500' },
         ].map(stat => (
           <div key={stat.label} className="bg-[#121212] border border-stone-800 p-6 rounded-2xl shadow-lg">
              <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="bg-[#121212] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-stone-900/40 border-b border-stone-800">
            <tr className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em]">
              <th className="px-8 py-5">主体标识 / 凭据标识</th>
              <th className="px-8 py-5">权限级别</th>
              <th className="px-8 py-5 text-right">可用可用余额 (YUAN)</th>
              <th className="px-8 py-5 text-right">资产估值估值</th>
              <th className="px-8 py-5 text-right">审计操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/30">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-stone-800/20 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-center text-orange-600 font-black uppercase shadow-inner group-hover:border-orange-600/30 transition">
                      {u.username.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-200">{u.username}</span>
                      <span className="text-[10px] font-mono text-stone-600 uppercase tracking-tighter">ID: {u.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-950 border border-stone-800 text-[10px] font-black text-stone-500 rounded-full uppercase tracking-widest">
                     <Shield size={10} className="text-orange-500" />
                     {u.role}
                   </span>
                </td>
                <td className="px-8 py-6 text-right font-mono text-stone-300 font-bold">
                  ¥ {u.balance.toLocaleString()}
                </td>
                <td className="px-8 py-6 text-right font-mono text-stone-600 text-[11px]">
                  ¥ {u.totalAssets.toLocaleString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button aria-label="资金操作" title="资金操作" className="p-2.5 hover:bg-stone-800 rounded-xl text-stone-600 hover:text-orange-500 transition border border-transparent hover:border-stone-700 shadow-sm"><DollarSign size={16} /></button>
                    <button aria-label="编辑权限" title="编辑权限" className="p-2.5 hover:bg-stone-800 rounded-xl text-stone-600 hover:text-white transition border border-transparent hover:border-stone-700 shadow-sm"><Settings size={16} /></button>
                    <button aria-label="查看活动" title="查看活动" className="p-2.5 hover:bg-stone-800 rounded-xl text-stone-600 hover:text-red-500 transition border border-transparent hover:border-stone-700 shadow-sm"><Activity size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
           <div className="bg-[#121212] border border-stone-800 w-full max-w-lg rounded-[2.5rem] p-12 space-y-10 animate-fade-up shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none"></div>
              <div className="flex justify-between items-center relative z-10">
                 <h3 className="text-3xl font-black text-white flex items-center gap-3 italic">
                    <PlusCircle size={28} className="text-orange-600" />
                    录入新系统主体
                 </h3>
                 <button aria-label="关闭" title="关闭弹窗" onClick={() => setShowModal(false)} className="text-stone-600 hover:text-white transition"><X size={24} /></button>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="space-y-2">
                    <label htmlFor="newUsername" className="text-[10px] font-black text-stone-600 uppercase tracking-widest ml-1">主体名称 (USERNAME)</label>
                    <input
                      id="newUsername"
                      type="text"
                      value={newUsername}
                      title="主体名称"
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="如：东方红资管、张三个人账户"
                      className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-200 outline-none focus:border-orange-600 transition"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label htmlFor="newRole" className="text-[10px] font-black text-stone-600 uppercase tracking-widest ml-1">权限级别 (ROLE)</label>
                       <select 
                         id="newRole"
                         title="权限级别"
                         value={newRole}
                         onChange={(e) => setNewRole(e.target.value as any)}
                         className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-stone-300 outline-none focus:border-orange-600 transition appearance-none"
                       >
                          <option value="CLIENT">CLIENT (常规交易员)</option>
                          <option value="OPERATOR">OPERATOR (系统操作员)</option>
                          <option value="ADMIN">ADMIN (主管理员)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label htmlFor="newBalance" className="text-[10px] font-black text-stone-600 uppercase tracking-widest ml-1">初始资金 (YUAN)</label>
                       <input 
                         id="newBalance"
                         type="number" 
                         value={newBalance}
                         title="初始资金（YUAN）"
                         placeholder="100000"
                         onChange={(e) => setNewBalance(e.target.value)}
                         className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 font-mono text-orange-500 outline-none focus:border-orange-600 transition"
                       />
                    </div>
                 </div>

                 <button 
                   onClick={handleCreate}
                   disabled={isSubmitting || !newUsername}
                   className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-3xl font-black text-xl uppercase tracking-widest transition flex items-center justify-center gap-4 shadow-2xl shadow-orange-900/30 disabled:opacity-50"
                 >
                    {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Shield size={24} />}
                    {isSubmitting ? '正在执行录入...' : '确认开设系统账户'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
