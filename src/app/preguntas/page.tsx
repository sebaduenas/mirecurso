import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';

const faqSections = [
  {
    title: 'Sobre el servicio',
    questions: [
      {
        question: '¿Quién puede usar mirecurso.cl?',
        answer:
          'Cualquier adulto mayor de 60 años que sea propietario de una vivienda y pague contribuciones de bienes raíces. También pueden usar el servicio familiares o representantes que deseen ayudar a un adulto mayor.',
      },
      {
        question: '¿Tiene algún costo?',
        answer:
          'No, el servicio es completamente gratuito. No hay costos ocultos ni pagos posteriores.',
      },
      {
        question: '¿Mis datos están seguros?',
        answer:
          'Sí. Sus datos se almacenan únicamente en su propio dispositivo (navegador) y no se envían a ningún servidor externo. Cuando cierra la página, puede optar por borrar todos los datos.',
      },
      {
        question: '¿Quiénes están detrás de este servicio?',
        answer:
          'Este servicio fue desarrollado por Inteligencia Digital como una herramienta de acceso a la justicia para adultos mayores en Chile.',
      },
    ],
  },
  {
    title: 'Sobre el recurso',
    questions: [
      {
        question: '¿Qué es un recurso de protección?',
        answer:
          'Es una acción constitucional que permite a cualquier persona acudir a la Corte de Apelaciones cuando considera que se han vulnerado sus derechos fundamentales. No requiere abogado y es gratuito presentarlo.',
      },
      {
        question: '¿Por qué puedo reclamar las contribuciones?',
        answer:
          'La Corte de Apelaciones de Santiago estableció en enero de 2026 (caso Marina Latorre) que el cobro de contribuciones a adultos mayores sin considerar su capacidad económica real vulnera sus derechos constitucionales. Este precedente es aplicable a casos similares.',
      },
      {
        question: '¿Qué documentos necesito reunir?',
        answer:
          'Necesitará: 1) Copia de su cédula de identidad, 2) Certificado de avalúo fiscal (se obtiene en sii.cl), 3) Copia de boleta de contribuciones, 4) Liquidación de pensión o certificado de ingresos.',
      },
      {
        question: '¿Qué probabilidades tengo de ganar?',
        answer:
          'Cada caso es evaluado individualmente por la Corte. El precedente del caso Marina Latorre es favorable, pero el resultado depende de las circunstancias específicas de cada situación. Este servicio no garantiza resultados.',
      },
    ],
  },
  {
    title: 'Sobre el proceso',
    questions: [
      {
        question: '¿Dónde presento el recurso?',
        answer:
          'En la Corte de Apelaciones de la región donde está ubicada la propiedad. El documento generado incluye la dirección exacta de la Corte correspondiente.',
      },
      {
        question: '¿Cuánto demora el proceso?',
        answer:
          'Una vez presentado, la Corte tiene plazos establecidos para resolver. Generalmente el proceso completo puede tomar entre 1 y 3 meses, aunque esto puede variar.',
      },
      {
        question: '¿Qué pasa si lo rechazan?',
        answer:
          'Si el recurso es rechazado, tiene la opción de apelar ante la Corte Suprema. Sin embargo, para una apelación es recomendable contar con asesoría legal profesional.',
      },
      {
        question: '¿Necesito ir personalmente a la Corte?',
        answer:
          'Sí, debe presentar el documento en persona (o a través de un representante) en la oficina de partes de la Corte de Apelaciones correspondiente.',
      },
      {
        question: '¿Puedo presentarlo por internet?',
        answer:
          'Actualmente, el recurso debe presentarse de forma presencial en la Corte. Existe la Oficina Judicial Virtual, pero para recursos de protección presentados por primera vez, generalmente se requiere la presentación física.',
      },
    ],
  },
  {
    title: 'Sobre el precedente',
    questions: [
      {
        question: '¿Quién es Marina Latorre?',
        answer:
          'Marina Latorre es una escritora chilena de 100 años que presentó un recurso de protección contra el SII por el cobro de contribuciones. Su caso fue acogido por la Corte de Apelaciones de Santiago en enero de 2026.',
      },
      {
        question: '¿Por qué es importante ese fallo?',
        answer:
          'El fallo establece que el cobro de contribuciones a adultos mayores sin considerar su capacidad económica real es ilegal y arbitrario. Al quedar firme (sin apelación del SII), constituye un precedente judicial importante para casos similares.',
      },
      {
        question: '¿El SII puede apelar mi caso?',
        answer:
          'Sí, el SII tiene derecho a apelar ante la Corte Suprema si la Corte de Apelaciones acoge su recurso. Sin embargo, dado el precedente existente, esto no es garantía de que vayan a hacerlo en todos los casos.',
      },
    ],
  },
];

export default function PreguntasPage() {
  return (
    <>
      <Header />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Preguntas frecuentes
            </h1>
            <p className="text-xl text-muted-foreground">
              Encuentre respuestas a las dudas más comunes sobre el servicio
            </p>
          </div>

          {/* FAQ por secciones */}
          <div className="space-y-12">
            {faqSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  {section.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {section.questions.map((item, itemIndex) => (
                    <AccordionItem
                      key={itemIndex}
                      value={`${sectionIndex}-${itemIndex}`}
                      className="border rounded-lg px-5"
                    >
                      <AccordionTrigger className="text-left text-lg hover:no-underline py-5">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-lg text-muted-foreground pb-5">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center p-8 bg-slate-50 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para comenzar?
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Genere su recurso de protección en pocos minutos
            </p>
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link href="/formulario">
                Crear mi recurso
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
