import type { FormularioCompleto } from '@/types/formulario';
import { RECURRIDO, PRECEDENTE, NORMATIVA, ESTADOS_CIVILES, FUENTES_INGRESO, TOPES_LEY_20732 } from './datos-fijos';

// =====================================================
// UTILIDADES DE FORMATO
// =====================================================

export function formatearPesos(monto: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto);
}

export function formatearFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  const opciones: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return fecha.toLocaleDateString('es-CL', opciones);
}

export function formatearFechaCorta(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-CL');
}

export function calcularPorcentaje(parte: number, total: number): string {
  if (total === 0) return '0';
  return ((parte / total) * 100).toFixed(1);
}

function getEstadoCivilTexto(estadoCivil: string): string {
  const estado = ESTADOS_CIVILES[estadoCivil as keyof typeof ESTADOS_CIVILES];
  return estado ? estado.textoMasculino : estadoCivil;
}

function getFuentesIngresoTexto(fuentes: string[]): string {
  if (!fuentes || fuentes.length === 0) return 'pensionado/a';

  const textos = fuentes.map((f) => {
    const fuente = FUENTES_INGRESO[f as keyof typeof FUENTES_INGRESO];
    return fuente ? fuente.texto : f;
  });

  if (textos.length === 1) return textos[0];
  if (textos.length === 2) return `${textos[0]} y ${textos[1]}`;
  return textos.slice(0, -1).join(', ') + ' y ' + textos[textos.length - 1];
}

function formatearGiros(giros: Array<{ numeroGiro: string; fechaGiro: string; monto: number }>): string {
  if (!giros || giros.length === 0) return '';

  return giros.map((giro, index) => {
    return `${index + 1}. Giro N° ${giro.numeroGiro}, de fecha ${formatearFecha(giro.fechaGiro)}, por la suma de ${formatearPesos(giro.monto)}.`;
  }).join('\n');
}

// =====================================================
// GENERACION DEL RECURSO DE PROTECCION
// Basado en el recurso real de Marina Latorre (Rol 20732-2024)
// =====================================================

