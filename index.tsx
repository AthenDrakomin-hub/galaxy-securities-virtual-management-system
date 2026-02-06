
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './app/layout';
import AdminLayout from './app/admin/layout';
import DashboardPage from './app/admin/dashboard/page.tsx';
import MarketPage from './app/admin/market/page.tsx';
import BasicTradePage from './app/admin/trades/basic/page.tsx';
import IPOPage from './app/admin/trades/ipo/page.tsx';
import BlockTradePage from './app/admin/trades/block/page.tsx';
import LimitUpPage from './app/admin/trades/limit-up/page.tsx';
import HoldingsPage from './app/admin/holdings/page.tsx';
import CustomersPage from './app/admin/customers/page.tsx';
import IntegrationPage from './app/admin/system/integration/page.tsx';
import LogsPage from './app/admin/system/logs/page.tsx';
import SettingsPage from './app/admin/system/settings/page.tsx';
import LoginPage from './app/admin/login/page.tsx';
import TradesHistoryPage from './app/admin/trades/page.tsx';
import UserDetailPage from './app/admin/system/users/[userId]/page.tsx';
import UsersManagementPage from './app/admin/system/users/page.tsx';

// Loading Fallback
const Loading = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <RootLayout>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Root Redirect */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Auth */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminLayout><Navigate to="/admin/dashboard" replace /></AdminLayout>} />
            <Route path="/admin/dashboard" element={<AdminLayout><DashboardPage /></AdminLayout>} />
            <Route path="/admin/market" element={<AdminLayout><MarketPage /></AdminLayout>} />
            <Route path="/admin/holdings" element={<AdminLayout><HoldingsPage /></AdminLayout>} />
            <Route path="/admin/customers" element={<AdminLayout><CustomersPage /></AdminLayout>} />
            
            {/* Trades Sub-routes */}
            <Route path="/admin/trades" element={<AdminLayout><TradesHistoryPage /></AdminLayout>} />
            <Route path="/admin/trades/basic" element={<AdminLayout><BasicTradePage /></AdminLayout>} />
            <Route path="/admin/trades/ipo" element={<AdminLayout><IPOPage /></AdminLayout>} />
            <Route path="/admin/trades/block" element={<AdminLayout><BlockTradePage /></AdminLayout>} />
            <Route path="/admin/trades/limit-up" element={<AdminLayout><LimitUpPage /></AdminLayout>} />

            {/* System Sub-routes */}
            <Route path="/admin/system/users" element={<AdminLayout><UsersManagementPage /></AdminLayout>} />
            <Route path="/admin/system/users/:userId" element={<AdminLayout><UserDetailPage /></AdminLayout>} />
            <Route path="/admin/system/integration" element={<AdminLayout><IntegrationPage /></AdminLayout>} />
            <Route path="/admin/system/logs" element={<AdminLayout><LogsPage /></AdminLayout>} />
            <Route path="/admin/system/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Suspense>
      </RootLayout>
    </BrowserRouter>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
