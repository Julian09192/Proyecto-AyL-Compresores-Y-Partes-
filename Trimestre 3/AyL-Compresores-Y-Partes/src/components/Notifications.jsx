import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bell } from 'lucide-react';

export function Notifications({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h1>Notificaciones</h1>
        <p className="text-muted-foreground">
          Gestiona tus notificaciones
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            Funcionalidad de notificaciones
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
