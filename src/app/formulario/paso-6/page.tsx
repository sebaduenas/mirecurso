'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormularioStore } from '@/lib/store';
import { getCorteByRegion } from '@/data/cortes-apelaciones';
import { FUENTES_INGRESO, TIPOS_PROPIETARIO, TRAMOS_RSH, ESTADOS_CIVILES, TOPES_LEY_20732 } from '@/data/datos-fijos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Home,
  Wallet,
  Receipt,
  FileQuestion,
  Building2,
  Pencil,
  ArrowLeft,
  FileText,
  CheckCircle2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Percent,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

function formatearPesos(valor: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
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

function getFuentesIngresoLabels(fuentes: string[]): string {
  return fuentes
    .map((f) => FUENTES_INGRESO[f as keyof typeof FUENTES_INGRESO]?.corto || f)
    .join(', ');
}

function getTipoPropietarioLabel(tipo: string): string {
  return TIPOS_PROPIETARIO[tipo as keyof typeof TIPOS_PROPIETARIO]?.texto || tipo;
}

function getEstadoCivilLabel(estado: string): string {
  const ec = ESTADOS_CIVILES[estado as keyof typeof ESTADOS_CIVILES];
  return ec ? ec.textoMasculino.charAt(0).toUpperCase() + ec.textoMasculino.slice(1) : estado;
}

interface DataRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number | undefined;
  highlight?: boolean;
}

function DataRow({ icon, label, value, highlight = false }: DataRowProps) {
  return (
    <div className={`flex items-start gap-3 py-2 ${highlight ? 'bg-primary/5 -mx-4 px-4 rounded-lg' : ''}`}>
      {icon && <span className="text-muted-foreground mt-0.5">{icon}</span>}
      <div className="flex-1">
        <p className="text-base text-muted-foreground">{label}</p>
        <p className={`text-lg ${highlight ? 'font-semibold text-primary' : 'text-foreground'}`}>
          {value || '-'}
        </p>
      </div>
    </div>
  );
}

