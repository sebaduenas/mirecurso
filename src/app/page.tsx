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
        {/* Hero Section - Modern gradient with floating elements */}
        <section className="relative overflow-hidden gradient-hero py-12 sm:py-16">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-soft">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-base font-medium text-primary">
                100% gratuito y sin abogado
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
              Reclame la exención de{" "}
              <span className="text-primary">contribuciones</span>{" "}
              que le corresponde
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Si tiene más de 60 años y paga contribuciones desproporcionadas,
              generamos su recurso de protección en minutos.
            </p>

            {/* Features badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: Shield, text: "Datos seguros" },
                { icon: Clock, text: "Solo 5 minutos" },
                { icon: FileText, text: "PDF listo" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white rounded-full px-5 py-3 shadow-soft"
                >
                  <item.icon className="w-5 h-5 text-secondary" />
                  <span className="text-base font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-lg gradient-primary shadow-glow hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <Link href="/formulario">
                  Comenzar mi recurso
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <p className="mt-3 text-base text-muted-foreground">
                Sin registro ni tarjeta de crédito
              </p>
            </div>
          </div>
        </section>

        {/* Cómo funciona - Modern cards */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Tres pasos simples
              </h2>
              <p className="text-xl text-muted-foreground">
                Un proceso diseñado para ser fácil y rápido
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  icon: FileText,
                  title: "Complete el formulario",
                  description:
                    "Ingrese sus datos personales y de la propiedad. Solo lo esencial.",
                  color: "bg-blue-500",
                },
                {
                  step: 2,
                  icon: Eye,
                  title: "Revise la información",
                  description:
                    "Verifique que todo esté correcto antes de generar el documento.",
                  color: "bg-indigo-500",
                },
                {
                  step: 3,
                  icon: Download,
                  title: "Descargue el PDF",
                  description:
                    "Obtenga su recurso listo para imprimir y presentar en la Corte.",
                  color: "bg-emerald-500",
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="relative overflow-hidden border-0 shadow-soft hover-lift"
                >
                  <CardContent className="pt-10 pb-8 px-6">
                    {/* Step number badge */}
                    <div
                      className={`absolute -top-4 -right-4 w-20 h-20 ${item.color} rounded-full opacity-10`}
                    />
                    <div
                      className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-base font-semibold text-muted-foreground mb-2">
                      Paso {item.step}
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

        {/* Basado en un caso real - Highlighted card */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <CardContent className="relative py-12 px-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Scale className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="inline-block bg-white/20 rounded-full px-4 py-1 mb-4">
                      <span className="text-base font-medium">
                        Precedente judicial
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      Basado en un caso real ganado
                    </h3>
                    <p className="text-lg text-blue-100 mb-4 leading-relaxed">
                      En enero de 2026, la Corte de Apelaciones de Santiago
                      acogió el recurso de Marina Latorre, una escritora de 100
                      años, estableciendo que el cobro de contribuciones sin
                      considerar la capacidad económica del adulto mayor es
                      ilegal y arbitrario.
                    </p>
                    <p className="text-lg text-blue-100 leading-relaxed">
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
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
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

        {/* CTA Final - Gradient with glow */}
        <section className="relative py-20 overflow-hidden gradient-primary">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
              Genere su recurso de protección en pocos minutos.
              Es gratis y no necesita abogado.
            </p>
            <Button
              asChild
              size="lg"
              className="h-16 px-10 text-xl bg-white text-primary hover:bg-blue-50 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
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
