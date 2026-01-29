import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  DatosPersonales,
  DatosPropiedad,
  DatosEconomicos,
  DatosContribuciones,
  ProcedimientoPrevio,
  FormularioCompleto,
  ValidacionesCaso,
  DatosTributarios,
} from '@/types/formulario';
import { getCorteByRegion } from '@/data/cortes-apelaciones';
import { TOPES_LEY_20732 } from '@/data/datos-fijos';

// Número total de pasos en el formulario
const TOTAL_PASOS = 7;

interface FormularioState {
  // Datos del formulario (nueva estructura)
  datosPersonales: Partial<DatosPersonales>;
  datosPropiedad: Partial<DatosPropiedad>;
  datosEconomicos: Partial<DatosEconomicos>;
  datosContribuciones: Partial<DatosContribuciones>;
  procedimientoPrevio: Partial<ProcedimientoPrevio>;

  // Legacy (para compatibilidad con componentes existentes)
  datosTributarios: Partial<DatosTributarios>;

  // Estado de navegación
  currentStep: number;
  completedSteps: number[];

  // Hidratación
  _hasHydrated: boolean;

  // Acciones para actualizar datos
  setDatosPersonales: (datos: Partial<DatosPersonales>) => void;
  setDatosPropiedad: (datos: Partial<DatosPropiedad>) => void;
  setDatosEconomicos: (datos: Partial<DatosEconomicos>) => void;
  setDatosContribuciones: (datos: Partial<DatosContribuciones>) => void;
  setProcedimientoPrevio: (datos: Partial<ProcedimientoPrevio>) => void;
  setDatosTributarios: (datos: Partial<DatosTributarios>) => void;

  // Acciones de navegación
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;

  // Utilidades
  resetFormulario: () => void;
  getFormularioCompleto: () => FormularioCompleto | null;
  getValidaciones: () => ValidacionesCaso;
  isStepAccessible: (step: number) => boolean;
  getPorcentajeCompletado: () => number;
}

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

function calcularDiasDesde(fechaISO: string): number {
  const fecha = new Date(fechaISO);
  const hoy = new Date();
  const diferencia = hoy.getTime() - fecha.getTime();
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
}

