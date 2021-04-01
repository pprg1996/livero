import { useRouter } from "next/router";
import { globalContext } from "pages/_app";
import { useContext, useState } from "react";

const PagosOperacion = () => {
  const [metodoDePago, setMetodoDePago] = useState<"pm" | "zelle" | "paypal">("pm");
  const router = useRouter();
  const dolar = useContext(globalContext).state.dolar;

  return (
    <div tw="space-y-4 divide-y">
      <div>
        <h1 tw="font-medium text-gray-700">Pago recibido por Zelle</h1>
        <span>
          Código de transacción: <span tw="font-medium text-green-700">d893jkvc6</span>
        </span>
      </div>

      <div>
        <h1 tw="font-medium text-gray-700">
          {router.pathname === "/chatcomprador" ? "Pagar a vendedor: " : "Pagar a repartidor: "} $90
        </h1>

        <label tw="flex justify-between items-center">
          <h2 tw="flex">Método de pago</h2>
          <select defaultValue="pm" onChange={e => setMetodoDePago(e.target.value as typeof metodoDePago)}>
            <option value="pm">Pago móvil</option>
            <option value="zelle">Zelle</option>
            <option value="paypal">Paypal</option>
          </select>
        </label>

        {(() => {
          switch (metodoDePago) {
            case "pm":
              return (
                <div tw="flex flex-col">
                  <span>Cedula: {123321123}</span>
                  <span>Teléfono: {4241234564}</span>
                  <span>Banco: {"Banco de Venezuela"}</span>

                  <span tw="my-3"># de referencia: 74678</span>

                  <input type="number" placeholder="# de referencia" tw="border rounded p-1 mb-2" />
                  <button tw="text-white rounded bg-blue-700 p-2">Enviar número de referencia</button>
                </div>
              );
            case "zelle":
              return (
                <div tw="flex flex-col">
                  <span>A nombre de: {"eiofjweiofo"}</span>
                  <span>Correo: {"jfiewji@eifjeijfi.com"}</span>

                  <span tw="my-3">Código de transacción: f78ef79g9dvd</span>

                  <input type="text" placeholder="Código de transacción" tw="border rounded p-1 mb-2" />
                  <button tw="text-white rounded bg-blue-700 p-2">Enviar código de transacción</button>
                </div>
              );
            case "paypal":
              return (
                <div tw="flex flex-col">
                  <span>Correo: {"jfiewji@eifjeijfi.com"}</span>

                  <span tw="my-3">
                    Correo desde donde enviaste el págo:
                    <br />
                    dfnie@dfii.com
                  </span>

                  <input type="email" placeholder="Correo desde donde hiciste el págo" tw="border rounded p-1 mb-2" />
                  <button tw="text-white rounded bg-blue-700 p-2">Enviar correo desde donde pagaste</button>
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default PagosOperacion;
