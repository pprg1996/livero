import { Operacion } from "features/compradores/types";
import {
  mandarMensaje,
  setNuevoPago,
  useCompradores,
  useOperaciones,
  useRepartidores,
  useVendedores,
} from "features/firebase";
import { bancos } from "features/pagos/bancos";
import { useRouter } from "next/router";
import { globalContext } from "pages/_app";
import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { capitalizeFirstLetter, distanciaEntreUbicaciones } from "shared/utils";
import firebase from "firebase/app";

const useCostosDeOperacion = (operacion: Operacion | undefined) => {
  const comprador = useCompradores()?.[operacion?.compradorId ?? ""];
  const vendedor = useVendedores()?.[operacion?.tiendaId ?? ""];

  if (!operacion || !comprador || !vendedor) return { costoCarrito: 1, costoDelivery: 1 };

  const distanciaDelivery = distanciaEntreUbicaciones(comprador.ubicacion, vendedor.ubicacion);

  const costoDelivery = Math.ceil(Number((distanciaDelivery / 5).toFixed(2)));

  const costoCarrito =
    operacion.carrito?.articuloPacks.reduce((precio, articuloPack) => {
      return (precio += articuloPack.cantidad * articuloPack.articulo.precio);
    }, 0) ?? 0;

  return { costoCarrito, costoDelivery };
};

