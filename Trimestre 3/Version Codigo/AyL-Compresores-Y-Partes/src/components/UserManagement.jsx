import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users } from 'lucide-react';

export function UserManagement({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h1>Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          Administra los usuarios del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            Funcionalidad de gestión de usuarios
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
