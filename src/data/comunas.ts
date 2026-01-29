// Re-exportar desde regiones-comunas para mantener compatibilidad con el PRD
export { regiones, getComunasByRegion, getRegionNames } from './regiones-comunas';
export type { Region } from './regiones-comunas';

// Alias para el nombre del PRD
export { regiones as comunasPorRegion } from './regiones-comunas';
