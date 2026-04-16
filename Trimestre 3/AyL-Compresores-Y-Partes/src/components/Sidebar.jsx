import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Package2, 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Users, 
  Truck, 
  FileBarChart, 
  Bell,
  UserCircle,
  LogOut,
  AlertTriangle,
  Store
} from 'lucide-react';

export function Sidebar({ user, currentView, onViewChange, onLogout, onBackToStore }) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { id: 'products', label: 'Productos', icon: Package, adminOnly: false },
    { id: 'stock', label: 'Control de Stock', icon: TrendingUp, adminOnly: false, badge: 3 },
    { id: 'suppliers', label: 'Proveedores', icon: Truck, adminOnly: false },
    { id: 'users', label: 'Usuarios', icon: Users, adminOnly: true },
    { id: 'reports', label: 'Reportes', icon: FileBarChart, adminOnly: false },
    { id: 'notifications', label: 'Notificaciones', icon: Bell, adminOnly: false, badge: 5 },
  ];

  const profileItems = [
    { id: 'profile', label: 'Mi Perfil', icon: UserCircle },
  ];

  const isAdmin = user.role === 'admin';

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="bg-primary rounded-lg p-2">
            <Package2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">A&L Compresores</h2>
            <p className="text-sm text-muted-foreground">Inventario</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="bg-secondary rounded-full h-10 w-10 flex items-center justify-center">
            <UserCircle className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <div className="flex items-center space-x-2">
              <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs">
                {isAdmin ? 'Administrador' : 'Auxiliar'}
              </Badge>
              {!isAdmin && (
                <AlertTriangle className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            
            const isActive = currentView === item.id;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border space-y-2">
          {profileItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {onBackToStore && (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={onBackToStore}
          >
            <Store className="h-4 w-4 mr-3" />
            Volver a la Tienda
          </Button>
        )}
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}
