import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown, 
  Package,
  AlertTriangle,
  Search,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

// Mock products for stock movements
const mockProducts = [
  { id: '1', name: 'Compresor Atlas Copco GA30', reference: 'AC-GA30-001', currentStock: 2 },
  { id: '2', name: 'Filtro de Aire FA-500', reference: 'FA-500-002', currentStock: 8 },
  { id: '3', name: 'Aceite Shell Corena S4 R46', reference: 'SH-R46-003', currentStock: 3 },
  { id: '4', name: 'Compresor Ingersoll Rand SSR', reference: 'IR-SSR-004', currentStock: 15 },
  { id: '5', name: 'Válvula de Seguridad 8 bar', reference: 'VS-8BAR-005', currentStock: 1 },
];

// Mock stock movements
const mockMovements = [
  {
    id: '1',
    productId: '4',
    productName: 'Compresor Ingersoll Rand SSR',
    productReference: 'IR-SSR-004',
    type: 'entry',
    quantity: 2,
    reason: 'Compra',
    notes: 'Reposición de stock según pedido #12345',
    user: 'Liliana Vesga',
    date: '2024-12-20',
    supplier: 'Ingersoll Rand',
    previousStock: 13,
    newStock: 15
  },
  {
    id: '2',
    productId: '2',
    productName: 'Kit de Mantenimiento KM-500',
    productReference: 'KM-500-002',
    type: 'exit',
    quantity: 5,
    reason: 'Venta',
    notes: 'Venta a cliente Industrias XYZ',
    user: 'Carlos Rodríguez',
    date: '2024-12-20',
    customer: 'Industrias XYZ',
    previousStock: 13,
    newStock: 8
  },
  {
    id: '3',
    productId: '2',
    productName: 'Filtro Separador FS-200',
    productReference: 'FS-200-003',
    type: 'entry',
    quantity: 20,
    reason: 'Compra',
    notes: 'Pedido especial para proyecto ABC',
    user: 'Liliana Vesga',
    date: '2024-12-19',
    supplier: 'Atlas Copco',
    previousStock: 5,
    newStock: 25
  },
  {
    id: '4',
    productId: '3',
    productName: 'Aceite Mobil Rarus SHC 1025',
    productReference: 'MR-1025-004',
    type: 'exit',
    quantity: 3,
    reason: 'Venta',
    notes: 'Mantenimiento programado cliente ABC',
    user: 'Luis Morales',
    date: '2024-12-19',
    customer: 'Cliente ABC',
    previousStock: 8,
    newStock: 5
  },
  {
    id: '5',
    productId: '5',
    productName: 'Válvula Check VC-25',
    productReference: 'VC-25-005',
    type: 'adjustment',
    quantity: -2,
    reason: 'Ajuste de inventario',
    notes: 'Producto dañado durante manejo',
    user: 'Liliana Vesga',
    date: '2024-12-19',
    previousStock: 3,
    newStock: 1
  }
];

const movementTypes = [
  { value: 'entry', label: 'Entrada', icon: Plus, color: 'text-green-600' },
  { value: 'exit', label: 'Salida', icon: Minus, color: 'text-red-600' },
  { value: 'adjustment', label: 'Ajuste', icon: FileText, color: 'text-blue-600' },
  { value: 'return', label: 'Devolución', icon: TrendingUp, color: 'text-purple-600' }
];

const reasons = {
  entry: ['Compra', 'Devolución de cliente', 'Transferencia', 'Ajuste positivo', 'Producción'],
  exit: ['Venta', 'Transferencia', 'Consumo interno', 'Muestra', 'Pérdida'],
  adjustment: ['Conteo físico', 'Corrección de error', 'Producto dañado', 'Producto vencido'],
  return: ['Devolución a proveedor', 'Devolución de cliente', 'Producto defectuoso']
};

