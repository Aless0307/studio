import type { FC } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Building, Heart, Mail, Target, Users, Zap, Code, GraduationCap, User } from 'lucide-react';
import Image from 'next/image';

const AboutPage: FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-black/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 lg:py-12">
         <div className="mb-6 flex items-center justify-between">
             <h1 className="text-3xl font-bold text-primary">Acerca de Food Link</h1>
              <Link href="/" passHref>
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-1.5 h-4 w-4"/> Volver al Inicio
                 </Button>
             </Link>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Nuestra Misión */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
                <Target className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-xl font-semibold">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Conectar de manera eficiente y transparente los excedentes de alimentos de empresas con organizaciones benéficas verificadas, reduciendo el desperdicio y combatiendo el hambre en nuestras comunidades.
              </p>
            </CardContent>
          </Card>

          {/* Nuestra Visión */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
                <Zap className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-xl font-semibold">Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ser la plataforma líder en la gestión de donaciones de alimentos, creando un futuro donde ningún alimento apto para el consumo se desperdicie y todas las personas tengan acceso a comida nutritiva.
              </p>
            </CardContent>
          </Card>

          {/* Nuestros Valores */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
                <Heart className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-xl font-semibold">Nuestros Valores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p><strong className="text-foreground">Impacto:</strong> Maximizamos la redistribución de alimentos.</p>
              <p><strong className="text-foreground">Confianza:</strong> Construimos relaciones transparentes.</p>
              <p><strong className="text-foreground">Eficiencia:</strong> Simplificamos el proceso de donación.</p>
              <p><strong className="text-foreground">Comunidad:</strong> Fortalecemos el tejido social.</p>
              <p><strong className="text-foreground">Sostenibilidad:</strong> Reducimos el desperdicio alimentario.</p>
            </CardContent>
          </Card>

          {/* Sobre Food Link */}
          <Card className="md:col-span-2 lg:col-span-3 shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2"><Building className="h-6 w-6 text-primary"/>¿Qué es Food Link?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Food Link nació de la necesidad de crear un puente directo y eficaz entre las empresas con excedentes de alimentos (restaurantes, supermercados, productores, distribuidores) y las organizaciones sin fines de lucro que trabajan incansablemente para alimentar a personas en situación de vulnerabilidad.
              </p>
              <p>
                Nuestra plataforma tecnológica facilita el proceso de publicación, reclamación y seguimiento de donaciones, asegurando que los alimentos lleguen a quienes más los necesitan de forma rápida y segura. Creemos en el poder de la tecnología para resolver problemas sociales complejos y estamos comprometidos con la lucha contra el desperdicio de alimentos y la inseguridad alimentaria.
              </p>
              <p>
                Fomentamos tanto las donaciones gratuitas como las ofertas con precios simbólicos para cubrir costos operativos mínimos, permitiendo a las empresas recuperar parte de su inversión mientras apoyan una causa noble.
              </p>
            </CardContent>
          </Card>

          {/* Creador del Proyecto - NUEVA SECCIÓN */}
          <Card className="lg:col-span-3 shadow-lg overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/10 dark:from-primary/10 dark:via-background/80 dark:to-secondary/20">
            <CardHeader className="pb-2 border-b border-primary/10">
              <CardTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
                <Code className="h-6 w-6"/> Creador del Proyecto
              </CardTitle>
              <CardDescription className="text-muted-foreground/80 italic">
                "Tecnología con propósito social"
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
                <div className="w-40 h-40 rounded-full overflow-hidden relative bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-lg border-2 border-primary/20">
                  <User className="h-24 w-24 text-primary/40" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-1 text-center lg:text-left">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Alessandro Atilano Hernandez</h3>
                    <p className="text-lg font-medium flex items-center justify-center lg:justify-start gap-1.5">
                      <GraduationCap className="h-5 w-5 text-accent" />
                      Estudiante de Ingeniería Informática
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                    <div className="bg-card rounded-lg p-3 shadow-sm border border-border/50">
                      <p className="text-sm font-medium text-muted-foreground">Universidad</p>
                      <p className="font-medium">Universidad Veracruzana</p>
                      <p className="text-sm text-muted-foreground">Veracruz, Veracruz</p>
                    </div>
                    <div className="bg-card rounded-lg p-3 shadow-sm border border-border/50">
                      <p className="text-sm font-medium text-muted-foreground">Información personal</p>
                      <p className="font-medium">21 años</p>
                      <p className="text-sm font-mono text-accent">Matrícula: S21002441</p>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/20 dark:bg-secondary/10 rounded-lg p-4 border border-border/50">
                    <p className="italic text-muted-foreground">
                      "Food Link representa mi visión de cómo la tecnología puede conectar necesidades sociales con recursos disponibles, 
                      creando un impacto positivo en nuestra comunidad mientras combatimos el desperdicio alimentario."
                    </p>
                    <p className="text-right mt-2 font-medium">- Alessandro Atilano</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="lg:col-span-3 shadow-lg border-border/50 bg-gradient-to-r from-card via-secondary/10 to-card dark:from-card dark:via-black/10 dark:to-card">
            <CardHeader>
               <CardTitle className="text-2xl font-semibold flex items-center gap-2"><Mail className="h-6 w-6 text-primary"/>Contacto</CardTitle>
               <CardDescription>¿Tienes preguntas, sugerencias o quieres colaborar? ¡Contáctanos!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                    Para consultas generales, soporte técnico o información sobre alianzas:
                </p>
                <p className="font-semibold text-primary text-lg">
                    <a href="mailto:info@foodlink.org.sim" className="hover:underline">
                        info@foodlink.org.sim
                    </a>
                </p>
                 <p className="text-muted-foreground">
                    Para temas relacionados con donaciones monetarias o patrocinios:
                 </p>
                 <p className="font-semibold text-primary text-lg">
                    <a href="mailto:donaciones@foodlink.org.sim" className="hover:underline">
                        donaciones@foodlink.org.sim
                    </a>
                 </p>
                <p className="text-sm text-muted-foreground/80 pt-2">
                    (Recuerda que estos son correos de simulación. En un entorno real, aquí encontrarías información de contacto válida.)
                </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-card mt-12">
        © {new Date().getFullYear()} Food Link. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default AboutPage;
