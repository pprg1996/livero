import React, { FC, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useClickOutside } from "shared/hooks";
import tw from "twin.macro";
import CarritoOperacion from "./CarritoOperacion";
import MapaOperacion from "./MapaOperacion";
import StatusOperacion from "./StatusOperacion";

const SelectableBtn: FC<{ texto: string; selectedValue: string; setSelectedValue: Function }> = ({
  texto,
  selectedValue,
  setSelectedValue,
}) => {
  return (
    <button
      tw="text-white p-1 rounded bg-blue-700"
      css={[selectedValue === texto.toLowerCase() ? tw`bg-yellow-500` : null]}
      onClick={() => setSelectedValue(texto.toLowerCase())}
    >
      {texto}
    </button>
  );
};

const DetallesOperacionDrawer: FC<{ setShowDetalles: Function }> = ({ setShowDetalles }) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const detallesRef = useRef<HTMLDivElement>(null);
  const [selectedDetalle, setSelectedDetalle] = useState<"carrito" | "mapa" | "perfiles" | "status">("carrito");

  useEffect(() => setStartAnimation(true), []);

  useClickOutside(detallesRef, () => setShowDetalles(false));

  if (typeof window === "undefined") {
    return null;
  }

  return ReactDOM.createPortal(
    <div tw="bg-gray-700 bg-opacity-40 w-full h-full absolute z-10 flex justify-end right-0 top-0">
      <div
        tw="relative -right-96 bg-white transition-all p-2 overflow-auto"
        css={[startAnimation ? tw`right-0` : null]}
        ref={detallesRef}
      >
        <div tw="space-x-2 mb-3">
          <SelectableBtn texto="Carrito" selectedValue={selectedDetalle} setSelectedValue={setSelectedDetalle} />
          <SelectableBtn texto="Mapa" selectedValue={selectedDetalle} setSelectedValue={setSelectedDetalle} />
          <SelectableBtn texto="Perfiles" selectedValue={selectedDetalle} setSelectedValue={setSelectedDetalle} />
          <SelectableBtn texto="Status" selectedValue={selectedDetalle} setSelectedValue={setSelectedDetalle} />
        </div>

        {(function () {
          switch (selectedDetalle) {
            case "carrito":
              return <CarritoOperacion />;
            case "mapa":
              return <MapaOperacion />;
            case "perfiles":
              return null;
            case "status":
              return <StatusOperacion />;
          }
        })()}
      </div>
    </div>,
    document.getElementById("content-container") as HTMLElement,
  );
};

export default DetallesOperacionDrawer;
