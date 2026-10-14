import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu,
  Package
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';

export function Header({
  currentPage,
  onNavigate,
  auth,
  onLogin,
  onRegister,
  onLogout,
  cartItemCount,
  onOpenCart,
}) {
  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'about', label: 'Nosotros' },
    { id: 'products', label: 'Productos' },
    { id: 'contact', label: 'Contactos' },
  ];

  const NavItems = ({ mobile = false }) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={currentPage === item.id ? 'default' : 'ghost'}
          onClick={() => onNavigate(item.id)}
          className={mobile ? 'w-full justify-start' : ''}
        >
          {item.label}
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <span className="font-bold text-xl">A&L Compresores</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavItems />
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            {auth.isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenCart}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* User Info and Logout */}
            {auth.isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Hola, {auth.customer?.name}
                </span>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={onLogin}>
                  Iniciar Sesión
                </Button>
                <Button onClick={onRegister}>
                  Registrarse
                </Button>
              </div>
            )}



            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-6">
                  <NavItems mobile />
                  
                  <div className="border-t pt-4">
                    {auth.isAuthenticated ? (
                      <div className="flex flex-col gap-2">
                        <div className="p-2 bg-muted rounded-lg">
                          <p className="font-medium">{auth.customer?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {auth.customer?.email}
                          </p>
                        </div>
                        <Button variant="outline" onClick={onLogout} className="w-full justify-start">
                          <LogOut className="mr-2 h-4 w-4" />
                          Cerrar Sesión
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" onClick={onLogin} className="w-full justify-start">
                          Iniciar Sesión
                        </Button>
                        <Button onClick={onRegister} className="w-full">
                          Registrarse
                        </Button>
                      </div>
                    )}
                  </div>
                  

                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
