import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  FileText,
  Eye,
  Download,
  CheckCircle2,
  Scale,
  AlertTriangle,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Section - Warm gradient style Brilo */}
        <section className="relative overflow-hidden gradient-hero gradient-mesh py-16 sm:py-20 lg:py-24">
          {/* Decorative warm elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-orange-300/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-accent/40 to-amber-200/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/30 to-amber-100/20 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center">
            {/* Badge cálido */}
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 mb-6 shadow-soft border border-border shine-on-hover">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-base font-semibold text-primary">
                100% gratuito y sin abogado
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] text-balance">
              Reclame la exención de{" "}
              <span className="text-primary">
                contribuciones
              </span>{" "}
              que le corresponde
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Si tiene más de 60 años y paga contribuciones desproporcionadas,
              generamos su recurso de protección en minutos.
            </p>

            {/* Features badges cálidos */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {[
                { icon: Shield, text: "Datos seguros", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: Clock, text: "Solo 5 minutos", color: "text-primary", bg: "bg-orange-50" },
                { icon: FileText, text: "PDF listo", color: "text-secondary", bg: "bg-accent" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 ${item.bg} rounded-full px-5 py-3 shadow-soft hover-lift`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-base font-medium text-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button cálido */}
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="h-16 px-10 text-xl gradient-primary shadow-colored hover:shadow-xl hover:scale-[1.03] transition-all duration-300 pulse-subtle shine-on-hover"
              >
                <Link href="/formulario">
                  Comenzar mi recurso
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Cómo funciona - Cards con estilo Brilo */}
        <section id="como-funciona" className="py-20 bg-white scroll-mt-20 relative overflow-hidden">
          <div className="relative mx-auto max-w-5xl px-4">
            <div className="text-center mb-16">
              <span className="inline-block text-base font-semibold text-primary bg-orange-50 rounded-full px-4 py-1.5 mb-4">
                Proceso simple
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Tres pasos simples
              </h2>
              <p className="text-xl text-muted-foreground">
                Un proceso diseñado para ser fácil y rápido
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 relative">
              {/* Línea conectora cálida (solo desktop) */}
              <div className="hidden sm:block absolute top-[72px] left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-primary via-orange-400 to-secondary" />

              {[
                {
                  step: 1,
                  icon: FileText,
                  title: "Complete el formulario",
                  description:
                    "Ingrese sus datos personales y de la propiedad. Solo lo esencial.",
                  bg: "bg-primary",
                  bgLight: "bg-orange-50",
                },
                {
                  step: 2,
                  icon: Eye,
                  title: "Revise la información",
                  description:
                    "Verifique que todo esté correcto antes de generar el documento.",
                  bg: "bg-orange-500",
                  bgLight: "bg-amber-50",
                },
                {
                  step: 3,
                  icon: Download,
                  title: "Descargue el PDF",
                  description:
                    "Obtenga su recurso listo para imprimir y presentar en la Corte.",
                  bg: "bg-secondary",
                  bgLight: "bg-accent",
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="relative overflow-hidden border border-border shadow-soft hover-lift bg-white"
                >
                  <CardContent className="pt-12 pb-8 px-6 text-center">
                    {/* Step number badge flotante */}
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className={`inline-block ${item.bgLight} rounded-full px-4 py-1 mb-4`}>
                      <span className="text-base font-bold text-foreground">
                        Paso {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quién puede usar el servicio - Modern checklist */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-4xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                ¿Quién puede usar este servicio?
              </h2>
              <p className="text-xl text-muted-foreground">
                Verifique si cumple con los requisitos
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="py-10 px-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Adultos mayores de 60 años",
                    "Propietarios de vivienda",
                    "Con ingresos limitados",
                    "Contribuciones desproporcionadas",
                    "Sin beneficio actual",
                    "O con rebaja insuficiente",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-lg font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Basado en un caso real - Card estilo Brilo */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4">
            <Card className="relative overflow-hidden border-0 bg-secondary text-white shadow-2xl">
              {/* Decorative warm circles */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

              <CardContent className="relative py-14 px-8 sm:px-12">
                <div className="flex flex-col sm:flex-row items-start gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Scale className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-5">
                      <Sparkles className="w-4 h-4 text-orange-300" />
                      <span className="text-base font-semibold">
                        Precedente judicial
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-5">
                      Basado en un caso real ganado
                    </h3>
                    <p className="text-lg text-white/90 mb-4 leading-relaxed">
                      En enero de 2026, la Corte de Apelaciones de Santiago
                      acogió el recurso de Marina Latorre, una escritora de 100
                      años, estableciendo que el cobro de contribuciones sin
                      considerar la capacidad económica del adulto mayor es
                      ilegal y arbitrario.
                    </p>
                    <p className="text-lg text-white/70 leading-relaxed">
                      Este precedente abre la puerta para miles de casos
                      similares en todo Chile.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ resumido - Modern accordion style */}
        <section id="preguntas" className="py-20 bg-gradient-to-b from-slate-50 to-white scroll-mt-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Preguntas frecuentes
              </h2>
              <p className="text-xl text-muted-foreground">
                Las dudas más comunes sobre el servicio
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "¿Es gratis?",
                  a: "Sí, completamente gratis. No hay costos ocultos ni pagos posteriores.",
                },
                {
                  q: "¿Necesito abogado?",
                  a: "No, puede presentar el recurso personalmente. La ley permite comparecer sin patrocinio de abogado en recursos de protección.",
                },
                {
                  q: "¿Dónde lo presento?",
                  a: "En la Corte de Apelaciones de su región. El documento incluirá la dirección exacta según la ubicación de su propiedad.",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-soft hover:shadow-md transition-shadow"
                >
                  <CardContent className="py-6 px-8">
                    <h3 className="text-xl font-bold mb-3">{item.q}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg hover-lift">
                <Link href="/preguntas">
                  Ver todas las preguntas
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Disclaimer legal - Subtle but visible */}
        <section className="py-12 bg-white border-t border-border">
          <div className="mx-auto max-w-4xl px-4">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-2">
                  Aviso legal importante
                </h3>
                <p className="text-base text-amber-700 leading-relaxed">
                  Este servicio genera documentos basados en precedentes
                  judiciales públicos. No constituye asesoría legal profesional
                  ni garantiza resultados. Cada caso es evaluado individualmente
                  por los tribunales. Sus datos se almacenan únicamente en su
                  dispositivo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final - Estilo Brilo cálido */}
        <section className="relative py-24 overflow-hidden gradient-primary">
          {/* Decorative warm elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_50%)]" />
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-400/30 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span className="text-base font-semibold text-white">Comience hoy</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-white/85 mb-10 max-w-xl mx-auto leading-relaxed">
              Genere su recurso de protección en pocos minutos.
              Es gratis y no necesita abogado.
            </p>
            <Button
              asChild
              size="lg"
              className="h-16 px-12 text-xl bg-white text-primary hover:bg-white/95 shadow-2xl hover:scale-[1.03] transition-all duration-300 shine-on-hover"
            >
              <Link href="/formulario">
                Crear mi recurso ahora
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
