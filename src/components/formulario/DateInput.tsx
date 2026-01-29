'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
  showAge?: boolean;
  minAge?: number;
  error?: string;
}

const meses = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

function generarDias(): string[] {
  return Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
}

function generarAnios(): string[] {
  const anioActual = new Date().getFullYear();
  const anios: string[] = [];
  for (let i = anioActual - 100; i <= anioActual - 55; i++) {
    anios.push(String(i));
  }
  return anios.reverse();
}

export function DateInput({
  value,
  onChange,
  showAge = true,
  error,
}: DateInputProps) {
  const [year, month, day] = value ? value.split('-') : ['', '', ''];
  const dias = generarDias();
  const anios = generarAnios();

  const handleChange = (part: 'day' | 'month' | 'year', newValue: string) => {
    let newDay = day;
    let newMonth = month;
    let newYear = year;

    if (part === 'day') newDay = newValue;
    if (part === 'month') newMonth = newValue;
    if (part === 'year') newYear = newValue;

    if (newYear && newMonth && newDay) {
      onChange(`${newYear}-${newMonth}-${newDay}`);
    } else if (newYear || newMonth || newDay) {
      // Partial date - store what we have
      onChange(`${newYear || '0000'}-${newMonth || '00'}-${newDay || '00'}`);
    }
  };

  const edad = value && !value.includes('00') ? calcularEdad(value) : null;
  const isValidAge = edad !== null && edad >= 60;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Día */}
        <Select value={day} onValueChange={(v) => handleChange('day', v)}>
          <SelectTrigger className={`h-14 w-[90px] text-base ${error ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Día" />
          </SelectTrigger>
          <SelectContent>
            {dias.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mes */}
        <Select value={month} onValueChange={(v) => handleChange('month', v)}>
          <SelectTrigger className={`h-14 flex-1 text-base ${error ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {meses.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Año */}
        <Select value={year} onValueChange={(v) => handleChange('year', v)}>
          <SelectTrigger className={`h-14 w-[100px] text-base ${error ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {anios.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mostrar edad */}
      {showAge && edad !== null && (
        <p className={`text-base font-medium ${isValidAge ? 'text-green-600' : 'text-red-600'}`}>
          {isValidAge ? '✓' : '⚠️'} Tiene {edad} años
        </p>
      )}
    </div>
  );
}