const PagosOperacion = () => {
  const [metodoDePagoSeleccionado, setMetodoDePagoSeleccionado] = useState<"pm" | "zelle" | "paypal">();
  const { pathname } = useRouter();
  const dolar = useContext(globalContext).state.dolar;
  const operacionChatId = useContext(globalContext).state.operacionChatId as string;
  const operaciones = useOperaciones();
  const vendedorId = operaciones?.[operacionChatId].tiendaId;
  const repartidorId = operaciones?.[operacionChatId].repartidorId;
  const repartidorConfirmado = operaciones?.[operacionChatId].repartidorConfirmado;
  const metodosDePagoVendedor = useVendedores()?.[vendedorId ?? ""].metodosDePago;
  const metodosDePagoRepartidor = useRepartidores()?.[repartidorId ?? ""]?.metodosDePago;
  const metodosDePagoCorrespondiente = pathname === "/chatcomprador" ? metodosDePagoVendedor : metodosDePagoRepartidor;
  const pagosDeOperacion = operaciones?.[operacionChatId].pagos;
  const pagosDeOperacionCorrespondiente =
    pathname === "/chatvendedor" ? pagosDeOperacion?.vendedor : pagosDeOperacion?.repartidor;
  const { costoCarrito, costoDelivery } = useCostosDeOperacion(operaciones?.[operacionChatId]);
  const userUID = useContext(globalContext).state.user?.uid;

  useEffect(() => {
    if (!metodosDePagoCorrespondiente) return;

    for (let [metodo, { activo }] of Object.entries(metodosDePagoCorrespondiente)) {
      if (activo) {
        setMetodoDePagoSeleccionado(metodo as typeof metodoDePagoSeleccionado);
        break;
      }
    }
  }, [!!metodosDePagoCorrespondiente]);

  useEffect(() => {
    if (pathname === "/chatcomprador") return;
    const tipo = pathname === "/chatvendedor" ? "tiendas" : "repartidores";

    firebase.database().ref(`/${tipo}/${userUID}/pagosNuevosEnOperaciones/${operacionChatId}`).remove();
  });

  const enviarPago: MouseEventHandler<HTMLButtonElement> = e => {
    const tipoPago = e.currentTarget.getAttribute("data-pago");
    const perfilAPagar = pathname === "/chatcomprador" ? "vendedor" : "repartidor";

    const dataInput = document.getElementById(`input-${tipoPago}`) as HTMLInputElement;

    firebase
      .database()
      .ref(`/operaciones/${operacionChatId}/pagos/${perfilAPagar}/${tipoPago}`)
      .set(dataInput.value)
      .then(() => {
        const tipo = pathname === "/chatcomprador" ? "tiendas" : "repartidores";
        const userId = pathname === "/chatcomprador" ? vendedorId : repartidorId;

        setNuevoPago(tipo, userId as string, operacionChatId);
      });

    dataInput.value = "";

    mandarMensaje({ rol: "info", texto: `Pago enviado a ${perfilAPagar}`, timestamp: Date.now() }, operacionChatId);
  };

  return (
    <div tw="space-y-4 divide-y">
      {pathname !== "/chatcomprador" && pagosDeOperacionCorrespondiente?.pm ? (
        <div>
          <h1 tw="font-medium text-gray-700">Pago recibido por Pago Móvil</h1>
          <span>
            # de referencia: <span tw="font-medium text-green-700">{pagosDeOperacionCorrespondiente.pm}</span>
          </span>
        </div>
      ) : null}

      {pathname !== "/chatcomprador" && pagosDeOperacionCorrespondiente?.zelle ? (
        <div>
          <h1 tw="font-medium text-gray-700">Pago recibido por Zelle</h1>
          <span>
            Código de transacción: <span tw="font-medium text-green-700">{pagosDeOperacionCorrespondiente.zelle}</span>
          </span>
        </div>
      ) : null}

      {pathname !== "/chatcomprador" && pagosDeOperacionCorrespondiente?.paypal ? (
        <div>
          <h1 tw="font-medium text-gray-700">Pago recibido por Paypal</h1>
          <span>
            Correo desde donde te pagaron:
            <br />
            <span tw="font-medium text-green-700">{pagosDeOperacionCorrespondiente.paypal}</span>
          </span>
        </div>
      ) : null}

      {pathname !== "/chatcomprador" &&
      !pagosDeOperacionCorrespondiente?.paypal &&
      !pagosDeOperacionCorrespondiente?.zelle &&
      !pagosDeOperacionCorrespondiente?.pm ? (
        <h1 tw="font-medium text-gray-700">No has recibido ningun pago</h1>
      ) : null}

      {pathname === "/chatcomprador" || (pathname === "/chatvendedor" && repartidorId && repartidorConfirmado) ? (
        <div>
          <h1 tw="font-medium text-gray-700">
            {pathname === "/chatcomprador"
              ? `Pagar a vendedor: $${(costoCarrito + costoDelivery).toFixed(2)} = Bs${(
                  (costoCarrito + costoDelivery) *
                  dolar
                )
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              : `Pagar a repartidor: $${costoDelivery.toFixed(2)} = Bs${(costoDelivery * dolar)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
          </h1>

          <label tw="flex justify-between items-center">
            <h2 tw="flex">Método de pago</h2>
            <select
              value={metodoDePagoSeleccionado}
              onChange={e => setMetodoDePagoSeleccionado(e.target.value as typeof metodoDePagoSeleccionado)}
            >
              {metodosDePagoCorrespondiente?.pm.activo ? <option value="pm">Pago móvil</option> : null}
              {metodosDePagoCorrespondiente?.zelle.activo ? <option value="zelle">Zelle</option> : null}
              {metodosDePagoCorrespondiente?.paypal.activo ? <option value="paypal">Paypal</option> : null}
            </select>
          </label>

          {(() => {
            switch (metodoDePagoSeleccionado) {
              case "pm":
                const bancoDeVendedor = bancos.find(({ id }) => id === metodosDePagoCorrespondiente?.pm.codigoBanco);

                return (
                  <div tw="flex flex-col">
                    <span>Cedula: {metodosDePagoCorrespondiente?.pm.cedula}</span>
                    <span>Teléfono: {metodosDePagoCorrespondiente?.pm.telefono}</span>
                    <span>
                      Banco: {capitalizeFirstLetter(bancoDeVendedor?.name.toLowerCase() ?? "")} ({bancoDeVendedor?.id})
                    </span>

                    {pathname === "/chatvendedor" && pagosDeOperacion?.repartidor.pm ? (
                      <span tw="my-3"># de referencia: {pagosDeOperacion.repartidor.pm}</span>
                    ) : null}

                    {pathname === "/chatcomprador" && pagosDeOperacion?.vendedor.pm ? (
                      <span tw="my-3"># de referencia: {pagosDeOperacion.vendedor.pm}</span>
                    ) : null}

                    <input id="input-pm" type="text" placeholder="# de referencia" tw="border rounded p-1 my-2" />
                    <button onClick={enviarPago} data-pago="pm" tw="text-white rounded bg-blue-700 p-2">
                      Enviar número de referencia
                    </button>
                  </div>
                );
              case "zelle":
                return (
                  <div tw="flex flex-col">
                    <span>A nombre de: {metodosDePagoCorrespondiente?.zelle.titular}</span>
                    <span>Correo: {metodosDePagoCorrespondiente?.zelle.correo}</span>

                    {pathname === "/chatvendedor" && pagosDeOperacion?.repartidor.zelle ? (
                      <span tw="my-3">Código de transacción: {pagosDeOperacion.repartidor.zelle}</span>
                    ) : null}

                    {pathname === "/chatcomprador" && pagosDeOperacion?.vendedor.zelle ? (
                      <span tw="my-3">Código de transacción: {pagosDeOperacion.vendedor.zelle}</span>
                    ) : null}

                    <input
                      id="input-zelle"
                      type="text"
                      placeholder="Código de transacción"
                      tw="border rounded p-1 my-2"
                    />
                    <button onClick={enviarPago} data-pago="zelle" tw="text-white rounded bg-blue-700 p-2">
                      Enviar código de transacción
                    </button>
                  </div>
                );
              case "paypal":
                return (
                  <div tw="flex flex-col">
                    <span>Correo: {metodosDePagoCorrespondiente?.paypal.correo}</span>

                    {pathname === "/chatvendedor" && pagosDeOperacion?.repartidor.paypal ? (
                      <span tw="my-3">
                        Correo desde donde enviaste el pago:
                        <br />
                        {pagosDeOperacion.repartidor.paypal}
                      </span>
                    ) : null}

                    {pathname === "/chatcomprador" && pagosDeOperacion?.vendedor.paypal ? (
                      <span tw="my-3">
                        Correo desde donde enviaste el pago:
                        <br />
                        {pagosDeOperacion.vendedor.paypal}
                      </span>
                    ) : null}

                    <input
                      id="input-paypal"
                      type="email"
                      placeholder="Correo desde donde enviaste el pago"
                      tw="border rounded p-1 my-2"
                    />
                    <button onClick={enviarPago} data-pago="paypal" tw="text-white rounded bg-blue-700 p-2">
                      Enviar correo desde donde pagaste
                    </button>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </div>
      ) : null}
    </div>
  );
};

export default PagosOperacion;