export const useFormularioStore = create<FormularioState>()(
  persist(
    (set, get) => ({
      // Initial state
      datosPersonales: {},
      datosPropiedad: {},
      datosEconomicos: {},
      datosContribuciones: {},
      procedimientoPrevio: {},
      datosTributarios: {}, // Legacy
      currentStep: 1,
      completedSteps: [],
      _hasHydrated: false,

      // Setters de datos
      setDatosPersonales: (datos) =>
        set((state) => ({
          datosPersonales: { ...state.datosPersonales, ...datos },
        })),

      setDatosPropiedad: (datos) =>
        set((state) => ({
          datosPropiedad: { ...state.datosPropiedad, ...datos },
        })),

      setDatosEconomicos: (datos) =>
        set((state) => ({
          datosEconomicos: { ...state.datosEconomicos, ...datos },
          // Sincronizar con datosTributarios para compatibilidad
          datosTributarios: {
            ...state.datosTributarios,
            ingresoMensual: datos.ingresoMensual ?? state.datosTributarios.ingresoMensual,
            tieneOtrasPropiedades: datos.tieneOtrasPropiedades ?? state.datosTributarios.tieneOtrasPropiedades,
          },
        })),

      setDatosContribuciones: (datos) =>
        set((state) => ({
          datosContribuciones: { ...state.datosContribuciones, ...datos },
          // Sincronizar con datosTributarios para compatibilidad
          datosTributarios: {
            ...state.datosTributarios,
            montoContribucionTrimestral: datos.montoContribucionTrimestral ?? state.datosTributarios.montoContribucionTrimestral,
          },
        })),

      setProcedimientoPrevio: (datos) =>
        set((state) => ({
          procedimientoPrevio: { ...state.procedimientoPrevio, ...datos },
        })),

      // Legacy setter (para compatibilidad)
      setDatosTributarios: (datos) =>
        set((state) => ({
          datosTributarios: { ...state.datosTributarios, ...datos },
        })),

      // Navegación
      setCurrentStep: (step) =>
        set((state) => {
          if (state.currentStep === step) return state;
          return { currentStep: step };
        }),

      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])].sort((a, b) => a - b),
        })),

      // Reset
      resetFormulario: () => set({
        datosPersonales: {},
        datosPropiedad: {},
        datosEconomicos: {},
        datosContribuciones: {},
        procedimientoPrevio: {},
        datosTributarios: {},
        currentStep: 1,
        completedSteps: [],
      }),

      // Calcular validaciones del caso
      getValidaciones: (): ValidacionesCaso => {
        const state = get();
        const { datosPersonales, datosPropiedad, datosEconomicos, datosContribuciones, procedimientoPrevio } = state;

        const edad = datosPersonales.fechaNacimiento
          ? calcularEdad(datosPersonales.fechaNacimiento)
          : 0;

        const ingresoAnual = (datosEconomicos.ingresoMensual || 0) * 12;
        const contribucionAnual = (datosContribuciones.montoContribucionTrimestral || 0) * 4;
        const porcentajeIngresos = ingresoAnual > 0
          ? (contribucionAnual / ingresoAnual) * 100
          : 0;

        // Calcular si excede tope de avalúo
        const avaluo = datosPropiedad.avaluoFiscalVigente || 0;
        const excedeTopeAvaluo = avaluo > TOPES_LEY_20732.topeAvaluoMaximo;

        // Verificar si está dentro del plazo de 30 días
        const dentroDelPlazo = procedimientoPrevio.fechaResolucion
          ? calcularDiasDesde(procedimientoPrevio.fechaResolucion) <= 30
          : true; // Si no hay resolución, no aplica el plazo

        return {
          cumpleEdad: edad >= 60,
          cumpleIngresos100: ingresoAnual <= TOPES_LEY_20732.ingresoMaximo100_UTA * TOPES_LEY_20732.valorUTA,
          cumpleIngresos50: ingresoAnual <= TOPES_LEY_20732.ingresoMaximo50_UTA * TOPES_LEY_20732.valorUTA,
          esHabitacional: datosPropiedad.destinoHabitacional ?? true,
          excedeTopeAvaluo,
          porcentajeDesproporcionado: porcentajeIngresos > 10,
          dentroDelPlazo,
        };
      },

      // Obtener formulario completo para generar PDF
      getFormularioCompleto: (): FormularioCompleto | null => {
        const state = get();

        // Verificar que los pasos mínimos están completos (al menos hasta el paso 5)
        if (state.completedSteps.length < 5) {
          return null;
        }

        const { datosPersonales, datosPropiedad, datosEconomicos, datosContribuciones, procedimientoPrevio } = state;

        const corte = getCorteByRegion(datosPropiedad.regionPropiedad || 'Metropolitana');
        const edad = datosPersonales.fechaNacimiento
          ? calcularEdad(datosPersonales.fechaNacimiento)
          : 0;

        const ingresoAnual = (datosEconomicos.ingresoMensual || 0) * 12;
        const contribucionAnual = (datosContribuciones.montoContribucionTrimestral || 0) * 4;
        const porcentajeIngresos = ingresoAnual > 0
          ? (contribucionAnual / ingresoAnual) * 100
          : 0;

        const validaciones = state.getValidaciones();

        return {
          datosPersonales: {
            ...datosPersonales,
            edad,
            nacionalidad: datosPersonales.nacionalidad || 'Chilena',
          } as DatosPersonales,

          datosPropiedad: {
            ...datosPropiedad,
            destinoHabitacional: datosPropiedad.destinoHabitacional ?? true,
          } as DatosPropiedad,

          datosEconomicos: {
            ...datosEconomicos,
            ingresoAnual,
            fuentesIngreso: datosEconomicos.fuentesIngreso || [],
          } as DatosEconomicos,

          datosContribuciones: {
            ...datosContribuciones,
            contribucionAnual,
            porcentajeIngresos,
            giros: datosContribuciones.giros || [],
          } as DatosContribuciones,

          procedimientoPrevio: {
            ...procedimientoPrevio,
            presentoSolicitudSII: procedimientoPrevio.presentoSolicitudSII ?? false,
            recibioDenegatoria: procedimientoPrevio.recibioDenegatoria ?? false,
          } as ProcedimientoPrevio,

          datosRecurso: {
            corteApelaciones: corte.nombre,
            direccionCorte: `${corte.direccion}, ${corte.ciudad}`,
            fechaGeneracion: new Date().toISOString(),
          },

          validaciones,

          metadata: {
            version: '2.0',
            creadoEn: new Date().toISOString(),
            modificadoEn: new Date().toISOString(),
          },
        };
      },

      // Verificar si un paso es accesible
      isStepAccessible: (step) => {
        const state = get();
        if (step === 1) return true;
        return state.completedSteps.includes(step - 1);
      },

      // Porcentaje de completado para la barra de progreso
      getPorcentajeCompletado: () => {
        const state = get();
        return Math.round((state.completedSteps.length / TOTAL_PASOS) * 100);
      },
    }),
    {
      name: 'mirecurso-formulario-v2', // Nueva versión del store
      storage: createJSONStorage(() => {
        // Return a no-op storage on server
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        // Wrap localStorage with error handling
        return {
          getItem: (name: string) => {
            try {
              const value = localStorage.getItem(name);
              if (value) {
                // Try to parse to validate it's valid JSON
                JSON.parse(value);
              }
              return value;
            } catch {
              // If data is corrupted, remove it and return null
              try {
                localStorage.removeItem(name);
              } catch {
                // Ignore removal errors
              }
              return null;
            }
          },
          setItem: (name: string, value: string) => {
            try {
              localStorage.setItem(name, value);
            } catch {
              // Ignore storage errors (e.g., quota exceeded)
            }
          },
          removeItem: (name: string) => {
            try {
              localStorage.removeItem(name);
            } catch {
              // Ignore removal errors
            }
          },
        };
      }),
      partialize: (state) => ({
        datosPersonales: state.datosPersonales,
        datosPropiedad: state.datosPropiedad,
        datosEconomicos: state.datosEconomicos,
        datosContribuciones: state.datosContribuciones,
        procedimientoPrevio: state.procedimientoPrevio,
        datosTributarios: state.datosTributarios,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
      onRehydrateStorage: () => () => {
        useFormularioStore.setState({ _hasHydrated: true });
      },
    }
  )
);

// Clean up old v1 data on client
if (typeof window !== 'undefined') {
  try {
    const oldData = localStorage.getItem('mirecurso-formulario-v1');
    if (oldData) {
      localStorage.removeItem('mirecurso-formulario-v1');
    }
  } catch {
    // Ignore errors when cleaning up
  }
}
