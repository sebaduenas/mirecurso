'use client';

import { Input } from '@/components/ui/input';
import { formatearRut, validarRut, limpiarRut } from '@/lib/rut-utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface RutInputProps {
  value: string;
  onChange: (rut: string, isValid: boolean) => void;
  error?: string;
  id?: string;
  placeholder?: string;
}

export function RutInput({
  value,
  onChange,
  error,
  id = 'rut',
  placeholder = '12.345.678-9',
}: RutInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const limpio = limpiarRut(inputValue);

    // Limitar a 9 caracteres (8 dígitos + 1 DV)
    if (limpio.length > 9) return;

    const formateado = formatearRut(inputValue);
    const esValido = limpio.length >= 8 && validarRut(limpio);

    onChange(formateado, esValido);
  };

  const isValid = value.length >= 11 && validarRut(value);
  const showValidation = value.length >= 11;

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`h-14 text-lg pr-10 ${
          error ? 'border-red-500 focus-visible:ring-red-500' : ''
        } ${isValid ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
        autoComplete="off"
      />
      {showValidation && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValid ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      )}
    </div>
  );
}
