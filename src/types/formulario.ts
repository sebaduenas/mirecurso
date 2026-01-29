// Tipos actualizados basados en el precedente Marina Latorre (Rol 20732-2024, C.A. Santiago)

export type EstadoCivil = 'soltero' | 'casado' | 'viudo' | 'divorciado' | 'conviviente_civil';
export type FuenteIngreso = 'pgu' | 'pension_afp' | 'pension_sobrevivencia' | 'arriendos' | 'otros';
export type TipoPropietario = 'unico' | 'con_conyuge' | 'con_hijos' | 'otro';
export type RespuestaSINO = 'si' | 'no' | 'no_se';
export type TramoRSH = '40' | '50' | '60' | '70' | '80' | '90';
export type TipoBeneficio = 'ninguno' | 'parcial_50' | 'total_100';

export interface DatosPersonales {
  nombreCompleto: string;
  rut: string;
  fechaNacimiento: string;        // YYYY-MM-DD
  edad: number;                   // Calculado
  nacionalidad: string;           // Default: "Chilena"
  estadoCivil: EstadoCivil;
  profesion: string;              // Ej: "Jubilado/a", "Escritora"
  domicilio: string;              // Calle y número
  comuna: string;
  region: string;
  telefono?: string;
  email?: string;
}

export interface DatosPropiedad {
  // Dirección
  mismoQueDomicilio: boolean;     // Checkbox para copiar datos
  direccionPropiedad: string;
  comunaPropiedad: string;
  regionPropiedad: string;

  // Datos SII
  rolAvaluo: string;              // Formato: XXXXX-XXXXX (ej: 00372-00010)
  avaluoFiscalVigente: number;    // En pesos

  // Inscripción en Conservador (OPCIONAL)
  conoceInscripcion: boolean;
  inscripcionFojas?: number;
  inscripcionNumero?: number;
  inscripcionAnio?: number;
  conservador?: string;

  // Tipo de propiedad
  tipoPropietario: TipoPropietario;
  destinoHabitacional: boolean;   // Casi siempre true
}

export interface DatosEconomicos {
  ingresoMensual: number;
  ingresoAnual: number;           // Calculado: ingresoMensual * 12
  fuentesIngreso: FuenteIngreso[];
  fuenteIngresoOtros?: string;    // Si seleccionó "otros"

  estaEnRSH: RespuestaSINO;
  tramoRSH?: TramoRSH;            // Solo si estaEnRSH === 'si'

  tieneOtrasPropiedades: boolean;
  tieneBeneficioActual: TipoBeneficio;
}

export interface Giro {
  numeroGiro: string;
  fechaGiro: string;              // YYYY-MM-DD
  monto: number;
}

export interface DatosContribuciones {
  montoContribucionTrimestral: number;
  contribucionAnual: number;      // Calculado: trimestral * 4
  porcentajeIngresos: number;     // Calculado: (contribucionAnual / ingresoAnual) * 100

  tieneGirosPendientes: boolean;
  giros: Giro[];
}

export interface ProcedimientoPrevio {
  presentoSolicitudSII: boolean;
  fechaSolicitud?: string;        // YYYY-MM-DD
  recibioDenegatoria: boolean;
  numeroResolucion?: string;      // Ej: "213555"
  fechaResolucion?: string;       // YYYY-MM-DD - IMPORTANTE para plazo 30 días
}

export interface DatosRecurso {
  corteApelaciones: string;       // Determinado por región de la propiedad
  direccionCorte: string;
  fechaGeneracion: string;
}

export interface ValidacionesCaso {
  cumpleEdad: boolean;            // >= 60 años
  cumpleIngresos100: boolean;     // <= 13.5 UTA para 100%
  cumpleIngresos50: boolean;      // <= 30 UTA para 50%
  esHabitacional: boolean;
  excedeTopeAvaluo: boolean;      // Si excede, aplicar argumento Marina Latorre
  porcentajeDesproporcionado: boolean;  // Si contribuciones > 10% ingresos
  dentroDelPlazo: boolean;        // 30 días desde resolución denegatoria
}

export interface FormularioCompleto {
  datosPersonales: DatosPersonales;
  datosPropiedad: DatosPropiedad;
  datosEconomicos: DatosEconomicos;
  datosContribuciones: DatosContribuciones;
  procedimientoPrevio: ProcedimientoPrevio;
  datosRecurso: DatosRecurso;

  validaciones: ValidacionesCaso;

  metadata: {
    version: string;
    creadoEn: string;
    modificadoEn: string;
  };
}

// Tipos legacy para compatibilidad temporal con store existente
export interface DatosTributarios {
  ingresoMensual: number;
  ingresoAnual: number;
  fuenteIngresos: string;
  tieneOtrasPropiedades: boolean;
  montoContribucionTrimestral: number;
  tieneBeneficioActual: boolean;
  tipoBeneficioActual?: string;
}
