# PRD: mirecurso.cl
## Plataforma de generación de recursos de protección para adultos mayores

**Versión:** 1.0  
**Fecha:** 29 de enero de 2026  
**Autores:** Sebastián Dueñas, Matías Aránguiz  
**Stack:** Next.js 14 + TypeScript + Tailwind CSS + Vercel  

---

## 1. Visión del Producto

### 1.1 Problema
Aproximadamente 206.000 adultos mayores en Chile poseen propiedades afectas a contribuciones sin acceder a beneficios tributarios. El fallo de la Corte de Apelaciones de Santiago (caso Marina Latorre, enero 2026) abre la puerta a recursos de protección para anular cobros indebidos, pero:

- El proceso legal es intimidante para personas mayores
- Requiere conocimiento técnico-jurídico especializado
- No existe una vía simple y guiada para iniciar el reclamo
- Los adultos mayores enfrentan barreras tecnológicas adicionales

### 1.2 Solución
**mirecurso.cl** es una plataforma web que guía paso a paso a adultos mayores (o sus familiares) para generar un recurso de protección contra el SII por cobro de contribuciones, generando un **PDF listo para presentar ante la Corte de Apelaciones**.

### 1.3 Propuesta de valor
> "Ingresa tus datos, descarga tu recurso. Sin abogados, sin complicaciones, listo para presentar."

### 1.4 Usuarios objetivo

| Segmento | Descripción | Necesidades específicas |
|----------|-------------|------------------------|
| **Primario** | Adultos mayores (65+) propietarios | UI accesible, entrada por voz, ritmo pausado |
| **Secundario** | Hijos/nietos que ayudan a familiares | Flujo eficiente, opción de completar por otro |
| **Terciario** | Asesores/gestores que asisten múltiples casos | Exportación profesional, datos estructurados |

---

## 2. Principios de Diseño UX Gerontológico

### 2.1 Principios rectores
> ⚠️ Aplicar en TODA decisión de diseño sin excepción.

| Principio | Implementación concreta |
|-----------|------------------------|
| **Reducir carga cognitiva** | Máximo 2-3 campos por pantalla. Una sola acción principal por vista. Textos ≤20 palabras por bloque. |
| **Reconocimiento > recuerdo** | Barra de progreso siempre visible. Autocompletado de comunas/ciudades. Resumen de datos ingresados accesible en todo momento. |
| **Prevención de errores** | Validación en tiempo real con feedback visual. Confirmación explícita antes de generar PDF. Ejemplos en cada campo. |
| **Ritmo del usuario** | Sin timeouts de sesión. Guardado automático en localStorage. Botón "Guardar y continuar después" visible. |
| **Consistencia extrema** | Mismo layout en todas las pantallas. Botón principal siempre en la misma posición. Misma paleta de colores. |

### 2.2 Especificaciones de accesibilidad

```yaml
tipografía:
  familia_principal: "Inter" # Alta legibilidad, gratuita
  familia_alternativa: "Atkinson Hyperlegible" # Diseñada para baja visión
  tamaño_base_mobile: 18px
  tamaño_base_desktop: 18px
  tamaño_títulos: 24px - 32px
  line_height: 1.6
  letter_spacing: 0.01em
  peso_body: 400
  peso_labels: 500
  peso_títulos: 600

colores:
  # Contraste mínimo 7:1 (WCAG AAA)
  primario: "#1E3A8A"        # Azul oscuro - confianza, institucional
  primario_hover: "#1E40AF"
  secundario: "#059669"       # Verde - éxito, confirmación
  error: "#DC2626"            # Rojo - siempre con ícono adicional
  warning: "#D97706"          # Naranja - advertencias
  fondo_página: "#F8FAFC"     # Gris muy claro (no blanco puro)
  fondo_cards: "#FFFFFF"
  texto_principal: "#1E293B"  # Gris oscuro (no negro puro)
  texto_secundario: "#475569"
  borde: "#CBD5E1"

interacción:
  área_táctil_mínima: 48px x 48px
  espaciado_entre_botones: 16px
  espaciado_entre_campos: 24px
  border_radius: 8px
  transiciones: 150ms ease-in-out
  focus_ring: "ring-2 ring-offset-2 ring-blue-500"

formularios:
  altura_campos: 56px
  padding_campos: 16px
  labels: siempre visibles arriba del campo
  placeholder: solo como ejemplo, nunca como label
  mensajes_ayuda: debajo del campo, color texto_secundario
  mensajes_error: debajo del campo, color error + ícono ⚠️
```

### 2.3 Patrones de interacción para adultos mayores

```yaml
entrada_de_datos:
  - Labels grandes y descriptivos sobre cada campo
  - Ejemplos de formato esperado (ej: "12.345.678-9")
  - Máscaras de input para RUT y teléfono
  - Botón de voz prominente junto a campos de texto largo
  
navegación:
  - Barra de progreso horizontal siempre visible
  - Botones "Anterior" y "Siguiente" consistentes
  - Número de paso actual: "Paso 2 de 5"
  - Sin menús hamburguesa en el formulario - navegación lineal
  
feedback:
  - Confirmación visual inmediata al completar campo (checkmark verde)
  - Resumen antes de generar el documento
  - Animación sutil al guardar (no intrusiva)

recuperación:
  - "¿Olvidó dónde quedó?" - botón para ver resumen
  - Datos persisten al cerrar navegador (localStorage)
  - Opción de enviar link de continuación por email (futuro)
```

---

## 3. Arquitectura Técnica

### 3.1 Stack tecnológico

```yaml
frontend:
  framework: Next.js 14 (App Router)
  lenguaje: TypeScript (strict mode)
  estilos: Tailwind CSS 3.4
  componentes_ui: shadcn/ui (accesible por defecto)
  formularios: React Hook Form + Zod
  estado: Zustand (simple, persistible)
  
funcionalidades_especiales:
  voz_a_texto: Web Speech API (nativo del navegador)
  generación_pdf: @react-pdf/renderer
  almacenamiento_local: localStorage con JSON
  
deploy:
  plataforma: Vercel
  dominio: mirecurso.cl
  analytics: Vercel Analytics (privacy-friendly)

repositorio:
  plataforma: GitHub
  estructura: monorepo simple
  ci_cd: GitHub Actions → Vercel (automático)
```

