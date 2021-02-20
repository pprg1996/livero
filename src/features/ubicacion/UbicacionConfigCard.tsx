import tw from "twin.macro";
import mapboxgl from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";
import Card from "shared/components/Card";
import { globalContext } from "pages/_app";
import firebase from "firebase/app";

const UbicacionConfigCard = () => {
  const mapRef = useRef<mapboxgl.Map>();
  const markerRef = useRef<mapboxgl.Marker>();
  const userUID = useContext(globalContext).user?.uid;
  const [ubicacion, setUbicacion] = useState({ longitud: 0, latitud: 0 });
  const [isModUbicacion, setIsModUbicacion] = useState(false);

  useEffect(() => {
    if (!userUID) return;

    navigator.geolocation.getCurrentPosition(
      pos => {
        mapboxgl.accessToken =
          "pk.eyJ1IjoicHByZzE5OTYiLCJhIjoiY2trdjJzanNwMHhubjJvcnU1MTBtOGhtciJ9.0n8i3rZBb7OJ5zaPmt8ODw";
        const map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v11",
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 16,
        });

        markerRef.current = new mapboxgl.Marker().setLngLat([0, 0]).addTo(map);

        firebase
          .database()
          .ref(`tiendas/${userUID}/ubicacion`)
          .on("value", data => {
            const lng = data.val().longitud;
            const lat = data.val().latitud;

            if (lng !== 0 && lat !== 0) {
              map.flyTo({ center: [lng, lat] });
            }

            markerRef.current?.setLngLat([lng, lat]);
          });

        mapRef.current = map;
      },
      undefined,
      { enableHighAccuracy: true },
    );
  }, [userUID]);

  useEffect(() => {
    if (!userUID) return;

    mapRef.current?.resize();

    const mapClickHandler = (clickEvent: mapboxgl.MapMouseEvent & mapboxgl.EventData): void => {
      markerRef.current?.setLngLat(clickEvent.lngLat);
      setUbicacion({ longitud: clickEvent.lngLat.lng, latitud: clickEvent.lngLat.lat });
    };

    if (isModUbicacion) {
      mapRef.current?.on("click", mapClickHandler);
    }

    return () => {
      mapRef.current?.off("click", mapClickHandler);
      firebase
        .database()
        .ref(`tiendas/${userUID}/ubicacion`)
        .get()
        .then(data => {
          const lng = data.val().longitud;
          const lat = data.val().latitud;

          mapRef.current?.flyTo({ center: [lng, lat], zoom: 16 });
          markerRef.current?.setLngLat([lng, lat]);
        });
    };
  }, [isModUbicacion, userUID]);

  const goToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        mapRef.current?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 16 });
      },
      undefined,
      { enableHighAccuracy: true },
    );
  };

  const saveNewLocation = () => {
    firebase
      .database()
      .ref(`tiendas/${userUID}/ubicacion`)
      .set(ubicacion)
      .then(() => alert("Nueva ubicacion guardada"));
  };

  return (
    <Card className="tienda-ubicacion" tw="mb-4 py-4 flex flex-col gap-4">
      <div id="map" className="mapboxgl-map" tw="h-40" css={[isModUbicacion && tw`h-80`]}></div>

      {isModUbicacion ? (
        <div tw="border-none flex gap-2">
          <button onClick={goToCurrentLocation} tw="bg-blue-700 p-1.5 rounded  text-white text-sm">
            Ir a tu ubicacion actual
          </button>

          <button onClick={saveNewLocation} tw="bg-blue-700 p-1.5 rounded text-white text-sm ml-auto">
            Guardar ubicacion
          </button>

          <button
            onClick={() => setIsModUbicacion(false)}
            tw="bg-white p-1.5 rounded text-red-700 border-2  border-red-700 text-sm"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button onClick={() => setIsModUbicacion(true)} tw="bg-blue-700 p-1.5 rounded  text-white text-sm">
          Cambiar ubicacion
        </button>
      )}
    </Card>
  );
};

export default UbicacionConfigCard;
