import { Tienda } from "features/tienda/types";
import { FC, useRef, useState } from "react";
import { useClickOutside } from "shared/hooks";
import { filtrarVendedorPorHorario } from "shared/utils";

const HorarioDeTienda: FC<{ tienda: Tienda | undefined }> = ({ tienda }) => {
  const [showHorario, setShowHorario] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useClickOutside(btnRef, () => setShowHorario(false));

  if (!tienda) return null;

  if (tienda.horario.tipo === "manual") {
    return (
      <span tw="font-medium text-gray-700 underline text-underline-position[under] text-center">
        La tienda esta {tienda.abierto ? "abierta" : "cerrada"}
      </span>
    );
  }

  return (
    <button
      onClick={() => setShowHorario(true)}
      tw="relative font-medium text-gray-700 underline text-underline-position[under] self-center"
      ref={btnRef}
    >
      La tienda esta {filtrarVendedorPorHorario(tienda) ? "abierta" : "cerrada"}
      {showHorario ? (
        <div tw="absolute z-20 left-1/2 transform -translate-x-1/2 top-5 bg-white shadow border p-2 rounded max-h-32 w-52 overflow-auto flex flex-col divide-y">
          {tienda.horario.dias.lunes.isAbierto ? (
            <span>
              Lunes de {tienda.horario.dias.lunes.horaApertura} a {tienda.horario.dias.lunes.horaCierre}
            </span>
          ) : null}

          {tienda.horario.dias.martes.isAbierto ? (
            <span>
              Martes de {tienda.horario.dias.martes.horaApertura} a {tienda.horario.dias.martes.horaCierre}
            </span>
          ) : null}

          {tienda.horario.dias.miercoles.isAbierto ? (
            <span>
              Miercoles de {tienda.horario.dias.miercoles.horaApertura} a {tienda.horario.dias.miercoles.horaCierre}
            </span>
          ) : null}

          {tienda.horario.dias.jueves.isAbierto ? (
            <span>
              Jueves de {tienda.horario.dias.jueves.horaApertura} a {tienda.horario.dias.jueves.horaCierre}
            </span>
          ) : null}

          {tienda.horario.dias.viernes.isAbierto ? (
            <span>
              Viernes de {tienda.horario.dias.viernes.horaApertura} a {tienda.horario.dias.viernes.horaCierre}
            </span>
          ) : null}

          {tienda.horario.dias.sabado.isAbierto ? (
            <span>
              sábado de {tienda.horario.dias.sabado.horaApertura} a {tienda.horario.dias.sabado.horaCierre}
            </span>
          ) : null}

          {tienda.horario.dias.domingo.isAbierto ? (
            <span>
              Domingo de {tienda.horario.dias.domingo.horaApertura} a {tienda.horario.dias.domingo.horaCierre}
            </span>
          ) : null}
        </div>
      ) : null}
    </button>
  );
};

export default HorarioDeTienda;
