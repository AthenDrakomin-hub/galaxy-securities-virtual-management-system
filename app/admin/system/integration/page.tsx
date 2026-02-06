
'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Plus, ShieldCheck, Zap, RefreshCw, Lock, Unlock, Eye, EyeOff, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { useIntegration } from '../../../../lib/hooks/useIntegration';
import { testApiEndpoint } from '../../../../lib/api/integration';

const ApiKeyRow = ({ client, apiKey, apiSecret, status, id, onToggle }: any) => {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `Client: ${client}\nAPI Key: ${apiKey}\nAPI Secret: ${apiSecret}\nStatus: ${status}\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galaxy_api_key_${client}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`p-5 bg-stone-900/30 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between group transition-all duration-300 ${status === 'ACTIVE' ? 'border-stone-800' : 'border-red-900/20 opacity-60'}`}>
      <div className="flex items-center gap-6 mb-4 md:mb-0">
        <div className={`w-12 h-12 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-center transition-colors ${status === 'ACTIVE' ? 'text-orange-500 shadow-[0_0_10px_rgba(255,69,0,0.1)]' : 'text-stone-700'}`}>
          <Zap size={20} className={status === 'ACTIVE' ? 'animate-pulse' : ''} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-stone-200">{client}</h4>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest border transition-colors ${status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              {status}
            </span>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-stone-600 uppercase tracking-tighter w-16">API_KEY:</span>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800 select-all">{apiKey}</span>
              <button 
                onClick={() => handleCopy(apiKey)}
                className="p-1 hover:text-orange-500 text-stone-700 transition"
                title="复制 API Key"
              >
                <Copy size={12} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-stone-600 uppercase tracking-tighter w-16">SECRET:</span>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800 truncate max-w-[150px]">
                {showSecret ? apiSecret : '••••••••••••••••'}
              </span>
              <button 
                onClick={() => setShowSecret(!showSecret)}
                className="p-1 hover:text-orange-500 text-stone-700 transition"
                title={showSecret ? "隐藏 Secret" : "查看 Secret"}
              >
                {showSecret ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
              {showSecret && (
                <button 
                  onClick={() => handleCopy(apiSecret)}
                  className="p-1 hover:text-orange-500 text-stone-700 transition"
                  title="复制 Secret"
                >
                  <Copy size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 justify-end md:justify-start">
        {copied && <span className="text-[9px] font-black text-orange-500 uppercase animate-pulse">Copied!</span>}
        
        <div className="flex items-center gap-2 bg-stone-950/50 p-1 rounded-xl border border-stone-800">
          <button 
            onClick={handleDownload}
            className="p-2 hover:bg-stone-800 rounded-lg text-stone-500 hover:text-white transition"
            title="下载配置凭据"
          >
            <Download size={16} />
          </button>
          <div className="w-px h-4 bg-stone-800 mx-1"></div>
          <button 
            onClick={() => onToggle(id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
              status === 'ACTIVE' 
                ? 'bg-red-900/10 text-red-500 border-red-900/20 hover:bg-red-900/20' 
                : 'bg-green-900/10 text-green-500 border-green-900/20 hover:bg-green-900/20'
            }`}
          >
            {status === 'ACTIVE' ? <Lock size={12} /> : <Unlock size={12} />}
            {status === 'ACTIVE' ? '禁用' : '启用'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function IntegrationPage() {
  const { apiKeys, loading: keysLoading, createKey, toggleStatus } = useIntegration();
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testSymbol, setTestSymbol] = useState('600519');
  const [newClientName, setNewClientName] = useState('');

  const runTest = async () => {
    const activeKeys = apiKeys.filter(k => k.status === 'ACTIVE');
    if (activeKeys.length === 0) {
      alert('无可用且处于活跃状态的 API 密钥');
      return;
    }
    setTestLoading(true);
    try {
      const result = await testApiEndpoint(`/api/market/quotes?symbol=${testSymbol}`, activeKeys[0].apiKey);
      setTestResponse(result);
    } catch (err) {
      setTestResponse({ status: 'ERROR', data: { message: 'Network failed' } });
    } finally {
      setTestLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newClientName) return;
    await createKey(newClientName, ['行情查询', '基础交易']);
    setNewClientName('');
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleStatus(id);
    } catch (err) {
      alert('状态变更失败');
    }
  };

  return (
    <div className="space-y-10 animate-fade-up pb-20">
      <header>
        <h2 className="text-4xl font-black text-white tracking-tighter mb-2">开发接入管理 <span className="text-orange-600">INTEGRATION</span></h2>
        <p className="text-stone-500 font-medium">配置外部客户端 API 访问凭据与端点测试环境</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
              <ShieldCheck size={200} />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10">
               <h3 className="text-xl font-bold flex items-center gap-3">
                 <ShieldCheck size={24} className="text-orange-500" />
                 访问密钥矩阵
               </h3>
               <div className="flex gap-2 w-full md:w-auto">
                 <input 
                   type="text" 
                   placeholder="新应用名称..."
                   value={newClientName}
                   onChange={(e) => setNewClientName(e.target.value)}
                   className="bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-xs font-mono outline-none focus:border-orange-600 transition flex-1 md:w-48 text-stone-200"
                 />
                 <button 
                   onClick={handleCreate}
                   className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-950 rounded-xl text-xs font-black uppercase hover:bg-white transition shadow-lg"
                 >
                   <Plus size={16} /> 创建
                 </button>
               </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              {keysLoading ? (
                <div className="py-20 text-center font-mono text-stone-700 animate-pulse uppercase text-xs tracking-widest flex flex-col items-center gap-4">
                  <RefreshCw size={24} className="animate-spin" />
                  Loading_Secure_Access_Matrix...
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="py-20 text-center text-stone-700 italic border border-dashed border-stone-800 rounded-2xl flex flex-col items-center gap-4">
                  <Lock size={32} className="opacity-20" />
                  未发现活跃的 API 密钥凭据
                </div>
              ) : (
                apiKeys.map((key) => (
                  <ApiKeyRow 
                    key={key.id} 
                    id={key.id} 
                    client={key.clientName} 
                    apiKey={key.apiKey} 
                    apiSecret={key.apiSecret}
                    status={key.status} 
                    onToggle={handleToggle}
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-[#121212] border border-stone-800 p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Zap size={24} className="text-orange-500" />
              核心端点监控 (Live Monitor)
            </h3>
            <div className="space-y-3">
               {[
                 { path: '/api/market/quotes', method: 'GET', latency: '12ms', status: 200 },
                 { path: '/api/trades/basic/buy', method: 'POST', latency: '45ms', status: 200 },
                 { path: '/api/trades/ipo/apply', method: 'POST', latency: '32ms', status: 200 },
                 { path: '/api/system/users', method: 'GET', latency: '8ms', status: 200 },
               ].map((api, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-stone-950 border border-stone-800 rounded-xl group hover:border-stone-700 transition-colors">
                   <div className="flex items-center gap-4">
                     <span className={`text-[10px] font-black px-2 py-1 rounded w-16 text-center border ${api.method === 'GET' ? 'bg-blue-900/10 text-blue-500 border-blue-900/20' : 'bg-orange-900/10 text-orange-500 border-orange-900/20'}`}>
                       {api.method}
                     </span>
                     <span className="text-xs font-mono text-stone-400 group-hover:text-stone-200 transition-colors">{api.path}</span>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-mono text-stone-600 tabular-nums">{api.latency}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-green-500 uppercase">{api.status} OK</span>
                      </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col bg-[#0f0f0f] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
          <div className="p-5 border-b border-stone-800 bg-[#151515] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-orange-500" />
              <h4 className="text-sm font-bold uppercase tracking-widest text-white">端点调试终端</h4>
            </div>
            <button 
              onClick={() => setTestResponse(null)}
              className="p-1.5 hover:bg-stone-800 rounded transition text-stone-600"
              title="清空终端"
            >
              <RefreshCw size={14} />
            </button>
          </div>
          
          <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-6 custom-scrollbar bg-stone-950/20">
            <div className="space-y-2">
              <p className="text-stone-600 flex items-center gap-2">
                <span className="w-1 h-1 bg-stone-600 rounded-full"></span>
                构造测试请求 (CURL_SIMULATION)
              </p>
              <div className="text-green-500/80 break-all leading-relaxed p-4 bg-stone-950 rounded-xl border border-stone-900 shadow-inner">
                <span className="text-stone-700">$</span> curl -X GET "https://galaxy.api/market/quotes?symbol={testSymbol}" \<br/>
                &nbsp;&nbsp;-H "X-API-Key: {apiKeys.find(k => k.status === 'ACTIVE')?.apiKey || 'NULL'}"
              </div>
            </div>

            {testLoading && (
              <div className="py-10 text-orange-500 animate-pulse flex flex-col items-center justify-center gap-4 text-center border border-dashed border-stone-900 rounded-2xl">
                <RefreshCw size={24} className="animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">正在建立安全连接并同步镜像数据...</span>
              </div>
            )}

            {testResponse && (
              <div className="animate-fade-up space-y-4">
                <div className="flex items-center justify-between pt-6 border-t border-stone-800">
                  <div className="flex items-center gap-2 text-stone-500 uppercase text-[10px] font-black">
                    {testResponse.status === 'OK' ? <CheckCircle2 size={12} className="text-green-500" /> : <AlertCircle size={12} className="text-red-500" />}
                    <span>镜像数据响应 ({testResponse.code})</span>
                  </div>
                  <span className="text-stone-700 text-[10px]">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="bg-stone-950 p-6 rounded-2xl border border-stone-900 shadow-inner overflow-hidden">
                  <pre className="text-orange-500/80 leading-relaxed overflow-x-auto custom-scrollbar">
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {!testLoading && !testResponse && (
              <div className="h-full flex flex-col items-center justify-center text-stone-800 opacity-20 py-20">
                <Terminal size={64} className="mb-4" />
                <p className="font-black uppercase tracking-[0.3em]">Awaiting Command_</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#121212] border-t border-stone-800">
             <div className="flex gap-3">
               <div className="flex-1 relative">
                 <input 
                   type="text" 
                   placeholder="股票代码 (如 00700)..."
                   value={testSymbol}
                   onChange={(e) => setTestSymbol(e.target.value)}
                   className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 pl-4 text-xs font-mono outline-none focus:border-orange-600 transition text-stone-300 placeholder:text-stone-700"
                 />
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-stone-800 uppercase tracking-tighter">SYMBOL_IN</div>
               </div>
               <button 
                onClick={runTest}
                disabled={testLoading || apiKeys.filter(k => k.status === 'ACTIVE').length === 0}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase rounded-xl transition shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-2"
               >
                 {testLoading ? 'EXECUTING...' : 'RUN_TEST'}
                 {!testLoading && <Zap size={14} className="group-hover:scale-110 transition-transform" />}
               </button>
             </div>
             {apiKeys.filter(k => k.status === 'ACTIVE').length === 0 && (
               <p className="text-[9px] text-red-800 mt-3 font-black uppercase tracking-widest text-center animate-pulse">
                 需先创建并启用至少一个 API 密钥以执行测试
               </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
