
'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, TrendingUp, Users, Zap, ArrowUpRight, ArrowDownRight, ShieldAlert } from 'lucide-react';
import { db } from '../../../lib/mongodb/client';

const DashboardCard = ({ title, value, change, isUp, icon }: any) => (
  <div className="bg-[#121212] border border-stone-800 p-6 rounded-2xl hover:border-stone-700 transition group relative overflow-hidden shadow-xl">
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-[50px] pointer-events-none"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-stone-900 rounded-xl text-stone-500 group-hover:text-orange-500 transition border border-stone-800 shadow-inner">
        {icon}
      </div>
      {change && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-bold ${isUp ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      )}
    </div>
    <p className="text-stone-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1">{title}</p>
    <h3 className="text-3xl font-black text-white font-mono tracking-tighter">{value}</h3>
  </div>
);

const chartData = [
  { t: '09:30', v: 3100 }, { t: '10:00', v: 3150 }, { t: '10:30', v: 3120 },
  { t: '11:00', v: 3180 }, { t: '11:30', v: 3200 }, { t: '13:00', v: 3190 },
  { t: '14:00', v: 3250 }, { t: '15:00', v: 3280 },
];

const PIE_COLORS = ['#ff4500', '#2e2e2e', '#404040', '#595959'];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    balance: db.users[0].balance,
    trades: db.trades.length,
    users: db.users.length,
    latency: '12ms'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      db.updateMarket();
      setStats({
        balance: db.users[0].balance,
        trades: db.trades.length,
        users: db.users.length,
        latency: `${Math.floor(Math.random() * 5) + 10}ms`
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);



  const pieData = [
    { name: '蓝筹', value: 400 },
    { name: '成长', value: 300 },
    { name: '周期', value: 200 },
    { name: '现金', value: 100 },
  ];

  return (
    <div className="space-y-10 animate-fade-up pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">系统总览 <span className="text-orange-600">DASHBOARD</span></h2>
          <p className="text-stone-500 font-medium">监控银河核心引擎运行状态与虚拟资本流向</p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-stone-900/50 border border-stone-800 rounded-xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-stone-400 uppercase">Sync: Active ({stats.latency})</span>
           </div>
        </div>
      </header>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="核心资金池总量" 
          value={`¥${(stats.balance / 10000).toLocaleString()}万`} 
          change="+2.4%" 
          isUp={true} 
          icon={<Wallet size={20} />} 
        />
        <DashboardCard 
          title="系统成交总量" 
          value={stats.trades.toLocaleString()} 
          change="+15.2%" 
          isUp={true} 
          icon={<TrendingUp size={20} />} 
        />
        <DashboardCard 
          title="在线客户规模" 
          value={stats.users.toString()} 
          change="NORMAL" 
          isUp={true} 
          icon={<Users size={20} />} 
        />
        <DashboardCard 
          title="镜像同步耗时" 
          value={stats.latency} 
          change="-2ms" 
          isUp={true} 
          icon={<Zap size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#121212] border border-stone-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
              银河综指实时对账镜像
            </h3>
            <div className="flex bg-stone-900 p-1 rounded-lg text-[10px] font-bold">
               <button className="px-3 py-1 bg-stone-800 text-orange-500 rounded-md">LIVE</button>
               <button className="px-3 py-1 text-stone-500">1W</button>
               <button className="px-3 py-1 text-stone-500">1M</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4500" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ff4500" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="t" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #2e2e2e', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="v" stroke="#ff4500" strokeWidth={3} fillOpacity={1} fill="url(#chartColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl shadow-xl flex flex-col">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
             <ShieldAlert size={18} className="text-orange-600" />
             资产风险 Flux 监控
          </h3>
          <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121212', border: '1px solid #2e2e2e', borderRadius: '8px', fontSize: '10px' }}
                  />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
             {pieData.map((item, i) => (
               <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}></div>
                  <span className="text-[10px] font-black text-stone-500 uppercase">{item.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
