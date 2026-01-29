'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormularioStore } from '@/lib/store';
import { validarRut } from '@/lib/rut-utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldWithHelp } from '@/components/formulario/FieldWithHelp';
import { RutInput } from '@/components/formulario/RutInput';
import { DateInput } from '@/components/formulario/DateInput';
import { RegionComunaSelect } from '@/components/formulario/RegionComunaSelect';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { ESTADOS_CIVILES } from '@/data/datos-fijos';

// Sub-pasos del paso 1
const SUB_PASOS = [
  { id: 1, title: 'Identificación', fields: ['nombreCompleto', 'rut'] },
  { id: 2, title: 'Fecha de nacimiento', fields: ['fechaNacimiento'] },
  { id: 3, title: 'Estado civil y profesión', fields: ['estadoCivil', 'profesion'] },
  { id: 4, title: 'Domicilio', fields: ['domicilio', 'region', 'comuna'] },
  { id: 5, title: 'Contacto (opcional)', fields: ['telefono', 'email'] },
];

const paso1Schema = z.object({
  nombreCompleto: z
    .string()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  rut: z
    .string()
    .min(11, 'RUT incompleto')
    .refine(validarRut, 'El RUT ingresado no es válido'),
  fechaNacimiento: z
    .string()
    .min(1, 'Ingrese la fecha de nacimiento')
    .refine((fecha) => {
      if (!fecha || fecha.includes('00')) return false;
      const hoy = new Date();
      const nacimiento = new Date(fecha);
      const edad = Math.floor((hoy.getTime() - nacimiento.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return edad >= 60;
    }, 'Debe tener al menos 60 años para usar este servicio'),
  nacionalidad: z.string(),
  estadoCivil: z.enum(['soltero', 'casado', 'viudo', 'divorciado', 'conviviente_civil'], {
    message: 'Seleccione su estado civil',
  }),
  profesion: z
    .string()
    .min(2, 'Ingrese su profesión u ocupación')
    .max(100, 'La profesión es demasiado larga'),
  domicilio: z
    .string()
    .min(10, 'Ingrese la dirección completa')
    .max(200, 'La dirección es demasiado larga'),
  region: z.string().min(1, 'Seleccione una región'),
  comuna: z.string().min(1, 'Seleccione una comuna'),
  telefono: z.string().optional(),
  email: z.string().email('El email no es válido').optional().or(z.literal('')),
});

type Paso1Form = z.infer<typeof paso1Schema>;

export default function Paso1Page() {
  const router = useRouter();
  const [subPaso, setSubPaso] = useState(1);
  const { datosPersonales, setDatosPersonales, setCurrentStep, markStepComplete } = useFormularioStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Paso1Form>({
    resolver: zodResolver(paso1Schema),
    defaultValues: {
      nombreCompleto: datosPersonales.nombreCompleto ?? '',
      rut: datosPersonales.rut ?? '',
      fechaNacimiento: datosPersonales.fechaNacimiento ?? '',
      nacionalidad: datosPersonales.nacionalidad ?? 'Chilena',
      estadoCivil: datosPersonales.estadoCivil ?? undefined,
      profesion: datosPersonales.profesion ?? '',
      domicilio: datosPersonales.domicilio ?? '',
      region: datosPersonales.region ?? '',
      comuna: datosPersonales.comuna ?? '',
      telefono: datosPersonales.telefono ?? '',
      email: datosPersonales.email ?? '',
    },
    mode: 'onBlur',
  });

  const watchedValues = watch();

  useEffect(() => {
    setCurrentStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validar campos del sub-paso actual
  const validateCurrentSubPaso = async (): Promise<boolean> => {
    const currentFields = SUB_PASOS[subPaso - 1].fields as (keyof Paso1Form)[];

    // El último sub-paso (contacto) es opcional
    if (subPaso === 5) return true;

    const result = await trigger(currentFields);
    return result;
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
    }
  };

  const onSubmit = (data: Paso1Form) => {
    setDatosPersonales(data);
    markStepComplete(1);
    router.push('/formulario/paso-2');
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
          <span>Paso 1 de 7: Datos personales</span>
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
          {/* Sub-paso 1: Nombre y RUT */}
          {subPaso === 1 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Ingrese los datos de identificación del adulto mayor
              </p>

              <FieldWithHelp
                label="Nombre completo"
                htmlFor="nombreCompleto"
                error={errors.nombreCompleto?.message}
                example="María Elena González Pérez"
                required
              >
                <Input
                  id="nombreCompleto"
                  {...register('nombreCompleto')}
                  placeholder="Ingrese nombre completo"
                  className="h-14 text-lg"
                  autoFocus
                />
              </FieldWithHelp>

              <FieldWithHelp
                label="RUT"
                htmlFor="rut"
                error={errors.rut?.message}
                helpText="Se formatea automáticamente con puntos y guión"
                required
              >
                <RutInput
                  value={watchedValues.rut}
                  onChange={(rut) => setValue('rut', rut)}
                  error={errors.rut?.message}
                />
              </FieldWithHelp>
            </>
          )}

          {/* Sub-paso 2: Fecha de nacimiento */}
          {subPaso === 2 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Seleccione la fecha de nacimiento para verificar que cumple con el requisito de edad (60 años o más)
              </p>

              <FieldWithHelp
                label="Fecha de nacimiento"
                error={errors.fechaNacimiento?.message}
                required
              >
                <DateInput
                  value={watchedValues.fechaNacimiento}
                  onChange={(date) => setValue('fechaNacimiento', date)}
                  showAge
                  error={errors.fechaNacimiento?.message}
                />
              </FieldWithHelp>
            </>
          )}

          {/* Sub-paso 3: Estado civil y profesión */}
          {subPaso === 3 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Estos datos aparecerán en el documento legal
              </p>

              <div className="space-y-2">
                <Label className="text-lg font-medium">
                  Estado civil <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedValues.estadoCivil}
                  onValueChange={(value) => setValue('estadoCivil', value as Paso1Form['estadoCivil'])}
                >
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue placeholder="Seleccione su estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ESTADOS_CIVILES).map((estado) => (
                      <SelectItem key={estado.valor} value={estado.valor} className="text-lg py-3">
                        {estado.textoMasculino.charAt(0).toUpperCase() + estado.textoMasculino.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.estadoCivil && (
                  <p className="text-base text-red-600">{errors.estadoCivil.message}</p>
                )}
              </div>

              <FieldWithHelp
                label="Profesión u ocupación"
                htmlFor="profesion"
                error={errors.profesion?.message}
                example="Jubilado/a, Dueña de casa, Comerciante"
                required
              >
                <Input
                  id="profesion"
                  {...register('profesion')}
                  placeholder="Ej: Jubilado/a"
                  className="h-14 text-lg"
                />
              </FieldWithHelp>
            </>
          )}

          {/* Sub-paso 4: Domicilio */}
          {subPaso === 4 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Dirección donde vive actualmente (puede ser distinta a la propiedad afectada)
              </p>

              <FieldWithHelp
                label="Dirección"
                htmlFor="domicilio"
                error={errors.domicilio?.message}
                example="Av. Providencia 1234, depto 56"
                required
              >
                <Input
                  id="domicilio"
                  {...register('domicilio')}
                  placeholder="Calle, número, depto/casa"
                  className="h-14 text-lg"
                  autoFocus
                />
              </FieldWithHelp>

              <div className="space-y-2">
                <Label className="text-lg font-medium">
                  Región y Comuna <span className="text-red-500">*</span>
                </Label>
                <RegionComunaSelect
                  region={watchedValues.region}
                  comuna={watchedValues.comuna}
                  onRegionChange={(region) => setValue('region', region)}
                  onComunaChange={(comuna) => setValue('comuna', comuna)}
                  regionError={errors.region?.message}
                  comunaError={errors.comuna?.message}
                />
                {(errors.region || errors.comuna) && (
                  <p className="text-base text-red-600">
                    {errors.region?.message || errors.comuna?.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Sub-paso 5: Contacto (opcional) */}
          {subPaso === 5 && (
            <>
              <p className="text-lg text-muted-foreground mb-4">
                Estos datos son opcionales pero útiles para que la Corte pueda contactarlo
              </p>

              <FieldWithHelp
                label="Teléfono"
                htmlFor="telefono"
                error={errors.telefono?.message}
                example="+56 9 1234 5678"
              >
                <Input
                  id="telefono"
                  {...register('telefono')}
                  placeholder="Ingrese número de teléfono"
                  className="h-14 text-lg"
                  autoFocus
                />
              </FieldWithHelp>

              <FieldWithHelp
                label="Correo electrónico"
                htmlFor="email"
                error={errors.email?.message}
                example="correo@ejemplo.cl"
              >
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Ingrese correo electrónico"
                  className="h-14 text-lg"
                />
              </FieldWithHelp>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navegación de sub-pasos */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-6">
        {subPaso === 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/')}
            className="h-14 px-6 text-lg min-w-[140px]"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al inicio
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevSubPaso}
            className="h-14 px-6 text-lg min-w-[140px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Anterior
          </Button>
        )}

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