### 3.2 Estructura del proyecto

```
mirecurso/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout global con fuentes y meta
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css
│   │   ├── formulario/
│   │   │   ├── layout.tsx          # Layout del formulario con ProgressBar
│   │   │   ├── page.tsx            # Redirect a paso-1
│   │   │   ├── paso-1/page.tsx     # Datos personales
│   │   │   ├── paso-2/page.tsx     # Datos de la propiedad
│   │   │   ├── paso-3/page.tsx     # Datos tributarios
│   │   │   ├── paso-4/page.tsx     # Revisión
│   │   │   └── paso-5/page.tsx     # Descarga PDF
│   │   ├── como-funciona/page.tsx
│   │   ├── preguntas/page.tsx
│   │   └── api/
│   │       └── generar-pdf/route.ts
│   ├── components/
│   │   ├── ui/                     # shadcn components
│   │   ├── formulario/
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StepNavigation.tsx
│   │   │   ├── VoiceInput.tsx
│   │   │   ├── FieldWithHelp.tsx
│   │   │   ├── RutInput.tsx
│   │   │   └── CurrencyInput.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   └── pdf/
│   │       └── RecursoTemplate.tsx
│   ├── lib/
│   │   ├── store.ts                # Zustand store
│   │   ├── validations.ts          # Schemas Zod
│   │   ├── pdf-generator.ts
│   │   ├── rut-utils.ts
│   │   └── utils.ts
│   ├── data/
│   │   ├── comunas.ts
│   │   ├── cortes-apelaciones.ts
│   │   └── textos-legales.ts
│   └── types/
│       └── formulario.ts
├── public/
│   ├── fonts/
│   └── images/
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

### 3.3 Modelo de datos

```typescript
// src/types/formulario.ts

export interface DatosPersonales {
  nombreCompleto: string;
  rut: string;
  fechaNacimiento: string;      // ISO date YYYY-MM-DD
  edad: number;                 // Calculado automáticamente
  domicilio: string;
  comuna: string;
  region: string;
  telefono?: string;
  email?: string;
  actuaRepresentante: boolean;
  representante?: {
    nombreCompleto: string;
    rut: string;
    parentesco: string;
  };
}

export interface DatosPropiedad {
  direccionPropiedad: string;
  comunaPropiedad: string;
  regionPropiedad: string;
  rolSII: string;               // Formato: "123-456"
  avaluoFiscal: number;         // En pesos chilenos
  destinoPropiedad: 'habitacional' | 'otro';
  esPropietarioUnico: boolean;
  porcentajeDominio?: number;
}

export interface DatosTributarios {
  ingresoMensual: number;
  ingresoAnual: number;         // Calculado: ingresoMensual * 12
  fuenteIngresos: 'pension' | 'arriendos' | 'otros' | 'mixto';
  tieneOtrasPropiedades: boolean;
  montoContribucionTrimestral: number;
  tieneBeneficioActual: boolean;
  tipoBeneficioActual?: string;
}

export interface DatosRecurso {
  corteApelaciones: string;
  direccionCorte: string;
  fechaGeneracion: string;
}

