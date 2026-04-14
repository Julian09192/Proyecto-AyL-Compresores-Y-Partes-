"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function AuthModal({ open, onOpenChange, mode, onModeChange, onLogin, onAdminLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Mock customer data for demo
  const mockCustomers = [
    {
      id: '1',
      email: 'cliente@ejemplo.com',
      name: 'Carlos Mendoza',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      email: 'maria@empresa.com',
      name: 'María Rodríguez',
      createdAt: '2024-02-20'
    }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    console.log('Login attempt:', { email: loginForm.email, password: loginForm.password });

    // Check if it's admin credentials
    if (loginForm.email === 'admin' && loginForm.password === 'admin123') {
      const adminUser = {
        id: 'admin-1',
        email: 'admin@alcompresores.com',
        name: 'Administrador',
        role: 'admin',
        createdAt: new Date().toISOString(),
        isActive: true
      };
      onAdminLogin(adminUser);
      toast.success('¡Bienvenido! Has iniciado sesión como administrador');
      setLoginForm({ email: '', password: '' });
      return;
    }

    // Regular customer login
    const existingCustomer = mockCustomers.find(c => c.email === loginForm.email);
    const customer = existingCustomer || {
      id: Date.now().toString(),
      email: loginForm.email,
      name: loginForm.email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    onLogin(customer);
    toast.success('¡Bienvenido! Has iniciado sesión correctamente');
    setLoginForm({ email: '', password: '' });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (registerForm.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const newCustomer = {
      id: Date.now().toString(),
      email: registerForm.email,
      name: registerForm.name,
      createdAt: new Date().toISOString()
    };

    onLogin(newCustomer);
    toast.success('¡Cuenta creada exitosamente! Ya puedes realizar compras');
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Acceder a tu cuenta</DialogTitle>
          <DialogDescription>
            Inicia sesión como cliente para comprar o como administrador para gestionar la tienda
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => onModeChange(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>
                  Ingresa tus credenciales como cliente o administrador
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email / Usuario</Label>
                    <Input
                      id="login-email"
                      type="text"
                      placeholder="tu@email.com o admin"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Tu contraseña"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Iniciar Sesión</Button>
                </form>
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">💡 Credenciales de prueba:</p>
                  <div className="space-y-1">
                    <p className="text-sm"><strong>👤 Cliente:</strong> cliente@ejemplo.com / cualquier contraseña</p>
                    <p className="text-sm"><strong>🔑 Admin:</strong> admin / admin123</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Crear Cuenta</CardTitle>
                <CardDescription>
                  Regístrate para empezar a comprar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre Completo</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="Confirma tu contraseña"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Crear Cuenta</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}