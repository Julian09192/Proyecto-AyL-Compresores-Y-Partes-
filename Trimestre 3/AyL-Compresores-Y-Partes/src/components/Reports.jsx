import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileBarChart } from 'lucide-react';

export function Reports({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h1>Reportes</h1>
        <p className="text-muted-foreground">
          Genera reportes del inventario
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            Reportes Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            Funcionalidad de reportes
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
