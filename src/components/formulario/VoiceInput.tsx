'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Mic, MicOff, X, Check, Loader2, AlertCircle } from 'lucide-react';

type VoiceInputState = 'idle' | 'listening' | 'processing' | 'error';

interface VoiceInputProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  buttonLabel?: string;
}

export function VoiceInput({
  onResult,
  onError,
  language = 'es-CL',
  buttonLabel = 'Dictar',
}: VoiceInputProps) {
  const [state, setState] = useState<VoiceInputState>('idle');
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Verificar soporte del navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setIsSupported(supported);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setErrorMessage('');
      setState('listening');
      setTranscript('');
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        }
      });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Detener el stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        if (audioChunksRef.current.length === 0) {
          setState('error');
          setErrorMessage('No se grabó audio. Intente de nuevo.');
          return;
        }

        // Procesar el audio
        setState('processing');

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType
        });

        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('language', language);

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Error en la transcripción');
          }

          const data = await response.json();

          if (data.text && data.text.trim()) {
            setTranscript(data.text.trim());
            setState('idle');
          } else {
            setState('error');
            setErrorMessage('No se pudo reconocer el texto. Hable más cerca del micrófono e intente de nuevo.');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          setState('error');
          setErrorMessage('Error al procesar el audio. Intente de nuevo.');
          onError?.('Error al procesar el audio');
        }
      };

      mediaRecorder.start(1000); // Grabar en chunks de 1 segundo
    } catch (error) {
      console.error('Error starting recording:', error);
      setState('error');

      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setErrorMessage('Necesitamos permiso para usar el micrófono. Por favor, permita el acceso cuando aparezca la ventana del navegador.');
      } else {
        setErrorMessage('No se pudo acceder al micrófono. Verifique que su dispositivo tenga uno conectado.');
      }

      onError?.('Error al acceder al micrófono');
    }
  }, [language, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setTranscript('');
    setErrorMessage('');
    setState('idle');
  };

  const handleStartListening = () => {
    startRecording();
  };

  const handleStopListening = () => {
    stopRecording();
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onResult(transcript.trim());
    }
    handleClose();
  };

  const handleClose = () => {
    stopRecording();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsDialogOpen(false);
    setTranscript('');
    setErrorMessage('');
    setState('idle');
  };

  const handleRetry = () => {
    setErrorMessage('');
    setState('idle');
    setTranscript('');
  };

  // No mostrar si el navegador no soporta grabación
  if (isSupported === false) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className="h-14 px-4 gap-2 opacity-50"
        title="Su navegador no soporta grabación de voz"
      >
        <MicOff className="w-5 h-5" />
        {buttonLabel}
      </Button>
    );
  }

  // Mientras verifica soporte
  if (isSupported === null) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleOpenDialog}
        className="h-14 px-4 gap-2 text-lg"
      >
        <Mic className="w-5 h-5" />
        {buttonLabel}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              {state === 'idle' && !transcript && 'Dictar texto'}
              {state === 'listening' && 'Escuchando...'}
              {state === 'processing' && 'Procesando audio...'}
              {state === 'error' && 'Error'}
              {state === 'idle' && transcript && 'Texto reconocido'}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {state === 'idle' && !transcript && 'Presione el botón del micrófono para comenzar a grabar'}
              {state === 'listening' && 'Hable claramente cerca del micrófono'}
              {state === 'processing' && 'Espere mientras procesamos su voz'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-4">
            {/* Indicador visual según estado */}
            <div
              className={`
                w-24 h-24 rounded-full flex items-center justify-center
                transition-all duration-300
                ${state === 'idle' && !transcript ? 'bg-muted' : ''}
                ${state === 'listening' ? 'bg-red-100 animate-pulse' : ''}
                ${state === 'processing' ? 'bg-blue-100' : ''}
                ${state === 'error' ? 'bg-red-100' : ''}
                ${state === 'idle' && transcript ? 'bg-green-100' : ''}
              `}
            >
              {state === 'idle' && !transcript && (
                <Mic className="w-12 h-12 text-muted-foreground" />
              )}
              {state === 'listening' && (
                <Mic className="w-12 h-12 text-red-600" />
              )}
              {state === 'processing' && (
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              )}
              {state === 'error' && (
                <AlertCircle className="w-12 h-12 text-red-600" />
              )}
              {state === 'idle' && transcript && (
                <Check className="w-12 h-12 text-green-600" />
              )}
            </div>

            {/* Mensaje de error */}
            {state === 'error' && errorMessage && (
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-base text-red-700 text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Transcripción */}
            {(transcript || state === 'listening') && state !== 'error' && (
              <div className="w-full min-h-[100px] p-4 bg-muted rounded-lg">
                <p className="text-lg text-foreground leading-relaxed">
                  {transcript || (
                    <span className="text-muted-foreground italic">
                      Lo que diga aparecerá aquí...
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Botones según estado */}
            <div className="flex gap-3 w-full">
              {/* Estado idle sin transcript - Botón para iniciar */}
              {state === 'idle' && !transcript && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 h-14 text-lg"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleStartListening}
                    className="flex-1 h-14 text-lg bg-red-600 hover:bg-red-700"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Grabar
                  </Button>
                </>
              )}

              {/* Estado listening - Botón para detener */}
              {state === 'listening' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleStopListening}
                  className="w-full h-14 text-lg"
                >
                  <MicOff className="w-5 h-5 mr-2" />
                  Detener grabación
                </Button>
              )}

              {/* Estado processing - Sin botones, solo esperar */}
              {state === 'processing' && (
                <Button
                  type="button"
                  disabled
                  className="w-full h-14 text-lg"
                >
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Procesando...
                </Button>
              )}

              {/* Estado error - Botón para reintentar */}
              {state === 'error' && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 h-14 text-lg"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleRetry}
                    className="flex-1 h-14 text-lg"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Reintentar
                  </Button>
                </>
              )}

              {/* Estado idle con transcript - Confirmar o reintentar */}
              {state === 'idle' && transcript && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRetry}
                    className="flex-1 h-14 text-lg"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Grabar de nuevo
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    className="flex-1 h-14 text-lg"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Usar texto
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
