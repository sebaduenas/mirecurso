import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DatosPersonales, DatosPropiedad, DatosTributarios, FormularioCompleto } from '@/types/formulario';
import { getCorteByRegion } from '@/data/cortes-apelaciones';

interface FormularioState {
  // Datos del formulario
  datosPersonales: Partial<DatosPersonales>;
  datosPropiedad: Partial<DatosPropiedad>;
  datosTributarios: Partial<DatosTributarios>;

  // Estado de navegación
  currentStep: number;
  completedSteps: number[];

  // Acciones para actualizar datos
  setDatosPersonales: (datos: Partial<DatosPersonales>) => void;
  setDatosPropiedad: (datos: Partial<DatosPropiedad>) => void;
  setDatosTributarios: (datos: Partial<DatosTributarios>) => void;

  // Acciones de navegación
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;

  // Utilidades
  resetFormulario: () => void;
  getFormularioCompleto: () => FormularioCompleto | null;
  isStepAccessible: (step: number) => boolean;
  getPorcentajeCompletado: () => number;
}

const initialState = {
  datosPersonales: {},
  datosPropiedad: {},
  datosTributarios: {},
  currentStep: 1,
  completedSteps: [] as number[],
};

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

export const useFormularioStore = create<FormularioState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Setters de datos
      setDatosPersonales: (datos) =>
        set((state) => ({
          datosPersonales: { ...state.datosPersonales, ...datos },
        })),

      setDatosPropiedad: (datos) =>
        set((state) => ({
          datosPropiedad: { ...state.datosPropiedad, ...datos },
        })),

      setDatosTributarios: (datos) =>
        set((state) => ({
          datosTributarios: { ...state.datosTributarios, ...datos },
        })),

      // Navegación
      setCurrentStep: (step) => set({ currentStep: step }),

      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])].sort((a, b) => a - b),
        })),

      // Reset
      resetFormulario: () => set(initialState),

      // Obtener formulario completo para generar PDF
      getFormularioCompleto: () => {
        const state = get();

        // Verificar que todos los pasos están completos
        if (state.completedSteps.length < 3) {
          return null;
        }

        const corte = getCorteByRegion(state.datosPropiedad.regionPropiedad || 'Metropolitana');
        const edad = state.datosPersonales.fechaNacimiento
          ? calcularEdad(state.datosPersonales.fechaNacimiento)
          : 0;

        return {
          datosPersonales: {
            ...state.datosPersonales,
            edad,
          } as DatosPersonales,
          datosPropiedad: state.datosPropiedad as DatosPropiedad,
          datosTributarios: {
            ...state.datosTributarios,
            ingresoAnual: (state.datosTributarios.ingresoMensual || 0) * 12,
          } as DatosTributarios,
          datosRecurso: {
            corteApelaciones: corte.nombre,
            direccionCorte: `${corte.direccion}, ${corte.ciudad}`,
            fechaGeneracion: new Date().toISOString(),
          },
          metadata: {
            version: '1.0',
            creadoEn: new Date().toISOString(),
            modificadoEn: new Date().toISOString(),
            completado: true,
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
        return Math.round((state.completedSteps.length / 5) * 100);
      },
    }),
    {
      name: 'mirecurso-formulario-v1',
      partialize: (state) => ({
        datosPersonales: state.datosPersonales,
        datosPropiedad: state.datosPropiedad,
        datosTributarios: state.datosTributarios,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    }
  )
);
