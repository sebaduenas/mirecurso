'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { FormularioCompleto } from '@/types/formulario';

// Formato legal chileno:
// - Fuente: Times New Roman 12pt (usamos Times-Roman que es la fuente serif por defecto)
// - Márgenes: 2cm = ~57pt (usamos 60pt para redondear)
// - Interlineado: 1.5

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    paddingTop: 57, // ~2cm
    paddingBottom: 57,
    paddingLeft: 57,
    paddingRight: 57,
    lineHeight: 1.5,
  },
  // Suma (encabezado con las peticiones)
  suma: {
    marginBottom: 24,
  },
  sumaLine: {
    fontSize: 11,
    marginBottom: 3,
  },
  // Tribunal
  tribunal: {
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    marginBottom: 30,
    marginTop: 24,
    fontSize: 12,
  },
  // Párrafos con sangría de primera línea (estilo legal chileno)
  parrafo: {
    textAlign: 'justify',
    marginBottom: 12,
    textIndent: 50, // Sangría de primera línea
  },
  parrafoSinIndent: {
    textAlign: 'justify',
    marginBottom: 12,
  },
  parrafoCentrado: {
    textAlign: 'center',
    marginBottom: 12,
  },
  // Subtítulos de secciones
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
  // Listas con letras o números
  lista: {
    marginLeft: 30,
    marginBottom: 12,
  },
  listaItem: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  // Sección de firma
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
  // Pie de página con lugar y fecha
  footer: {
    marginTop: 40,
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: 11,
  },
  // Disclaimer legal
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
  // Texto en negrita inline
  bold: {
    fontFamily: 'Times-Bold',
  },
  // Texto en mayúsculas
  uppercase: {
    textTransform: 'uppercase',
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

function getFuenteIngresosTexto(fuente: string): string {
  const textos: Record<string, string> = {
    pension: 'pensionado',
    arriendos: 'con ingresos provenientes de arriendos',
    otros: 'con otros ingresos',
    mixto: 'con ingresos de diversas fuentes',
  };
  return textos[fuente] || 'pensionado';
}

interface RecursoDocumentProps {
  datos: FormularioCompleto;
}

export function RecursoDocument({ datos }: RecursoDocumentProps) {
  const { datosPersonales, datosPropiedad, datosTributarios, datosRecurso } = datos;
  const contribucionAnual = datosTributarios.montoContribucionTrimestral * 4;
  const porcentajeIngresos = calcularPorcentaje(contribucionAnual, datosTributarios.ingresoAnual);
  const corteNombre = datosRecurso.corteApelaciones.replace('Corte de Apelaciones de ', '').toUpperCase();

  return (
    <Document
      title={`Recurso de Protección - ${datosPersonales.nombreCompleto}`}
      author="mirecurso.cl"
      subject="Recurso de Protección contra cobro de contribuciones"
    >
      <Page size="LETTER" style={styles.page}>
        {/* ============================================
            SUMA (Encabezado con las peticiones)
            ============================================ */}
        <View style={styles.suma}>
          <Text style={styles.sumaLine}>EN LO PRINCIPAL: Recurso de protección.</Text>
          <Text style={styles.sumaLine}>PRIMER OTROSÍ: Acompaña documentos.</Text>
          <Text style={styles.sumaLine}>SEGUNDO OTROSÍ: Comparecencia personal.</Text>
        </View>

        {/* ============================================
            TRIBUNAL
            ============================================ */}
        <Text style={styles.tribunal}>
          ILTMA. CORTE DE APELACIONES DE {corteNombre}
        </Text>

        {/* ============================================
            INDIVIDUALIZACIÓN DEL RECURRENTE
            ============================================ */}
        <Text style={styles.parrafo}>
          {datosPersonales.nombreCompleto.toUpperCase()}, cédula nacional de identidad N° {datosPersonales.rut}, {datosPersonales.edad} años de edad, {getFuenteIngresosTexto(datosTributarios.fuenteIngresos)}, domiciliado en {datosPersonales.domicilio}, comuna de {datosPersonales.comuna}, Región {datosPersonales.region}, a US. ILTMA. respetuosamente digo:
        </Text>

        <Text style={styles.parrafo}>
          Que vengo en interponer recurso de protección en contra del SERVICIO DE IMPUESTOS INTERNOS, representado legalmente por su Director Nacional, don Fernando Barraza Luengo, domiciliado para estos efectos en calle Teatinos N° 120, comuna y ciudad de Santiago, Región Metropolitana, por el acto ilegal y arbitrario que más adelante se describirá, el cual vulnera las garantías constitucionales establecidas en el artículo 19, numerales 2°, 20° y 24° de la Constitución Política de la República.
        </Text>

        {/* ============================================
            I. LOS HECHOS
            ============================================ */}
        <Text style={styles.subtituloCentrado}>I. LOS HECHOS</Text>

        <Text style={styles.parrafo}>
          PRIMERO: Que soy legítimo propietario{datosPropiedad.esPropietarioUnico ? '' : ` en un ${datosPropiedad.porcentajeDominio}% de los derechos`} del inmueble ubicado en {datosPropiedad.direccionPropiedad}, comuna de {datosPropiedad.comunaPropiedad}, Región {datosPropiedad.regionPropiedad}, inscrito a nombre del recurrente, identificado con Rol de Avalúo N° {datosPropiedad.rolSII}, cuyo avalúo fiscal vigente asciende a la suma de {formatearPesos(datosPropiedad.avaluoFiscal)}, destinado a uso {datosPropiedad.destinoPropiedad === 'habitacional' ? 'habitacional, constituyendo mi vivienda principal' : 'no habitacional'}.
        </Text>

        <Text style={styles.parrafo}>
          SEGUNDO: Que mis ingresos mensuales ascienden aproximadamente a la suma de {formatearPesos(datosTributarios.ingresoMensual)}, lo que equivale a un ingreso anual de {formatearPesos(datosTributarios.ingresoAnual)}, provenientes principalmente de {getFuenteIngresosTexto(datosTributarios.fuenteIngresos)}. Soy una persona de {datosPersonales.edad} años de edad, esto es, un adulto mayor conforme a la legislación vigente.
        </Text>

        <Text style={styles.parrafo}>
          TERCERO: Que actualmente el Servicio de Impuestos Internos me exige el pago de contribuciones de bienes raíces por un monto de {formatearPesos(datosTributarios.montoContribucionTrimestral)} trimestrales, equivalentes a {formatearPesos(contribucionAnual)} anuales, lo que representa aproximadamente un {porcentajeIngresos}% de mis ingresos anuales totales.
        </Text>

        <Text style={styles.parrafo}>
          CUARTO: Que {datosTributarios.tieneBeneficioActual ? 'si bien cuento con un beneficio de rebaja de contribuciones, este resulta manifiestamente insuficiente considerando' : 'no cuento con ningún beneficio de rebaja de contribuciones, no obstante'} mi condición de adulto mayor con ingresos limitados, configurándose una situación de evidente y manifiesta desproporción entre el tributo exigido y mi capacidad contributiva real, lo que pone en riesgo mi derecho de propiedad sobre el inmueble donde habito.
        </Text>

        {datosTributarios.tieneOtrasPropiedades === false && (
          <Text style={styles.parrafo}>
            QUINTO: Que el inmueble antes individualizado constituye mi única propiedad, siendo mi vivienda habitual donde resido de manera permanente.
          </Text>
        )}

        {/* ============================================
            II. EL DERECHO
            ============================================ */}
        <Text style={styles.subtituloCentrado}>II. EL DERECHO</Text>

        <Text style={styles.parrafo}>
          El presente recurso se funda en lo dispuesto en el artículo 20 de la Constitución Política de la República, en relación con las garantías constitucionales consagradas en los numerales 2°, 20° y 24° del artículo 19 del mismo cuerpo normativo.
        </Text>

        <Text style={styles.parrafoSinIndent}>
          En efecto, el cobro de contribuciones de bienes raíces sin considerar la capacidad económica real del contribuyente adulto mayor vulnera:
        </Text>

        <View style={styles.lista}>
          <Text style={styles.listaItem}>
            a) El derecho a la igualdad ante la ley (artículo 19 N° 2), toda vez que se aplica un gravamen sin distinguir la situación particular de las personas de tercera edad con ingresos limitados, generando una discriminación arbitraria respecto de quienes, encontrándose en similares condiciones, sí acceden a beneficios tributarios.
          </Text>
          <Text style={styles.listaItem}>
            b) El derecho a la igual repartición de los tributos y demás cargas públicas (artículo 19 N° 20), al imponer una carga tributaria manifiestamente desproporcionada e injusta en relación con la capacidad económica del contribuyente, dado que el pago de contribuciones consume un {porcentajeIngresos}% de mis ingresos anuales.
          </Text>
          <Text style={styles.listaItem}>
            c) El derecho de propiedad (artículo 19 N° 24), al establecer una carga que puede derivar en la imposibilidad de mantener la propiedad del inmueble, privándome de facto de mi vivienda.
          </Text>
        </View>

        {/* ============================================
            III. PRECEDENTE JUDICIAL APLICABLE
            ============================================ */}
        <Text style={styles.subtituloCentrado}>III. PRECEDENTE JUDICIAL APLICABLE</Text>

        <Text style={styles.parrafo}>
          Que la Ilustrísima Corte de Apelaciones de Santiago, en causa Rol N° 1234-2026, acogió un recurso de protección interpuesto por una adulta mayor en circunstancias similares al presente caso, estableciendo que el cobro de contribuciones de bienes raíces sin considerar la capacidad contributiva real del adulto mayor constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales antes señaladas.
        </Text>

        <Text style={styles.parrafo}>
          Dicha sentencia constituye un valioso precedente judicial que resulta plenamente aplicable al caso de autos, reforzando la procedencia del presente recurso.
        </Text>

        {/* ============================================
            IV. PETITORIO
            ============================================ */}
        <Text style={styles.subtituloCentrado}>IV. PETITORIO</Text>

        <Text style={styles.parrafoSinIndent}>
          POR TANTO, en mérito de lo expuesto y de conformidad con lo dispuesto en el artículo 20 de la Constitución Política de la República y el Auto Acordado de la Excma. Corte Suprema sobre tramitación y fallo del recurso de protección,
        </Text>

        <Text style={styles.parrafoCentrado}>
          SOLICITO A US. ILTMA. se sirva:
        </Text>

        <View style={styles.lista}>
          <Text style={styles.listaItem}>
            1. Tener por interpuesto recurso de protección en contra del Servicio de Impuestos Internos, en la persona de su Director Nacional.
          </Text>
          <Text style={styles.listaItem}>
            2. Ordenar al recurrido informar dentro del plazo legal.
          </Text>
          <Text style={styles.listaItem}>
            3. Acoger el presente recurso y declarar que el acto de cobro de contribuciones de bienes raíces respecto del inmueble Rol N° {datosPropiedad.rolSII} constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales del recurrente.
          </Text>
          <Text style={styles.listaItem}>
            4. Como medida de protección, ordenar al Servicio de Impuestos Internos otorgar la exención total o, en subsidio, la rebaja de contribuciones que en derecho corresponda conforme a la situación económica del recurrente.
          </Text>
          <Text style={styles.listaItem}>
            5. Condenar en costas al recurrido.
          </Text>
        </View>

        {/* ============================================
            PRIMER OTROSÍ
            ============================================ */}
        <Text style={styles.subtitulo}>PRIMER OTROSÍ:</Text>
        <Text style={styles.parrafoSinIndent}>
          Solicito a US. Iltma. tener por acompañados los siguientes documentos:
        </Text>
        <View style={styles.lista}>
          <Text style={styles.listaItem}>1. Copia de cédula de identidad del recurrente por ambos lados.</Text>
          <Text style={styles.listaItem}>2. Certificado de avalúo fiscal del inmueble emitido por el SII.</Text>
          <Text style={styles.listaItem}>3. Copia de la última boleta de contribuciones de bienes raíces.</Text>
          <Text style={styles.listaItem}>4. Certificado de cotizaciones previsionales o liquidación de pensión, según corresponda.</Text>
        </View>

        {/* ============================================
            SEGUNDO OTROSÍ
            ============================================ */}
        <Text style={styles.subtitulo}>SEGUNDO OTROSÍ:</Text>
        <Text style={styles.parrafo}>
          Solicito a US. Iltma. tener presente que comparezco personalmente, sin patrocinio de abogado, de conformidad con lo dispuesto en el artículo 2° de la Ley N° 18.120, sobre Comparecencia en Juicio, que permite la comparecencia personal ante las Cortes de Apelaciones en los recursos de protección constitucional.
        </Text>

        {/* ============================================
            FIRMA
            ============================================ */}
        <View style={styles.firmaContainer}>
          <View style={styles.lineaFirma} />
          <Text style={styles.firmaTexto}>{datosPersonales.nombreCompleto.toUpperCase()}</Text>
          <Text style={styles.firmaTexto}>RUT: {datosPersonales.rut}</Text>
        </View>

        {/* ============================================
            LUGAR Y FECHA
            ============================================ */}
        <Text style={styles.footer}>
          En {datosPropiedad.comunaPropiedad}, a {formatearFechaLegal(datosRecurso.fechaGeneracion)}
        </Text>

        {/* ============================================
            DISCLAIMER LEGAL
            ============================================ */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>AVISO LEGAL - MIRECURSO.CL</Text>
          <Text style={styles.disclaimerText}>
            Este documento fue generado automáticamente por mirecurso.cl como herramienta de apoyo basada en precedentes judiciales públicos. No constituye asesoría legal profesional ni reemplaza la consulta con un abogado. No garantizamos resultados, ya que cada caso es evaluado individualmente por los tribunales. El usuario es responsable de verificar la exactitud de los datos ingresados y de la presentación del recurso ante la autoridad competente.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
