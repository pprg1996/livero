export type Dia = { horaApertura: string; horaCierre: string; isAbierto: boolean };

export type TipoHorario = "manual" | "automatico";

export type Horario = {
  tipo: TipoHorario;
  dias: { lunes: Dia; martes: Dia; miercoles: Dia; jueves: Dia; viernes: Dia; sabado: Dia; domingo: Dia };
};
