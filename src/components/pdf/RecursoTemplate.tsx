'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { FormularioCompleto } from '@/types/formulario';
import { RECURRIDO, PRECEDENTE, ESTADOS_CIVILES, FUENTES_INGRESO, TOPES_LEY_20732 } from '@/data/datos-fijos';

// Formato legal chileno:
// - Fuente: Times New Roman 12pt (usamos Times-Roman que es la fuente serif por defecto)
// - Márgenes: 2cm = ~57pt (usamos 60pt para redondear)
// - Interlineado: 1.5

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    paddingTop: 57,
    paddingBottom: 57,
    paddingLeft: 57,
    paddingRight: 57,
    lineHeight: 1.5,
  },
  suma: {
    marginBottom: 24,
  },
  sumaLine: {
    fontSize: 11,
    marginBottom: 3,
  },
  tribunal: {
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    marginBottom: 30,
    marginTop: 24,
    fontSize: 12,
  },
  parrafo: {
    textAlign: 'justify',
    marginBottom: 12,
    textIndent: 50,
  },
  parrafoSinIndent: {
    textAlign: 'justify',
    marginBottom: 12,
  },
  parrafoCentrado: {
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitulo: {
    fontFamily: 'Times-Bold',
    marginTop: 24,
    marginBottom: 12,
    fontSize: 12,
  },
  subtituloCentrado: {
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
    fontSize: 12,
  },
  lista: {
    marginLeft: 30,
    marginBottom: 12,
  },
  listaItem: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  firmaContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  lineaFirma: {
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 8,
  },
  firmaTexto: {
    textAlign: 'center',
    fontSize: 11,
  },
  footer: {
    marginTop: 40,
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: 11,
  },
  disclaimer: {
    marginTop: 60,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  disclaimerTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    marginBottom: 6,
    color: '#92400E',
  },
  disclaimerText: {
    fontSize: 9,
    color: '#78350F',
    lineHeight: 1.4,
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
});

function formatearPesos(monto: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto);
}

