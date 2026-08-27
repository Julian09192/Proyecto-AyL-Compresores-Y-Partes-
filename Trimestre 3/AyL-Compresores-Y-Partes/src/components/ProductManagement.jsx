import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Package } from 'lucide-react';

export function ProductManagement({ user }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1>Gestión de Productos</h1>
        <p className="text-muted-foreground">
          Administra el catálogo de productos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="text-center p-8 text-muted-foreground">
              Funcionalidad de gestión de productos
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
