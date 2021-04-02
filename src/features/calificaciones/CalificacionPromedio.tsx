import { Calificacion } from "features/tienda/types";
import { FC } from "react";

const CalificacionPromedio: FC<{ calificaciones: Record<string, Calificacion> | undefined }> = ({ calificaciones }) => {
  if (!calificaciones)
    return <span tw="font-medium text-gray-700 underline text-underline-position[under]">Sin calificaciones</span>;

  const calificacionesTuple = Object.entries(calificaciones);

  const estrellasPromedio =
    calificacionesTuple.reduce((totalEstrellas, [, calificacion]) => {
      return totalEstrellas + calificacion.estrellas;
    }, 0) / calificacionesTuple.length;

  return (
    <span tw="font-medium text-gray-700 underline text-underline-position[under]">
      Calificación {estrellasPromedio.toFixed(1)}⭐
    </span>
  );
};

export default CalificacionPromedio;
