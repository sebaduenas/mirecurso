// Datos fijos basados en el precedente Marina Latorre (Rol 20732-2024, C.A. Santiago)

/**
 * Datos del Servicio de Impuestos Internos (recurrido)
 */
export const RECURRIDO = {
  nombre: "Servicio de Impuestos Internos",
  sigla: "SII",
  rut: "60.803.000-K",
  director: "Javier Etcheberry Celhay",  // Actualizar si cambia
  rutDirector: "4.891.404-7",
  domicilio: "Teatinos N°120",
  comuna: "Santiago",
  ciudad: "Santiago"
};

/**
 * Datos de la Tesorería General de la República
 */
export const TESORERIA = {
  nombre: "Tesorería General de la República",
  sigla: "TGR",
  rut: "60.805.000-0",
  domicilio: "Teatinos N°120",
  comuna: "Santiago"
};

/**
 * Precedente judicial: Caso Marina Latorre
 * Sentencia firme que establece la interpretación favorable
 */
export const PRECEDENTE = {
  rol: "20732-2024",
  tribunal: "Corte de Apelaciones de Santiago",
  tribunalCorto: "C.A. de Santiago",
  fecha: "21 de enero de 2026",
  fechaISO: "2026-01-21",
  caratula: "Latorre con Servicio de Impuestos Internos",
  recurrente: "Marina Latorre Salinas",
  resultado: "Acogido",
  costas: "Sin costas",
  ministros: [
    {
      nombre: "Miguel Eduardo Vázquez Plaza",
      cargo: "Ministro"
    },
    {
      nombre: "Luis Guillermo Hernández Olmedo",
      cargo: "Abogado Integrante"
    }
  ],
  argumentoClave: `La Corte distinguió entre requisitos "esenciales" y "adjetivos" de la Ley 20.732. Los requisitos N°1 (edad), N°2 (ingresos) y N°3 (destino habitacional) son esenciales, mientras que el N°4 (tope de avalúo fiscal) es "adjetivo, no esencial" y opera únicamente como límite cuantitativo del beneficio.`,
  siiNoApelo: true,
  sentenciaFirme: true
};

/**
 * Normativa aplicable al recurso
 */
export const NORMATIVA = {
  constitucion: {
    articulo20: "Recurso de protección",
    articulo19_1: "Derecho a la vida e integridad física y psíquica",
    articulo19_2: "Igualdad ante la ley",
    articulo19_20: "Igual repartición de los tributos",
    articulo19_24: "Derecho de propiedad"
  },
  ley20732: {
    nombre: "Ley N° 20.732",
    descripcion: "Rebaja del impuesto territorial para adultos mayores",
    requisitos: {
      1: "Tener 60 años de edad o más",
      2: "Percibir ingresos que no excedan los límites establecidos",
      3: "El bien raíz debe estar destinado a la habitación",
      4: "El avalúo fiscal no debe exceder el monto máximo (requisito adjetivo según precedente)"
    }
  },
  convencionPersonasMayores: {
    nombre: "Convención Interamericana sobre la Protección de los Derechos Humanos de las Personas Mayores",
    articulos: {
      12: "Derecho a la independencia y autonomía",
      24: "Derecho a la vivienda"
    },
    ratificacion: "Chile ratificó esta convención"
  }
};

/**
 * Topes vigentes de la Ley 20.732
 * IMPORTANTE: Actualizar semestralmente
 */
export const TOPES_LEY_20732 = {
  vigenciaDesde: "2024-07-01",
  vigenciaHasta: "2024-12-31",
  // Tope de avalúo fiscal máximo para acceder al beneficio
  // Según precedente Marina Latorre, este tope es "adjetivo, no esencial"
  topeAvaluoMaximo: 224000000,  // $224 millones
  // Ingreso máximo anual para rebaja del 100%
  ingresoMaximo100_UTA: 13.5,
  // Ingreso máximo anual para rebaja del 50%
  ingresoMaximo50_UTA: 30,
  // Valor de la UTA (Unidad Tributaria Anual)
  // Actualizar mensualmente según SII
  valorUTA: 836532,
  // Valores calculados
  get ingresoMaximo100(): number {
    return this.ingresoMaximo100_UTA * this.valorUTA;
  },
  get ingresoMaximo50(): number {
    return this.ingresoMaximo50_UTA * this.valorUTA;
  }
};

/**
 * Estados civiles con texto para el documento
 */
export const ESTADOS_CIVILES = {
  soltero: { valor: 'soltero', textoMasculino: 'soltero', textoFemenino: 'soltera' },
  casado: { valor: 'casado', textoMasculino: 'casado', textoFemenino: 'casada' },
  viudo: { valor: 'viudo', textoMasculino: 'viudo', textoFemenino: 'viuda' },
  divorciado: { valor: 'divorciado', textoMasculino: 'divorciado', textoFemenino: 'divorciada' },
  conviviente_civil: { valor: 'conviviente_civil', textoMasculino: 'conviviente civil', textoFemenino: 'conviviente civil' }
} as const;

/**
 * Fuentes de ingreso con texto descriptivo
 */
export const FUENTES_INGRESO = {
  pgu: { valor: 'pgu', texto: 'Pensión Garantizada Universal (PGU)', corto: 'PGU' },
  pension_afp: { valor: 'pension_afp', texto: 'Pensión de AFP', corto: 'AFP' },
  pension_sobrevivencia: { valor: 'pension_sobrevivencia', texto: 'Pensión de sobrevivencia', corto: 'Sobrevivencia' },
  arriendos: { valor: 'arriendos', texto: 'Arriendos', corto: 'Arriendos' },
  otros: { valor: 'otros', texto: 'Otros ingresos', corto: 'Otros' }
} as const;

