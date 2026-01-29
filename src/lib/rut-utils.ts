/**
 * Utilidades para validación y formateo de RUT chileno
 */

export function limpiarRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

export function formatearRut(rut: string): string {
  const rutLimpio = limpiarRut(rut);
  if (rutLimpio.length < 2) return rutLimpio;

  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);

  // Formatear con puntos
  let cuerpoFormateado = '';
  let contador = 0;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    contador++;
    if (contador === 3 && i !== 0) {
      cuerpoFormateado = '.' + cuerpoFormateado;
      contador = 0;
    }
  }

  return `${cuerpoFormateado}-${dv}`;
}

export function calcularDigitoVerificador(rutSinDV: string): string {
  const rutLimpio = rutSinDV.replace(/\D/g, '');
  let suma = 0;
  let multiplicador = 2;

  for (let i = rutLimpio.length - 1; i >= 0; i--) {
    suma += parseInt(rutLimpio[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvCalculado = 11 - resto;

  if (dvCalculado === 11) return '0';
  if (dvCalculado === 10) return 'K';
  return dvCalculado.toString();
}

export function validarRut(rut: string): boolean {
  const rutLimpio = limpiarRut(rut);

  if (rutLimpio.length < 8 || rutLimpio.length > 9) {
    return false;
  }

  const cuerpo = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1);
  const dvCalculado = calcularDigitoVerificador(cuerpo);

  return dvIngresado === dvCalculado;
}

export function obtenerEdadDesdeRut(rut: string): number | null {
  // El RUT no contiene información de edad directamente
  // Esta función es un placeholder por si se necesita en el futuro
  return null;
}
