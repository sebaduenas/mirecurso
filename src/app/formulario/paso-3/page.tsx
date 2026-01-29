'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormularioStore } from '@/lib/store';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FieldWithHelp } from '@/components/formulario/FieldWithHelp';
import { CurrencyInput } from '@/components/formulario/CurrencyInput';
import { ArrowLeft, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Sub-pasos del paso 3
const SUB_PASOS = [
  { id: 1, title: 'Ingresos mensuales', fields: ['ingresoMensual', 'fuenteIngresos'] },
  { id: 2, title: 'Otras propiedades', fields: ['tieneOtrasPropiedades'] },
  { id: 3, title: 'Beneficios actuales', fields: ['tieneBeneficioActual', 'tipoBeneficioActual'] },
  { id: 4, title: 'Monto de contribuciones', fields: ['montoContribucionTrimestral'] },
];

const paso3Schema = z.object({
  ingresoMensual: z
    .number({ error: 'Ingrese su ingreso mensual' })
    .min(0, 'El ingreso no puede ser negativo'),
  fuenteIngresos: z.enum(['pension', 'arriendos', 'otros', 'mixto']),
  tieneOtrasPropiedades: z.boolean(),
  tieneBeneficioActual: z.boolean(),
  tipoBeneficioActual: z.string().optional(),
  montoContribucionTrimestral: z
    .number({ error: 'Ingrese el monto de contribuciones' })
    .min(0, 'El monto no puede ser negativo'),
});

type Paso3Form = z.infer<typeof paso3Schema>;

function formatearPesos(valor: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
}

export default function Paso3Page() {
  const router = useRouter();
  const [subPaso, setSubPaso] = useState(1);
  const {
    datosTributarios,
    setDatosTributarios,
    setCurrentStep,
    markStepComplete,
    isStepAccessible,
  } = useFormularioStore();

  const {
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Paso3Form>({
    resolver: zodResolver(paso3Schema),
    defaultValues: {
      ingresoMensual: datosTributarios.ingresoMensual ?? undefined,
      fuenteIngresos: datosTributarios.fuenteIngresos ?? 'pension',
      tieneOtrasPropiedades: datosTributarios.tieneOtrasPropiedades ?? false,
      tieneBeneficioActual: datosTributarios.tieneBeneficioActual ?? false,
      tipoBeneficioActual: datosTributarios.tipoBeneficioActual ?? '',
      montoContribucionTrimestral: datosTributarios.montoContribucionTrimestral ?? undefined,
    },
    mode: 'onBlur',
  });

  const watchedValues = watch();

  useEffect(() => {
    if (!isStepAccessible(3)) {
      router.replace('/formulario/paso-1');
      return;
    }
    setCurrentStep(3);
  }, [isStepAccessible, router, setCurrentStep]);

  useEffect(() => {
    setDatosTributarios(watchedValues);
  }, [watchedValues, setDatosTributarios]);

  // Cálculos automáticos
  const ingresoAnual = (watchedValues.ingresoMensual || 0) * 12;
  const contribucionAnual = (watchedValues.montoContribucionTrimestral || 0) * 4;
  const porcentajeIngresos = ingresoAnual > 0
    ? (contribucionAnual / ingresoAnual) * 100
    : 0;
  const contribucionMensual = (watchedValues.montoContribucionTrimestral || 0) / 3;

  // Determinar si el caso es favorable (contribuciones > 25% de ingresos es un caso fuerte)
  const casoFavorable = porcentajeIngresos >= 25;

  // Validar campos del sub-paso actual
  const validateCurrentSubPaso = async (): Promise<boolean> => {
    if (subPaso === 1) {
      return await trigger(['ingresoMensual', 'fuenteIngresos']);
    }
    if (subPaso === 2) {
      return await trigger(['tieneOtrasPropiedades']);
    }
    if (subPaso === 3) {
      return true; // Beneficio actual es opcional
    }
    if (subPaso === 4) {
      return await trigger(['montoContribucionTrimestral']);
    }
    return true;
  };

  const handleNextSubPaso = async () => {
    const isValid = await validateCurrentSubPaso();
    if (isValid) {
      if (subPaso < SUB_PASOS.length) {
        setSubPaso(subPaso + 1);
      }
    }
  };

  const handlePrevSubPaso = () => {
    if (subPaso > 1) {
      setSubPaso(subPaso - 1);
    } else {
      router.push('/formulario/paso-2');
    }
  };

  const onSubmit = (data: Paso3Form) => {
    setDatosTributarios({
      ...data,
      ingresoAnual: data.ingresoMensual * 12,
    });
    markStepComplete(3);
    router.push('/formulario/paso-4');
  };

  const handleFinalSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      handleSubmit(onSubmit)();
    }
  };

  const currentSubPaso = SUB_PASOS[subPaso - 1];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Indicador de sub-paso */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-base text-muted-foreground mb-2">
          <span>Paso 3 de 5: Situación tributaria</span>
          <span>{subPaso} de {SUB_PASOS.length}</span>
        </div>
        <div className="flex gap-1">
          {SUB_PASOS.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index + 1 <= subPaso ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{currentSubPaso.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sub-paso 1: Ingresos mensuales */}
          {subPaso === 1 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Información sobre sus ingresos actuales
              </p>

              <FieldWithHelp
                label="Ingreso mensual aproximado"
                htmlFor="ingresoMensual"
                error={errors.ingresoMensual?.message}
                helpText="Incluya pensiones, arriendos y otros ingresos regulares"
                required
              >
                <CurrencyInput
                  id="ingresoMensual"
                  value={watchedValues.ingresoMensual}
                  onChange={(value) => setValue('ingresoMensual', value as number)}
                  error={errors.ingresoMensual?.message}
                  placeholder="850.000"
                />
              </FieldWithHelp>

              <div className="space-y-3">
                <Label className="text-lg font-medium">Principal fuente de ingresos</Label>
                <RadioGroup
                  value={watchedValues.fuenteIngresos}
                  onValueChange={(value) => setValue('fuenteIngresos', value as 'pension' | 'arriendos' | 'otros' | 'mixto')}
                >
                  <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="pension" id="pension" className="w-6 h-6" />
                    <Label htmlFor="pension" className="cursor-pointer flex-1 text-lg">
                      Pensión de vejez
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="arriendos" id="arriendos" className="w-6 h-6" />
                    <Label htmlFor="arriendos" className="cursor-pointer flex-1 text-lg">
                      Arriendos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="mixto" id="mixto" className="w-6 h-6" />
                    <Label htmlFor="mixto" className="cursor-pointer flex-1 text-lg">
                      Combinación de fuentes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="otros" id="otros" className="w-6 h-6" />
                    <Label htmlFor="otros" className="cursor-pointer flex-1 text-lg">
                      Otros ingresos
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {/* Sub-paso 2: Otras propiedades */}
          {subPaso === 2 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Indique si posee otras propiedades además de la afectada
              </p>

              <RadioGroup
                value={watchedValues.tieneOtrasPropiedades ? 'si' : 'no'}
                onValueChange={(value) => setValue('tieneOtrasPropiedades', value === 'si')}
              >
                <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="no" id="otras-no" className="w-6 h-6" />
                  <div className="flex-1">
                    <Label htmlFor="otras-no" className="cursor-pointer text-lg font-medium">
                      No, esta es mi única propiedad
                    </Label>
                    <p className="text-base text-muted-foreground">
                      No soy dueño de otras propiedades
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="si" id="otras-si" className="w-6 h-6" />
                  <div className="flex-1">
                    <Label htmlFor="otras-si" className="cursor-pointer text-lg font-medium">
                      Sí, tengo otras propiedades
                    </Label>
                    <p className="text-base text-muted-foreground">
                      Poseo otras propiedades a mi nombre
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {watchedValues.tieneOtrasPropiedades && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-base text-amber-800">
                    Tener otras propiedades puede afectar la elegibilidad del recurso.
                    Sin embargo, aún puede presentarlo si las contribuciones de esta propiedad
                    afectan significativamente sus ingresos.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {/* Sub-paso 3: Beneficios actuales */}
          {subPaso === 3 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                ¿Actualmente tiene algún beneficio de rebaja de contribuciones?
              </p>

              <RadioGroup
                value={
                  watchedValues.tieneBeneficioActual
                    ? watchedValues.tipoBeneficioActual || 'parcial'
                    : 'ninguno'
                }
                onValueChange={(value) => {
                  if (value === 'ninguno') {
                    setValue('tieneBeneficioActual', false);
                    setValue('tipoBeneficioActual', '');
                  } else {
                    setValue('tieneBeneficioActual', true);
                    setValue('tipoBeneficioActual', value);
                  }
                }}
              >
                <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="ninguno" id="beneficio-ninguno" className="w-6 h-6" />
                  <div className="flex-1">
                    <Label htmlFor="beneficio-ninguno" className="cursor-pointer text-lg font-medium">
                      No tengo ningún beneficio
                    </Label>
                    <p className="text-base text-muted-foreground">
                      Pago el 100% de las contribuciones
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="parcial" id="beneficio-parcial" className="w-6 h-6" />
                  <div className="flex-1">
                    <Label htmlFor="beneficio-parcial" className="cursor-pointer text-lg font-medium">
                      Tengo rebaja parcial (50%)
                    </Label>
                    <p className="text-base text-muted-foreground">
                      Ya cuento con beneficio del 50%
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="total" id="beneficio-total" className="w-6 h-6" />
                  <div className="flex-1">
                    <Label htmlFor="beneficio-total" className="cursor-pointer text-lg font-medium">
                      Tengo rebaja total (100%)
                    </Label>
                    <p className="text-base text-muted-foreground">
                      Actualmente no pago contribuciones
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </>
          )}

          {/* Sub-paso 4: Monto de contribuciones */}
          {subPaso === 4 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Ingrese el monto que paga actualmente en contribuciones
              </p>

              <FieldWithHelp
                label="Monto de contribuciones (por trimestre)"
                htmlFor="montoContribucionTrimestral"
                error={errors.montoContribucionTrimestral?.message}
                helpText="Es el monto que paga cada 3 meses según su boleta"
                required
              >
                <CurrencyInput
                  id="montoContribucionTrimestral"
                  value={watchedValues.montoContribucionTrimestral}
                  onChange={(value) => setValue('montoContribucionTrimestral', value as number)}
                  error={errors.montoContribucionTrimestral?.message}
                  placeholder="420.000"
                />
              </FieldWithHelp>

              {/* Resumen calculado automáticamente */}
              {watchedValues.ingresoMensual && watchedValues.montoContribucionTrimestral && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Análisis de su situación
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-base text-muted-foreground">Contribución mensual equivalente</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatearPesos(contribucionMensual)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <p className="text-base text-muted-foreground">Contribución anual total</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatearPesos(contribucionAnual)}
                      </p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border-2 ${
                    casoFavorable
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {casoFavorable ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-lg font-semibold ${
                          casoFavorable ? 'text-green-800' : 'text-blue-800'
                        }`}>
                          Las contribuciones representan el {porcentajeIngresos.toFixed(1)}% de sus ingresos
                        </p>
                        <p className={`text-base mt-1 ${
                          casoFavorable ? 'text-green-700' : 'text-blue-700'
                        }`}>
                          {casoFavorable
                            ? 'Este porcentaje fortalece significativamente su caso, ya que demuestra una carga tributaria desproporcionada respecto a sus ingresos.'
                            : 'Su caso puede tener mérito legal. El recurso argumentará la desproporción entre sus ingresos y el aumento de contribuciones.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-base text-muted-foreground">
                      <strong>Resumen:</strong> Usted paga {formatearPesos(contribucionMensual)} mensuales
                      en contribuciones de un ingreso mensual de {formatearPesos(watchedValues.ingresoMensual)},
                      lo que equivale al {porcentajeIngresos.toFixed(1)}% de sus ingresos destinados
                      exclusivamente a este impuesto.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Navegación de sub-pasos */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevSubPaso}
          className="h-14 px-6 text-lg min-w-[140px]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Anterior
        </Button>

        {subPaso < SUB_PASOS.length ? (
          <Button
            type="button"
            onClick={handleNextSubPaso}
            className="h-14 px-8 text-lg min-w-[160px]"
          >
            Continuar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleFinalSubmit}
            className="h-14 px-8 text-lg min-w-[160px]"
          >
            Revisar datos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </form>
  );
}