export interface FormularioCompleto {
  datosPersonales: DatosPersonales;
  datosPropiedad: DatosPropiedad;
  datosTributarios: DatosTributarios;
  datosRecurso: DatosRecurso;
  metadata: {
    version: string;
    creadoEn: string;
    modificadoEn: string;
    completado: boolean;
  };
}
```

---

## 4. Flujo de Usuario Detallado

### 4.1 Diagrama de flujo principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            LANDING PAGE                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  "Reclame la exención de contribuciones que le corresponde"     │   │
│  │                                                                  │   │
│  │  [🎯 COMENZAR MI RECURSO]  ←── Botón principal, muy visible     │   │
│  │                                                                  │   │
│  │  ¿Cómo funciona? | Preguntas frecuentes                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PASO 1: DATOS PERSONALES                          [████░░░░░░] 1 de 5 │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ¿Quién presenta el recurso?                                           │
│  ○ Yo mismo (soy el adulto mayor afectado)                             │
│  ○ Un familiar o representante                                         │
│                                                                         │
│  Nombre completo del afectado                                          │
│  ┌─────────────────────────────────────────────────────────┐ [🎤]      │
│  │ Ej: María Elena González Pérez                          │           │
│  └─────────────────────────────────────────────────────────┘           │
│                                                                         │
│  RUT                                                                    │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ 12.345.678-9                                             │  ✓       │
│  └─────────────────────────────────────────────────────────┘           │
│  ℹ️ Incluya puntos y guión                                             │
│                                                                         │
│  Fecha de nacimiento                                                    │
│  ┌──────┐ / ┌──────┐ / ┌──────┐    → Tiene 78 años ✓                  │
│  │  15  │   │  03  │   │ 1947 │                                        │
│  └──────┘   └──────┘   └──────┘                                        │
│                                                                         │
│           [← Volver al inicio]                [Siguiente →]            │
│                                                                         │
│  💾 Sus datos se guardan automáticamente en este dispositivo           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PASO 1 (cont): DOMICILIO                          [████░░░░░░] 1 de 5 │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Dirección donde vive actualmente                                      │
│  ┌─────────────────────────────────────────────────────────┐ [🎤]      │
│  │ Ej: Av. Providencia 1234, depto 56                      │           │
│  └─────────────────────────────────────────────────────────┘           │
│  ℹ️ Puede ser distinta a la dirección de la propiedad                  │
│                                                                         │
│  Región                                                                 │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ Seleccione región...                              ▼     │           │
│  └─────────────────────────────────────────────────────────┘           │
│                                                                         │
│  Comuna                                                                 │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ 🔍 Buscar comuna...                              ▼      │           │
│  └─────────────────────────────────────────────────────────┘           │
│                                                                         │
│  Teléfono (opcional)                                                   │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ +56 9 1234 5678                                          │           │
│  └─────────────────────────────────────────────────────────┘           │
│                                                                         │
│           [← Anterior]                        [Siguiente →]            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PASO 2: DATOS DE LA PROPIEDAD                     [████████░░] 2 de 5 │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Dirección de la propiedad afecta a contribuciones                     │
│  ┌─────────────────────────────────────────────────────────┐ [🎤]      │
│  │                                                         │           │
│  └─────────────────────────────────────────────────────────┘           │
│  [ ] Es la misma dirección donde vivo                                  │
│                                                                         │
│  Región de la propiedad                                                │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ Región Metropolitana                              ▼     │           │
│  └─────────────────────────────────────────────────────────┘           │
│                                                                         │
│  Comuna de la propiedad                                                │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ Providencia                                       ▼     │           │
│  └─────────────────────────────────────────────────────────┘           │
│                                                                         │
│           [← Anterior]                        [Siguiente →]            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PASO 2 (cont): INFORMACIÓN DEL SII                [████████░░] 2 de 5 │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Rol del SII                                                           │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ Ej: 123-456                                              │           │
│  └─────────────────────────────────────────────────────────┘           │
│  ℹ️ Lo encuentra en su boleta de contribuciones o en sii.cl            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │  📄 ¿Dónde encuentro el Rol?                            │           │
│  │     [Ver ejemplo de boleta]                              │           │
│  └─────────────────────────────────────────────────────────┘           │
│                                                                         │
│  Avalúo fiscal (en pesos)                                              │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ $ 180.000.000                                            │           │
│  └─────────────────────────────────────────────────────────┘           │
│  ℹ️ Este valor aparece en su certificado de avalúo fiscal              │
│                                                                         │
│  ¿Es usted el único propietario?                                       │
│  ○ Sí, soy el único propietario                                        │
│  ○ No, comparto la propiedad con otras personas                        │
│                                                                         │
│           [← Anterior]                        [Siguiente →]            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PASO 3: SITUACIÓN TRIBUTARIA                    [████████████░] 3 de 5│
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Ingreso mensual aproximado (suma de todas las fuentes)                │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ $ 850.000                                                │           │
│  └─────────────────────────────────────────────────────────┘           │
│  ℹ️ Incluya pensiones, arriendos y otros ingresos regulares           │
│                                                                         │
│  Principal fuente de ingresos                                          │
│  ○ Pensión de vejez                                                    │
│  ○ Arriendos                                                           │
│  ○ Otros ingresos                                                      │
│  ○ Combinación de fuentes                                              │
│                                                                         │
│  ¿Tiene otras propiedades además de esta?                              │
│  ○ No, esta es mi única propiedad                                      │
│  ○ Sí, tengo otras propiedades                                         │
│                                                                         │
│           [← Anterior]                        [Siguiente →]            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PASO 3 (cont): CONTRIBUCIONES ACTUALES          [████████████░] 3 de 5│
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ¿Actualmente tiene algún beneficio de rebaja de contribuciones?       │
│  ○ Sí, tengo rebaja parcial (50%)                                      │
│  ○ Sí, tengo rebaja total (100%)                                       │
│  ● No tengo ningún beneficio                                           │
│                                                                         │
│  Monto actual de contribuciones (por trimestre)                        │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ $ 420.000                                                │           │
│  └─────────────────────────────────────────────────────────┘           │
│  ℹ️ Es el monto que paga cada 3 meses                                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  💡 Según sus datos, usted paga $1.680.000 al año en             │   │
│  │     contribuciones, lo que representa un 16.5% de sus           │   │
│  │     ingresos anuales.                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│           [← Anterior]                        [Siguiente →]            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PASO 4: REVISIÓN DE DATOS                      [████████████████░] 4/5│
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Por favor revise que toda la información esté correcta                │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 👤 DATOS PERSONALES                              [✏️ Editar]   │   │
│  │                                                                  │   │
│  │    María Elena González Pérez                                   │   │
│  │    RUT: 12.345.678-9                                            │   │
│  │    78 años                                                      │   │
│  │    Av. Providencia 1234, Providencia                            │   │
│  │    Región Metropolitana                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🏠 PROPIEDAD                                     [✏️ Editar]   │   │
│  │                                                                  │   │
│  │    Av. Providencia 1234, depto 56                               │   │
│  │    Providencia, Región Metropolitana                            │   │
│  │    Rol SII: 123-456                                             │   │
│  │    Avalúo fiscal: $180.000.000                                  │   │
│  │    Propietario único: Sí                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 💰 SITUACIÓN TRIBUTARIA                          [✏️ Editar]   │   │
│  │                                                                  │   │
│  │    Ingreso mensual: $850.000                                    │   │
│  │    Ingreso anual: $10.200.000                                   │   │
│  │    Fuente: Pensión de vejez                                     │   │
│  │    Otras propiedades: No                                        │   │
│  │    Beneficio actual: Ninguno                                    │   │
│  │    Contribución trimestral: $420.000                            │   │
│  │    Contribución anual: $1.680.000 (16.5% de ingresos)           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🏛️ CORTE COMPETENTE                                             │   │
│  │                                                                  │   │
│  │    Corte de Apelaciones de Santiago                             │   │
│  │    Dirección: Bandera 344, Santiago Centro                      │   │
│  │    (Determinada según la región de la propiedad)                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ☑️ Confirmo que los datos ingresados son correctos y verdaderos │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│           [← Anterior]            [✅ GENERAR MI RECURSO]              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PASO 5: ¡SU RECURSO ESTÁ LISTO!                [████████████████████] │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│                         ┌───────────────────┐                          │
│                         │                   │                          │
│                         │    📄 PDF         │                          │
│                         │                   │                          │
│                         │  Recurso de       │                          │
│                         │  Protección       │                          │
│                         │                   │                          │
│                         │  María Elena      │                          │
│                         │  González P.      │                          │
│                         │                   │                          │
│                         └───────────────────┘                          │
│                                                                         │
│              [📥 DESCARGAR RECURSO EN PDF]                             │
│                    Botón grande y prominente                           │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📋 PASOS SIGUIENTES                                                   │
│                                                                         │
│  1️⃣ Imprima el documento                                               │
│     Necesita 2 copias: una para la Corte y una para usted              │
│                                                                         │
│  2️⃣ Firme donde corresponde                                            │
│     Busque la línea "Firma del recurrente" al final del documento      │
│                                                                         │
│  3️⃣ Reúna los documentos de respaldo                                   │
│     • Copia de su cédula de identidad                                  │
│     • Certificado de avalúo fiscal (puede obtenerlo en sii.cl)         │
│     • Copia de boleta de contribuciones                                │
│     • Liquidación de pensión o certificado de ingresos                 │
│                                                                         │
│  4️⃣ Presente en la Corte de Apelaciones                                │
│     📍 Corte de Apelaciones de Santiago                                │
│        Bandera 344, Santiago Centro                                    │
│        Horario: Lunes a Viernes, 8:00 a 14:00 hrs                      │
│                                                                         │
│  5️⃣ Guarde su copia timbrada                                           │
│     La Corte le devolverá una copia con el timbre de recepción.        │
│     Guárdela como comprobante.                                         │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ¿Tiene dudas?                                                         │
│  [📖 Ver preguntas frecuentes]    [📞 Línea de ayuda: 600 XXX XXXX]   │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  [🔄 Generar otro recurso]         [📧 Enviarme el PDF por email]     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Flujo de entrada por voz

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ESTADO INICIAL - Campo con botón de voz                               │
│                                                                         │
│  Nombre completo                                                        │
│  ┌─────────────────────────────────────────────────────┐ ┌───────────┐ │
│  │ Ej: María Elena González Pérez                      │ │ 🎤 Dictar │ │
│  └─────────────────────────────────────────────────────┘ └───────────┘ │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ESTADO ESCUCHANDO - Modal o drawer                                    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │            🔴 Escuchando...                                      │   │
│  │                                                                  │   │
│  │    Hable claramente cerca del micrófono                         │   │
│  │                                                                  │   │
│  │    "María Elena González Pérez"                                 │   │
│  │    ↑ Lo que vamos escuchando aparece aquí                       │   │
│  │                                                                  │   │
│  │      [Cancelar]              [✓ Usar este texto]                │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ESTADO CONFIRMADO - Texto insertado                                   │
│                                                                         │
│  Nombre completo                                                        │
│  ┌─────────────────────────────────────────────────────┐ ┌───────────┐ │
│  │ María Elena González Pérez                     ✓   │ │ 🎤 Dictar │ │
│  └─────────────────────────────────────────────────────┘ └───────────┘ │
│  ✓ Texto ingresado correctamente                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Especificaciones de Componentes

### 5.1 Componentes principales

```typescript
// src/components/formulario/ProgressBar.tsx
interface ProgressBarProps {
  currentStep: number;      // 1-5
  totalSteps: number;       // 5
  stepLabels: string[];     // ["Datos personales", "Propiedad", ...]
}
/*
 * Barra horizontal con pasos numerados
 * Paso actual: círculo azul con número
 * Pasos completados: círculo verde con checkmark
 * Pasos pendientes: círculo gris con número
 * Labels debajo de cada paso (solo en desktop)
 * Mobile: solo muestra "Paso X de Y"
 */

