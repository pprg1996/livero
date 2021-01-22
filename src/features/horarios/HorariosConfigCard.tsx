import { SyntheticEvent, useContext, useEffect, useState } from "react";
import type { FC } from "react";
import "twin.macro";
import { Dia, TipoHorario } from "./types";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";
import { globalContext } from "pages/_app";

const HorariosConfigCard = () => {
  const [tipoHorario, setTipoHorario] = useState<TipoHorario>("automatico");
  const [tipoDescripcion, setTipoDescripcion] = useState("");
  const UserUID = useContext(globalContext).user?.uid;

  useEffect(() => {
    if (UserUID === undefined) return;

    firebase
      .database()
      .ref(`/tiendas/${UserUID}/horario/tipo`)
      .on("value", data => setTipoHorario(data.val()));
  }, [UserUID]);

  useEffect(() => {
    if (tipoHorario === "automatico")
      setTipoDescripcion("Tu tienda abrira y cerrara automaticamente en un horario establecido");
    else if (tipoHorario === "manual")
      setTipoDescripcion("Tu tienda recibira ordenes solo cuando abras y dejaras de recibirlas cuando cierres");
  }, [tipoHorario]);

  const handleHorarioTipoChange = (e: SyntheticEvent) => {
    firebase
      .database()
      .ref(`/tiendas/${UserUID}/horario/tipo`)
      .set((e.currentTarget as HTMLInputElement).value);
  };

  return (
    <div className="horarios" tw="shadow mt-8 mx-4 divide-y px-4 pb-2">
      <div className="card-header" tw="flex justify-between py-2">
        <h1 tw="font-medium text-lg">Horario</h1>
        <label>
          <span tw="mr-2">Tipo de horario:</span>
          <select value={tipoHorario} onChange={handleHorarioTipoChange} name="horario-tipos" id="horario-tipo-select">
            <option value="automatico">Automatico</option>
            <option value="manual">Manual</option>
          </select>
        </label>
      </div>

      <div className="card-body">
        <h2 tw="pt-2">{tipoDescripcion}</h2>

        {tipoHorario === "automatico" ? (
          <div className="dias-config" tw="mt-2">
            <DiaSetup dia="Lunes" />
            <DiaSetup dia="Martes" />
            <DiaSetup dia="Miercoles" />
            <DiaSetup dia="Jueves" />
            <DiaSetup dia="Viernes" />
            <DiaSetup dia="Sabado" />
            <DiaSetup dia="Domingo" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const DiaSetup: FC<{
  dia: string;
}> = ({ dia }) => {
  const UserUID = useContext(globalContext).user?.uid;
  const { register, watch } = useForm<Dia>();
  const { isAbierto, horaApertura, horaCierre } = watch();
  const [diaConfigRemoto, setDiaConfigRemoto] = useState<Dia>();

  useEffect(() => {
    if (UserUID === undefined) return;

    firebase
      .database()
      .ref(`/tiendas/${UserUID}/horario/dias/${dia.toLowerCase()}`)
      .on("value", data => setDiaConfigRemoto(data.val()));
  }, [UserUID]);

  useEffect(() => {
    if (UserUID === undefined || isAbierto === undefined || horaApertura === undefined || horaCierre === undefined)
      return;

    firebase
      .database()
      .ref(`/tiendas/${UserUID}/horario/dias/${dia.toLowerCase()}`)
      .set({ isAbierto, horaApertura, horaCierre });
  }, [isAbierto, horaApertura, horaCierre]);

  return (
    <div tw="flex flex-col bg-gray-100 my-2 p-1">
      {diaConfigRemoto ? (
        <>
          <div tw="flex justify-between">
            <span tw="font-medium">{dia}</span>
            <label>
              Abierto
              <input
                name="isAbierto"
                ref={register}
                type="checkbox"
                defaultChecked={diaConfigRemoto?.isAbierto}
                tw="ml-2"
              />
            </label>
          </div>

          <label tw="flex justify-between my-1">
            Desde las:
            <input name="horaApertura" ref={register} type="time" defaultValue={diaConfigRemoto?.horaApertura} />
          </label>

          <label tw="flex justify-between my-1">
            Hasta las:
            <input name="horaCierre" ref={register} type="time" defaultValue={diaConfigRemoto?.horaCierre} />
          </label>
        </>
      ) : null}
    </div>
  );
};

export default HorariosConfigCard;
