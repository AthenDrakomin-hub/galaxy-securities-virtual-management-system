'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Industrial Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ff4500 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="w-full max-w-md bg-[#121212] border border-stone-800 rounded-[2.5rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,69,0,0.4)] mb-6">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">银河系统 <span className="text-orange-600">AUTH</span></h1>
          <p className="text-stone-500 text-xs font-bold mt-2 uppercase tracking-widest">Galaxy Virtual Engine v3.1</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest ml-1">Terminal ID</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-700" size={18} />
              <input 
                type="text" 
                defaultValue="SYS_ADMIN_01"
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl py-4 pl-12 pr-4 font-mono text-stone-300 outline-none focus:border-orange-600 transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest ml-1">Access Credentials</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-700" size={18} />
              <input 
                type="password" 
                defaultValue="********"
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl py-4 pl-12 pr-4 font-mono text-stone-300 outline-none focus:border-orange-600 transition"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-lg uppercase tracking-widest transition flex items-center justify-center gap-3 shadow-xl shadow-orange-900/20 disabled:opacity-50"
          >
            {loading ? 'Initializing...' : '安全进入系统'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-stone-800/50 flex flex-col items-center gap-4">
           <p className="text-[10px] text-stone-700 font-bold uppercase tracking-widest">受限访问：仅限银河证券内部人员</p>
           <div className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-stone-800"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-stone-800"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
