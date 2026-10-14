import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

export function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Dirección',
      details: [
        'Calle 67 # 11-50, Bogotá',
        'Zona Industrial',
        'Colombia'
      ]
    },
    {
      icon: Phone,
      title: 'Teléfonos',
      details: [
        '+57 (1) 234-5678',
        '+57 300 123 4567',
        'Línea de Emergencias'
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      details: [
        'ventas@aylcompresores.com',
        'soporte@aylcompresores.com',
        'info@aylcompresores.com'
      ]
    },
    {
      icon: Clock,
      title: 'Horarios',
      details: [
        'Lunes a Viernes: 8:00 AM - 6:00 PM',
        'Sábados: 8:00 AM - 2:00 PM',
        'Domingos: Cerrado'
      ]
    }
  ];

  const officeLocations = [
    {
      city: 'Bogotá',
      address: 'Calle 67 # 11-50',
      phone: '+57 (1) 234-5678',
      manager: 'Liliana Vesga'
    },
    {
      city: 'Medellín',
      address: 'Carrera 50 # 25-30',
      phone: '+57 (4) 345-6789',
      manager: 'Carlos Mendoza'
    },
    {
      city: 'Cali',
      address: 'Avenida 3N # 15-45',
      phone: '+57 (2) 456-7890',
      manager: 'Ana Rodríguez'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      toast.success('Mensaje enviado exitosamente. Te contactaremos pronto.');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contáctanos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Ponte en contacto con nosotros para 
            cotizaciones, soporte técnico o cualquier consulta que tengas.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Envíanos un Mensaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Asunto</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe tu consulta o requerimiento..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-sm text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Office Locations */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestras Oficinas</h2>
            <p className="text-xl text-muted-foreground">
              Encuentra la oficina más cercana a ti
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {officeLocations.map((office, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{office.city}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <span className="text-sm">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">{office.phone}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium">Gerente</p>
                      <p className="text-sm text-muted-foreground">{office.manager}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-muted/50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Ubicación Principal</h2>
            <p className="text-muted-foreground">
              Visítanos en nuestra oficina principal en Bogotá
            </p>
          </div>
          
          <div className="bg-card rounded-lg overflow-hidden">
            <div className="h-[400px] bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">Mapa Interactivo</p>
                <p className="text-muted-foreground">
                  Calle 67 # 11-50, Zona Industrial, Bogotá
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center bg-primary text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas una Cotización?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestro equipo comercial está listo para ayudarte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Solicitar Cotización
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              Llamar Ahora
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
