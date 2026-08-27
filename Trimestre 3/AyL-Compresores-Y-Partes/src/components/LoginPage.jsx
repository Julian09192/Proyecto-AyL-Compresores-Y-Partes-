import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Package2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Mock users for demo
const mockUsers = [
  {
    id: '1',
    email: 'admin@alcompresores.com',
    name: 'Liliana Vesga',
    role: 'admin',
    createdAt: '2024-01-15',
    isActive: true,
  },
  {
    id: '2',
    email: 'auxiliar@alcompresores.com',
    name: 'Carlos Rodríguez',
    role: 'auxiliary',
    createdAt: '2024-02-01',
    isActive: true,
  },
];

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'demo123') {
      toast.success(`Bienvenido/a, ${user.name}`);
      onLogin(user);
    } else {
      setError('Credenciales incorrectas. Use demo123 como contraseña.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Package2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">A&L Compresores y Partes</CardTitle>
          <CardDescription>
            Sistema de Gestión de Inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@alcompresores.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Credenciales de Demo:</p>
            <div className="text-sm space-y-1">
              <p><strong>Admin:</strong> admin@alcompresores.com</p>
              <p><strong>Auxiliar:</strong> auxiliar@alcompresores.com</p>
              <p><strong>Contraseña:</strong> demo123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}