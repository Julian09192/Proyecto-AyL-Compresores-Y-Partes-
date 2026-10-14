import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { UserCircle } from 'lucide-react';
import { Button } from './ui/button';

export function UserProfile({ user, onLogout }) {
  return (
    <div className="space-y-6">
      <div>
        <h1>Mi Perfil</h1>
        <p className="text-muted-foreground">
          Administra tu información personal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Información del Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rol</p>
              <p className="font-medium">{user.role === 'admin' ? 'Administrador' : 'Auxiliar'}</p>
            </div>
            <Button variant="outline" onClick={onLogout} className="w-full">
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
