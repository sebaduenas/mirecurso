'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useFormularioStore } from '@/lib/store';
import { getCorteByRegion } from '@/data/cortes-apelaciones';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  FileText,
  Printer,
  PenTool,
  FolderOpen,
  Building2,
  Archive,
  HelpCircle,
  RefreshCw,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  MapPin,
  Clock,
  FileCheck,
} from 'lucide-react';

// Importar dinámicamente para evitar SSR issues con @react-pdf/renderer
const PDFDownloadButton = dynamic(
  () => import('@/components/pdf/PDFDownloadButton').then((mod) => mod.PDFDownloadButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="h-16 px-8 text-lg min-w-[280px]">
        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
        Preparando documento...
      </Button>
    ),
  }
);

export default function Paso5Page() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const {
    setCurrentStep,
    isStepAccessible,
    getFormularioCompleto,
    resetFormulario,
  } = useFormularioStore();

  const formulario = getFormularioCompleto();
  const corte = formulario
    ? getCorteByRegion(formulario.datosPropiedad.regionPropiedad)
    : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isStepAccessible(5)) {
      router.replace('/formulario/paso-1');
      return;
    }
    setCurrentStep(5);
  }, [isStepAccessible, router, setCurrentStep]);

  const handleNuevoRecurso = () => {
    if (confirm('¿Está seguro de que desea iniciar un nuevo recurso? Se borrarán todos los datos actuales.')) {
      resetFormulario();
      router.push('/formulario/paso-1');
    }
  };

  if (!formulario || !isClient) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg text-muted-foreground">Preparando su documento...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Encabezado de éxito */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">¡Su recurso está listo!</h1>
        <p className="text-lg text-muted-foreground">
          Descargue el documento PDF y siga las instrucciones para presentarlo
        </p>
      </div>

      {/* Botón de descarga principal */}
      <Card className="mb-6 border-2 border-primary">
        <CardContent className="py-8">
          <div className="flex flex-col items-center text-center">
            {/* Preview visual del PDF */}
            <div className="w-28 h-36 bg-white border-2 border-border rounded-lg mb-6 flex flex-col items-center justify-center shadow-md">
              <FileText className="w-10 h-10 text-red-600 mb-1" />
              <p className="text-[10px] text-muted-foreground font-medium">PDF</p>
              <p className="text-[9px] text-foreground mt-1 px-2 text-center leading-tight">
                Recurso de Protección
              </p>
            </div>

            <p className="text-lg text-muted-foreground mb-6 max-w-md">
              Documento listo para imprimir y presentar en la {corte?.nombre}
            </p>

            <PDFDownloadButton
              datos={formulario}
              filename={`recurso-proteccion-${formulario.datosPersonales.rut.replace(/\./g, '')}.pdf`}
            />

            <p className="text-base text-muted-foreground mt-4">
              El archivo se guardará en su carpeta de descargas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alerta importante */}
      <Alert className="mb-6 bg-amber-50 border-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-base text-amber-800">
          <strong>Importante:</strong> El recurso de protección debe presentarse dentro de 30 días
          desde que ocurrió el acto que afecta sus derechos. No demore en presentarlo.
        </AlertDescription>
      </Alert>

      {/* Pasos siguientes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-primary" />
            Pasos para presentar su recurso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {/* Paso 1 */}
          <div className="flex gap-4 py-5 border-b">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Printer className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Imprima el documento</h3>
              </div>
              <p className="text-base text-muted-foreground">
                Imprima <strong>2 copias</strong> del recurso: una para entregar en la Corte
                y otra para que le devuelvan con el timbre de recepción.
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex gap-4 py-5 border-b">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <PenTool className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Firme el documento</h3>
              </div>
              <p className="text-base text-muted-foreground">
                Busque la línea de firma al final del documento y firme con su nombre completo.
                <strong> Firme las dos copias.</strong>
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex gap-4 py-5 border-b">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Reúna los documentos de respaldo</h3>
              </div>
              <div className="text-base text-muted-foreground">
                <p className="mb-2">Adjunte copias de los siguientes documentos:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Cédula de identidad (por ambos lados)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Certificado de avalúo fiscal (descárguelo en <a href="https://www.sii.cl" target="_blank" rel="noopener noreferrer" className="text-primary underline">sii.cl</a>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Última boleta de contribuciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Liquidación de pensión o comprobante de ingresos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Paso 4 */}
          <div className="flex gap-4 py-5 border-b">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
              4
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Presente en la Corte de Apelaciones</h3>
              </div>
              {corte && (
                <div className="bg-muted rounded-xl p-4 mt-3">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    {corte.nombre}
                  </p>
                  <div className="space-y-2 text-base">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      {corte.direccion}, {corte.ciudad}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      Horario de atención: Lunes a Viernes, 8:00 a 14:00 hrs
                    </p>
                  </div>
                  <p className="text-base text-muted-foreground mt-3 italic">
                    Diríjase a la oficina de partes o mesón de ingreso de causas
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Paso 5 */}
          <div className="flex gap-4 py-5">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold">
              5
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Archive className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Guarde su copia timbrada</h3>
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

      {/* Información adicional */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Qué pasa después?</h3>
              <ul className="space-y-2 text-base text-blue-700">
                <li>• La Corte revisará su recurso y pedirá un informe al SII</li>
                <li>• El SII tiene plazo para responder (generalmente 8 días)</li>
                <li>• La Corte dictará sentencia, que puede tardar algunas semanas</li>
                <li>• Si la Corte acoge su recurso, el SII deberá otorgarle el beneficio</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ayuda */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">¿Tiene dudas?</h3>
          </div>
          <p className="text-base text-muted-foreground mb-4">
            Consulte nuestras preguntas frecuentes para resolver sus inquietudes sobre el proceso.
          </p>
          <Button asChild variant="outline" className="h-12 text-lg">
            <Link href="/preguntas">
              Ver preguntas frecuentes
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Acciones adicionales */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          variant="outline"
          onClick={handleNuevoRecurso}
          className="h-14 px-6 text-lg flex-1"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Generar otro recurso
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-14 px-6 text-lg flex-1"
        >
          <Link href="/">
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
