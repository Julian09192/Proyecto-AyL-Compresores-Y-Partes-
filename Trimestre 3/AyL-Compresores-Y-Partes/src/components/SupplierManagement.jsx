import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Truck } from 'lucide-react';

export function SupplierManagement({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h1>Gestión de Proveedores</h1>
        <p className="text-muted-foreground">
          Administra los proveedores
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Lista de Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            Funcionalidad de gestión de proveedores
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
