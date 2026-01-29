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
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight text-balance">
              Reclame la exención de contribuciones que le corresponde
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Si tiene más de 60 años y paga contribuciones desproporcionadas,
              podemos ayudarle a presentar un recurso de protección.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-left">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>Gratis</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>Sin necesidad de abogado</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>Documento listo para presentar</span>
              </div>
            </div>

            <div className="mt-10">
              <Button asChild size="lg" className="h-14 px-8 text-lg">
                <Link href="/formulario">
                  Comenzar mi recurso
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Cómo funciona - 3 pasos */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-12">
              ¿Cómo funciona?
            </h2>

            <div className="grid sm:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Paso 1</h3>
                  <p className="text-muted-foreground">
                    Complete sus datos personales y de la propiedad
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Paso 2</h3>
                  <p className="text-muted-foreground">
                    Revise que toda la información esté correcta
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Paso 3</h3>
                  <p className="text-muted-foreground">
                    Descargue su recurso en PDF listo para presentar
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quién puede usar el servicio */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
              ¿Quién puede usar este servicio?
            </h2>

            <Card>
              <CardContent className="py-8">
                <ul className="space-y-4">
                  {[
                    "Adultos mayores de 60 años",
                    "Propietarios de vivienda",
                    "Con ingresos limitados (pensiones u otros)",
                    "Que pagan contribuciones desproporcionadas",
                    "Sin beneficio actual o con rebaja insuficiente",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Basado en un caso real */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-8">
                <div className="flex items-start gap-4">
                  <Scale className="w-10 h-10 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Basado en un caso real
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      En enero de 2026, la Corte de Apelaciones de Santiago
                      acogió el recurso de Marina Latorre, una escritora de 100
                      años, estableciendo que el cobro de contribuciones sin
                      considerar la capacidad económica del adulto mayor es
                      ilegal y arbitrario.
                    </p>
                    <p className="text-muted-foreground">
                      Este precedente abre la puerta para miles de casos
                      similares.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ resumido */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
              Preguntas frecuentes
            </h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="py-6">
                  <h3 className="font-semibold mb-2">¿Es gratis?</h3>
                  <p className="text-muted-foreground">
                    Sí, completamente gratis. No hay costos ocultos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <h3 className="font-semibold mb-2">¿Necesito abogado?</h3>
                  <p className="text-muted-foreground">
                    No, puede presentar el recurso personalmente. La ley permite
                    comparecer sin patrocinio de abogado en recursos de
                    protección.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <h3 className="font-semibold mb-2">¿Dónde lo presento?</h3>
                  <p className="text-muted-foreground">
                    En la Corte de Apelaciones de su región. El documento
                    incluirá la dirección exacta según la ubicación de su
                    propiedad.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/preguntas">
                  Ver todas las preguntas frecuentes
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Disclaimer legal */}
        <section className="py-12 bg-white border-t border-border">
          <div className="mx-auto max-w-4xl px-4">
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-amber-800 mb-3">
                      Aviso legal importante
                    </h3>
                    <ul className="space-y-2 text-lg text-amber-700">
                      <li>
                        • Este servicio genera documentos basados en precedentes judiciales públicos.
                      </li>
                      <li>
                        • <strong>No constituye asesoría legal profesional</strong> ni reemplaza la consulta con un abogado.
                      </li>
                      <li>
                        • No garantizamos resultados. Cada caso es evaluado individualmente por los tribunales.
                      </li>
                      <li>
                        • Sus datos se almacenan únicamente en su dispositivo y no se envían a servidores externos.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-primary">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg"
            >
              <Link href="/formulario">
                Crear mi recurso ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
