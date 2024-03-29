import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import type { FC } from "react";
import "twin.macro";
import { Dia, TipoHorario } from "features/horario/types";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";
import { globalContext } from "pages/_app";
import Card from "shared/components/Card";
import SwitchToggle from "shared/components/SwitchToggle";

const HorariosConfigCard = () => {
  const [tipoHorario, setTipoHorario] = useState<TipoHorario>("automatico");
  const [tipoDescripcion, setTipoDescripcion] = useState("");
  const userUID = useContext(globalContext).state.user?.uid;
  const [tiendaAbierta, setTiendaAbierta] = useState();

  useEffect(() => {
    firebase
      .database()
      .ref(`/tiendas/${userUID}/horario/tipo`)
      .on("value", data => setTipoHorario(data.val()));

    firebase
      .database()
      .ref(`/tiendas/${userUID}/abierto`)
      .on("value", data => setTiendaAbierta(data.val()));
  }, []);

  useEffect(() => {
    if (tipoHorario === "automatico")
      setTipoDescripcion(`Tu tienda solo aparecerá en los resultados de busqueda cuando este en horario de apertura`);
    else if (tipoHorario === "manual")
      setTipoDescripcion(`Tu tienda solo aparecerá en los resultados de busqueda cuando este marcada como "Abierta"`);
  }, [tipoHorario]);

  const handleHorarioTipoChange = (e: SyntheticEvent) => {
    firebase
      .database()
      .ref(`/tiendas/${userUID}/horario/tipo`)
      .set((e.currentTarget as HTMLInputElement).value);
  };

  useEffect(() => {
    if (tiendaAbierta === undefined) return;
    firebase.database().ref(`/tiendas/${userUID}/abierto`).set(tiendaAbierta);
  }, [tiendaAbierta]);

  return (
    <Card className="horarios">
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

      <div className="card-body" tw="py-2">
        <h2>{tipoDescripcion}</h2>

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
        ) : (
          <SwitchToggle
            checked={tiendaAbierta ?? true}
            setChecked={setTiendaAbierta}
            label={tiendaAbierta ? "Tienda abierta" : "Tienda cerrada"}
          />
        )}
      </div>
    </Card>
  );
};

const DiaSetup: FC<{
  dia: string;
}> = ({ dia }) => {
  const userUID = useContext(globalContext).state.user?.uid;
  const { register, watch, setValue } = useForm<Dia>();
  const { isAbierto, horaApertura, horaCierre } = watch();
  const [diaConfigRemoto, setDiaConfigRemoto] = useState<Dia>();

  useEffect(() => {
    firebase
      .database()
      .ref(`/tiendas/${userUID}/horario/dias/${dia.toLowerCase()}`)
      .on("value", data => {
        setDiaConfigRemoto(data.val());
        setValue("isAbierto", data.val().isAbierto);
        setValue("horaApertura", data.val().horaApertura);
        setValue("horaCierre", data.val().horaCierre);
      });
  }, []);

  useEffect(() => {
    if (userUID === undefined || isAbierto === undefined || horaApertura === undefined || horaCierre === undefined)
      return;

    firebase
      .database()
      .ref(`/tiendas/${userUID}/horario/dias/${dia.toLowerCase()}`)
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
