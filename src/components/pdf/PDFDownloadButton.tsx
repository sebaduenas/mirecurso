'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { RecursoDocument } from './RecursoTemplate';
import type { FormularioCompleto } from '@/types/formulario';

interface PDFDownloadButtonProps {
  datos: FormularioCompleto;
  filename: string;
}

export function PDFDownloadButton({ datos, filename }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    setIsDownloaded(false);

    try {
      // Generar el PDF
      const blob = await pdf(<RecursoDocument datos={datos} />).toBlob();

      // Crear URL y descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL
      setTimeout(() => URL.revokeObjectURL(url), 100);

      // Mostrar éxito
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor intente nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`h-16 px-8 text-lg min-w-[280px] ${
        isDownloaded ? 'bg-green-600 hover:bg-green-700' : ''
      }`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
          Generando PDF...
        </>
      ) : isDownloaded ? (
        <>
          <CheckCircle2 className="w-6 h-6 mr-3" />
          ¡Descargado!
        </>
      ) : (
        <>
          <Download className="w-6 h-6 mr-3" />
          Descargar recurso en PDF
        </>
      )}
    </Button>
  );
}
