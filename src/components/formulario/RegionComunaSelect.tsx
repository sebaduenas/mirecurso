'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { regiones, getComunasByRegion } from '@/data/regiones-comunas';

interface RegionComunaSelectProps {
  region: string;
  comuna: string;
  onRegionChange: (region: string) => void;
  onComunaChange: (comuna: string) => void;
  regionError?: string;
  comunaError?: string;
  regionLabel?: string;
  comunaLabel?: string;
}

export function RegionComunaSelect({
  region,
  comuna,
  onRegionChange,
  onComunaChange,
  regionError,
  comunaError,
}: RegionComunaSelectProps) {
  const comunas = region ? getComunasByRegion(region) : [];

  const handleRegionChange = (newRegion: string) => {
    onRegionChange(newRegion);
    onComunaChange(''); // Reset comuna when region changes
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Región */}
      <div className="space-y-2">
        <Select value={region} onValueChange={handleRegionChange}>
          <SelectTrigger className={`h-14 text-base ${regionError ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Seleccione región..." />
          </SelectTrigger>
          <SelectContent>
            {regiones.map((r) => (
              <SelectItem key={r.nombre} value={r.nombre}>
                {r.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Comuna */}
      <div className="space-y-2">
        <Select value={comuna} onValueChange={onComunaChange} disabled={!region}>
          <SelectTrigger className={`h-14 text-base ${comunaError ? 'border-red-500' : ''}`}>
            <SelectValue placeholder={region ? 'Seleccione comuna...' : 'Primero seleccione región'} />
          </SelectTrigger>
          <SelectContent>
            {comunas.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