/**
 * Tipos de propietario
 */
export const TIPOS_PROPIETARIO = {
  unico: { valor: 'unico', texto: 'Soy el único propietario' },
  con_conyuge: { valor: 'con_conyuge', texto: 'Soy propietario junto con mi cónyuge' },
  con_hijos: { valor: 'con_hijos', texto: 'Soy propietario junto con mis hijos' },
  otro: { valor: 'otro', texto: 'Otra situación de copropiedad' }
} as const;

/**
 * Tramos del Registro Social de Hogares
 */
export const TRAMOS_RSH = {
  '40': { valor: '40', texto: '40% - Más vulnerable', descripcion: 'Pertenece al 40% más vulnerable' },
  '50': { valor: '50', texto: '50%', descripcion: 'Pertenece al 50% más vulnerable' },
  '60': { valor: '60', texto: '60%', descripcion: 'Pertenece al 60% más vulnerable' },
  '70': { valor: '70', texto: '70%', descripcion: 'Pertenece al 70% más vulnerable' },
  '80': { valor: '80', texto: '80%', descripcion: 'Pertenece al 80% más vulnerable' },
  '90': { valor: '90', texto: '90%', descripcion: 'Pertenece al 90% más vulnerable' }
} as const;

/**
 * Tipos de beneficio actual
 */
export const TIPOS_BENEFICIO = {
  ninguno: { valor: 'ninguno', texto: 'No tengo ningún beneficio actualmente' },
  parcial_50: { valor: 'parcial_50', texto: 'Tengo rebaja del 50%' },
  total_100: { valor: 'total_100', texto: 'Tengo rebaja del 100%' }
} as const;

/**
 * Documentos que se deben acompañar al recurso
 */
export const DOCUMENTOS_REQUERIDOS = [
  {
    id: 1,
    nombre: "Copia de cédula de identidad",
    descripcion: "Por ambos lados",
    obligatorio: true
  },
  {
    id: 2,
    nombre: "Certificado de avalúo fiscal",
    descripcion: "Obtener en sii.cl o en oficina del SII",
    obligatorio: true
  },
  {
    id: 3,
    nombre: "Última boleta de contribuciones",
    descripcion: "O certificado de deuda de contribuciones",
    obligatorio: true
  },
  {
    id: 4,
    nombre: "Liquidación de pensión o certificado de ingresos",
    descripcion: "Del mes más reciente",
    obligatorio: true
  },
  {
    id: 5,
    nombre: "Certificado de Registro Social de Hogares",
    descripcion: "Obtener en registrosocial.gob.cl",
    obligatorio: false
  },
  {
    id: 6,
    nombre: "Copia de la resolución denegatoria del SII",
    descripcion: "Si presentó solicitud previa y fue rechazada",
    obligatorio: false,
    condicional: "procedimientoPrevio.recibioDenegatoria"
  },
  {
    id: 7,
    nombre: "Certificado de dominio vigente",
    descripcion: "Del Conservador de Bienes Raíces",
    obligatorio: false
  }
];

/**
 * Textos de ayuda para el formulario
 */
export const TEXTOS_AYUDA = {
  rolAvaluo: "El rol de avalúo es el número que identifica su propiedad ante el SII. Lo encuentra en la boleta de contribuciones o en sii.cl. Tiene formato XXXXX-XXXXX (ej: 00372-00010).",
  avaluoFiscal: "El avalúo fiscal es el valor que el SII asigna a su propiedad. Lo encuentra en el certificado de avalúo fiscal en sii.cl o solicitándolo en una oficina del SII.",
  inscripcionConservador: "Esta información aparece en la escritura de compraventa o en un certificado de dominio del Conservador de Bienes Raíces. Si no la tiene a mano, puede dejarla en blanco.",
  registroSocialHogares: "El Registro Social de Hogares es una base de datos del Estado que determina la vulnerabilidad de los hogares. Puede consultar si está inscrito en registrosocial.gob.cl",
  giros: "Los giros son los cobros específicos de contribuciones que ha recibido. El número de giro aparece en la boleta de pago.",
  plazo30Dias: "El recurso de protección debe presentarse dentro de los 30 días siguientes al acto que lo motiva. Sin embargo, cuando el agravio es permanente (como el cobro continuo de contribuciones), el recurso sigue siendo procedente."
};

/**
 * Calcula si el ingreso anual califica para rebaja
 */
export function calcularTipoRebaja(ingresoAnual: number): 'total' | 'parcial' | 'ninguna' {
  const { valorUTA, ingresoMaximo100_UTA, ingresoMaximo50_UTA } = TOPES_LEY_20732;
  const ingresoEnUTA = ingresoAnual / valorUTA;

  if (ingresoEnUTA <= ingresoMaximo100_UTA) {
    return 'total';
  } else if (ingresoEnUTA <= ingresoMaximo50_UTA) {
    return 'parcial';
  }
  return 'ninguna';
}

/**
 * Calcula los días transcurridos desde una fecha
 */
export function diasDesde(fechaISO: string): number {
  const fecha = new Date(fechaISO);
  const hoy = new Date();
  const diferencia = hoy.getTime() - fecha.getTime();
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
}

/**
 * Verifica si está dentro del plazo de 30 días
 */
export function dentroDelPlazo30Dias(fechaISO: string): boolean {
  return diasDesde(fechaISO) <= 30;
}
