import { z } from 'zod';
import { validarRut } from './rut-utils';

// Paso 1: Datos Personales
export const datosPersonalesSchema = z.object({
  actuaRepresentante: z.boolean(),

  nombreCompleto: z
    .string()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/, 'El nombre solo puede contener letras'),

  rut: z
    .string()
    .min(11, 'RUT incompleto')
    .max(12, 'RUT demasiado largo')
    .refine(validarRut, 'El RUT ingresado no es válido'),

  fechaNacimiento: z
    .string()
    .min(1, 'Ingrese la fecha de nacimiento')
    .refine((fecha) => {
      const hoy = new Date();
      const nacimiento = new Date(fecha);
      const edad = Math.floor((hoy.getTime() - nacimiento.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return edad >= 60;
    }, 'Debe tener al menos 60 años para usar este servicio'),

  domicilio: z
    .string()
    .min(10, 'Ingrese la dirección completa')
    .max(200, 'La dirección es demasiado larga'),

  region: z
    .string()
    .min(1, 'Seleccione una región'),

  comuna: z
    .string()
    .min(1, 'Seleccione una comuna'),

  telefono: z
    .string()
    .regex(/^(\+?56)?(\s?9)?(\s?\d{4})(\s?\d{4})$/, 'Formato de teléfono inválido')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .email('El email no es válido')
    .optional()
    .or(z.literal('')),

  representante: z.object({
    nombreCompleto: z.string().min(5, 'Ingrese el nombre completo'),
    rut: z.string().refine(validarRut, 'RUT inválido'),
    parentesco: z.string().min(1, 'Indique el parentesco'),
  }).optional(),
});

// Paso 2: Datos de la Propiedad
export const datosPropiedadSchema = z.object({
  direccionPropiedad: z
    .string()
    .min(10, 'Ingrese la dirección completa de la propiedad')
    .max(200, 'La dirección es demasiado larga'),

  regionPropiedad: z
    .string()
    .min(1, 'Seleccione la región de la propiedad'),

  comunaPropiedad: z
    .string()
    .min(1, 'Seleccione la comuna de la propiedad'),

  rolSII: z
    .string()
    .regex(/^\d{1,5}-\d{1,4}$/, 'El formato debe ser: 123-456'),

  avaluoFiscal: z
    .number()
    .min(1, 'Ingrese el avalúo fiscal')
    .max(50000000000, 'El valor parece incorrecto'),

  destinoPropiedad: z
    .enum(['habitacional', 'otro'], {
      error: 'Seleccione el destino de la propiedad',
    }),

  esPropietarioUnico: z.boolean(),

  porcentajeDominio: z
    .number()
    .min(1, 'El porcentaje debe ser mayor a 0')
    .max(100, 'El porcentaje no puede ser mayor a 100')
    .optional(),
});

// Paso 3: Datos Tributarios
export const datosTributariosSchema = z.object({
  ingresoMensual: z
    .number()
    .min(0, 'El ingreso no puede ser negativo'),

  fuenteIngresos: z
    .enum(['pension', 'arriendos', 'otros', 'mixto'], {
      error: 'Seleccione la fuente de ingresos',
    }),

  tieneOtrasPropiedades: z.boolean(),

  tieneBeneficioActual: z.boolean(),

  tipoBeneficioActual: z
    .string()
    .optional(),

  montoContribucionTrimestral: z
    .number()
    .min(0, 'El monto no puede ser negativo'),
});

// Schema completo
export const formularioCompletoSchema = z.object({
  datosPersonales: datosPersonalesSchema,
  datosPropiedad: datosPropiedadSchema,
  datosTributarios: datosTributariosSchema,
});

// Tipos inferidos
export type DatosPersonalesForm = z.infer<typeof datosPersonalesSchema>;
export type DatosPropiedadForm = z.infer<typeof datosPropiedadSchema>;
export type DatosTributariosForm = z.infer<typeof datosTributariosSchema>;