// src/components/formulario/StepNavigation.tsx
interface StepNavigationProps {
  onPrevious?: () => void;
  onNext: () => void;
  previousLabel?: string;   // default: "Anterior"
  nextLabel?: string;       // default: "Siguiente"
  isNextDisabled?: boolean;
  isLoading?: boolean;
}
/*
 * Dos botones: Anterior (outline) y Siguiente (filled)
 * En mobile: botones full-width, stacked
 * En desktop: botones alineados a la derecha
 * Botón Siguiente siempre prominente (primario)
 */

// src/components/formulario/VoiceInput.tsx
interface VoiceInputProps {
  onResult: (text: string) => void;
  onError: (error: string) => void;
  language?: string;        // default: 'es-CL'
  buttonLabel?: string;     // default: "Dictar"
}
/*
 * Botón que activa Web Speech API
 * Estados: idle, listening, processing, error
 * Modal/drawer para confirmar texto reconocido
 * Fallback graceful si navegador no soporta
 * Muestra mensaje de error claro si falla
 */

// src/components/formulario/FieldWithHelp.tsx
interface FieldWithHelpProps {
  label: string;
  helpText?: string;
  error?: string;
  example?: string;
  required?: boolean;
  children: React.ReactNode;
}
/*
 * Wrapper para campos de formulario
 * Label siempre visible arriba (nunca floating)
 * Texto de ayuda en gris debajo del input
 * Error en rojo con ícono ⚠️
 * Asterisco rojo si es required
 */

// src/components/formulario/RutInput.tsx
interface RutInputProps {
  value: string;
  onChange: (rut: string, isValid: boolean) => void;
  error?: string;
}
/*
 * Input con máscara automática: 12345678-9 → 12.345.678-9
 * Valida dígito verificador en tiempo real
 * Muestra ✓ verde si es válido
 * Muestra ✗ rojo si es inválido
 * Solo permite números y K
 */

// src/components/formulario/CurrencyInput.tsx
interface CurrencyInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  error?: string;
  placeholder?: string;
}
/*
 * Input con formato de moneda chilena
 * Muestra: $ 1.234.567
 * Solo permite números
 * Formatea automáticamente con puntos de miles
 * Valor interno siempre es número
 */

