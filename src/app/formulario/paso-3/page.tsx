'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormularioStore } from '@/lib/store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldWithHelp } from '@/components/formulario/FieldWithHelp';
import { CurrencyInput } from '@/components/formulario/CurrencyInput';
import { ArrowLeft, ArrowRight, AlertTriangle, Info } from 'lucide-react';
import { FUENTES_INGRESO, TRAMOS_RSH, TIPOS_BENEFICIO, TEXTOS_AYUDA } from '@/data/datos-fijos';

// Sub-pasos del paso 3
const SUB_PASOS = [
  { id: 1, title: 'Ingresos mensuales', fields: ['ingresoMensual', 'fuentesIngreso'] },
  { id: 2, title: 'Registro Social de Hogares', fields: ['estaEnRSH'] },
  { id: 3, title: 'Otras propiedades y beneficios', fields: ['tieneOtrasPropiedades', 'tieneBeneficioActual'] },
];

const paso3Schema = z.object({
  ingresoMensual: z
    .number({ message: 'Ingrese su ingreso mensual' })
    .min(0, 'El ingreso no puede ser negativo'),
  fuentesIngreso: z
    .array(z.enum(['pgu', 'pension_afp', 'pension_sobrevivencia', 'arriendos', 'otros']))
    .min(1, 'Seleccione al menos una fuente de ingresos'),
  fuenteIngresoOtros: z.string().optional(),
  estaEnRSH: z.enum(['si', 'no', 'no_se'], {
    message: 'Indique si está inscrito en el Registro Social de Hogares',
  }),
  tramoRSH: z.enum(['40', '50', '60', '70', '80', '90']).optional(),
  tieneOtrasPropiedades: z.boolean(),
  tieneBeneficioActual: z.enum(['ninguno', 'parcial_50', 'total_100'], {
    message: 'Indique si tiene algún beneficio actualmente',
  }),
});

type Paso3Form = z.infer<typeof paso3Schema>;

