import { Calificacion } from "features/tienda/types";
import { FC, useRef, useState } from "react";
import { useClickOutside } from "shared/hooks";
import tw from "twin.macro";

const CalificacionPromedio: FC<{
  calificaciones: Record<string, Calificacion> | undefined;
  posicion?: "center" | "left";
}> = ({ calificaciones, posicion = "center" }) => {
  const [showCriticas, setShowCriticas] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useClickOutside(btnRef, () => setShowCriticas(false));

  const pos = posicion === "left" ? tw`left-0 translate-x-0` : null;

  if (!calificaciones)
    return <span tw="font-medium text-gray-700 underline text-underline-position[under]">Sin calificaciones</span>;

  const calificacionesTuple = Object.entries(calificaciones);

  const estrellasPromedio =
    calificacionesTuple.reduce((totalEstrellas, [, calificacion]) => {
      return totalEstrellas + calificacion.estrellas;
    }, 0) / calificacionesTuple.length;

  const criticasTuple = calificacionesTuple
    .filter(([, calificacion]) => calificacion.critica)
    .map(([id, calificacion]) => [id, calificacion.critica]);
  return (
    <button
      onClick={() => setShowCriticas(true)}
      tw="relative font-medium text-gray-700 underline text-underline-position[under]"
      ref={btnRef}
    >
      Calificación {estrellasPromedio.toFixed(1)}⭐
      {showCriticas ? (
        <div
          tw="absolute z-20 left-1/2 transform -translate-x-1/2 top-5 bg-white shadow border p-2 rounded max-h-32 w-52 overflow-auto flex flex-col divide-y"
          css={[pos]}
        >
          {criticasTuple.length ? (
            criticasTuple.map(([id, critica]) => <span key={id}>{critica}</span>)
          ) : (
            <span>Sin reseñas</span>
          )}
        </div>
      ) : null}
    </button>
  );
};

export default CalificacionPromedio;
