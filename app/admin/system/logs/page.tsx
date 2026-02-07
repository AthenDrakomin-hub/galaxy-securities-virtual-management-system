'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

// 自定义UI组件
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#121212] border border-stone-800 rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 border-b border-stone-800 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-xl font-bold text-white ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-stone-500 mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Table = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full overflow-auto ${className}`}>
    <table className="w-full">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-stone-900/50">
    {children}
  </thead>
);

const TableRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`border-b border-stone-800 ${className}`}>
    {children}
  </tr>
);

const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`text-left p-3 text-xs font-bold text-stone-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>
    {children}
  </tbody>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`p-3 text-sm ${className}`}>
    {children}
  </td>
);

const Input = ({ placeholder, value, onChange, className = '' }: { 
  placeholder: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 text-white placeholder-stone-500 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 ${className}`}
  />
);

const Button = ({ children, variant = 'default', onClick, className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'outline';
  onClick?: () => void;
  className?: string;
}) => {
  const baseClass = 'px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2';
  const variantClass = variant === 'outline' 
    ? 'bg-transparent border border-stone-700 text-stone-300 hover:bg-stone-800 hover:border-stone-600' 
    : 'bg-orange-600 text-white hover:bg-orange-700';
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};

// 简化版Select组件
const Select = ({ value, onValueChange, children, placeholder }: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-[180px] bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 text-white text-left flex items-center justify-between hover:border-stone-700"
      >
        <span className="truncate">{value === 'all' ? placeholder || '选择...' : value}</span>
        <ChevronDown size={16} className="text-stone-500" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-stone-900 border border-stone-800 rounded-lg shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
};

const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="py-1">
    {children}
  </div>
);

const SelectItem = ({ value, children, onSelect }: {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}) => (
  <div
    onClick={() => onSelect?.(value)}
    className="px-4 py-2 text-sm text-white hover:bg-stone-800 cursor-pointer"
  >
    {children}
  </div>
);

const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>
    {children}
  </div>
);

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <span>{placeholder}</span>
);

interface LogEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  module: string;
  details: string;
  ip: string;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILED';
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // 模拟获取日志数据
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        userId: 'user001',
        username: 'admin',
        action: 'LOGIN',
        module: 'AUTH',
        details: '用户登录系统',
        ip: '192.168.1.100',
        timestamp: new Date('2024-01-15T10:30:00'),
        status: 'SUCCESS'
      },
      {
        id: '2',
        userId: 'user002',
        username: 'operator1',
        action: 'TRADE_BUY',
        module: 'TRADE',
        details: '买入股票 AAPL 100股',
        ip: '192.168.1.101',
        timestamp: new Date('2024-01-15T11:15:00'),
        status: 'SUCCESS'
      },
      {
        id: '3',
        userId: 'user003',
        username: 'client1',
        action: 'WITHDRAW',
        module: 'FUND',
        details: '提现申请 5000元',
        ip: '192.168.1.102',
        timestamp: new Date('2024-01-15T14:20:00'),
        status: 'FAILED'
      },
      {
        id: '4',
        userId: 'user001',
        username: 'admin',
        action: 'USER_CREATE',
        module: 'USER',
        details: '创建新用户 operator2',
        ip: '192.168.1.100',
        timestamp: new Date('2024-01-15T15:45:00'),
        status: 'SUCCESS'
      },
      {
        id: '5',
        userId: 'user004',
        username: 'client2',
        action: 'API_CALL',
        module: 'INTEGRATION',
        details: '调用行情接口获取股票数据',
        ip: '192.168.1.103',
        timestamp: new Date('2024-01-15T16:30:00'),
        status: 'SUCCESS'
      }
    ];

    setLogs(mockLogs);
    setLoading(false);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.username.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter.toUpperCase();

    return matchesSearch && matchesModule && matchesStatus;
  });

  const modules = Array.from(new Set(logs.map(log => log.module)));

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">操作日志</h1>
        <p className="text-stone-500 mt-2">查看系统所有操作记录，支持搜索和筛选</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 h-4 w-4" />
                <Input
                  placeholder="搜索用户、操作或详情..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={moduleFilter} onValueChange={setModuleFilter} placeholder="模块筛选">
                <SelectContent>
                  <SelectItem value="all" onSelect={setModuleFilter}>所有模块</SelectItem>
                  {modules.map(module => (
                    <SelectItem key={module} value={module} onSelect={setModuleFilter}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter} placeholder="状态筛选">
                <SelectContent>
                  <SelectItem value="all" onSelect={setStatusFilter}>所有状态</SelectItem>
                  <SelectItem value="success" onSelect={setStatusFilter}>成功</SelectItem>
                  <SelectItem value="failed" onSelect={setStatusFilter}>失败</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                更多筛选
              </Button>

              <Button>
                <Download className="mr-2 h-4 w-4" />
                导出日志
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>操作记录</CardTitle>
          <CardDescription>
            共 {filteredLogs.length} 条记录，最近更新：{format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-stone-500">加载中...</div>
          ) : (
            <div className="rounded-lg border border-stone-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>用户</TableHead>
                    <TableHead>模块</TableHead>
                    <TableHead>操作</TableHead>
                    <TableHead>详情</TableHead>
                    <TableHead>IP地址</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-white">
                        {format(log.timestamp, 'MM-dd HH:mm:ss')}
                      </TableCell>
                      <TableCell className="text-white">{log.username}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-stone-900 text-stone-300 rounded text-xs border border-stone-800">
                          {log.module}
                        </span>
                      </TableCell>
                      <TableCell className="text-white">{log.action}</TableCell>
                      <TableCell className="text-stone-300 max-w-xs truncate">{log.details}</TableCell>
                      <TableCell className="text-stone-400">{log.ip}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.status === 'SUCCESS' 
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {log.status === 'SUCCESS' ? '成功' : '失败'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
