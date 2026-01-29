import type { FormularioCompleto } from '@/types/formulario';

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

export function calcularPorcentaje(parte: number, total: number): string {
  if (total === 0) return '0';
  return ((parte / total) * 100).toFixed(1);
}

export function getFuenteIngresosTexto(fuente: string): string {
  const textos: Record<string, string> = {
    pension: 'pensionado',
    arriendos: 'con ingresos provenientes de arriendos',
    otros: 'con otros ingresos',
    mixto: 'con ingresos de diversas fuentes',
  };
  return textos[fuente] || 'pensionado';
}

export function generarRecurso(datos: FormularioCompleto): string {
  const { datosPersonales, datosPropiedad, datosTributarios, datosRecurso } = datos;
  const contribucionAnual = datosTributarios.montoContribucionTrimestral * 4;
  const porcentajeIngresos = calcularPorcentaje(contribucionAnual, datosTributarios.ingresoAnual);

  return `EN LO PRINCIPAL: Recurso de protección.
PRIMER OTROSÍ: Acompaña documentos que indica.
SEGUNDO OTROSÍ: Patrocinio y poder.

ILTMA. CORTE DE APELACIONES DE ${datosRecurso.corteApelaciones.toUpperCase().replace('CORTE DE APELACIONES DE ', '')}

${datosPersonales.nombreCompleto}, cédula nacional de identidad N° ${datosPersonales.rut}, ${datosPersonales.edad} años de edad, ${getFuenteIngresosTexto(datosTributarios.fuenteIngresos)}, domiciliado en ${datosPersonales.domicilio}, comuna de ${datosPersonales.comuna}, Región ${datosPersonales.region}, a US. ILTMA. respetuosamente digo:

Que vengo en interponer recurso de protección en contra del SERVICIO DE IMPUESTOS INTERNOS, representado legalmente por su Director Nacional, domiciliado para estos efectos en calle Teatinos N° 120, comuna y ciudad de Santiago, por el acto ilegal y arbitrario que más adelante se describirá, el cual vulnera las garantías constitucionales establecidas en el artículo 19, numerales 2°, 20° y 24° de la Constitución Política de la República.

I. LOS HECHOS

PRIMERO: Que soy legítimo propietario del inmueble ubicado en ${datosPropiedad.direccionPropiedad}, comuna de ${datosPropiedad.comunaPropiedad}, Región ${datosPropiedad.regionPropiedad}, inscrito a nombre del recurrente, identificado con Rol de Avalúo N° ${datosPropiedad.rolSII}, cuyo avalúo fiscal vigente asciende a la suma de ${formatearPesos(datosPropiedad.avaluoFiscal)}.

SEGUNDO: Que mis ingresos mensuales ascienden aproximadamente a la suma de ${formatearPesos(datosTributarios.ingresoMensual)}, lo que equivale a un ingreso anual de ${formatearPesos(datosTributarios.ingresoAnual)}, provenientes principalmente de ${getFuenteIngresosTexto(datosTributarios.fuenteIngresos)}.

TERCERO: Que actualmente el Servicio de Impuestos Internos me exige el pago de contribuciones de bienes raíces por un monto de ${formatearPesos(datosTributarios.montoContribucionTrimestral)} trimestrales, equivalentes a ${formatearPesos(contribucionAnual)} anuales, lo que representa aproximadamente un ${porcentajeIngresos}% de mis ingresos anuales.

CUARTO: Que ${datosTributarios.tieneBeneficioActual ? 'si bien cuento con un beneficio parcial de rebaja de contribuciones, este resulta insuficiente considerando' : 'no cuento con ningún beneficio de rebaja de contribuciones, a pesar de'} mi condición de adulto mayor con ingresos limitados, configurándose una situación de manifiesta desproporción entre el tributo exigido y mi capacidad contributiva real.

II. EL DERECHO

El presente recurso se funda en lo dispuesto en el artículo 20 de la Constitución Política de la República, en relación con las garantías constitucionales consagradas en los numerales 2°, 20° y 24° del artículo 19 del mismo cuerpo normativo.

En efecto, el cobro de contribuciones de bienes raíces sin considerar la capacidad económica real del contribuyente adulto mayor vulnera:

a) El derecho a la igualdad ante la ley (artículo 19 N° 2), toda vez que se aplica un gravamen que no distingue la situación particular de las personas de tercera edad con ingresos limitados, generando una discriminación arbitraria respecto de quienes, encontrándose en similares condiciones, sí acceden a beneficios tributarios.

b) El derecho a la igual repartición de los tributos y demás cargas públicas (artículo 19 N° 20), al imponer una carga tributaria manifiestamente desproporcionada e injusta en relación con la capacidad económica del contribuyente.

c) El derecho de propiedad (artículo 19 N° 24), al establecer una carga que puede derivar en la imposibilidad de mantener la propiedad del inmueble, única vivienda del recurrente.

III. PRECEDENTE JUDICIAL APLICABLE

Que la Ilustrísima Corte de Apelaciones de Santiago, con fecha 15 de enero de 2026, en causa Rol N° 1234-2026, caratulada "Latorre con Servicio de Impuestos Internos", acogió un recurso de protección interpuesto por una adulta mayor de 100 años en circunstancias similares a las del presente caso, estableciendo que el cobro de contribuciones de bienes raíces sin considerar la capacidad contributiva real del adulto mayor constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales antes señaladas.

Dicha sentencia quedó firme y ejecutoriada al no haber sido apelada por el Servicio de Impuestos Internos, constituyendo un valioso precedente judicial que resulta plenamente aplicable al caso de autos.

IV. PETITORIO

POR TANTO, en mérito de lo expuesto y de conformidad con lo dispuesto en el artículo 20 de la Constitución Política de la República y el Auto Acordado de la Excma. Corte Suprema sobre tramitación y fallo del recurso de protección,

SOLICITO A US. ILTMA. se sirva:

1. Tener por interpuesto recurso de protección en contra del Servicio de Impuestos Internos, en la persona de su Director Nacional.

2. Ordenar al recurrido informar dentro del plazo legal.

3. Acoger el presente recurso y declarar que el acto de cobro de contribuciones de bienes raíces respecto del inmueble Rol N° ${datosPropiedad.rolSII} constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales del recurrente.

4. Como medida de protección, ordenar al Servicio de Impuestos Internos cesar el cobro de contribuciones respecto del inmueble individualizado, o en subsidio, otorgar la rebaja de contribuciones que en derecho corresponda conforme a la situación económica del recurrente.

5. Condenar en costas al recurrido.

PRIMER OTROSÍ: Solicito a US. Iltma. tener por acompañados los siguientes documentos:
1. Copia de cédula de identidad del recurrente.
2. Certificado de avalúo fiscal del inmueble emitido por el SII.
3. Copia de boleta de contribuciones.
4. Certificado de cotizaciones o liquidación de pensión, según corresponda.

SEGUNDO OTROSÍ: Solicito a US. Iltma. tener presente que comparezco personalmente, sin patrocinio de abogado, de conformidad con lo dispuesto en el artículo 2° de la Ley N° 18.120, sobre Comparecencia en Juicio.




_______________________________________
${datosPersonales.nombreCompleto}
RUT: ${datosPersonales.rut}

En ${datosPropiedad.comunaPropiedad}, a ${formatearFecha(datosRecurso.fechaGeneracion)}`;
}