// src/components/formulario/DateInput.tsx
interface DateInputProps {
  value: string;            // ISO format
  onChange: (date: string) => void;
  showAge?: boolean;        // Muestra edad calculada
  minAge?: number;          // Validación mínima
  error?: string;
}
/*
 * Tres selects: día, mes, año
 * O un date picker nativo en mobile
 * Muestra edad calculada al lado
 * Valida edad mínima si se especifica
 */
```

### 5.2 Componente de generación de PDF

```typescript
// src/components/pdf/RecursoTemplate.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface RecursoTemplateProps {
  datos: FormularioCompleto;
}

/*
 * Estructura del documento:
 * 1. Encabezado: "EN LO PRINCIPAL: Recurso de protección..."
 * 2. Identificación del tribunal
 * 3. Individualización del recurrente
 * 4. Relación de hechos (personalizado con datos)
 * 5. Derecho aplicable (texto estándar + cita fallo Marina Latorre)
 * 6. Petitorio
 * 7. Primer Otrosí: Acompaña documentos
 * 8. Segundo Otrosí: Patrocinio (o actuación personal)
 * 9. Espacio para firma
 * 
 * Formato: Carta legal chileno
 * Fuente: Times New Roman 12pt
 * Márgenes: 2cm
 * Interlineado: 1.5
 */

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 60,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
  },
  suma: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tribunal: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  parrafo: {
    textAlign: 'justify',
    marginBottom: 12,
    textIndent: 40,
  },
  subtitulo: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  petitorio: {
    marginLeft: 40,
    marginBottom: 8,
  },
  firma: {
    marginTop: 80,
    textAlign: 'center',
  },
  lineaFirma: {
    borderTop: '1px solid black',
    width: 200,
    marginHorizontal: 'auto',
    marginBottom: 5,
  },
});
```

---

## 6. Contenido Legal

### 6.1 Plantilla del recurso de protección

```typescript
// src/data/textos-legales.ts

export function generarRecurso(datos: FormularioCompleto): string {
  const { datosPersonales, datosPropiedad, datosTributarios, datosRecurso } = datos;
  
  return `
EN LO PRINCIPAL: Recurso de protección.
PRIMER OTROSÍ: Acompaña documentos que indica.
SEGUNDO OTROSÍ: Patrocinio y poder.

ILTMA. CORTE DE APELACIONES DE ${datosRecurso.corteApelaciones.toUpperCase()}

${datosPersonales.nombreCompleto}, cédula nacional de identidad N° ${datosPersonales.rut}, ${datosPersonales.edad} años de edad, ${getFuenteIngresosTexto(datosTributarios.fuenteIngresos)}, domiciliado en ${datosPersonales.domicilio}, comuna de ${datosPersonales.comuna}, Región ${datosPersonales.region}, a US. ILTMA. respetuosamente digo:

Que vengo en interponer recurso de protección en contra del SERVICIO DE IMPUESTOS INTERNOS, representado legalmente por su Director Nacional, domiciliado para estos efectos en calle Teatinos N° 120, comuna y ciudad de Santiago, por el acto ilegal y arbitrario que más adelante se describirá, el cual vulnera las garantías constitucionales establecidas en el artículo 19, numerales 2°, 20° y 24° de la Constitución Política de la República.

I. LOS HECHOS

PRIMERO: Que soy legítimo propietario del inmueble ubicado en ${datosPropiedad.direccionPropiedad}, comuna de ${datosPropiedad.comunaPropiedad}, Región ${datosPropiedad.regionPropiedad}, inscrito a nombre del recurrente, identificado con Rol de Avalúo N° ${datosPropiedad.rolSII}, cuyo avalúo fiscal vigente asciende a la suma de ${formatearPesos(datosPropiedad.avaluoFiscal)}.

SEGUNDO: Que mis ingresos mensuales ascienden aproximadamente a la suma de ${formatearPesos(datosTributarios.ingresoMensual)}, lo que equivale a un ingreso anual de ${formatearPesos(datosTributarios.ingresoAnual)}, provenientes principalmente de ${getFuenteIngresosTexto(datosTributarios.fuenteIngresos)}.

TERCERO: Que actualmente el Servicio de Impuestos Internos me exige el pago de contribuciones de bienes raíces por un monto de ${formatearPesos(datosTributarios.montoContribucionTrimestral)} trimestrales, equivalentes a ${formatearPesos(datosTributarios.montoContribucionTrimestral * 4)} anuales, lo que representa aproximadamente un ${calcularPorcentaje(datosTributarios.montoContribucionTrimestral * 4, datosTributarios.ingresoAnual)}% de mis ingresos anuales.

CUARTO: Que ${datosTributarios.tieneBeneficioActual ? 'si bien cuento con un beneficio parcial de rebaja de contribuciones, este resulta insuficiente considerando' : 'no cuento con ningún beneficio de rebaja de contribuciones, a pesar de'} mi condición de adulto mayor con ingresos limitados, configurándose una situación de manifiesta desproporción entre el tributo exigido y mi capacidad contributiva real.

II. EL DERECHO

El presente recurso se funda en lo dispuesto en el artículo 20 de la Constitución Política de la República, en relación con las garantías constitucionales consagradas en los numerales 2°, 20° y 24° del artículo 19 del mismo cuerpo normativo.

En efecto, el cobro de contribuciones de bienes raíces sin considerar la capacidad económica real del contribuyente adulto mayor vulnera:

a) El derecho a la igualdad ante la ley (artículo 19 N° 2), toda vez que se aplica un gravamen que no distingue la situación particular de las personas de tercera edad con ingresos limitados, generando una discriminación arbitraria respecto de quienes, encontrándose en similares condiciones, sí acceden a beneficios tributarios.

b) El derecho a la igual repartición de los tributos y demás cargas públicas (artículo 19 N° 20), al imponer una carga tributaria manifiestamente desproporcionada e injusta en relación con la capacidad económica del contribuyente.

c) El derecho de propiedad (artículo 19 N° 24), al establecer una carga que puede derivar en la imposibilidad de mantener la propiedad del inmueble, única vivienda del recurrente.

III. PRECEDENTE JUDICIAL APLICABLE

Que la Ilustrísima Corte de Apelaciones de Santiago, con fecha [FECHA DEL FALLO], en causa Rol N° [ROL], caratulada "Latorre con Servicio de Impuestos Internos", acogió un recurso de protección interpuesto por una adulta mayor de 100 años en circunstancias similares a las del presente caso, estableciendo que el cobro de contribuciones de bienes raíces sin considerar la capacidad contributiva real del adulto mayor constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales antes señaladas.

Dicha sentencia quedó firme y ejecutoriada al no haber sido apelada por el Servicio de Impuestos Internos, constituyendo un valioso precedente judicial que resulta plenamente aplicable al caso de autos.

IV. PETITORIO

POR TANTO, en mérito de lo expuesto y de conformidad con lo dispuesto en el artículo 20 de la Constitución Política de la República y el Auto Acordado de la Excma. Corte Suprema sobre tramitación y fallo del recurso de protección,

SOLICITO A US. ILTMA. se sirva:

1. Tener por interpuesto recurso de protección en contra del Servicio de Impuestos Internos, en la persona de su Director Nacional.

2. Ordenar al recurrido informar dentro del plazo legal.

3. Acoger el presente recurso y declarar que el acto de cobro de contribuciones de bienes raíces respecto del inmueble Rol N° ${datosPropiedad.rolSII} constituye un acto ilegal y arbitrario que vulnera las garantías constitucionales del recurrente.

4. Como medida de protección, ordenar al Servicio de Impuestos Internos cesar el cobro de contribuciones respecto del inmueble individualizado, o en subsidio, otorgar la rebaja de contribuciones que en derecho corresponda conforme a la situación económica del recurrente.

5. Condenar en costas al recurrido.

PRIMER OTROSÍ: Solicito a US. Iltma. tener por acompañados los siguientes documentos:
1. Copia de cédula de identidad del recurrente.
2. Certificado de avalúo fiscal del inmueble emitido por el SII.
3. Copia de boleta de contribuciones.
4. Certificado de cotizaciones o liquidación de pensión, según corresponda.

SEGUNDO OTROSÍ: Solicito a US. Iltma. tener presente que comparezco personalmente, sin patrocinio de abogado, de conformidad con lo dispuesto en el artículo 2° de la Ley N° 18.120, sobre Comparecencia en Juicio.




_______________________________________
${datosPersonales.nombreCompleto}
RUT: ${datosPersonales.rut}

En ${datosPropiedad.comunaPropiedad}, a ${formatearFecha(datosRecurso.fechaGeneracion)}
`;
}
```

### 6.2 Datos de Cortes de Apelaciones

```typescript
// src/data/cortes-apelaciones.ts