function formatearFechaLegal(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  const dia = fecha.getDate();
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} de ${mes} de ${anio}`;
}

function calcularPorcentaje(parte: number, total: number): string {
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
    return fuente ? fuente.corto : f;
  });

  if (textos.length === 1) return textos[0];
  if (textos.length === 2) return `${textos[0]} y ${textos[1]}`;
  return textos.slice(0, -1).join(', ') + ' y ' + textos[textos.length - 1];
}

interface RecursoDocumentProps {
  datos: FormularioCompleto;
}

export function RecursoDocument({ datos }: RecursoDocumentProps) {
  const { datosPersonales, datosPropiedad, datosEconomicos, datosContribuciones, procedimientoPrevio, datosRecurso, validaciones } = datos;

  const contribucionAnual = datosContribuciones.montoContribucionTrimestral * 4;
  const ingresoAnual = datosEconomicos.ingresoMensual * 12;
  const porcentajeIngresos = calcularPorcentaje(contribucionAnual, ingresoAnual);
  const corteNombre = datosRecurso.corteApelaciones.replace('Corte de Apelaciones de ', '').toUpperCase();

  // Determinar si es caso tipo Marina Latorre (excede tope de avalúo)
  const esCasoMarinaLatorre = validaciones.excedeTopeAvaluo;

  return (
    <Document
      title={`Recurso de Protección - ${datosPersonales.nombreCompleto}`}
      author="mirecurso.cl"
      subject="Recurso de Protección contra cobro de contribuciones"
    >
      <Page size="LETTER" style={styles.page}>
        {/* SUMA */}
        <View style={styles.suma}>
          <Text style={styles.sumaLine}>EN LO PRINCIPAL: Recurso de protección.</Text>
          <Text style={styles.sumaLine}>PRIMER OTROSÍ: Acompaña documentos.</Text>
          <Text style={styles.sumaLine}>SEGUNDO OTROSÍ: Orden de no innovar.</Text>
          <Text style={styles.sumaLine}>TERCER OTROSÍ: Comparecencia personal.</Text>
        </View>

        {/* TRIBUNAL */}
        <Text style={styles.tribunal}>
          ILTMA. CORTE DE APELACIONES DE {corteNombre}
        </Text>

        {/* INDIVIDUALIZACIÓN */}
        <Text style={styles.parrafo}>
          {datosPersonales.nombreCompleto.toUpperCase()}, nacionalidad {datosPersonales.nacionalidad || 'chilena'}, cédula nacional de identidad N° {datosPersonales.rut}, {getEstadoCivilTexto(datosPersonales.estadoCivil)}, {datosPersonales.profesion}, de {datosPersonales.edad} años de edad, domiciliado/a en {datosPersonales.domicilio}, comuna de {datosPersonales.comuna}, Región {datosPersonales.region}, a US. ILTMA. respetuosamente digo:
        </Text>

        <Text style={styles.parrafo}>
          Que vengo en interponer recurso de protección en contra del {RECURRIDO.nombre}, RUT {RECURRIDO.rut}, representado legalmente por su Director Nacional don {RECURRIDO.director}, domiciliado para estos efectos en {RECURRIDO.domicilio}, comuna de {RECURRIDO.comuna}, por el acto ilegal y arbitrario que más adelante se describirá, el cual vulnera las garantías constitucionales establecidas en el artículo 19, numerales 1°, 2°, 20° y 24° de la Constitución Política de la República.
        </Text>

        {/* I. LOS HECHOS */}
        <Text style={styles.subtituloCentrado}>I. ACCIÓN ARBITRARIA Y/O ILEGAL</Text>

        <Text style={styles.parrafo}>
          PRIMERO: Que soy legítimo/a propietario/a del inmueble ubicado en {datosPropiedad.direccionPropiedad}, comuna de {datosPropiedad.comunaPropiedad}, Región {datosPropiedad.regionPropiedad}, identificado con Rol de Avalúo N° {datosPropiedad.rolAvaluo}, cuyo avalúo fiscal vigente asciende a la suma de {formatearPesos(datosPropiedad.avaluoFiscalVigente)}.
        </Text>

        <Text style={styles.parrafo}>
          Dicho inmueble constituye mi vivienda habitual y permanente, donde resido desde hace años, siendo destinado exclusivamente a habitación.
        </Text>

        <Text style={styles.parrafo}>
          SEGUNDO: Que mis ingresos mensuales ascienden aproximadamente a la suma de {formatearPesos(datosEconomicos.ingresoMensual)}, lo que equivale a un ingreso anual de {formatearPesos(ingresoAnual)}, provenientes de {getFuentesIngresoTexto(datosEconomicos.fuentesIngreso)}.{datosEconomicos.estaEnRSH === 'si' ? ` Me encuentro inscrito/a en el Registro Social de Hogares, en el tramo ${datosEconomicos.tramoRSH}% más vulnerable.` : ''} Soy una persona de {datosPersonales.edad} años de edad, esto es, un adulto mayor conforme a la legislación vigente.
        </Text>

        <Text style={styles.parrafo}>
          TERCERO: Que actualmente el Servicio de Impuestos Internos me exige el pago de contribuciones de bienes raíces por un monto de {formatearPesos(datosContribuciones.montoContribucionTrimestral)} trimestrales, equivalentes a {formatearPesos(contribucionAnual)} anuales, lo que representa aproximadamente un {porcentajeIngresos}% de mis ingresos anuales totales.
        </Text>

        <Text style={styles.parrafo}>
          CUARTO: Que {datosEconomicos.tieneBeneficioActual === 'parcial_50' ? 'si bien cuento con una rebaja del 50% en mis contribuciones, esta resulta insuficiente considerando' : datosEconomicos.tieneBeneficioActual === 'total_100' ? 'si bien formalmente cuento con el beneficio de exención, en la práctica se me sigue exigiendo el pago de contribuciones, desconociéndose' : 'no cuento con ningún beneficio de rebaja de contribuciones, a pesar de'} mi condición de adulto mayor con ingresos limitados, configurándose una situación de manifiesta desproporción entre el tributo exigido y mi capacidad contributiva real, lo que pone en riesgo mi derecho de propiedad sobre el inmueble donde habito.
        </Text>

        {datosEconomicos.tieneOtrasPropiedades === false && (
          <Text style={styles.parrafo}>
            QUINTO: Que el inmueble antes individualizado constituye mi única propiedad, siendo mi vivienda habitual donde resido de manera permanente.
          </Text>
        )}

        {/* II. EL DERECHO */}
        <Text style={styles.subtituloCentrado}>II. DERECHOS Y GARANTÍAS CONCULCADAS</Text>

        <Text style={styles.parrafo}>
          El presente recurso se funda en lo dispuesto en el artículo 20 de la Constitución Política de la República, en relación con las garantías constitucionales consagradas en los numerales 1°, 2°, 20° y 24° del artículo 19 del mismo cuerpo normativo.
        </Text>

        <Text style={styles.parrafoSinIndent}>
          El cobro de contribuciones de bienes raíces sin considerar la capacidad económica real del contribuyente adulto mayor vulnera:
        </Text>

        <View style={styles.lista}>
          <Text style={styles.listaItem}>
            a) El derecho a la vida e integridad física y psíquica (artículo 19 N° 1), toda vez que el cobro de contribuciones desproporcionadas afecta directamente mi tranquilidad, bienestar y calidad de vida.
          </Text>
          <Text style={styles.listaItem}>
            b) El derecho a la igualdad ante la ley (artículo 19 N° 2), toda vez que se aplica un gravamen sin distinguir la situación particular de las personas de tercera edad con ingresos limitados, generando una discriminación arbitraria respecto de quienes, encontrándose en similares condiciones, sí acceden a beneficios tributarios.
          </Text>
          <Text style={styles.listaItem}>
            c) El derecho a la igual repartición de los tributos (artículo 19 N° 20), al imponer una carga tributaria manifiestamente desproporcionada e injusta en relación con la capacidad económica del contribuyente, dado que el pago de contribuciones consume un {porcentajeIngresos}% de mis ingresos anuales.
          </Text>
          <Text style={styles.listaItem}>
            d) El derecho de propiedad (artículo 19 N° 24), al establecer una carga que puede derivar en la imposibilidad de mantener la propiedad del inmueble, privándome de facto de mi vivienda.
          </Text>
        </View>

        {/* III. PRECEDENTE JUDICIAL */}
        <Text style={styles.subtituloCentrado}>III. PRECEDENTE JUDICIAL APLICABLE</Text>

        {esCasoMarinaLatorre ? (
          <>
            <Text style={styles.parrafo}>
              Cabe destacar especialmente que, si bien el avalúo fiscal de mi propiedad ({formatearPesos(datosPropiedad.avaluoFiscalVigente)}) excede el tope establecido en el artículo 1° N°4 de la Ley 20.732 ({formatearPesos(TOPES_LEY_20732.topeAvaluoMaximo)}), la Ilustrísima Corte de Apelaciones de Santiago, en causa Rol N° {PRECEDENTE.rol}, caratulada "{PRECEDENTE.caratula}", con fecha {PRECEDENTE.fecha}, estableció expresamente que dicho requisito es "adjetivo, no esencial" y opera únicamente como límite cuantitativo del beneficio, no como requisito de procedencia.
            </Text>
            <Text style={styles.parrafo}>
              La Corte distinguió entre los requisitos "esenciales" de la Ley 20.732 (N°1: edad de 60 años o más; N°2: ingresos dentro de los límites; N°3: destino habitacional del inmueble) y el requisito "adjetivo" (N°4: tope de avalúo fiscal), determinando que este último no puede impedir el acceso al beneficio cuando se cumplen los requisitos esenciales.
            </Text>
            <Text style={styles.parrafo}>
              Dicha sentencia quedó firme y ejecutoriada al no haber sido apelada por el Servicio de Impuestos Internos, constituyendo un precedente judicial plenamente aplicable al caso de autos.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.parrafo}>
              Que la Ilustrísima Corte de Apelaciones de Santiago, en causa Rol N° {PRECEDENTE.rol}, caratulada "{PRECEDENTE.caratula}", con fecha {PRECEDENTE.fecha}, acogió un recurso de protección interpuesto por una adulta mayor en circunstancias similares al presente caso, estableciendo que el cobro de contribuciones de bienes raíces sin considerar la capacidad contributiva real del adulto mayor constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales antes señaladas.
            </Text>
            <Text style={styles.parrafo}>
              Dicha sentencia quedó firme y ejecutoriada al no haber sido apelada por el Servicio de Impuestos Internos, constituyendo un valioso precedente judicial que resulta plenamente aplicable al caso de autos.
            </Text>
          </>
        )}

        {/* IV. PETITORIO */}
        <Text style={styles.subtituloCentrado}>IV. PETITORIO</Text>

        <Text style={styles.parrafoSinIndent}>
          POR TANTO, en mérito de lo expuesto y de conformidad con lo dispuesto en el artículo 20 de la Constitución Política de la República y el Auto Acordado de la Excma. Corte Suprema sobre tramitación y fallo del recurso de protección,
        </Text>

        <Text style={styles.parrafoCentrado}>
          SOLICITO A US. ILTMA. se sirva:
        </Text>

        <View style={styles.lista}>
          <Text style={styles.listaItem}>
            1. Tener por interpuesto recurso de protección en contra del {RECURRIDO.nombre}, en la persona de su Director Nacional.
          </Text>
          <Text style={styles.listaItem}>
            2. Ordenar al recurrido informar dentro del plazo legal.
          </Text>
          <Text style={styles.listaItem}>
            3. Acoger el presente recurso y declarar que el acto de cobro de contribuciones de bienes raíces respecto del inmueble Rol N° {datosPropiedad.rolAvaluo} constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales del recurrente.
          </Text>
          <Text style={styles.listaItem}>
            4. Como medida de protección, ordenar al {RECURRIDO.nombre} otorgar la rebaja de contribuciones que en derecho corresponda conforme a la Ley N° 20.732 y la situación económica del recurrente.
          </Text>
          <Text style={styles.listaItem}>
            5. Condenar en costas al recurrido.
          </Text>
        </View>

        {/* PRIMER OTROSÍ */}
        <Text style={styles.subtitulo}>PRIMER OTROSÍ:</Text>
        <Text style={styles.parrafoSinIndent}>
          Solicito a US. Iltma. tener por acompañados los siguientes documentos:
        </Text>
        <View style={styles.lista}>
          <Text style={styles.listaItem}>1. Copia de cédula de identidad del recurrente por ambos lados.</Text>
          <Text style={styles.listaItem}>2. Certificado de avalúo fiscal del inmueble emitido por el SII.</Text>
          <Text style={styles.listaItem}>3. Copia de la última boleta de contribuciones o certificado de deuda.</Text>
          <Text style={styles.listaItem}>4. Liquidación de pensión o comprobante de ingresos.</Text>
          {datosEconomicos.estaEnRSH === 'si' && (
            <Text style={styles.listaItem}>5. Certificado del Registro Social de Hogares.</Text>
          )}
        </View>

        {/* SEGUNDO OTROSÍ */}
        <Text style={styles.subtitulo}>SEGUNDO OTROSÍ:</Text>
        <Text style={styles.parrafo}>
          Solicito a US. Iltma. que, atendida la naturaleza de los derechos afectados y la urgencia de la situación, se sirva decretar orden de no innovar, ordenando al {RECURRIDO.nombre} abstenerse de efectuar gestiones de cobro respecto de las contribuciones impugnadas mientras se tramita y resuelve el presente recurso.
        </Text>

        {/* TERCER OTROSÍ */}
        <Text style={styles.subtitulo}>TERCER OTROSÍ:</Text>
        <Text style={styles.parrafo}>
          Solicito a US. Iltma. tener presente que comparezco personalmente, sin patrocinio de abogado, de conformidad con lo dispuesto en el artículo 2° de la Ley N° 18.120, sobre Comparecencia en Juicio, que permite la comparecencia personal ante las Cortes de Apelaciones en los recursos de protección constitucional.
        </Text>

        {/* FIRMA */}
        <View style={styles.firmaContainer}>
          <View style={styles.lineaFirma} />
          <Text style={styles.firmaTexto}>{datosPersonales.nombreCompleto.toUpperCase()}</Text>
          <Text style={styles.firmaTexto}>RUT: {datosPersonales.rut}</Text>
        </View>

        {/* LUGAR Y FECHA */}
        <Text style={styles.footer}>
          En {datosPropiedad.comunaPropiedad}, a {formatearFechaLegal(datosRecurso.fechaGeneracion)}
        </Text>

        {/* DISCLAIMER LEGAL */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>AVISO LEGAL - MIRECURSO.CL</Text>
          <Text style={styles.disclaimerText}>
            Este documento fue generado automáticamente por mirecurso.cl basándose en el precedente judicial establecido en la causa Rol N° 20732-2024 de la Corte de Apelaciones de Santiago (caso Marina Latorre). No constituye asesoría legal profesional. Cada caso es evaluado individualmente por los tribunales. El usuario es responsable de verificar la exactitud de los datos ingresados y de la presentación del recurso ante la autoridad competente.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