export default function Paso3Page() {
  const router = useRouter();
  const [subPaso, setSubPaso] = useState(1);
  const {
    datosEconomicos,
    setDatosEconomicos,
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
      ingresoMensual: datosEconomicos.ingresoMensual ?? undefined,
      fuentesIngreso: datosEconomicos.fuentesIngreso ?? [],
      fuenteIngresoOtros: datosEconomicos.fuenteIngresoOtros ?? '',
      estaEnRSH: datosEconomicos.estaEnRSH ?? undefined,
      tramoRSH: datosEconomicos.tramoRSH ?? undefined,
      tieneOtrasPropiedades: datosEconomicos.tieneOtrasPropiedades ?? false,
      tieneBeneficioActual: datosEconomicos.tieneBeneficioActual ?? undefined,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFuenteIngresoChange = (fuente: string, checked: boolean) => {
    const current = watchedValues.fuentesIngreso || [];
    if (checked) {
      setValue('fuentesIngreso', [...current, fuente] as Paso3Form['fuentesIngreso']);
    } else {
      setValue('fuentesIngreso', current.filter((f) => f !== fuente) as Paso3Form['fuentesIngreso']);
    }
  };

  const validateCurrentSubPaso = async (): Promise<boolean> => {
    if (subPaso === 1) {
      return await trigger(['ingresoMensual', 'fuentesIngreso']);
    }
    if (subPaso === 2) {
      const valid = await trigger(['estaEnRSH']);
      if (valid && watchedValues.estaEnRSH === 'si') {
        return await trigger(['tramoRSH']);
      }
      return valid;
    }
    if (subPaso === 3) {
      return await trigger(['tieneOtrasPropiedades', 'tieneBeneficioActual']);
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
    setDatosEconomicos({
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
          <span>Paso 3 de 7: Situación económica</span>
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
                <Label className="text-lg font-medium">
                  Fuentes de ingresos <span className="text-red-500">*</span>
                </Label>
                <p className="text-base text-muted-foreground">
                  Seleccione todas las que apliquen
                </p>
                <div className="space-y-3">
                  {Object.values(FUENTES_INGRESO).map((fuente) => (
                    <div
                      key={fuente.valor}
                      className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        id={fuente.valor}
                        checked={watchedValues.fuentesIngreso?.includes(fuente.valor as Paso3Form['fuentesIngreso'][number])}
                        onCheckedChange={(checked) => handleFuenteIngresoChange(fuente.valor, checked as boolean)}
                        className="w-6 h-6"
                      />
                      <Label htmlFor={fuente.valor} className="cursor-pointer flex-1 text-lg">
                        {fuente.texto}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.fuentesIngreso && (
                  <p className="text-base text-red-600">{errors.fuentesIngreso.message}</p>
                )}
              </div>

              {watchedValues.fuentesIngreso?.includes('otros') && (
                <FieldWithHelp
                  label="Especifique otros ingresos"
                  htmlFor="fuenteIngresoOtros"
                  error={errors.fuenteIngresoOtros?.message}
                >
                  <Input
                    id="fuenteIngresoOtros"
                    value={watchedValues.fuenteIngresoOtros || ''}
                    onChange={(e) => setValue('fuenteIngresoOtros', e.target.value)}
                    placeholder="Ej: Trabajo independiente, ahorros"
                    className="h-14 text-lg"
                  />
                </FieldWithHelp>
              )}
            </>
          )}

          {/* Sub-paso 2: Registro Social de Hogares */}
          {subPaso === 2 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                El Registro Social de Hogares puede fortalecer su caso
              </p>

              <Alert>
                <Info className="h-5 w-5" />
                <AlertDescription className="text-base">
                  {TEXTOS_AYUDA.registroSocialHogares}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label className="text-lg font-medium">
                  ¿Está inscrito en el Registro Social de Hogares? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={watchedValues.estaEnRSH}
                  onValueChange={(value) => setValue('estaEnRSH', value as Paso3Form['estaEnRSH'])}
                >
                  <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="si" id="rsh-si" className="w-6 h-6" />
                    <Label htmlFor="rsh-si" className="cursor-pointer flex-1 text-lg">
                      Sí, estoy inscrito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="no" id="rsh-no" className="w-6 h-6" />
                    <Label htmlFor="rsh-no" className="cursor-pointer flex-1 text-lg">
                      No estoy inscrito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="no_se" id="rsh-nose" className="w-6 h-6" />
                    <Label htmlFor="rsh-nose" className="cursor-pointer flex-1 text-lg">
                      No sé si estoy inscrito
                    </Label>
                  </div>
                </RadioGroup>
                {errors.estaEnRSH && (
                  <p className="text-base text-red-600">{errors.estaEnRSH.message}</p>
                )}
              </div>

              {watchedValues.estaEnRSH === 'si' && (
                <div className="space-y-2">
                  <Label className="text-lg font-medium">
                    ¿En qué tramo se encuentra? <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watchedValues.tramoRSH}
                    onValueChange={(value) => setValue('tramoRSH', value as Paso3Form['tramoRSH'])}
                  >
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue placeholder="Seleccione el tramo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TRAMOS_RSH).map((tramo) => (
                        <SelectItem key={tramo.valor} value={tramo.valor} className="text-lg py-3">
                          {tramo.texto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tramoRSH && (
                    <p className="text-base text-red-600">{errors.tramoRSH.message}</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Sub-paso 3: Otras propiedades y beneficios */}
          {subPaso === 3 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Información adicional sobre su situación
              </p>

              <div className="space-y-3">
                <Label className="text-lg font-medium">¿Tiene otras propiedades?</Label>
                <RadioGroup
                  value={watchedValues.tieneOtrasPropiedades ? 'si' : 'no'}
                  onValueChange={(value) => setValue('tieneOtrasPropiedades', value === 'si')}
                >
                  <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="no" id="otras-no" className="w-6 h-6" />
                    <Label htmlFor="otras-no" className="cursor-pointer flex-1 text-lg">
                      No, esta es mi única propiedad
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                    <RadioGroupItem value="si" id="otras-si" className="w-6 h-6" />
                    <Label htmlFor="otras-si" className="cursor-pointer flex-1 text-lg">
                      Sí, tengo otras propiedades
                    </Label>
                  </div>
                </RadioGroup>
              </div>

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

              <div className="space-y-3">
                <Label className="text-lg font-medium">
                  ¿Tiene actualmente algún beneficio de contribuciones? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={watchedValues.tieneBeneficioActual}
                  onValueChange={(value) => setValue('tieneBeneficioActual', value as Paso3Form['tieneBeneficioActual'])}
                >
                  {Object.values(TIPOS_BENEFICIO).map((beneficio) => (
                    <div
                      key={beneficio.valor}
                      className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value={beneficio.valor} id={beneficio.valor} className="w-6 h-6" />
                      <Label htmlFor={beneficio.valor} className="cursor-pointer flex-1 text-lg">
                        {beneficio.texto}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.tieneBeneficioActual && (
                  <p className="text-base text-red-600">{errors.tieneBeneficioActual.message}</p>
                )}
              </div>
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
            Siguiente paso
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </form>
  );
}
