import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  FileText,
  Eye,
  Download,
  Printer,
  PenTool,
  Building2,
  CheckCircle2,
  Clock,
  FolderOpen,
  Archive,
} from 'lucide-react';

export default function ComoFuncionaPage() {
  return (
    <>
      <Header />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              ¿Cómo funciona mirecurso.cl?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un proceso simple de 3 pasos para generar su recurso de protección,
              más 5 pasos para presentarlo en la Corte.
            </p>
          </div>

          {/* Parte 1: En la plataforma */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">
                Parte 1: En la plataforma (5 minutos)
              </h2>
            </div>

            <div className="space-y-6">
              {/* Paso 1 */}
              <Card>
                <CardContent className="py-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold">
                      1
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-bold">Complete sus datos</h3>
                      </div>
                      <p className="text-lg text-muted-foreground mb-4">
                        Ingrese la información del adulto mayor afectado, los datos de la propiedad
                        y la situación tributaria. El formulario está diseñado para ser fácil de usar,
                        con campos claros y ayuda en cada paso.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-base text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Datos personales y de contacto
                        </li>
                        <li className="flex items-center gap-3 text-base text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Información de la propiedad (dirección, rol SII, avalúo)
                        </li>
                        <li className="flex items-center gap-3 text-base text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Situación de ingresos y contribuciones actuales
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paso 2 */}
              <Card>
                <CardContent className="py-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold">
                      2
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Eye className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-bold">Revise la información</h3>
                      </div>
                      <p className="text-lg text-muted-foreground mb-4">
                        Antes de generar el documento, podrá revisar todos los datos ingresados
                        en una pantalla de resumen. Si algo no está correcto, puede volver atrás
                        y editarlo fácilmente.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-base text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Resumen completo de toda la información
                        </li>
                        <li className="flex items-center gap-3 text-base text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Botones para editar cada sección si es necesario
                        </li>
                        <li className="flex items-center gap-3 text-base text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Confirmación antes de generar el documento
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paso 3 */}
              <Card>
                <CardContent className="py-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold">
                      3
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Download className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-bold">Descargue su recurso</h3>
                      </div>
                      <p className="text-lg text-muted-foreground mb-4">
                        Se genera automáticamente un documento PDF profesional con todos sus datos,
                        listo para imprimir y presentar. El documento incluye el formato legal
                        correcto y cita el precedente judicial del caso Marina Latorre.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-base text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Documento en formato PDF profesional
                        </li>
                        <li className="flex items-center gap-3 text-base text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Formato legal correcto para la Corte
                        </li>
                        <li className="flex items-center gap-3 text-base text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          Incluye dirección de la Corte correspondiente
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Parte 2: Presentación */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">
                Parte 2: Presentación del recurso
              </h2>
            </div>

            <div className="space-y-4">
              {/* Paso 1: Imprimir */}
              <Card className="bg-slate-50">
                <CardContent className="py-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Printer className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">Imprima el documento</h3>
                      </div>
                      <p className="text-base text-muted-foreground">
                        Necesita <strong>2 copias</strong>: una para entregar en la Corte
                        y otra para que le devuelvan con el timbre de recepción.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paso 2: Firmar */}
              <Card className="bg-slate-50">
                <CardContent className="py-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <PenTool className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">Firme el documento</h3>
                      </div>
                      <p className="text-base text-muted-foreground">
                        Busque la línea de firma al final del documento y firme con su nombre completo.
                        <strong> Firme las dos copias.</strong>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paso 3: Documentos */}
              <Card className="bg-slate-50">
                <CardContent className="py-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FolderOpen className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">Reúna los documentos de respaldo</h3>
                      </div>
                      <ul className="text-base text-muted-foreground space-y-1 mt-2">
                        <li>• Copia de su cédula de identidad (por ambos lados)</li>
                        <li>• Certificado de avalúo fiscal (puede obtenerlo en sii.cl)</li>
                        <li>• Copia de boleta de contribuciones</li>
                        <li>• Liquidación de pensión o certificado de ingresos</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paso 4: Presentar */}
              <Card className="bg-slate-50">
                <CardContent className="py-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">Presente en la Corte de Apelaciones</h3>
                      </div>
                      <p className="text-base text-muted-foreground">
                        Lleve el documento y los anexos a la Corte de Apelaciones de su región.
                        El documento generado incluirá la dirección exacta de la Corte correspondiente.
                      </p>
                      <p className="text-base text-muted-foreground mt-2">
                        <strong>Horario:</strong> Lunes a Viernes, 8:00 a 14:00 hrs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paso 5: Guardar */}
              <Card className="bg-slate-50">
                <CardContent className="py-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                      5
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Archive className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">Guarde su copia timbrada</h3>
                      </div>
                      <p className="text-base text-muted-foreground">
                        La Corte le devolverá una copia con el timbre de recepción y un número de ingreso.
                        <strong> Guárdela como comprobante</strong>, ya que con ese número podrá consultar
                        el estado de su recurso.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Información adicional */}
          <Card className="mb-12 bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold text-blue-800 mb-4">¿Qué pasa después?</h3>
              <ul className="space-y-3 text-lg text-blue-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  La Corte revisará su recurso y pedirá un informe al SII
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  El SII tiene plazo para responder (generalmente 8 días)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  La Corte dictará sentencia, que puede tardar algunas semanas
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  Si la Corte acoge su recurso, el SII deberá otorgarle el beneficio
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center bg-slate-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h3>
            <p className="text-lg text-muted-foreground mb-6">
              El proceso toma solo unos minutos y es completamente gratuito
            </p>
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link href="/formulario">
                Comenzar mi recurso
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