export function generarRecurso(datos: FormularioCompleto): string {
  const {
    datosPersonales,
    datosPropiedad,
    datosEconomicos,
    datosContribuciones,
    procedimientoPrevio,
    datosRecurso,
    validaciones,
  } = datos;

  const contribucionAnual = datosContribuciones.montoContribucionTrimestral * 4;
  const ingresoAnual = datosEconomicos.ingresoMensual * 12;
  const porcentajeIngresos = ingresoAnual > 0 ? ((contribucionAnual / ingresoAnual) * 100).toFixed(1) : '0';

  // Determinar si es caso tipo Marina Latorre (excede tope de avalúo)
  const esCasoMarinaLatorre = validaciones.excedeTopeAvaluo;

  // Sección de giros impugnados
  const seccionGiros = datosContribuciones.tieneGirosPendientes && datosContribuciones.giros.length > 0
    ? `\nEspecíficamente, solicito dejar sin efecto los siguientes giros de contribuciones que han sido emitidos en mi contra:\n\n${formatearGiros(datosContribuciones.giros)}\n`
    : '';

  // Sección de procedimiento previo ante el SII
  const seccionProcedimientoPrevio = procedimientoPrevio.presentoSolicitudSII
    ? `
CUARTO: Que con fecha ${formatearFecha(procedimientoPrevio.fechaSolicitud || '')}, presenté ante el Servicio de Impuestos Internos una solicitud formal requiriendo la aplicación del beneficio de rebaja de contribuciones establecido en la Ley N° 20.732, en atención a mi condición de adulto mayor con ingresos limitados.

${procedimientoPrevio.recibioDenegatoria
        ? `QUINTO: Que mediante Resolución N° ${procedimientoPrevio.numeroResolucion}, de fecha ${formatearFecha(procedimientoPrevio.fechaResolucion || '')}, el Servicio de Impuestos Internos rechazó mi solicitud, constituyendo dicho acto la acción arbitraria e ilegal que motiva el presente recurso.`
        : 'QUINTO: Que a la fecha no he recibido respuesta formal a mi solicitud, lo que constituye una omisión arbitraria por parte del Servicio de Impuestos Internos.'
      }`
    : '';

  // Argumento especial para casos que exceden el tope de avalúo (como Marina Latorre)
  const argumentoMarinaLatorre = esCasoMarinaLatorre
    ? `
Cabe destacar especialmente que, si bien el avalúo fiscal de mi propiedad (${formatearPesos(datosPropiedad.avaluoFiscalVigente)}) excede el tope establecido en el artículo 1° N°4 de la Ley 20.732 (${formatearPesos(TOPES_LEY_20732.topeAvaluoMaximo)}), la Ilustrísima Corte de Apelaciones de Santiago, en causa Rol N° ${PRECEDENTE.rol}, caratulada "${PRECEDENTE.caratula}", con fecha ${PRECEDENTE.fecha}, estableció expresamente que dicho requisito es "adjetivo, no esencial" y opera únicamente como límite cuantitativo del beneficio, no como requisito de procedencia.

La Corte distinguió entre los requisitos "esenciales" de la Ley 20.732 (N°1: edad de 60 años o más; N°2: ingresos dentro de los límites; N°3: destino habitacional del inmueble) y el requisito "adjetivo" (N°4: tope de avalúo fiscal), determinando que este último no puede impedir el acceso al beneficio cuando se cumplen los requisitos esenciales.

Dicha sentencia quedó firme y ejecutoriada al no haber sido apelada por el Servicio de Impuestos Internos, constituyendo un precedente judicial plenamente aplicable al caso de autos.`
    : '';

  // Sección de desproporción si aplica
  const seccionDesproporcion = validaciones.porcentajeDesproporcionado
    ? `
Resulta especialmente grave que las contribuciones exigidas representan el ${porcentajeIngresos}% de mis ingresos anuales, lo que configura una carga manifiestamente desproporcionada que amenaza directamente mi capacidad de subsistencia y el mantenimiento de mi vivienda.`
    : '';

  return `EN LO PRINCIPAL: Recurso de protección.
PRIMER OTROSÍ: Acompaña documentos que indica.
SEGUNDO OTROSÍ: Orden de no innovar.

ILTMA. CORTE DE APELACIONES DE ${datosRecurso.corteApelaciones.toUpperCase().replace('CORTE DE APELACIONES DE ', '')}

${datosPersonales.nombreCompleto}, nacionalidad ${datosPersonales.nacionalidad || 'chilena'}, cédula nacional de identidad N° ${datosPersonales.rut}, ${getEstadoCivilTexto(datosPersonales.estadoCivil)}, ${datosPersonales.profesion}, de ${datosPersonales.edad} años de edad, domiciliado/a en ${datosPersonales.domicilio}, comuna de ${datosPersonales.comuna}, Región ${datosPersonales.region}${datosPersonales.telefono ? `, teléfono ${datosPersonales.telefono}` : ''}${datosPersonales.email ? `, correo electrónico ${datosPersonales.email}` : ''}, a US. ILTMA. respetuosamente digo:

Que vengo en interponer recurso de protección en contra del ${RECURRIDO.nombre}, RUT ${RECURRIDO.rut}, representado legalmente por su Director Nacional don ${RECURRIDO.director}, domiciliado para estos efectos en ${RECURRIDO.domicilio}, comuna de ${RECURRIDO.comuna}, por el acto ilegal y arbitrario que más adelante se describirá, el cual vulnera las garantías constitucionales establecidas en el artículo 19, numerales 1°, 2°, 20° y 24° de la Constitución Política de la República.

I. ACCIÓN ARBITRARIA Y/O ILEGAL

PRIMERO: Que soy legítimo/a propietario/a del inmueble ubicado en ${datosPropiedad.direccionPropiedad}, comuna de ${datosPropiedad.comunaPropiedad}, Región ${datosPropiedad.regionPropiedad}, ${datosPropiedad.conoceInscripcion && datosPropiedad.inscripcionFojas ? `inscrito a fojas ${datosPropiedad.inscripcionFojas} N° ${datosPropiedad.inscripcionNumero} del año ${datosPropiedad.inscripcionAnio} del ${datosPropiedad.conservador}, ` : ''}identificado con Rol de Avalúo N° ${datosPropiedad.rolAvaluo}, cuyo avalúo fiscal vigente asciende a la suma de ${formatearPesos(datosPropiedad.avaluoFiscalVigente)}.

Dicho inmueble constituye mi vivienda habitual y permanente, donde resido desde hace años, siendo destinado exclusivamente a habitación.

SEGUNDO: Que mis ingresos mensuales ascienden aproximadamente a la suma de ${formatearPesos(datosEconomicos.ingresoMensual)}, lo que equivale a un ingreso anual de ${formatearPesos(ingresoAnual)}, provenientes de ${getFuentesIngresoTexto(datosEconomicos.fuentesIngreso)}.${datosEconomicos.estaEnRSH === 'si' ? ` Me encuentro inscrito/a en el Registro Social de Hogares, en el tramo ${datosEconomicos.tramoRSH}% más vulnerable.` : ''}

TERCERO: Que actualmente el Servicio de Impuestos Internos me exige el pago de contribuciones de bienes raíces por un monto de ${formatearPesos(datosContribuciones.montoContribucionTrimestral)} trimestrales, equivalentes a ${formatearPesos(contribucionAnual)} anuales.${seccionDesproporcion}
${seccionGiros}
${seccionProcedimientoPrevio}

${seccionProcedimientoPrevio ? 'SEXTO' : 'CUARTO'}: Que ${datosEconomicos.tieneBeneficioActual === 'parcial_50' ? 'si bien cuento con una rebaja del 50% en mis contribuciones, esta resulta insuficiente considerando' : datosEconomicos.tieneBeneficioActual === 'total_100' ? 'si bien formalmente cuento con el beneficio de exención, en la práctica se me sigue exigiendo el pago de contribuciones, desconociéndose' : 'no cuento con ningún beneficio de rebaja de contribuciones, a pesar de'} mi condición de adulto mayor con ingresos limitados, configurándose una situación de manifiesta desproporción entre el tributo exigido y mi capacidad contributiva real.

II. DERECHOS Y GARANTÍAS CONCULCADAS

El presente recurso se funda en lo dispuesto en el artículo 20 de la Constitución Política de la República, en relación con las garantías constitucionales consagradas en los numerales 1°, 2°, 20° y 24° del artículo 19 del mismo cuerpo normativo.

El cobro de contribuciones de bienes raíces sin considerar la capacidad económica real del contribuyente adulto mayor vulnera:

a) El derecho a la vida e integridad física y psíquica de la persona (artículo 19 N° 1), toda vez que el cobro de contribuciones desproporcionadas afecta directamente mi tranquilidad, bienestar y calidad de vida, generando una situación de angustia permanente ante la posibilidad de perder mi vivienda.

b) El derecho a la igualdad ante la ley (artículo 19 N° 2), toda vez que se aplica un gravamen que no distingue la situación particular de las personas de tercera edad con ingresos limitados, generando una discriminación arbitraria respecto de quienes, encontrándose en similares condiciones, sí acceden a beneficios tributarios.

c) El derecho a la igual repartición de los tributos y demás cargas públicas (artículo 19 N° 20), al imponer una carga tributaria manifiestamente desproporcionada e injusta en relación con la capacidad económica del contribuyente.

d) El derecho de propiedad (artículo 19 N° 24), al establecer una carga que puede derivar en la imposibilidad de mantener la propiedad del inmueble, única vivienda del recurrente.

Adicionalmente, el actuar del recurrido contraviene la Convención Interamericana sobre la Protección de los Derechos Humanos de las Personas Mayores, ratificada por Chile, particularmente sus artículos 12 (derecho a la independencia y autonomía) y 24 (derecho a la vivienda), que obligan al Estado a adoptar medidas para que las personas mayores tengan acceso a vivienda digna y adecuada.

III. PRECEDENTE JUDICIAL APLICABLE
${argumentoMarinaLatorre || `
La Ilustrísima Corte de Apelaciones de Santiago, en causa Rol N° ${PRECEDENTE.rol}, caratulada "${PRECEDENTE.caratula}", con fecha ${PRECEDENTE.fecha}, acogió un recurso de protección interpuesto por una adulta mayor de 100 años en circunstancias similares a las del presente caso, estableciendo que el cobro de contribuciones de bienes raíces sin considerar la capacidad contributiva real del adulto mayor constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales antes señaladas.

Dicha sentencia quedó firme y ejecutoriada al no haber sido apelada por el Servicio de Impuestos Internos, constituyendo un valioso precedente judicial que resulta plenamente aplicable al caso de autos.`}

IV. PETITORIO

POR TANTO, en mérito de lo expuesto y de conformidad con lo dispuesto en el artículo 20 de la Constitución Política de la República y el Auto Acordado de la Excma. Corte Suprema sobre tramitación y fallo del recurso de protección,

SOLICITO A US. ILTMA. se sirva:

1. Tener por interpuesto recurso de protección en contra del ${RECURRIDO.nombre}, en la persona de su Director Nacional.

2. Ordenar al recurrido informar dentro del plazo legal.

3. Acoger el presente recurso y declarar que el acto de cobro de contribuciones de bienes raíces respecto del inmueble Rol N° ${datosPropiedad.rolAvaluo} constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales del recurrente.

4. Como medida de protección, ordenar al ${RECURRIDO.nombre}:
   a) Cesar inmediatamente el cobro de las contribuciones impugnadas.
   b) Otorgar la rebaja de contribuciones que en derecho corresponda conforme a la Ley N° 20.732 y la situación económica del recurrente.
   c) Reliquidar las contribuciones cobradas indebidamente y restituir lo pagado en exceso, si correspondiere.
${datosContribuciones.tieneGirosPendientes ? `   d) Dejar sin efecto los giros de contribuciones individualizados en el cuerpo de este recurso.` : ''}

5. Condenar en costas al recurrido.

PRIMER OTROSÍ: Solicito a US. Iltma. tener por acompañados los siguientes documentos:

1. Copia de cédula de identidad del recurrente (por ambos lados).
2. Certificado de avalúo fiscal del inmueble emitido por el SII.
3. Copia de boleta de contribuciones o certificado de deuda.
4. Certificado de cotizaciones, liquidación de pensión o comprobante de ingresos.${datosEconomicos.estaEnRSH === 'si' ? '\n5. Certificado del Registro Social de Hogares.' : ''}${procedimientoPrevio.recibioDenegatoria ? '\n6. Copia de la resolución denegatoria del SII.' : ''}

SEGUNDO OTROSÍ: Solicito a US. Iltma. que, atendida la naturaleza de los derechos afectados y la urgencia de la situación, se sirva decretar orden de no innovar, ordenando al ${RECURRIDO.nombre} y a la Tesorería General de la República abstenerse de efectuar gestiones de cobro respecto de las contribuciones impugnadas mientras se tramita y resuelve el presente recurso.

TERCER OTROSÍ: Solicito a US. Iltma. tener presente que comparezco personalmente, sin patrocinio de abogado, de conformidad con lo dispuesto en el artículo 2° de la Ley N° 18.120, sobre Comparecencia en Juicio.




_______________________________________
${datosPersonales.nombreCompleto}
RUT: ${datosPersonales.rut}

En ${datosPropiedad.comunaPropiedad}, a ${formatearFecha(datosRecurso.fechaGeneracion)}`;
}

