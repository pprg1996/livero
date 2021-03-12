import { useMap } from "features/ubicacion/hooks";
import { globalContext } from "pages/_app";
import { FC, useContext } from "react";

const MapaOperacion = () => {
  const operacionChatId = useContext(globalContext).state.operacionChatId;

  useMap(operacionChatId as string);

  return (
    <div>
      <div className="mapboxgl-map" id="map" tw="w-80 h-80"></div>
    </div>
  );
};

export default MapaOperacion;
