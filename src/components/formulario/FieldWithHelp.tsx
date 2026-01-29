'use client';

import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FieldWithHelpProps {
  label: string;
  htmlFor?: string;
  helpText?: string;
  error?: string;
  example?: string;
  required?: boolean;
  isValid?: boolean;
  children: React.ReactNode;
}

export function FieldWithHelp({
  label,
  htmlFor,
  helpText,
  error,
  example,
  required = false,
  isValid,
  children,
}: FieldWithHelpProps) {
  return (
    <div className="space-y-3">
      <Label
        htmlFor={htmlFor}
        className="text-lg font-medium text-foreground flex items-center gap-2"
      >
        {label}
        {required && <span className="text-red-500" aria-label="requerido">*</span>}
        {isValid && !error && (
          <CheckCircle2 className="w-5 h-5 text-green-600" aria-label="válido" />
        )}
      </Label>

      {children}

      {example && !error && (
        <p className="text-base text-muted-foreground">
          Ej: {example}
        </p>
      )}

      {helpText && !error && (
        <p className="text-base text-muted-foreground flex items-start gap-2">
          <span className="text-blue-500 flex-shrink-0">ℹ️</span>
          {helpText}
        </p>
      )}

      {error && (
        <p className="text-base text-red-600 flex items-center gap-2 font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
