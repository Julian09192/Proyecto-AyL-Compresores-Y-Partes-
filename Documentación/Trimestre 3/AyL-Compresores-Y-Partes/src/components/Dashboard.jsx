import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { DashboardOverview } from './DashboardOverview';
import { ProductManagement } from './ProductManagement';
import { StockControl } from './StockControl';
import { UserManagement } from './UserManagement';
import { SupplierManagement } from './SupplierManagement';
import { Reports } from './Reports';
import { Notifications } from './Notifications';
import { UserProfile } from './UserProfile';

export function Dashboard({ user, onLogout }) {

   const [currentView, setCurrentView] = useState('overview');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return <DashboardOverview user={user} />;
      case 'products':
        return <ProductManagement user={user} />;
      case 'stock':
        return <StockControl user={user} />;
      case 'users':
        return <UserManagement user={user} />;
      case 'suppliers':
        return <SupplierManagement user={user} />;
      case 'reports':
        return <Reports user={user} />;
      case 'notifications':
        return <Notifications user={user} />;
      case 'profile':
        return <UserProfile user={user} onLogout={onLogout} />;
      default:
        return <DashboardOverview user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        user={user} 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
}