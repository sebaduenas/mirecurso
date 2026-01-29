'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormularioStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FieldWithHelp } from '@/components/formulario/FieldWithHelp';
import { ArrowLeft, ArrowRight, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TEXTOS_AYUDA, diasDesde, dentroDelPlazo30Dias } from '@/data/datos-fijos';

const paso5Schema = z.object({
  presentoSolicitudSII: z.boolean(),
  fechaSolicitud: z.string().optional(),
  recibioDenegatoria: z.boolean(),
  numeroResolucion: z.string().optional(),
  fechaResolucion: z.string().optional(),
});

type Paso5Form = z.infer<typeof paso5Schema>;

export default function Paso5Page() {
  const router = useRouter();
  const {
    procedimientoPrevio,
    setProcedimientoPrevio,
    setCurrentStep,
    markStepComplete,
    isStepAccessible,
  } = useFormularioStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Paso5Form>({
    resolver: zodResolver(paso5Schema),
    defaultValues: {
      presentoSolicitudSII: procedimientoPrevio.presentoSolicitudSII ?? false,
      fechaSolicitud: procedimientoPrevio.fechaSolicitud ?? '',
      recibioDenegatoria: procedimientoPrevio.recibioDenegatoria ?? false,
      numeroResolucion: procedimientoPrevio.numeroResolucion ?? '',
      fechaResolucion: procedimientoPrevio.fechaResolucion ?? '',
    },
    mode: 'onBlur',
  });

  const watchedValues = watch();
  const presentoSolicitud = watchedValues.presentoSolicitudSII;
  const recibioDenegatoria = watchedValues.recibioDenegatoria;

  // Verificar si está dentro del plazo de 30 días
  const estaDentroDelPlazo = watchedValues.fechaResolucion
    ? dentroDelPlazo30Dias(watchedValues.fechaResolucion)
    : true;

  const diasDesdeDenegatoria = watchedValues.fechaResolucion
    ? diasDesde(watchedValues.fechaResolucion)
    : 0;

  useEffect(() => {
    if (!isStepAccessible(5)) {
      router.replace('/formulario/paso-4');
      return;
    }
    setCurrentStep(5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: Paso5Form) => {
    setProcedimientoPrevio(data);
    markStepComplete(5);
    router.push('/formulario/paso-6');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-base text-muted-foreground mb-2">
          <span>Paso 5 de 7: Procedimiento previo</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Solicitud previa al SII</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground mb-4">
            Indique si ya presentó una solicitud de beneficio ante el SII
          </p>

          <div className="space-y-4">
            <Label className="text-lg font-medium">
              ¿Presentó una solicitud de beneficio al SII?
            </Label>
            <RadioGroup
              value={presentoSolicitud ? 'si' : 'no'}
              onValueChange={(value) => setValue('presentoSolicitudSII', value === 'si')}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="si" id="solicitud-si" className="w-5 h-5" />
                <Label htmlFor="solicitud-si" className="cursor-pointer text-lg flex-1">
                  Sí, presenté una solicitud
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="no" id="solicitud-no" className="w-5 h-5" />
                <Label htmlFor="solicitud-no" className="cursor-pointer text-lg flex-1">
                  No, no he presentado solicitud
                </Label>
              </div>
            </RadioGroup>
          </div>

          {presentoSolicitud && (
            <FieldWithHelp
              label="Fecha aproximada de la solicitud"
              htmlFor="fechaSolicitud"
              error={errors.fechaSolicitud?.message}
            >
              <Input
                id="fechaSolicitud"
                type="date"
                {...register('fechaSolicitud')}
                className="h-14 text-lg"
              />
            </FieldWithHelp>
          )}

          {!presentoSolicitud && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-base text-blue-800">
                No es obligatorio haber presentado una solicitud previa al SII para interponer el
                recurso de protección. Puede presentar el recurso directamente.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {presentoSolicitud && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Resolución del SII</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground mb-4">
              Indique si recibió una resolución denegatoria del SII
            </p>

            <div className="space-y-4">
              <Label className="text-lg font-medium">
                ¿Recibió una resolución denegatoria?
              </Label>
              <RadioGroup
                value={recibioDenegatoria ? 'si' : 'no'}
                onValueChange={(value) => setValue('recibioDenegatoria', value === 'si')}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="si" id="denegatoria-si" className="w-5 h-5" />
                  <Label htmlFor="denegatoria-si" className="cursor-pointer text-lg flex-1">
                    Sí, mi solicitud fue rechazada
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="no" id="denegatoria-no" className="w-5 h-5" />
                  <Label htmlFor="denegatoria-no" className="cursor-pointer text-lg flex-1">
                    No, aún no recibo respuesta
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {recibioDenegatoria && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FieldWithHelp
                    label="Número de resolución"
                    htmlFor="numeroResolucion"
                    error={errors.numeroResolucion?.message}
                    example="Ej: RES. EX. 123"
                  >
                    <Input
                      id="numeroResolucion"
                      {...register('numeroResolucion')}
                      placeholder="Número de la resolución"
                      className="h-14 text-lg"
                    />
                  </FieldWithHelp>

                  <FieldWithHelp
                    label="Fecha de la resolución"
                    htmlFor="fechaResolucion"
                    error={errors.fechaResolucion?.message}
                  >
                    <Input
                      id="fechaResolucion"
                      type="date"
                      {...register('fechaResolucion')}
                      className="h-14 text-lg"
                    />
                  </FieldWithHelp>
                </div>

                {watchedValues.fechaResolucion && (
                  <>
                    {estaDentroDelPlazo ? (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <AlertDescription className="text-base text-green-800">
                          <strong>Dentro del plazo.</strong> Han transcurrido {diasDesdeDenegatoria} días
                          desde la resolución. El recurso de protección debe presentarse dentro de 30 días.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <AlertDescription className="text-base text-amber-800">
                          <strong>Atención:</strong> Han transcurrido {diasDesdeDenegatoria} días desde la
                          resolución (más de 30 días). Sin embargo, el recurso puede aún ser procedente si
                          el agravio es permanente (el cobro de contribuciones continúa).
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </>
            )}

            {!recibioDenegatoria && (
              <Alert>
                <Info className="h-5 w-5" />
                <AlertDescription className="text-base">
                  Si aún no ha recibido respuesta del SII, puede presentar el recurso de protección
                  igualmente, especialmente si ha transcurrido un tiempo razonable desde su solicitud.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Información sobre el plazo */}
      <Card className="mb-6 bg-muted/30">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Sobre el plazo del recurso</h3>
              <p className="text-base text-muted-foreground">
                {TEXTOS_AYUDA.plazo30Dias}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/formulario/paso-4')}
          className="h-14 px-6 text-lg min-w-[140px]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Anterior
        </Button>

        <Button
          type="submit"
          className="h-14 px-8 text-lg min-w-[160px]"
        >
          Siguiente paso
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}
