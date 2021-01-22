type Dia = { horaApertura: string; horaCierre: string; isAbierto: boolean };

type TipoHorario = "manual" | "automatico";

type Horario = {
  tipo: TipoHorario;
  dias: { lunes: Dia; martes: Dia; miercoles: Dia; jueves: Dia; viernes: Dia; sabado: Dia; domingo: Dia };
};

export type { Dia, Horario, TipoHorario };
