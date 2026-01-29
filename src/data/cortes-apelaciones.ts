export interface CorteApelaciones {
  nombre: string;
  direccion: string;
  ciudad: string;
}

export const cortesApelaciones: Record<string, CorteApelaciones> = {
  "Arica y Parinacota": {
    nombre: "Corte de Apelaciones de Arica",
    direccion: "Sotomayor 340",
    ciudad: "Arica"
  },
  "Tarapacá": {
    nombre: "Corte de Apelaciones de Iquique",
    direccion: "Patricio Lynch 521",
    ciudad: "Iquique"
  },
  "Antofagasta": {
    nombre: "Corte de Apelaciones de Antofagasta",
    direccion: "Prat 461",
    ciudad: "Antofagasta"
  },
  "Atacama": {
    nombre: "Corte de Apelaciones de Copiapó",
    direccion: "Colipí 480",
    ciudad: "Copiapó"
  },
  "Coquimbo": {
    nombre: "Corte de Apelaciones de La Serena",
    direccion: "Cordovez 450",
    ciudad: "La Serena"
  },
  "Valparaíso": {
    nombre: "Corte de Apelaciones de Valparaíso",
    direccion: "Blanco 1111",
    ciudad: "Valparaíso"
  },
  "Metropolitana": {
    nombre: "Corte de Apelaciones de Santiago",
    direccion: "Bandera 344",
    ciudad: "Santiago"
  },
  "O'Higgins": {
    nombre: "Corte de Apelaciones de Rancagua",
    direccion: "Campos 387",
    ciudad: "Rancagua"
  },
  "Maule": {
    nombre: "Corte de Apelaciones de Talca",
    direccion: "1 Oriente 1016",
    ciudad: "Talca"
  },
  "Ñuble": {
    nombre: "Corte de Apelaciones de Chillán",
    direccion: "18 de Septiembre 485",
    ciudad: "Chillán"
  },
  "Biobío": {
    nombre: "Corte de Apelaciones de Concepción",
    direccion: "Tucapel 539",
    ciudad: "Concepción"
  },
  "La Araucanía": {
    nombre: "Corte de Apelaciones de Temuco",
    direccion: "Bulnes 535",
    ciudad: "Temuco"
  },
  "Los Ríos": {
    nombre: "Corte de Apelaciones de Valdivia",
    direccion: "Yungay 440",
    ciudad: "Valdivia"
  },
  "Los Lagos": {
    nombre: "Corte de Apelaciones de Puerto Montt",
    direccion: "Benavente 380",
    ciudad: "Puerto Montt"
  },
  "Aysén": {
    nombre: "Corte de Apelaciones de Coyhaique",
    direccion: "Condell 226",
    ciudad: "Coyhaique"
  },
  "Magallanes": {
    nombre: "Corte de Apelaciones de Punta Arenas",
    direccion: "Bories 901",
    ciudad: "Punta Arenas"
  }
};

export function getCorteByRegion(region: string): CorteApelaciones {
  return cortesApelaciones[region] || cortesApelaciones["Metropolitana"];
}