export const cortesApelaciones: Record<string, { nombre: string; direccion: string; ciudad: string }> = {
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

export function getCorteByRegion(region: string) {
  return cortesApelaciones[region] || cortesApelaciones["Metropolitana"];
}
```

---

## 7. Validaciones con Zod

```typescript
// src/lib/validations.ts
import { z } from 'zod';
import { validarRut } from './rut-utils';

// Paso 1: Datos Personales
export const datosPersonalesSchema = z.object({
  actuaRepresentante: z.boolean(),
  
  nombreCompleto: z
    .string()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/, 'El nombre solo puede contener letras'),
  
  rut: z
    .string()
    .min(11, 'RUT incompleto')
    .max(12, 'RUT demasiado largo')
    .refine(validarRut, 'El RUT ingresado no es válido'),
  
  fechaNacimiento: z
    .string()
    .refine((fecha) => {
      const hoy = new Date();
      const nacimiento = new Date(fecha);
      const edad = Math.floor((hoy.getTime() - nacimiento.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      return edad >= 60;
    }, 'Debe tener al menos 60 años para usar este servicio'),
  
  domicilio: z
    .string()
    .min(10, 'Ingrese la dirección completa')
    .max(200, 'La dirección es demasiado larga'),
  
  region: z
    .string()
    .min(1, 'Seleccione una región'),
  
  comuna: z
    .string()
    .min(1, 'Seleccione una comuna'),
  
  telefono: z
    .string()
    .regex(/^(\+?56)?(\s?9)?(\s?\d{4})(\s?\d{4})$/, 'Formato de teléfono inválido')
    .optional()
    .or(z.literal('')),
  
  email: z
    .string()
    .email('El email no es válido')
    .optional()
    .or(z.literal('')),
  
  representante: z.object({
    nombreCompleto: z.string().min(5, 'Ingrese el nombre completo'),
    rut: z.string().refine(validarRut, 'RUT inválido'),
    parentesco: z.string().min(1, 'Indique el parentesco'),
  }).optional(),
});

// Paso 2: Datos de la Propiedad
export const datosPropiedadSchema = z.object({
  direccionPropiedad: z
    .string()
    .min(10, 'Ingrese la dirección completa de la propiedad')
    .max(200, 'La dirección es demasiado larga'),
  
  regionPropiedad: z
    .string()
    .min(1, 'Seleccione la región de la propiedad'),
  
  comunaPropiedad: z
    .string()
    .min(1, 'Seleccione la comuna de la propiedad'),
  
  rolSII: z
    .string()
    .regex(/^\d{1,5}-\d{1,4}$/, 'El formato debe ser: 123-456'),
  
  avaluoFiscal: z
    .number()
    .min(1, 'Ingrese el avalúo fiscal')
    .max(50000000000, 'El valor parece incorrecto'),
  
  destinoPropiedad: z
    .enum(['habitacional', 'otro'], {
      errorMap: () => ({ message: 'Seleccione el destino de la propiedad' }),
    }),
  
  esPropietarioUnico: z.boolean(),
  
  porcentajeDominio: z
    .number()
    .min(1, 'El porcentaje debe ser mayor a 0')
    .max(100, 'El porcentaje no puede ser mayor a 100')
    .optional(),
});

// Paso 3: Datos Tributarios
export const datosTributariosSchema = z.object({
  ingresoMensual: z
    .number()
    .min(0, 'El ingreso no puede ser negativo'),
  
  fuenteIngresos: z
    .enum(['pension', 'arriendos', 'otros', 'mixto'], {
      errorMap: () => ({ message: 'Seleccione la fuente de ingresos' }),
    }),
  
  tieneOtrasPropiedades: z.boolean(),
  
  tieneBeneficioActual: z.boolean(),
  
  tipoBeneficioActual: z
    .string()
    .optional(),
  
  montoContribucionTrimestral: z
    .number()
    .min(0, 'El monto no puede ser negativo'),
});

// Schema completo
export const formularioCompletoSchema = z.object({
  datosPersonales: datosPersonalesSchema,
  datosPropiedad: datosPropiedadSchema,
  datosTributarios: datosTributariosSchema,
});
```

---

## 8. Estado Global con Zustand

```typescript
// src/lib/store.ts
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
  completedSteps: [],
};

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
          completedSteps: [...new Set([...state.completedSteps, step])].sort(),
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
        
        return {
          datosPersonales: state.datosPersonales as DatosPersonales,
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
      // Qué guardar en localStorage
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
```

---

## 9. Páginas Adicionales

### 9.1 Landing Page - Estructura

```
LANDING PAGE (/)
================

[HEADER]
Logo: mirecurso.cl                    [Cómo funciona] [Preguntas]

[HERO SECTION]
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Reclame la exención de contribuciones                          │
│  que le corresponde                                              │
│                                                                  │
│  Si tiene más de 60 años y paga contribuciones                  │
│  desproporcionadas, podemos ayudarle a presentar                │
│  un recurso de protección.                                       │
│                                                                  │
│  ✓ Gratis                                                        │
│  ✓ Sin necesidad de abogado                                      │
│  ✓ Documento listo para presentar                                │
│                                                                  │
│        [🎯 COMENZAR MI RECURSO →]                               │
│              (botón grande, prominente)                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

[CÓMO FUNCIONA - 3 pasos]
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│     📝      │  │     👁️      │  │     📄      │
│   PASO 1    │  │   PASO 2    │  │   PASO 3    │
│  Complete   │  │   Revise    │  │  Descargue  │
│  sus datos  │  │    todo     │  │   su PDF    │
│  (5 min)    │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘

[QUIÉN PUEDE USAR ESTE SERVICIO]
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Adultos mayores de 60 años                                   │
│  ✓ Propietarios de vivienda                                      │
│  ✓ Con ingresos limitados (pensiones u otros)                   │
│  ✓ Que pagan contribuciones desproporcionadas                   │
│  ✓ Sin beneficio actual o con rebaja insuficiente               │
└─────────────────────────────────────────────────────────────────┘

[BASADO EN UN CASO REAL]
┌─────────────────────────────────────────────────────────────────┐
│  📰 "Escritora de 100 años vence al SII"                        │
│                                                                  │
│  En enero de 2026, la Corte de Apelaciones de Santiago          │
│  acogió el recurso de Marina Latorre, estableciendo que         │
│  el cobro de contribuciones sin considerar la capacidad         │
│  económica del adulto mayor es ilegal y arbitrario.             │
│                                                                  │
│  Este precedente abre la puerta para miles de casos similares.  │
└─────────────────────────────────────────────────────────────────┘

[FAQ RESUMIDO]
┌─────────────────────────────────────────────────────────────────┐
│  ¿Es gratis?                                                     │
│  Sí, completamente gratis.                                       │
│                                                                  │
│  ¿Necesito abogado?                                              │
│  No, puede presentar el recurso personalmente.                  │
│                                                                  │
│  ¿Dónde lo presento?                                             │
│  En la Corte de Apelaciones de su región.                       │
│                                                                  │
│  [Ver todas las preguntas frecuentes →]                         │
└─────────────────────────────────────────────────────────────────┘

[CTA FINAL]
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│     ¿Listo para comenzar?                                        │
│                                                                  │
│        [🎯 CREAR MI RECURSO AHORA →]                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

[FOOTER]
mirecurso.cl
Cómo funciona | Preguntas frecuentes | Política de privacidad

Este servicio proporciona una plantilla basada en precedentes
judiciales. No constituye asesoría legal profesional.

Desarrollado por Inteligencia Digital
```

### 9.2 Preguntas Frecuentes (FAQ)

```
Categorías y preguntas:

SOBRE EL SERVICIO
─────────────────
• ¿Quién puede usar mirecurso.cl?
• ¿Tiene algún costo?
• ¿Mis datos están seguros?
• ¿Quiénes están detrás de este servicio?

SOBRE EL RECURSO
────────────────
• ¿Qué es un recurso de protección?
• ¿Por qué puedo reclamar las contribuciones?
• ¿Qué documentos necesito reunir?
• ¿Qué probabilidades tengo de ganar?

SOBRE EL PROCESO
────────────────
• ¿Dónde presento el recurso?
• ¿Cuánto demora el proceso?
• ¿Qué pasa si lo rechazan?
• ¿Necesito ir personalmente a la Corte?
• ¿Puedo presentarlo por internet?

SOBRE EL PRECEDENTE
───────────────────
• ¿Quién es Marina Latorre?
• ¿Por qué es importante ese fallo?
• ¿El SII puede apelar mi caso?
```

---

## 10. Consideraciones Técnicas Adicionales

### 10.1 SEO y Meta Tags

```typescript
// src/app/layout.tsx
export const metadata = {
  title: 'mirecurso.cl - Reclame la exención de contribuciones',
  description: 'Genere gratis su recurso de protección contra el cobro de contribuciones. Para adultos mayores propietarios de vivienda.',
  keywords: 'contribuciones, adulto mayor, recurso protección, SII, exención, Chile',
  openGraph: {
    title: 'mirecurso.cl - Exención de contribuciones para adultos mayores',
    description: 'Genere su recurso de protección gratis, sin abogados.',
    url: 'https://mirecurso.cl',
    siteName: 'mirecurso.cl',
    locale: 'es_CL',
    type: 'website',
  },
};
```

### 10.2 Performance Targets

```yaml
lighthouse_targets:
  performance: 90+
  accessibility: 95+
  best_practices: 90+
  seo: 95+

core_web_vitals:
  LCP: < 2.5s    # Largest Contentful Paint
  FID: < 100ms   # First Input Delay
  CLS: < 0.1     # Cumulative Layout Shift
```

### 10.3 Manejo de errores

```typescript
// Errores comunes y mensajes amigables
const errorMessages = {
  VOICE_NOT_SUPPORTED: 
    'Su navegador no soporta entrada por voz. Por favor escriba el texto.',
  VOICE_NOT_ALLOWED: 
    'Necesitamos permiso para usar el micrófono. Haga clic en "Permitir" cuando aparezca la ventana.',
  PDF_GENERATION_FAILED: 
    'Hubo un problema al generar el documento. Por favor intente nuevamente.',
  STORAGE_FULL: 
    'El almacenamiento está lleno. Sus datos no se guardarán automáticamente.',
  NETWORK_ERROR: 
    'Hay un problema de conexión. Puede seguir usando el formulario sin conexión.',
};
```

---

## 11. Roadmap de Desarrollo

### Fase 1: MVP (Semanas 1-2)
- [ ] Setup proyecto Next.js + Tailwind + shadcn
- [ ] Landing page responsive
- [ ] Formulario de 3 pasos + revisión
- [ ] Validaciones con Zod
- [ ] Persistencia en localStorage
- [ ] Generación de PDF básico
- [ ] Deploy en Vercel

### Fase 2: Pulido UX (Semana 3)
- [ ] Entrada por voz (Web Speech API)
- [ ] Mejoras de accesibilidad (WCAG AAA)
- [ ] Página "Cómo funciona"
- [ ] FAQ completo
- [ ] Animaciones y microinteracciones
- [ ] Testing en dispositivos reales

### Fase 3: Optimización (Semana 4)
- [ ] Analytics (Vercel Analytics)
- [ ] SEO completo
- [ ] Performance optimization
- [ ] Testing con usuarios reales (adultos mayores)
- [ ] Ajustes según feedback

### Fase 4: Mejoras futuras (backlog)
- [ ] Envío de PDF por email
- [ ] Múltiples idiomas (español simple)
- [ ] Guía paso a paso con imágenes
- [ ] Integración con SII para obtener datos automáticamente
- [ ] Otros tipos de recursos (isapres, AFP)
- [ ] App móvil nativa

---

## 12. Comandos de Setup

```bash
# 1. Crear proyecto
npx create-next-app@latest mirecurso \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd mirecurso

# 2. Instalar dependencias core
npm install zustand @react-pdf/renderer react-hook-form @hookform/resolvers zod

# 3. Instalar shadcn/ui
npx shadcn-ui@latest init
# Seleccionar: TypeScript, Default style, Slate, CSS variables, app/globals.css, @/components, @/lib/utils

# 4. Agregar componentes shadcn necesarios
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add select
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add accordion

# 5. Crear estructura de carpetas
mkdir -p src/components/{formulario,layout,pdf}
mkdir -p src/lib
mkdir -p src/data
mkdir -p src/types

# 6. Inicializar Git
git init
git add .
git commit -m "Initial setup: Next.js + Tailwind + shadcn"

# 7. Crear repo en GitHub y conectar
# gh repo create mirecurso --public --source=. --push
# o manualmente:
# git remote add origin https://github.com/[usuario]/mirecurso.git
# git push -u origin main

# 8. Deploy en Vercel
# Conectar repo desde dashboard de Vercel
# Configurar dominio personalizado: mirecurso.cl
```

---

## 13. Checklist Pre-Launch

```markdown
FUNCIONALIDAD
[ ] Formulario completo funciona end-to-end
[ ] PDF se genera con todos los datos correctamente
[ ] Validaciones funcionan en todos los campos
[ ] Guardado automático funciona (probar cerrando navegador)
[ ] Entrada por voz funciona en Chrome, Safari, Edge
[ ] Botones de navegación funcionan correctamente
[ ] Edición desde pantalla de revisión funciona

ACCESIBILIDAD
[ ] Contraste WCAG AAA (7:1) verificado
[ ] Navegación completa por teclado
[ ] Compatible con lectores de pantalla
[ ] Textos mínimo 18px en todos los dispositivos
[ ] Áreas táctiles mínimo 48x48px
[ ] Focus visible en todos los elementos interactivos

RESPONSIVE
[ ] iPhone SE (375px) - TODO legible y usable
[ ] iPhone 14 (390px) - TODO legible y usable
[ ] iPad (768px) - Layout apropiado
[ ] Desktop 1280px+ - Layout apropiado
[ ] Orientación landscape en móvil funciona

PERFORMANCE
[ ] Lighthouse Performance > 90
[ ] Lighthouse Accessibility > 95
[ ] First Contentful Paint < 1.5s
[ ] PDF se genera en < 3 segundos

CONTENIDO
[ ] Textos revisados por abogado
[ ] Disclaimer legal visible en landing y PDF
[ ] Todos los textos de ayuda son claros
[ ] FAQ responde las dudas principales

LEGAL
[ ] Disclaimer visible en landing
[ ] Disclaimer incluido en PDF generado
[ ] Política de privacidad accesible
[ ] No se almacenan datos en servidor (solo localStorage)
```

---

**Fin del documento PRD v1.0**

*Documento preparado para vibecoding con Cursor*
*Stack: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + Vercel*
