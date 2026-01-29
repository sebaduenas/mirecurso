import { z } from 'zod';
import { validarRut } from './rut-utils';

// =====================================================
// VALIDACIONES BASE
// =====================================================

/**
 * Validación de RUT chileno
 */
export const rutSchema = z
  .string()
  .min(11, 'RUT incompleto (formato: 12.345.678-9)')
  .max(12, 'RUT demasiado largo')
  .refine(validarRut, 'El RUT ingresado no es válido');

/**
 * Validación de rol de avalúo SII (formato XXXXX-XXXXX)
 */
export const rolAvaluoSchema = z
  .string()
  .min(1, 'Ingrese el rol de avalúo')
  .regex(
    /^\d{1,5}-\d{1,5}$/,
    'El rol debe tener formato XXXXX-XXXXX (ej: 00372-00010)'
  );

/**
 * Validación de fecha que no sea futura
 */
export const fechaPasadaSchema = z
  .string()
  .min(1, 'Ingrese la fecha')
  .refine((fecha) => {
    if (!fecha) return false;
    const fechaIngresada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    return fechaIngresada <= hoy;
  }, 'La fecha no puede ser futura');

/**
 * Validación de monto en pesos (positivo)
 */
export const montoPositivoSchema = z
  .number()
  .min(0, 'El monto no puede ser negativo')
  .max(10000000000, 'El monto parece demasiado alto');

// =====================================================
// PASO 1: DATOS PERSONALES
// =====================================================

