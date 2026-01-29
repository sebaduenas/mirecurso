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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FieldWithHelp } from '@/components/formulario/FieldWithHelp';
import { CurrencyInput } from '@/components/formulario/CurrencyInput';
import { RegionComunaSelect } from '@/components/formulario/RegionComunaSelect';
import { VoiceInput } from '@/components/formulario/VoiceInput';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';

// Sub-pasos del paso 2
const SUB_PASOS = [
  { id: 1, title: 'Ubicación de la propiedad', fields: ['mismaDireccion', 'direccionPropiedad', 'regionPropiedad', 'comunaPropiedad'] },
  { id: 2, title: 'Uso de la propiedad', fields: ['destinoPropiedad'] },
  { id: 3, title: 'Datos del SII', fields: ['rolSII', 'avaluoFiscal'] },
  { id: 4, title: 'Tipo de propiedad', fields: ['esPropietarioUnico', 'porcentajeDominio'] },
];

const paso2Schema = z.object({
  direccionPropiedad: z
    .string()
    .min(10, 'Ingrese la dirección completa de la propiedad')
    .max(200, 'La dirección es demasiado larga'),
  regionPropiedad: z.string().min(1, 'Seleccione la región de la propiedad'),
  comunaPropiedad: z.string().min(1, 'Seleccione la comuna de la propiedad'),
  rolSII: z
    .string()
    .regex(/^\d{1,5}-\d{1,4}$/, 'El formato debe ser: 123-456'),
  avaluoFiscal: z
    .number({ error: 'Ingrese el avalúo fiscal' })
    .min(1, 'Ingrese el avalúo fiscal'),
  destinoPropiedad: z.enum(['habitacional', 'otro']),
  esPropietarioUnico: z.boolean(),
  porcentajeDominio: z.number().min(1).max(100).optional(),
  mismaDireccion: z.boolean().optional(),
});

type Paso2Form = z.infer<typeof paso2Schema>;

