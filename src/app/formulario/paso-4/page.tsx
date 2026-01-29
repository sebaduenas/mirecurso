'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormularioStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FieldWithHelp } from '@/components/formulario/FieldWithHelp';
import { CurrencyInput } from '@/components/formulario/CurrencyInput';
import { ArrowLeft, ArrowRight, Info, Plus, Trash2, Receipt } from 'lucide-react';
import { TEXTOS_AYUDA } from '@/data/datos-fijos';

const giroSchema = z.object({
  numeroGiro: z.string().min(1, 'Ingrese el número de giro'),
  fechaGiro: z.string().min(1, 'Ingrese la fecha del giro'),
  monto: z.number({ message: 'Ingrese el monto' }).min(1, 'Ingrese el monto del giro'),
});

const paso4Schema = z.object({
  montoContribucionTrimestral: z
    .number({ message: 'Ingrese el monto de la contribución' })
    .min(1, 'Ingrese el monto de la contribución trimestral'),
  tieneGirosPendientes: z.boolean(),
  giros: z.array(giroSchema),
});

type Paso4Form = z.infer<typeof paso4Schema>;

export default function Paso4Page() {
  const router = useRouter();
  const {
    datosContribuciones,
    datosEconomicos,
    setDatosContribuciones,
    setCurrentStep,
    markStepComplete,
    isStepAccessible,
  } = useFormularioStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Paso4Form>({
    resolver: zodResolver(paso4Schema),
    defaultValues: {
      montoContribucionTrimestral: datosContribuciones.montoContribucionTrimestral ?? undefined,
      tieneGirosPendientes: datosContribuciones.tieneGirosPendientes ?? false,
      giros: datosContribuciones.giros ?? [],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'giros',
  });

  const watchedValues = watch();
  const tieneGiros = watchedValues.tieneGirosPendientes;

  // Cálculos para mostrar información útil
  const contribucionAnual = (watchedValues.montoContribucionTrimestral || 0) * 4;
  const ingresoAnual = (datosEconomicos.ingresoMensual || 0) * 12;
  const porcentajeIngresos = ingresoAnual > 0 ? (contribucionAnual / ingresoAnual) * 100 : 0;

  useEffect(() => {
    if (!isStepAccessible(4)) {
      router.replace('/formulario/paso-3');
      return;
    }
    setCurrentStep(4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: Paso4Form) => {
    setDatosContribuciones(data);
    markStepComplete(4);
    router.push('/formulario/paso-5');
  };

  const handleAddGiro = () => {
    append({ numeroGiro: '', fechaGiro: '', monto: 0 });
  };

  const formatearPesos = (valor: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-base text-muted-foreground mb-2">
          <span>Paso 4 de 7: Contribuciones</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Monto de las contribuciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground mb-4">
            Ingrese el monto que paga actualmente por contribuciones
          </p>

          <FieldWithHelp
            label="Contribución trimestral (en pesos)"
            htmlFor="montoContribucionTrimestral"
            error={errors.montoContribucionTrimestral?.message}
            helpText="Este monto aparece en su boleta de contribuciones o en sii.cl"
            required
          >
            <CurrencyInput
              id="montoContribucionTrimestral"
              value={watchedValues.montoContribucionTrimestral}
              onChange={(value) => setValue('montoContribucionTrimestral', value as number)}
              error={errors.montoContribucionTrimestral?.message}
              placeholder="150.000"
            />
          </FieldWithHelp>

          {/* Resumen calculado */}
          {watchedValues.montoContribucionTrimestral && watchedValues.montoContribucionTrimestral > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 p-5 bg-muted/50 rounded-xl">
              <div>
                <p className="text-base text-muted-foreground">Contribución anual</p>
                <p className="text-xl font-semibold">{formatearPesos(contribucionAnual)}</p>
              </div>
              {ingresoAnual > 0 && (
                <div>
                  <p className="text-base text-muted-foreground">Porcentaje de sus ingresos</p>
                  <p className={`text-xl font-semibold ${porcentajeIngresos > 10 ? 'text-amber-600' : 'text-foreground'}`}>
                    {porcentajeIngresos.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          )}

          {porcentajeIngresos > 10 && (
            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-base text-amber-800">
                Las contribuciones representan más del 10% de sus ingresos, lo que puede considerarse
                desproporcionado. Este argumento fortalece su recurso.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Giros pendientes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Giros a impugnar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground mb-4">
            Si tiene boletas de contribuciones específicas que quiere impugnar, puede agregarlas aquí
          </p>

          <div className="flex items-start space-x-4 p-5 border-2 rounded-xl bg-muted/30">
            <Checkbox
              id="tieneGirosPendientes"
              checked={watchedValues.tieneGirosPendientes}
              onCheckedChange={(checked) => setValue('tieneGirosPendientes', checked as boolean)}
              className="w-6 h-6 mt-1"
            />
            <div>
              <Label htmlFor="tieneGirosPendientes" className="cursor-pointer text-lg font-medium">
                Tengo giros específicos que quiero impugnar
              </Label>
              <p className="text-base text-muted-foreground mt-1">
                Por ejemplo, boletas de contribuciones recientes que no debería haber pagado
              </p>
            </div>
          </div>

          {tieneGiros && (
            <>
              <Alert>
                <Info className="h-5 w-5" />
                <AlertDescription className="text-base">
                  {TEXTOS_AYUDA.giros}
                </AlertDescription>
              </Alert>

              {/* Lista de giros */}
              {fields.length > 0 && (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-xl bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-primary" />
                          <span className="font-medium">Giro {index + 1}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`giros.${index}.numeroGiro`}>Número de giro</Label>
                          <Input
                            id={`giros.${index}.numeroGiro`}
                            {...register(`giros.${index}.numeroGiro`)}
                            placeholder="Ej: 123456"
                            className="h-12"
                          />
                          {errors.giros?.[index]?.numeroGiro && (
                            <p className="text-sm text-red-600">
                              {errors.giros[index]?.numeroGiro?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`giros.${index}.fechaGiro`}>Fecha del giro</Label>
                          <Input
                            id={`giros.${index}.fechaGiro`}
                            type="date"
                            {...register(`giros.${index}.fechaGiro`)}
                            className="h-12"
                          />
                          {errors.giros?.[index]?.fechaGiro && (
                            <p className="text-sm text-red-600">
                              {errors.giros[index]?.fechaGiro?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`giros.${index}.monto`}>Monto</Label>
                          <CurrencyInput
                            id={`giros.${index}.monto`}
                            value={watchedValues.giros?.[index]?.monto}
                            onChange={(value) => setValue(`giros.${index}.monto`, value as number)}
                            error={errors.giros?.[index]?.monto?.message}
                            placeholder="150.000"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddGiro}
                className="w-full h-14 text-lg border-dashed"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar giro
              </Button>

              {tieneGiros && fields.length === 0 && (
                <p className="text-base text-amber-600 text-center">
                  Agregue al menos un giro para impugnar
                </p>
              )}
            </>
          )}

          {!tieneGiros && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-base text-blue-800">
                Si no agrega giros específicos, el recurso solicitará que se le aplique el beneficio
                de la Ley 20.732 para todas las contribuciones futuras.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/formulario/paso-3')}
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
