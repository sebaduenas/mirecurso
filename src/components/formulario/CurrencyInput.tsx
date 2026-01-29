'use client';

import { Input } from '@/components/ui/input';

interface CurrencyInputProps {
  value: number | null | undefined;
  onChange: (value: number | undefined) => void;
  error?: string;
  id?: string;
  placeholder?: string;
}

function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CL').format(valor);
}

function parsearMoneda(texto: string): number | undefined {
  const limpio = texto.replace(/\D/g, '');
  if (limpio === '') return undefined;
  return parseInt(limpio, 10);
}

export function CurrencyInput({
  value,
  onChange,
  error,
  id = 'currency',
  placeholder = '0',
}: CurrencyInputProps) {
  const displayValue = value != null ? formatearMoneda(value) : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parsearMoneda(e.target.value);
    onChange(parsed);
  };

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
        $
      </span>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`h-14 text-lg pl-8 ${
          error ? 'border-red-500 focus-visible:ring-red-500' : ''
        }`}
        autoComplete="off"
      />
    </div>
  );
}