export function StockControl({ user }) {
  const [movements, setMovements] = useState(mockMovements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [newMovement, setNewMovement] = useState({
    productId: '',
    type: 'entry',
    quantity: 0,
    reason: '',
    notes: '',
    supplier: '',
    customer: ''
  });

  const canCreateMovements = user.role === 'admin' || user.role === 'auxiliary';

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.productReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || movement.type === filterType;
    return matchesSearch && matchesType;
  });

  const getMovementBadge = (type) => {
    const movementType = movementTypes.find(mt => mt.value === type);
    if (!movementType) return null;

    const Icon = movementType.icon;
    return (
      <Badge variant="outline" className="flex items-center space-x-1">
        <Icon className={`h-3 w-3 ${movementType.color}`} />
        <span>{movementType.label}</span>
      </Badge>
    );
  };

  const handleCreateMovement = () => {
    if (!newMovement.productId || !newMovement.reason || newMovement.quantity === 0) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    const product = mockProducts.find(p => p.id === newMovement.productId);
    if (!product) {
      toast.error('Producto no encontrado');
      return;
    }

    const previousStock = product.currentStock;
    const quantityChange = newMovement.type === 'exit' ? -Math.abs(newMovement.quantity) : Math.abs(newMovement.quantity);
    const newStock = previousStock + quantityChange;

    if (newStock < 0) {
      toast.error('No hay suficiente stock para realizar esta salida');
      return;
    }

    const movement = {
      id: Date.now().toString(),
      productId: newMovement.productId,
      productName: product.name,
      productReference: product.reference,
      type: newMovement.type,
      quantity: Math.abs(newMovement.quantity),
      reason: newMovement.reason,
      notes: newMovement.notes,
      user: user.name,
      date: new Date().toISOString().split('T')[0],
      supplier: newMovement.supplier,
      customer: newMovement.customer,
      previousStock,
      newStock
    };

    setMovements([movement, ...movements]);
    setNewMovement({
      productId: '',
      type: 'entry',
      quantity: 0,
      reason: '',
      notes: '',
      supplier: '',
      customer: ''
    });
    setIsDialogOpen(false);

    // Update product stock (in real app, this would be handled by backend)
    product.currentStock = newStock;

    toast.success('Movimiento de stock registrado exitosamente');
  };

  const todayMovements = movements.filter(m => m.date === new Date().toISOString().split('T')[0]);
  const totalEntries = todayMovements.filter(m => m.type === 'entry').reduce((sum, m) => sum + m.quantity, 0);
  const totalExits = todayMovements.filter(m => m.type === 'exit').reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Control de Stock</h1>
          <p className="text-muted-foreground">
            Gestiona entradas, salidas y movimientos de inventario
          </p>
        </div>
        {canCreateMovements && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
                <DialogDescription>
                  Registra una entrada, salida o ajuste de inventario
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Producto *</Label>
                    <Select 
                      value={newMovement.productId} 
                      onValueChange={(value) => setNewMovement({ ...newMovement, productId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.reference} - {product.name} (Stock: {product.currentStock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Movimiento *</Label>
                    <Select 
                      value={newMovement.type} 
                      onValueChange={(value) => setNewMovement({ ...newMovement, type: value, reason: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {movementTypes.map(type => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <Icon className={`h-4 w-4 ${type.color}`} />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Cantidad *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newMovement.quantity}
                      onChange={(e) => setNewMovement({ ...newMovement, quantity: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo *</Label>
                    <Select 
                      value={newMovement.reason} 
                      onValueChange={(value) => setNewMovement({ ...newMovement, reason: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasons[newMovement.type]?.map(reason => (
                          <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(newMovement.type === 'entry' || newMovement.type === 'return') && (
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Proveedor</Label>
                      <Input
                        id="supplier"
                        value={newMovement.supplier}
                        onChange={(e) => setNewMovement({ ...newMovement, supplier: e.target.value })}
                        placeholder="Nombre del proveedor"
                      />
                    </div>
                  )}
                  {newMovement.type === 'exit' && (
                    <div className="space-y-2">
                      <Label htmlFor="customer">Cliente</Label>
                      <Input
                        id="customer"
                        value={newMovement.customer}
                        onChange={(e) => setNewMovement({ ...newMovement, customer: e.target.value })}
                        placeholder="Nombre del cliente"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={newMovement.notes}
                    onChange={(e) => setNewMovement({ ...newMovement, notes: e.target.value })}
                    placeholder="Información adicional sobre el movimiento..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateMovement}>
                  Registrar Movimiento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas Hoy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">
              Productos ingresados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas Hoy</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalExits}</div>
            <p className="text-xs text-muted-foreground">
              Productos despachados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Neto</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalEntries - totalExits >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalEntries - totalExits >= 0 ? '+' : ''}{totalEntries - totalExits}
            </div>
            <p className="text-xs text-muted-foreground">
              Diferencia del día
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle>Historial de Movimientos</CardTitle>
              <CardDescription>
                Registro completo de movimientos de stock
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar movimientos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {movementTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Stock Anterior</TableHead>
                <TableHead>Stock Nuevo</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{movement.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{movement.productName}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {movement.productReference}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getMovementBadge(movement.type)}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      movement.type === 'entry' ? 'text-green-600' : 
                      movement.type === 'exit' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {movement.type === 'exit' ? '-' : '+'}
                      {movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{movement.reason}</p>
                      {movement.notes && (
                        <p className="text-sm text-muted-foreground">{movement.notes}</p>
                      )}
                      {movement.supplier && (
                        <p className="text-sm text-blue-600">Proveedor: {movement.supplier}</p>
                      )}
                      {movement.customer && (
                        <p className="text-sm text-purple-600">Cliente: {movement.customer}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{movement.previousStock}</TableCell>
                  <TableCell className="font-mono font-medium">{movement.newStock}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{movement.user}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
