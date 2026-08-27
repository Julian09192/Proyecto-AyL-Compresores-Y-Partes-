"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CreditCard, MapPin, Package, CheckCircle, Truck } from 'lucide-react';
import { toast } from 'sonner';

export function CheckoutModal({
  open,
  onOpenChange,
  cart,
  totalPrice,
  customer,
  onOrderComplete,
}) {
  const [step, setStep] = useState('shipping');
  const [loading, setLoading] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: 'Bogotá',
    department: 'Cundinamarca',
    postalCode: '',
    phone: '',
    notes: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [orderNumber] = useState(() => Math.floor(Math.random() * 1000000).toString());

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const colombianCities = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
    'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué',
    'Pasto', 'Manizales', 'Neiva', 'Villavicencio', 'Armenia'
  ];

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.address || !shippingInfo.phone) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentInfo.method === 'credit-card') {
      if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.cardName) {
        toast.error('Por favor completa todos los campos de la tarjeta');
        return;
      }
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setStep('confirmation');
  };

  const handleOrderComplete = () => {
    onOrderComplete();
    onOpenChange(false);
    setStep('shipping');
    toast.success('¡Pedido realizado exitosamente! Recibirás un email de confirmación');
  };

  const renderShippingStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Información de Envío
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleShippingSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Calle 123 # 45-67"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Select value={shippingInfo.city} onValueChange={(value) => setShippingInfo(prev => ({ ...prev, city: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colombianCities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input
                id="postalCode"
                value={shippingInfo.postalCode}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                placeholder="110111"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+57 300 123 4567"
                required
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={shippingInfo.notes}
                onChange={(e) => setShippingInfo(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Instrucciones especiales para la entrega..."
                rows={3}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Continuar al Pago
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <Label>Método de Pago</Label>
              <Select value={paymentInfo.method} onValueChange={(value) => setPaymentInfo(prev => ({ ...prev, method: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="debit-card">Tarjeta Débito</SelectItem>
                  <SelectItem value="pse">PSE</SelectItem>
                  <SelectItem value="cash-on-delivery">Pago Contra Entrega</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(paymentInfo.method === 'credit-card' || paymentInfo.method === 'debit-card') && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                  <Input
                    id="cardName"
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardName: e.target.value }))}
                    placeholder="Como aparece en la tarjeta"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Número de tarjeta</Label>
                  <Input
                    id="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Fecha de vencimiento</Label>
                    <Input
                      id="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="w-full">
                Volver
              </Button>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Procesando...' : 'Realizar Pedido'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Resumen del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h3>
        <p className="text-muted-foreground">
          Tu pedido #{orderNumber} ha sido procesado exitosamente
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">Entrega estimada</p>
                <p className="text-sm text-muted-foreground">2-3 días hábiles</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-orange-600" />
              <div className="text-left">
                <p className="font-medium">Dirección de entrega</p>
                <p className="text-sm text-muted-foreground">
                  {shippingInfo.address}, {shippingInfo.city}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleOrderComplete} className="w-full" size="lg">
        Continuar Comprando
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'shipping' && 'Información de Envío'}
            {step === 'payment' && 'Finalizar Pedido'}
            {step === 'confirmation' && 'Pedido Confirmado'}
          </DialogTitle>
          <DialogDescription>
            {step === 'shipping' && 'Ingresa la dirección donde quieres recibir tu pedido'}
            {step === 'payment' && 'Selecciona tu método de pago preferido'}
            {step === 'confirmation' && 'Tu pedido ha sido procesado exitosamente'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {step === 'shipping' && renderShippingStep()}
          {step === 'payment' && renderPaymentStep()}
          {step === 'confirmation' && renderConfirmationStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}