export default function Paso6Page() {
  const router = useRouter();
  const [confirmado, setConfirmado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    datosPersonales,
    datosPropiedad,
    datosEconomicos,
    datosContribuciones,
    procedimientoPrevio,
    setCurrentStep,
    markStepComplete,
    isStepAccessible,
    getValidaciones,
  } = useFormularioStore();

  useEffect(() => {
    if (!isStepAccessible(6)) {
      router.replace('/formulario/paso-5');
      return;
    }
    setCurrentStep(6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determinar automáticamente la Corte de Apelaciones según la región de la propiedad
  const corte = getCorteByRegion(datosPropiedad.regionPropiedad || 'Metropolitana');

  // Cálculos
  const edad = datosPersonales.fechaNacimiento
    ? calcularEdad(datosPersonales.fechaNacimiento)
    : 0;
  const ingresoAnual = (datosEconomicos.ingresoMensual || 0) * 12;
  const contribucionAnual = (datosContribuciones.montoContribucionTrimestral || 0) * 4;
  const porcentajeIngresos = ingresoAnual > 0
    ? (contribucionAnual / ingresoAnual) * 100
    : 0;

  // Validaciones del caso
  const validaciones = getValidaciones();
  const excedeTopeAvaluo = (datosPropiedad.avaluoFiscalVigente || 0) > TOPES_LEY_20732.topeAvaluoMaximo;

  const handleGenerar = async () => {
    if (!confirmado) return;
    setIsLoading(true);

    // Pequeña pausa para mostrar el estado de carga
    await new Promise(resolve => setTimeout(resolve, 500));

    markStepComplete(6);
    router.push('/formulario/paso-7');
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Revisión de datos</h1>
        <p className="text-lg text-muted-foreground">
          Por favor revise que toda la información esté correcta antes de generar su recurso
        </p>
      </div>

      {/* Alerta si excede tope de avalúo */}
      {excedeTopeAvaluo && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-base text-amber-800">
            <strong>Nota:</strong> El avalúo fiscal de su propiedad excede el tope de la Ley 20.732.
            Sin embargo, según el precedente <em>Latorre con SII</em> (Rol 20732-2024, C.A. Santiago),
            este requisito es "adjetivo, no esencial" y su recurso puede ser igualmente acogido.
          </AlertDescription>
        </Alert>
      )}

      {/* Datos personales */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Datos personales</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/formulario/paso-1')}
              className="h-10 px-4"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-1">
            <p className="text-xl font-semibold text-foreground">
              {datosPersonales.nombreCompleto}
            </p>
            <p className="text-lg text-muted-foreground">
              RUT: {datosPersonales.rut}
            </p>
          </div>

          <div className="grid gap-2 mt-4 pt-4 border-t">
            <DataRow
              icon={<Calendar className="w-4 h-4" />}
              label="Edad"
              value={`${edad} años`}
            />
            <DataRow
              label="Estado civil"
              value={datosPersonales.estadoCivil ? getEstadoCivilLabel(datosPersonales.estadoCivil) : '-'}
            />
            <DataRow
              label="Profesión"
              value={datosPersonales.profesion}
            />
            <DataRow
              icon={<MapPin className="w-4 h-4" />}
              label="Domicilio"
              value={`${datosPersonales.domicilio}, ${datosPersonales.comuna}, ${datosPersonales.region}`}
            />
            {datosPersonales.telefono && (
              <DataRow
                icon={<Phone className="w-4 h-4" />}
                label="Teléfono"
                value={datosPersonales.telefono}
              />
            )}
            {datosPersonales.email && (
              <DataRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={datosPersonales.email}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Propiedad */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Propiedad afectada</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/formulario/paso-2')}
              className="h-10 px-4"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-1">
            <p className="text-xl font-semibold text-foreground">
              {datosPropiedad.direccionPropiedad}
            </p>
            <p className="text-lg text-muted-foreground">
              {datosPropiedad.comunaPropiedad}, {datosPropiedad.regionPropiedad}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-base text-muted-foreground">Rol de avalúo</p>
              <p className="text-xl font-semibold">{datosPropiedad.rolAvaluo}</p>
            </div>
            <div className={`p-4 rounded-xl ${excedeTopeAvaluo ? 'bg-amber-50' : 'bg-muted/50'}`}>
              <p className="text-base text-muted-foreground">Avalúo fiscal</p>
              <p className={`text-xl font-semibold ${excedeTopeAvaluo ? 'text-amber-700' : ''}`}>
                {formatearPesos(datosPropiedad.avaluoFiscalVigente || 0)}
              </p>
              {excedeTopeAvaluo && (
                <p className="text-sm text-amber-600 mt-1">Excede tope legal</p>
              )}
            </div>
          </div>

          <div className="grid gap-2 mt-4 pt-4 border-t">
            <DataRow
              label="Uso de la propiedad"
              value={datosPropiedad.destinoHabitacional ? 'Habitacional (vivienda)' : 'Otro uso'}
            />
            <DataRow
              label="Tipo de propiedad"
              value={datosPropiedad.tipoPropietario ? getTipoPropietarioLabel(datosPropiedad.tipoPropietario) : '-'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Situación económica */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Situación económica</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/formulario/paso-3')}
              className="h-10 px-4"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-base text-muted-foreground">Ingreso mensual</p>
              <p className="text-xl font-semibold">
                {formatearPesos(datosEconomicos.ingresoMensual || 0)}
              </p>
              <p className="text-base text-muted-foreground mt-1">
                {datosEconomicos.fuentesIngreso ? getFuentesIngresoLabels(datosEconomicos.fuentesIngreso) : '-'}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-base text-muted-foreground">Ingreso anual</p>
              <p className="text-xl font-semibold">
                {formatearPesos(ingresoAnual)}
              </p>
            </div>
          </div>

          <div className="grid gap-2 mt-4 pt-4 border-t">
            <DataRow
              label="Registro Social de Hogares"
              value={
                datosEconomicos.estaEnRSH === 'si'
                  ? `Inscrito - Tramo ${datosEconomicos.tramoRSH}%`
                  : datosEconomicos.estaEnRSH === 'no'
                  ? 'No inscrito'
                  : 'No sabe'
              }
            />
            <DataRow
              label="Otras propiedades"
              value={datosEconomicos.tieneOtrasPropiedades ? 'Sí' : 'No'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contribuciones */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Contribuciones</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/formulario/paso-4')}
              className="h-10 px-4"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-base text-muted-foreground">Contribución trimestral</p>
              <p className="text-xl font-semibold">
                {formatearPesos(datosContribuciones.montoContribucionTrimestral || 0)}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <p className="text-base text-muted-foreground">Contribución anual</p>
              <p className="text-xl font-semibold">
                {formatearPesos(contribucionAnual)}
              </p>
            </div>
          </div>

          {/* Porcentaje destacado */}
          <div className={`mt-4 p-5 rounded-xl border-2 ${
            porcentajeIngresos >= 10
              ? 'bg-amber-50 border-amber-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                porcentajeIngresos >= 10 ? 'bg-amber-100' : 'bg-blue-100'
              }`}>
                {porcentajeIngresos >= 10 ? (
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                ) : (
                  <Percent className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <p className={`text-2xl font-bold ${
                  porcentajeIngresos >= 10 ? 'text-amber-700' : 'text-blue-700'
                }`}>
                  {porcentajeIngresos.toFixed(1)}% de sus ingresos
                </p>
                <p className={`text-base ${
                  porcentajeIngresos >= 10 ? 'text-amber-600' : 'text-blue-600'
                }`}>
                  destinado a pagar contribuciones
                  {porcentajeIngresos >= 10 && ' (desproporcionado)'}
                </p>
              </div>
            </div>
          </div>

          {datosContribuciones.tieneGirosPendientes && datosContribuciones.giros && datosContribuciones.giros.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-base font-medium mb-2">Giros a impugnar:</p>
              <ul className="space-y-1">
                {datosContribuciones.giros.map((giro, index) => (
                  <li key={index} className="text-base text-muted-foreground">
                    • Giro {giro.numeroGiro} - {formatearPesos(giro.monto)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Procedimiento previo */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileQuestion className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Procedimiento previo</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/formulario/paso-5')}
              className="h-10 px-4"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-2">
            <DataRow
              label="Solicitud previa al SII"
              value={procedimientoPrevio.presentoSolicitudSII ? 'Sí' : 'No'}
            />
            {procedimientoPrevio.presentoSolicitudSII && procedimientoPrevio.recibioDenegatoria && (
              <>
                <DataRow
                  label="Resolución denegatoria"
                  value={procedimientoPrevio.numeroResolucion || 'Sí'}
                />
                {procedimientoPrevio.fechaResolucion && (
                  <DataRow
                    label="Fecha de la resolución"
                    value={new Date(procedimientoPrevio.fechaResolucion).toLocaleDateString('es-CL')}
                  />
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Corte de Apelaciones (determinada automáticamente) */}
      <Card className="mb-6 border-primary/50 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Tribunal competente</CardTitle>
              <p className="text-base text-muted-foreground">
                Determinado según la región de la propiedad
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-xl font-semibold text-foreground">
            {corte.nombre}
          </p>
          <p className="text-lg text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            {corte.direccion}, {corte.ciudad}
          </p>
        </CardContent>
      </Card>

      {/* Checkbox de confirmación */}
      <Card className={`mb-6 border-2 transition-colors ${
        confirmado ? 'border-green-500 bg-green-50' : 'border-primary'
      }`}>
        <CardContent className="py-6">
          <div className="flex items-start space-x-4">
            <Checkbox
              id="confirmacion"
              checked={confirmado}
              onCheckedChange={(checked) => setConfirmado(checked as boolean)}
              className="w-7 h-7 mt-0.5"
            />
            <Label
              htmlFor="confirmacion"
              className="cursor-pointer text-lg leading-relaxed flex-1"
            >
              Confirmo que los datos ingresados son correctos y verdaderos, y autorizo
              la generación del recurso de protección con esta información.
            </Label>
          </div>
          {confirmado && (
            <div className="mt-4 flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-base font-medium">Confirmación completada</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/formulario/paso-5')}
          className="h-14 px-6 text-lg min-w-[140px]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Anterior
        </Button>

        <Button
          type="button"
          onClick={handleGenerar}
          disabled={!confirmado || isLoading}
          className="h-14 px-8 text-lg min-w-[200px]"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Generando...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 mr-2" />
              Generar mi recurso
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
