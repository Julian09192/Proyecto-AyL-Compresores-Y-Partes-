import React from 'react';
import { Card, CardContent } from './ui/card';
import { 
  Award,
  Users,
  MapPin,
  Clock,
  Target,
  Heart,
  Wrench
} from 'lucide-react';

export function AboutPage() {
  const stats = [
    { icon: Clock, label: 'Años de Experiencia', value: '20+' },
    { icon: Users, label: 'Clientes Satisfechos', value: '5,000+' },
    { icon: Wrench, label: 'Productos en Catálogo', value: '1,200+' },
    { icon: MapPin, label: 'Ciudades de Cobertura', value: '50+' }
  ];

  const values = [
    {
      icon: Award,
      title: 'Calidad',
      description: 'Ofrecemos únicamente productos de la más alta calidad, certificados y garantizados.'
    },
    {
      icon: Heart,
      title: 'Servicio',
      description: 'Nuestro equipo está comprometido con brindar la mejor experiencia a cada cliente.'
    },
    {
      icon: Target,
      title: 'Innovación',
      description: 'Constantemente actualizamos nuestro catálogo con las últimas tecnologías del mercado.'
    }
  ];

  const team = [
    {
      name: 'Liliana Vesga',
      role: 'Directora General',
      description: 'Con más de 15 años en la industria, lidera la visión estratégica de la empresa.'
    },
    {
      name: 'Carlos Mendoza',
      role: 'Jefe de Ventas',
      description: 'Especialista en soluciones industriales con amplia experiencia en el sector.'
    },
    {
      name: 'Ana Rodríguez',
      role: 'Gerente Técnica',
      description: 'Ingeniera mecánica experta en compresores y sistemas neumáticos.'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Acerca de AyL Compresores
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Somos una empresa colombiana especializada en la comercialización de compresores 
            industriales y herramientas neumáticas de la más alta calidad. Desde 2004, 
            hemos sido el aliado confiable de miles de empresas en todo el país.
          </p>
        </section>



        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                AyL Compresores nació en 2004 con la visión de ser el proveedor líder 
                de equipos neumáticos e industriales en Colombia. Iniciamos como una 
                pequeña empresa familiar con el compromiso de ofrecer productos de 
                calidad excepcional.
              </p>
              <p>
                A lo largo de los años, hemos crecido constantemente, expandiendo 
                nuestro catálogo de productos y servicios, siempre manteniendo 
                nuestros valores fundamentales de calidad, servicio y honestidad.
              </p>
              <p>
                Hoy somos reconocidos como uno de los distribuidores más confiables 
                del país, atendiendo desde pequeños talleres hasta grandes industrias, 
                siempre con el mismo compromiso de excelencia.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16 bg-muted/50 rounded-2xl p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-xl text-muted-foreground">
              Los principios que guían cada decisión que tomamos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestro Equipo</h2>
            <p className="text-xl text-muted-foreground">
              Profesionales comprometidos con tu éxito
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Proveer soluciones integrales en equipos neumáticos e industriales 
                de la más alta calidad, acompañando a nuestros clientes en el 
                crecimiento de sus negocios a través de productos confiables, 
                servicio excepcional y soporte técnico especializado.
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-8">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ser la empresa líder en Colombia en la comercialización de 
                compresores y herramientas neumáticas, reconocida por la 
                excelencia en el servicio, la innovación constante y el 
                compromiso con el desarrollo industrial del país.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