export const datosPersonalesSchema = z.object({
  nombreCompleto: z
    .string()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(100, 'El nombre es demasiado largo'),

  rut: rutSchema,

  fechaNacimiento: z
    .string()
    .min(1, 'Ingrese la fecha de nacimiento')
    .refine((fecha) => {
      if (!fecha || fecha.includes('00')) return false;
      const hoy = new Date();
      const nacimiento = new Date(fecha);
      const edad = Math.floor(
        (hoy.getTime() - nacimiento.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
      return edad >= 60;
    }, 'Debe tener al menos 60 años para usar este servicio'),

  nacionalidad: z.string().default('Chilena'),

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

export type DatosPersonalesForm = z.infer<typeof datosPersonalesSchema>;

// =====================================================
// PASO 2: DATOS DE LA PROPIEDAD
// =====================================================

export const datosPropiedadSchema = z.object({
  mismoQueDomicilio: z.boolean().default(false),

  direccionPropiedad: z
    .string()
    .min(10, 'Ingrese la dirección completa de la propiedad')
    .max(200, 'La dirección es demasiado larga'),

  comunaPropiedad: z.string().min(1, 'Seleccione la comuna de la propiedad'),
  regionPropiedad: z.string().min(1, 'Seleccione la región de la propiedad'),

  rolAvaluo: rolAvaluoSchema,

  avaluoFiscalVigente: z
    .number()
    .min(1000000, 'El avalúo fiscal parece muy bajo')
    .max(10000000000, 'El avalúo fiscal parece demasiado alto'),

  conoceInscripcion: z.boolean().default(false),
  inscripcionFojas: z.number().positive().optional(),
  inscripcionNumero: z.number().positive().optional(),
  inscripcionAnio: z
    .number()
    .min(1900, 'El año debe ser posterior a 1900')
    .max(new Date().getFullYear(), 'El año no puede ser futuro')
    .optional(),
  conservador: z.string().max(100).optional(),

  tipoPropietario: z.enum(['unico', 'con_conyuge', 'con_hijos', 'otro'], {
    message: 'Seleccione el tipo de propiedad',
  }),

  destinoHabitacional: z.boolean().default(true),
});

export type DatosPropiedadForm = z.infer<typeof datosPropiedadSchema>;

// =====================================================
// PASO 3: SITUACION ECONOMICA
// =====================================================

export const datosEconomicosSchema = z.object({
  ingresoMensual: z
    .number()
    .min(0, 'El ingreso no puede ser negativo')
    .max(100000000, 'El ingreso parece demasiado alto'),

  fuentesIngreso: z
    .array(z.enum(['pgu', 'pension_afp', 'pension_sobrevivencia', 'arriendos', 'otros']))
    .min(1, 'Seleccione al menos una fuente de ingresos'),

  fuenteIngresoOtros: z.string().max(200).optional(),

  estaEnRSH: z.enum(['si', 'no', 'no_se'], {
    message: 'Indique si está inscrito en el Registro Social de Hogares',
  }),

  tramoRSH: z.enum(['40', '50', '60', '70', '80', '90']).optional(),

  tieneOtrasPropiedades: z.boolean(),

  tieneBeneficioActual: z.enum(['ninguno', 'parcial_50', 'total_100'], {
    message: 'Indique si tiene algún beneficio actualmente',
  }),
}).refine(
  (data) => {
    // Si está en RSH, debe indicar el tramo
    if (data.estaEnRSH === 'si' && !data.tramoRSH) {
      return false;
    }
    return true;
  },
  {
    message: 'Si está inscrito en el RSH, debe indicar en qué tramo',
    path: ['tramoRSH'],
  }
).refine(
  (data) => {
    // Si seleccionó "otros" en fuentes, debe especificar
    if (data.fuentesIngreso.includes('otros') && !data.fuenteIngresoOtros) {
      return false;
    }
    return true;
  },
  {
    message: 'Especifique cuáles son sus otros ingresos',
    path: ['fuenteIngresoOtros'],
  }
);

export type DatosEconomicosForm = z.infer<typeof datosEconomicosSchema>;

// =====================================================
// PASO 4: CONTRIBUCIONES
// =====================================================

export const giroSchema = z.object({
  numeroGiro: z.string().min(1, 'Ingrese el número de giro'),
  fechaGiro: fechaPasadaSchema,
  monto: z
    .number()
    .min(1, 'Ingrese el monto del giro')
    .max(100000000, 'El monto parece demasiado alto'),
});

export const datosContribucionesSchema = z.object({
  montoContribucionTrimestral: z
    .number()
    .min(1, 'Ingrese el monto de la contribución trimestral')
    .max(100000000, 'El monto parece demasiado alto'),

  tieneGirosPendientes: z.boolean(),

  giros: z.array(giroSchema).default([]),
}).refine(
  (data) => {
    // Si tiene giros pendientes, debe agregar al menos uno
    if (data.tieneGirosPendientes && data.giros.length === 0) {
      return false;
    }
    return true;
  },
  {
    message: 'Debe agregar al menos un giro para impugnar',
    path: ['giros'],
  }
);

export type DatosContribucionesForm = z.infer<typeof datosContribucionesSchema>;
export type GiroForm = z.infer<typeof giroSchema>;

// =====================================================
// PASO 5: PROCEDIMIENTO PREVIO
// =====================================================

export const procedimientoPrevioSchema = z.object({
  presentoSolicitudSII: z.boolean(),
  fechaSolicitud: z.string().optional(),

  recibioDenegatoria: z.boolean(),
  numeroResolucion: z.string().max(50).optional(),
  fechaResolucion: z.string().optional(),
}).refine(
  (data) => {
    // Si presentó solicitud, debe indicar la fecha
    if (data.presentoSolicitudSII && !data.fechaSolicitud) {
      return false;
    }
    return true;
  },
  {
    message: 'Indique la fecha en que presentó la solicitud',
    path: ['fechaSolicitud'],
  }
).refine(
  (data) => {
    // Si recibió denegatoria, debe indicar número y fecha
    if (data.recibioDenegatoria && (!data.numeroResolucion || !data.fechaResolucion)) {
      return false;
    }
    return true;
  },
  {
    message: 'Indique el número y fecha de la resolución denegatoria',
    path: ['numeroResolucion'],
  }
);

export type ProcedimientoPrevioForm = z.infer<typeof procedimientoPrevioSchema>;

// =====================================================
// SCHEMA COMPLETO (LEGACY - para compatibilidad)
// =====================================================

export const datosTributariosSchema = z.object({
  ingresoMensual: z.number().min(0),
  fuenteIngresos: z.enum(['pension', 'arriendos', 'otros', 'mixto']),
  tieneOtrasPropiedades: z.boolean(),
  tieneBeneficioActual: z.boolean(),
  tipoBeneficioActual: z.string().optional(),
  montoContribucionTrimestral: z.number().min(0),
});

export const formularioCompletoSchema = z.object({
  datosPersonales: datosPersonalesSchema,
  datosPropiedad: datosPropiedadSchema,
  datosEconomicos: datosEconomicosSchema,
  datosContribuciones: datosContribucionesSchema,
  procedimientoPrevio: procedimientoPrevioSchema,
});

export type DatosTributariosForm = z.infer<typeof datosTributariosSchema>;

// =====================================================
// UTILIDADES DE CALCULO
// =====================================================

/**
 * Calcula la edad a partir de la fecha de nacimiento
 */
export function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

/**
 * Calcula el ingreso anual a partir del mensual
 */
export function calcularIngresoAnual(ingresoMensual: number): number {
  return ingresoMensual * 12;
}

/**
 * Calcula la contribución anual a partir de la trimestral
 */
export function calcularContribucionAnual(trimestral: number): number {
  return trimestral * 4;
}

/**
 * Calcula el porcentaje que representan las contribuciones del ingreso
 */
export function calcularPorcentajeIngresos(contribucionAnual: number, ingresoAnual: number): number {
  if (ingresoAnual === 0) return 0;
  return (contribucionAnual / ingresoAnual) * 100;
}

/**
 * Determina si el porcentaje es desproporcionado (> 10%)
 */
export function esDesproporcionado(porcentaje: number): boolean {
  return porcentaje > 10;
}

/**
 * Calcula los días desde una fecha hasta hoy
 */
export function diasDesde(fechaISO: string): number {
  const fecha = new Date(fechaISO);
  const hoy = new Date();
  const diferencia = hoy.getTime() - fecha.getTime();
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
}

/**
 * Verifica si la fecha está dentro de los 30 días
 */
export function dentroDelPlazo(fechaISO: string): boolean {
  return diasDesde(fechaISO) <= 30;
}
