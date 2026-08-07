import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Separator } from './ui/separator';
import { 
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard
} from 'lucide-react';

export function CartSheet({
  open,
  onOpenChange,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
  onCheckout,
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Carrito de Compras
            </SheetTitle>
            <SheetDescription>
              Tu carrito está vacío
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
              <p className="text-muted-foreground mb-4">
                Agrega algunos productos para empezar a comprar
              </p>
              <Button onClick={() => onOpenChange(false)}>
                Seguir Comprando
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
            <Badge variant="secondary">{totalItems}</Badge>
          </SheetTitle>
          <SheetDescription>
            Revisa tus productos antes de finalizar la compra
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto py-4">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg">
                <div className="w-16 h-16 flex-shrink-0 bg-muted rounded flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatPrice(item.product.price)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-sm">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="border-t pt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({totalItems} productos)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Envío</span>
              <span className="text-green-600">Gratis</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="text-lg">{formatPrice(totalPrice)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="w-full" 
              size="lg"
              onClick={onCheckout}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Finalizar Compra
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Seguir Comprando
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
