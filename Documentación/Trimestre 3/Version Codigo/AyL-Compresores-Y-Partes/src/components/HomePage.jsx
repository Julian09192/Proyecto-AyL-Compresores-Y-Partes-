import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  ArrowRight,
  Shield,
  Truck,
  Wrench,
  Star
} from 'lucide-react';


export function HomePage({ onNavigateToProducts }) {
  const features = [
    {
      icon: Shield,
      title: 'Calidad Garantizada',
      description: 'Productos certificados con garantía extendida'
    },
    {
      icon: Truck,
      title: 'Envío Rápido',
      description: 'Entrega en toda Colombia en 24-48 horas'
    },
    {
      icon: Wrench,
      title: 'Soporte Técnico',
      description: 'Asistencia especializada y mantenimiento'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Mendoza',
      company: 'Industrias del Norte',
      rating: 5,
      comment: 'Excelente calidad en compresores industriales. Muy recomendados.'
    },
    {
      name: 'María Rodríguez',
      company: 'Talleres Automotrices MR',
      rating: 5,
      comment: 'Servicio post-venta excepcional. Siempre están disponibles para soporte.'
    },
    {
      name: 'José Pérez',
      company: 'Construcciones JP',
      rating: 5,
      comment: 'Los mejores precios del mercado con productos de primera calidad.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            A&L Compresores y Partes
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Soluciones profesionales en compresores industriales y herramientas neumáticas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onNavigateToProducts} variant="secondary" className="text-lg px-8">
              Ver Productos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              Contactar Ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir A&L Compresores?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Más de 20 años de experiencia en el sector industrial
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros Productos Destacados
            </h2>
            <p className="text-xl text-muted-foreground">
              Compresores y herramientas de la más alta calidad
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Compresores Industriales',
                description: 'Equipos de alta potencia para uso industrial',
                icon: Wrench
              },
              {
                title: 'Herramientas Neumáticas',
                description: 'Pistolas, llaves y equipos profesionales',
                icon: Shield
              },
              {
                title: 'Repuestos y Accesorios',
                description: 'Piezas originales y compatibles',
                icon: Truck
              }
            ].map((product, index) => {
              const Icon = product.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    <Button variant="outline" className="w-full">
                      Ver Más
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center">
            <Button size="lg" onClick={onNavigateToProducts}>
              Ver Todos los Productos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para equipar tu negocio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contáctanos para una cotización personalizada
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 border-white text-black hover:bg-white hover:text-primary">
              Solicitar Cotización
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-black hover:bg-white hover:text-primary">
              Llamar Ahora
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