// =====================================================
// DISCLAIMER LEGAL
// =====================================================

export const DISCLAIMER_PDF = `
AVISO LEGAL IMPORTANTE

Este documento ha sido generado automáticamente por mirecurso.cl basándose en la información proporcionada por el usuario y en el precedente judicial establecido en la causa Rol N° 20732-2024 de la Corte de Apelaciones de Santiago (caso Marina Latorre).

Este servicio NO constituye asesoría legal profesional. Cada caso es evaluado individualmente por los tribunales y el resultado puede variar según las circunstancias particulares.

El usuario es responsable de verificar la exactitud de la información ingresada y de los documentos acompañados. Se recomienda consultar con un abogado si tiene dudas sobre su situación particular.

Los datos personales ingresados se almacenan únicamente en el dispositivo del usuario y no son transmitidos ni almacenados en servidores externos.
`;

export const INSTRUCCIONES_PRESENTACION = `
INSTRUCCIONES PARA PRESENTAR EL RECURSO

1. IMPRIMA EL DOCUMENTO
   - Imprima el recurso en papel tamaño carta.
   - Imprima también todos los documentos de respaldo.

2. FIRME EL RECURSO
   - Firme el recurso al final, donde aparece su nombre.
   - La firma debe ser igual a la de su cédula de identidad.

3. PREPARE LOS DOCUMENTOS ADJUNTOS
   - Copia de su cédula de identidad (por ambos lados).
   - Certificado de avalúo fiscal (obténgalo en sii.cl).
   - Boleta de contribuciones o certificado de deuda.
   - Liquidación de pensión o certificado de ingresos.
   - Certificado del Registro Social de Hogares (si aplica).
   - Resolución denegatoria del SII (si aplica).

4. PRESENTE EL RECURSO
   - Diríjase a la Corte de Apelaciones indicada en el documento.
   - Solicite ingresar un "recurso de protección".
   - Entregue el recurso y todos los documentos adjuntos.
   - Pida un comprobante de ingreso con el número de rol asignado.

5. SEGUIMIENTO
   - Con el número de rol, puede consultar el estado de su causa en:
     https://www.pjud.cl/consulta-unificada-de-causas
   - La Corte notificará al SII para que informe.
   - Usted será notificado de la resolución.

IMPORTANTE: El plazo para presentar el recurso es de 30 días desde el acto que lo motiva. Sin embargo, cuando el agravio es permanente (como el cobro continuo de contribuciones), el recurso sigue siendo procedente.
`;
