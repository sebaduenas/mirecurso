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
import { Checkbox } from '@/components/ui/checkbox';
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
import { RegionComunaSelect } from '@/components/formulario/RegionComunaSelect';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { TIPOS_PROPIETARIO, TEXTOS_AYUDA } from '@/data/datos-fijos';

// Sub-pasos del paso 2
const SUB_PASOS = [
  { id: 1, title: 'Ubicación de la propiedad', fields: ['direccionPropiedad', 'regionPropiedad', 'comunaPropiedad'] },
  { id: 2, title: 'Datos del SII', fields: ['rolAvaluo', 'avaluoFiscalVigente'] },
  { id: 3, title: 'Tipo de propiedad', fields: ['tipoPropietario', 'destinoHabitacional'] },
];

const paso2Schema = z.object({
  mismoQueDomicilio: z.boolean(),
  direccionPropiedad: z
    .string()
    .min(10, 'Ingrese la dirección completa de la propiedad')
    .max(200, 'La dirección es demasiado larga'),
  regionPropiedad: z.string().min(1, 'Seleccione la región de la propiedad'),
  comunaPropiedad: z.string().min(1, 'Seleccione la comuna de la propiedad'),
  rolAvaluo: z
    .string()
    .min(1, 'Ingrese el rol de avalúo')
    .regex(/^\d{1,5}-\d{1,5}$/, 'El formato debe ser: XXXXX-XXXXX (ej: 00372-00010)'),
  avaluoFiscalVigente: z
    .number({ message: 'Ingrese el avalúo fiscal' })
    .min(1000000, 'El avalúo fiscal parece muy bajo'),
  tipoPropietario: z.enum(['unico', 'con_conyuge', 'con_hijos', 'otro'], {
    message: 'Seleccione el tipo de propiedad',
  }),
  destinoHabitacional: z.boolean(),
  conoceInscripcion: z.boolean(),
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
      mismoQueDomicilio: datosPropiedad.mismoQueDomicilio ?? false,
      direccionPropiedad: datosPropiedad.direccionPropiedad ?? '',
      regionPropiedad: datosPropiedad.regionPropiedad ?? '',
      comunaPropiedad: datosPropiedad.comunaPropiedad ?? '',
      rolAvaluo: datosPropiedad.rolAvaluo ?? '',
      avaluoFiscalVigente: datosPropiedad.avaluoFiscalVigente ?? undefined,
      tipoPropietario: datosPropiedad.tipoPropietario ?? undefined,
      destinoHabitacional: datosPropiedad.destinoHabitacional ?? true,
      conoceInscripcion: datosPropiedad.conoceInscripcion ?? false,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMismaDireccion = (checked: boolean) => {
    setValue('mismoQueDomicilio', checked);
    if (checked) {
      // Get the latest data directly from the store
      const { datosPersonales: datos } = useFormularioStore.getState();
      if (datos.domicilio) {
        setValue('direccionPropiedad', datos.domicilio);
        setValue('regionPropiedad', datos.region || '');
        // Set comuna after a small delay to ensure the region is processed first
        setTimeout(() => {
          setValue('comunaPropiedad', datos.comuna || '');
        }, 0);
      }
    }
  };

  const validateCurrentSubPaso = async (): Promise<boolean> => {
    if (subPaso === 1) {
      return await trigger(['direccionPropiedad', 'regionPropiedad', 'comunaPropiedad']);
    }
    if (subPaso === 2) {
      return await trigger(['rolAvaluo', 'avaluoFiscalVigente']);
    }
    if (subPaso === 3) {
      return await trigger(['tipoPropietario']);
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
          <span>Paso 2 de 7: Datos de la propiedad</span>
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

              <div className="flex items-center space-x-4 p-5 border-2 rounded-xl bg-muted/30">
                <Checkbox
                  id="mismoQueDomicilio"
                  checked={watchedValues.mismoQueDomicilio}
                  onCheckedChange={handleMismaDireccion}
                  className="w-6 h-6"
                />
                <Label htmlFor="mismoQueDomicilio" className="cursor-pointer text-lg">
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
                <Input
                  id="direccionPropiedad"
                  {...register('direccionPropiedad')}
                  placeholder="Calle, número, depto/casa"
                  className="h-14 text-lg"
                />
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

          {/* Sub-paso 2: Datos del SII */}
          {subPaso === 2 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Esta información aparece en su boleta de contribuciones o en sii.cl
              </p>

              <FieldWithHelp
                label="Rol de avalúo"
                htmlFor="rolAvaluo"
                error={errors.rolAvaluo?.message}
                helpText={TEXTOS_AYUDA.rolAvaluo}
                example="00372-00010"
                required
              >
                <Input
                  id="rolAvaluo"
                  {...register('rolAvaluo')}
                  placeholder="Ingrese el rol (ej: 00372-00010)"
                  className="h-14 text-lg"
                  autoFocus
                />
              </FieldWithHelp>

              <FieldWithHelp
                label="Avalúo fiscal vigente (en pesos)"
                htmlFor="avaluoFiscalVigente"
                error={errors.avaluoFiscalVigente?.message}
                helpText={TEXTOS_AYUDA.avaluoFiscal}
                required
              >
                <CurrencyInput
                  id="avaluoFiscalVigente"
                  value={watchedValues.avaluoFiscalVigente}
                  onChange={(value) => setValue('avaluoFiscalVigente', value as number)}
                  error={errors.avaluoFiscalVigente?.message}
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

          {/* Sub-paso 3: Tipo de propiedad */}
          {subPaso === 3 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Indique cómo es la propiedad de este inmueble
              </p>

              <div className="space-y-2">
                <Label className="text-lg font-medium">
                  Tipo de propiedad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedValues.tipoPropietario}
                  onValueChange={(value) => setValue('tipoPropietario', value as Paso2Form['tipoPropietario'])}
                >
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue placeholder="Seleccione el tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TIPOS_PROPIETARIO).map((tipo) => (
                      <SelectItem key={tipo.valor} value={tipo.valor} className="text-lg py-3">
                        {tipo.texto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipoPropietario && (
                  <p className="text-base text-red-600">{errors.tipoPropietario.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-4 p-5 border-2 rounded-xl bg-emerald-50 border-emerald-200">
                <Checkbox
                  id="destinoHabitacional"
                  checked={watchedValues.destinoHabitacional}
                  onCheckedChange={(checked) => setValue('destinoHabitacional', checked as boolean)}
                  className="w-6 h-6 mt-1"
                />
                <div>
                  <Label htmlFor="destinoHabitacional" className="cursor-pointer text-lg font-medium">
                    La propiedad es mi vivienda habitual
                  </Label>
                  <p className="text-base text-muted-foreground mt-1">
                    La uso como mi hogar o residencia principal (requisito esencial para el beneficio)
                  </p>
                </div>
              </div>

              {!watchedValues.destinoHabitacional && (
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-base text-amber-800">
                    El beneficio de la Ley 20.732 solo aplica a propiedades de uso habitacional.
                    Si la propiedad no es su vivienda, el recurso tiene menos probabilidades de éxito.
                  </AlertDescription>
                </Alert>
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
