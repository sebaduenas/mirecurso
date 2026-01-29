export interface DatosPersonales {
  nombreCompleto: string;
  rut: string;
  fechaNacimiento: string;
  edad: number;
  domicilio: string;
  comuna: string;
  region: string;
  telefono?: string;
  email?: string;
  actuaRepresentante: boolean;
  representante?: {
    nombreCompleto: string;
    rut: string;
    parentesco: string;
  };
}

export interface DatosPropiedad {
  direccionPropiedad: string;
  comunaPropiedad: string;
  regionPropiedad: string;
  rolSII: string;
  avaluoFiscal: number;
  destinoPropiedad: 'habitacional' | 'otro';
  esPropietarioUnico: boolean;
  porcentajeDominio?: number;
}

export interface DatosTributarios {
  ingresoMensual: number;
  ingresoAnual: number;
  fuenteIngresos: 'pension' | 'arriendos' | 'otros' | 'mixto';
  tieneOtrasPropiedades: boolean;
  montoContribucionTrimestral: number;
  tieneBeneficioActual: boolean;
  tipoBeneficioActual?: string;
}

export interface DatosRecurso {
  corteApelaciones: string;
  direccionCorte: string;
  fechaGeneracion: string;
}

export interface FormularioCompleto {
  datosPersonales: DatosPersonales;
  datosPropiedad: DatosPropiedad;
  datosTributarios: DatosTributarios;
  datosRecurso: DatosRecurso;
  metadata: {
    version: string;
    creadoEn: string;
    modificadoEn: string;
    completado: boolean;
  };
}

export type FuenteIngresos = 'pension' | 'arriendos' | 'otros' | 'mixto';
export type DestinoPropiedad = 'habitacional' | 'otro';
