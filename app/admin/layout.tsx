
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  ArrowLeftRight, 
  Briefcase, 
  Settings, 
  ShieldCheck, 
  Terminal,
  History,
  LogOut,
  Database
} from 'lucide-react';
import { db } from '../../lib/mongodb/client';

const SidebarItem = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 border-l-4 ${
        isActive 
          ? 'bg-orange-500/10 border-orange-600 text-orange-500 shadow-[inset_10px_0_15px_-10px_rgba(255,69,0,0.3)]' 
          : 'border-transparent text-stone-500 hover:bg-stone-900/50 hover:text-stone-300'
      }`}
    >
      {icon}
      <span className="font-semibold text-sm tracking-wide">{label}</span>
    </Link>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    db.addLog('AUTH', '管理员 SYS_ADMIN_01 登出系统', 'OK');
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-stone-300 overflow-hidden font-sans">
      {/* Sidebar - Aluminum Industrial Style */}
      <aside className="w-72 bg-[#121212] border-r border-stone-800 flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-stone-800 flex items-center gap-4 bg-gradient-to-b from-[#1a1a1a] to-[#121212]">
          <div className="w-10 h-10 bg-orange-600 rounded shadow-[0_0_15px_rgba(255,69,0,0.5)] flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-widest uppercase">银河证券</h1>
            <p className="text-[10px] text-orange-600 font-mono tracking-tighter uppercase">Virtual Engine 3.1</p>
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
          <p className="px-8 mb-4 text-[11px] font-black text-stone-600 uppercase tracking-[0.2em]">主控中心</p>
          <SidebarItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="系统仪表盘" />
          <SidebarItem href="/admin/market" icon={<TrendingUp size={20} />} label="实时行情" />
          <SidebarItem href="/admin/trades/basic" icon={<ArrowLeftRight size={20} />} label="交易管理" />
          <SidebarItem href="/admin/holdings" icon={<Briefcase size={20} />} label="资产持仓" />
          <SidebarItem href="/admin/customers" icon={<Users size={20} />} label="客户管理" />
          
          <p className="px-8 mt-8 mb-4 text-[11px] font-black text-stone-600 uppercase tracking-[0.2em]">系统接入</p>
          <SidebarItem href="/admin/system/integration" icon={<Terminal size={20} />} label="可视化接入" />
          <SidebarItem href="/admin/system/logs" icon={<History size={20} />} label="审计日志" />
          <SidebarItem href="/admin/system/settings" icon={<Settings size={20} />} label="全局配置" />
        </nav>

        <div className="p-6 bg-[#0f0f0f] border-t border-stone-800">
          <div className="flex items-center gap-4 p-3 bg-stone-900/50 rounded-xl border border-stone-800 mb-4">
            <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center border border-stone-700">
              <Database size={18} className="text-stone-500" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-stone-200 truncate">SYS_ADMIN_01</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-[10px] text-stone-500 font-mono uppercase">Online</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-stone-500 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={14} /> 安全退出
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10 bg-[#0a0a0a] relative custom-scrollbar">
        <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-[0.03]">
          <h1 className="text-[12rem] font-black italic tracking-tighter leading-none select-none">GALAXY</h1>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