export default function Paso2Page() {
  const router = useRouter();
  const [subPaso, setSubPaso] = useState(1);
  const {
    datosPersonales,
    datosPropiedad,
    setDatosPropiedad,
    setCurrentStep,
    markStepComplete,
    isStepAccessible,
  } = useFormularioStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Paso2Form>({
    resolver: zodResolver(paso2Schema),
    defaultValues: {
      direccionPropiedad: datosPropiedad.direccionPropiedad ?? '',
      regionPropiedad: datosPropiedad.regionPropiedad ?? '',
      comunaPropiedad: datosPropiedad.comunaPropiedad ?? '',
      rolSII: datosPropiedad.rolSII ?? '',
      avaluoFiscal: datosPropiedad.avaluoFiscal ?? undefined,
      destinoPropiedad: datosPropiedad.destinoPropiedad ?? 'habitacional',
      esPropietarioUnico: datosPropiedad.esPropietarioUnico ?? true,
      porcentajeDominio: datosPropiedad.porcentajeDominio ?? 100,
      mismaDireccion: false,
    },
    mode: 'onBlur',
  });

  const watchedValues = watch();

  useEffect(() => {
    if (!isStepAccessible(2)) {
      router.replace('/formulario/paso-1');
      return;
    }
    setCurrentStep(2);
  }, [isStepAccessible, router, setCurrentStep]);

  useEffect(() => {
    setDatosPropiedad(watchedValues);
  }, [watchedValues, setDatosPropiedad]);

  const handleMismaDireccion = (checked: boolean) => {
    setValue('mismaDireccion', checked);
    if (checked && datosPersonales.domicilio) {
      setValue('direccionPropiedad', datosPersonales.domicilio);
      setValue('regionPropiedad', datosPersonales.region || '');
      setValue('comunaPropiedad', datosPersonales.comuna || '');
    }
  };

  // Validar campos del sub-paso actual
  const validateCurrentSubPaso = async (): Promise<boolean> => {
    if (subPaso === 1) {
      return await trigger(['direccionPropiedad', 'regionPropiedad', 'comunaPropiedad']);
    }
    if (subPaso === 2) {
      return await trigger(['destinoPropiedad']);
    }
    if (subPaso === 3) {
      return await trigger(['rolSII', 'avaluoFiscal']);
    }
    if (subPaso === 4) {
      if (!watchedValues.esPropietarioUnico) {
        return await trigger(['esPropietarioUnico', 'porcentajeDominio']);
      }
      return true;
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
      router.push('/formulario/paso-1');
    }
  };

  const onSubmit = (data: Paso2Form) => {
    setDatosPropiedad(data);
    markStepComplete(2);
    router.push('/formulario/paso-3');
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
          <span>Paso 2 de 5: Datos de la propiedad</span>
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
          {/* Sub-paso 1: Ubicación de la propiedad */}
          {subPaso === 1 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Ingrese la dirección de la propiedad afecta a contribuciones
              </p>

              {/* Checkbox misma dirección */}
              <div className="flex items-center space-x-4 p-5 border-2 rounded-xl bg-muted/30">
                <Checkbox
                  id="mismaDireccion"
                  checked={watchedValues.mismaDireccion}
                  onCheckedChange={handleMismaDireccion}
                  className="w-6 h-6"
                />
                <Label htmlFor="mismaDireccion" className="cursor-pointer text-lg">
                  Es la misma dirección donde vivo
                </Label>
              </div>

              <FieldWithHelp
                label="Dirección de la propiedad"
                htmlFor="direccionPropiedad"
                error={errors.direccionPropiedad?.message}
                example="Av. Providencia 1234, depto 56"
                required
              >
                <div className="flex gap-2">
                  <Input
                    id="direccionPropiedad"
                    {...register('direccionPropiedad')}
                    placeholder="Calle, número, depto/casa"
                    className="h-14 text-lg flex-1"
                  />
                  <VoiceInput
                    onResult={(text) => setValue('direccionPropiedad', text)}
                    buttonLabel="Dictar"
                  />
                </div>
              </FieldWithHelp>

              <div className="space-y-2">
                <Label className="text-lg font-medium">
                  Región y Comuna <span className="text-red-500">*</span>
                </Label>
                <RegionComunaSelect
                  region={watchedValues.regionPropiedad}
                  comuna={watchedValues.comunaPropiedad}
                  onRegionChange={(region) => setValue('regionPropiedad', region)}
                  onComunaChange={(comuna) => setValue('comunaPropiedad', comuna)}
                  regionError={errors.regionPropiedad?.message}
                  comunaError={errors.comunaPropiedad?.message}
                />
                {(errors.regionPropiedad || errors.comunaPropiedad) && (
                  <p className="text-base text-red-600">
                    {errors.regionPropiedad?.message || errors.comunaPropiedad?.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Sub-paso 2: Uso de la propiedad */}
          {subPaso === 2 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Indique el uso que le da a la propiedad
              </p>

              <RadioGroup
                value={watchedValues.destinoPropiedad}
                onValueChange={(value) => setValue('destinoPropiedad', value as 'habitacional' | 'otro')}
              >
                <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="habitacional" id="habitacional" className="w-6 h-6" />
                  <div className="flex-1">
                    <Label htmlFor="habitacional" className="cursor-pointer text-lg font-medium">
                      Habitacional (vivienda)
                    </Label>
                    <p className="text-base text-muted-foreground">
                      La propiedad es su hogar o residencia principal
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="otro" id="otro" className="w-6 h-6" />
                  <div className="flex-1">
                    <Label htmlFor="otro" className="cursor-pointer text-lg font-medium">
                      Otro uso
                    </Label>
                    <p className="text-base text-muted-foreground">
                      Comercial, bodega, terreno, etc.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {watchedValues.destinoPropiedad === 'otro' && (
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-base text-amber-800">
                    El recurso de protección tiene mejores resultados para propiedades de uso habitacional.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {/* Sub-paso 3: Datos del SII */}
          {subPaso === 3 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Esta información aparece en su boleta de contribuciones
              </p>

              <FieldWithHelp
                label="Rol del SII"
                htmlFor="rolSII"
                error={errors.rolSII?.message}
                helpText="Lo encuentra en la parte superior de su boleta de contribuciones"
                example="123-456"
                required
              >
                <Input
                  id="rolSII"
                  {...register('rolSII')}
                  placeholder="Ingrese el rol (ej: 123-456)"
                  className="h-14 text-lg"
                  autoFocus
                />
              </FieldWithHelp>

              <FieldWithHelp
                label="Avalúo fiscal (en pesos)"
                htmlFor="avaluoFiscal"
                error={errors.avaluoFiscal?.message}
                helpText="Este valor aparece en su certificado de avalúo fiscal del SII"
                required
              >
                <CurrencyInput
                  id="avaluoFiscal"
                  value={watchedValues.avaluoFiscal}
                  onChange={(value) => setValue('avaluoFiscal', value as number)}
                  error={errors.avaluoFiscal?.message}
                  placeholder="180.000.000"
                />
              </FieldWithHelp>

              <Alert>
                <Info className="h-5 w-5" />
                <AlertDescription className="text-base">
                  Puede consultar estos datos en{' '}
                  <a
                    href="https://www.sii.cl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline font-medium"
                  >
                    sii.cl
                  </a>
                  {' '}o en su boleta de contribuciones.
                </AlertDescription>
              </Alert>
            </>
          )}

          {/* Sub-paso 4: Tipo de propiedad */}
          {subPaso === 4 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Indique si es el único dueño de la propiedad
              </p>

              <RadioGroup
                value={watchedValues.esPropietarioUnico ? 'si' : 'no'}
                onValueChange={(value) => {
                  setValue('esPropietarioUnico', value === 'si');
                  if (value === 'si') {
                    setValue('porcentajeDominio', 100);
                  }
                }}
              >
                <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="si" id="propietario-si" className="w-6 h-6" />
                  <div className="flex-1">
                    <Label htmlFor="propietario-si" className="cursor-pointer text-lg font-medium">
                      Sí, soy el único propietario
                    </Label>
                    <p className="text-base text-muted-foreground">
                      El 100% de la propiedad está a mi nombre
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-5 border-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="no" id="propietario-no" className="w-6 h-6" />
                  <div className="flex-1">
                    <Label htmlFor="propietario-no" className="cursor-pointer text-lg font-medium">
                      No, comparto la propiedad
                    </Label>
                    <p className="text-base text-muted-foreground">
                      Hay otros copropietarios (herederos, cónyuge, etc.)
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {/* Porcentaje de dominio (solo si no es único propietario) */}
              {!watchedValues.esPropietarioUnico && (
                <FieldWithHelp
                  label="Porcentaje de dominio"
                  htmlFor="porcentajeDominio"
                  error={errors.porcentajeDominio?.message}
                  helpText="El porcentaje de propiedad que le corresponde según escritura"
                  required
                >
                  <div className="flex items-center gap-3">
                    <Input
                      id="porcentajeDominio"
                      type="number"
                      min="1"
                      max="100"
                      {...register('porcentajeDominio', { valueAsNumber: true })}
                      className="h-14 text-lg w-28"
                    />
                    <span className="text-xl font-medium">%</span>
                  </div>
                </FieldWithHelp>
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
            Siguiente paso
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </form>
  );
}
