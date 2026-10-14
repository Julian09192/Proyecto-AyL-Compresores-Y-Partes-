import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Truck,
  DollarSign,
  Calendar
} from 'lucide-react';

export function DashboardOverview({ user }) {
  const stats = [
    {
      title: 'Total Productos',
      value: '1,247',
      change: '+12%',
      trend: 'positive',
      icon: Package,
      description: 'Desde el mes pasado'
    },
    {
      title: 'Stock Bajo',
      value: '23',
      change: '+3',
      trend: 'negative',
      icon: AlertTriangle,
      description: 'Productos con stock mínimo'
    },
    {
      title: 'Valor Total Inventario',
      value: '$2,847,392',
      change: '+8.2%',
      trend: 'positive',
      icon: DollarSign,
      description: 'Valor actual del inventario'
    },
    {
      title: 'Movimientos Hoy',
      value: '47',
      change: '+15',
      trend: 'positive',
      icon: TrendingUp,
      description: 'Entradas y salidas'
    }
  ];

  const lowStockItems = [
    { name: 'Compresor Atlas Copco GA30', stock: 2, minimum: 5, category: 'Compresores' },
    { name: 'Filtro de Aire FA-500', stock: 8, minimum: 15, category: 'Filtros' },
    { name: 'Aceite Shell Corena S4 R46', stock: 3, minimum: 10, category: 'Lubricantes' },
    { name: 'Válvula de Seguridad 8 bar', stock: 1, minimum: 5, category: 'Válvulas' },
    { name: 'Manguera Alta Presión 10m', stock: 4, minimum: 8, category: 'Accesorios' }
  ];

  const recentMovements = [
    { type: 'Entrada', product: 'Compresor Ingersoll Rand SSR', quantity: 2, date: '2024-12-20', user: 'Liliana Vesga' },
    { type: 'Salida', product: 'Kit de Mantenimiento KM-500', quantity: 5, date: '2024-12-20', user: 'Carlos Rodríguez' },
    { type: 'Entrada', product: 'Filtro Separador FS-200', quantity: 20, date: '2024-12-19', user: 'Liliana Vesga' },
    { type: 'Salida', product: 'Aceite Mobil Rarus SHC 1025', quantity: 3, date: '2024-12-19', user: 'Luis Morales' },
    { type: 'Ajuste', product: 'Válvula Check VC-25', quantity: -2, date: '2024-12-19', user: 'Liliana Vesga' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido/a de vuelta, {user?.name || 'Usuario'}. Aquí tienes un resumen de tu inventario.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={stat.trend === 'positive' ? 'default' : 'destructive'} className="flex items-center">
                    {stat.trend === 'positive' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Productos con Stock Bajo</span>
            </CardTitle>
            <CardDescription>
              Productos que necesitan reabastecimiento urgente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="text-destructive border-destructive">
                      {item.stock} / {item.minimum}
                    </Badge>
                    <Progress 
                      value={(item.stock / item.minimum) * 100} 
                      className="w-20 h-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Movimientos Recientes</span>
            </CardTitle>
            <CardDescription>
              Últimas actividades del inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{movement.product}</p>
                    <p className="text-xs text-muted-foreground">
                      {movement.user} • {movement.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={movement.type === 'Entrada' ? 'default' : 
                               movement.type === 'Salida' ? 'secondary' : 'outline'}
                    >
                      {movement.type} {Math.abs(movement.quantity)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors group">
              <Package className="h-8 w-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold">Registrar Producto</h4>
              <p className="text-xs text-muted-foreground">Agregar nuevo producto al inventario</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors group">
              <TrendingUp className="h-8 w-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold">Movimiento de Stock</h4>
              <p className="text-xs text-muted-foreground">Registrar entrada o salida</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors group">
              <Truck className="h-8 w-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold">Nuevo Proveedor</h4>
              <p className="text-xs text-muted-foreground">Agregar proveedor al sistema</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}