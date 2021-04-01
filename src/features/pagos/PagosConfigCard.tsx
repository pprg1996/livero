import { useRouter } from "next/router";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import Card from "shared/components/Card";
import { bancos } from "./bancos";
import firebase from "firebase/app";
import { globalContext } from "pages/_app";
import { MetodosDePago } from "./types";

const PagosConfigCard = () => {
  const router = useRouter();
  const userUID = useContext(globalContext).state.user?.uid;
  const [metodosDePago, setMetodosDePago] = useState<MetodosDePago>();
  const tipoDireccion = router.pathname === "/vender" ? "/tiendas" : "/repartidores";

  useEffect(() => {
    const metodosDePagoRef = firebase.database().ref(`${tipoDireccion}/${userUID}/metodosDePago`);
    const refFetchCallback = (data: firebase.database.DataSnapshot): void => {
      setMetodosDePago(data.val());
    };

    metodosDePagoRef.on("value", refFetchCallback);

    return () => metodosDePagoRef.off("value", refFetchCallback);
  }, []);

  const handleActivoChange: ChangeEventHandler<HTMLInputElement> = e => {
    const checkbox = e.target;

    firebase
      .database()
      .ref(`${tipoDireccion}/${userUID}/metodosDePago/${checkbox.getAttribute("data-pago")}/activo`)
      .set(checkbox.checked);
  };

  const handleDataChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = e => {
    const input = e.target;

    firebase
      .database()
      .ref(`${tipoDireccion}/${userUID}/metodosDePago/${input.getAttribute("data-pago")}`)
      .set(input.value);
  };

  if (!metodosDePago) return null;

  return (
    <Card tw="mb-4 py-2 space-y-4">
      <div>
        <h1 tw="font-medium text-lg">Pagos</h1>
        <h2>
          Las siguientes plataformas de pago electrónico pueden cobrar comisiones por las que ni Livero ni el comprador
          de tus productos se hará responsable
        </h2>
      </div>

      <div tw="flex flex-col space-y-2">
        <label tw="flex items-center flex-shrink-0 space-x-2">
          <input type="checkbox" checked={metodosDePago.pm.activo} data-pago="pm" onChange={handleActivoChange} />
          <h2>Pago móvil</h2>
        </label>

        <select
          tw="flex-grow"
          value={metodosDePago.pm.codigoBanco}
          data-pago="pm/codigoBanco"
          onChange={handleDataChange}
        >
          <option value="0">Elegir banco</option>
          {bancos.map(({ id, name }) => (
            <option key={id} value={id}>
              {name} ({id})
            </option>
          ))}
        </select>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>Cédula</h2>
          <input
            type="string"
            tw="border rounded"
            value={metodosDePago.pm.cedula}
            data-pago="pm/cedula"
            onChange={handleDataChange}
          />
        </label>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>Teléfono</h2>
          <input
            type="tel"
            tw="border rounded"
            value={metodosDePago.pm.telefono}
            data-pago="pm/telefono"
            onChange={handleDataChange}
          />
        </label>
      </div>

      <div tw="flex flex-col space-y-2">
        <label tw="flex items-center flex-shrink-0 space-x-2">
          <input type="checkbox" checked={metodosDePago.zelle.activo} data-pago="zelle" onChange={handleActivoChange} />
          <h2>Zelle</h2>
        </label>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>A nombre de</h2>
          <input
            type="text"
            tw="border rounded"
            value={metodosDePago.zelle.titular}
            data-pago="zelle/titular"
            onChange={handleDataChange}
          />
        </label>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>Correo</h2>
          <input
            type="email"
            tw="border rounded"
            value={metodosDePago.zelle.correo}
            data-pago="zelle/correo"
            onChange={handleDataChange}
          />
        </label>
      </div>

      <div tw="flex flex-col space-y-2">
        <label tw="flex items-center flex-shrink-0 space-x-2">
          <input
            type="checkbox"
            checked={metodosDePago.paypal.activo}
            data-pago="paypal"
            onChange={handleActivoChange}
          />
          <h2>Paypal</h2>
        </label>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>Correo</h2>
          <input
            type="email"
            tw="border rounded"
            value={metodosDePago.paypal.correo}
            data-pago="paypal/correo"
            onChange={handleDataChange}
          />
        </label>
      </div>
    </Card>
  );
};

export default PagosConfigCard;
