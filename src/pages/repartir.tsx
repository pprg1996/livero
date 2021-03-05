import { useContext, useEffect, useRef, useState } from "react";
import SwitchToggle from "shared/components/SwitchToggle";
import firebase from "firebase/app";
import { globalContext } from "./_app";
import mapboxgl from "mapbox-gl";
import "twin.macro";

const Repartir = () => {
  const userUID = useContext(globalContext).user?.uid;
  const [repartirdorActivado, setRepartidorActivado] = useState();
  const mapRef = useRef<mapboxgl.Map>();
  const markerRef = useRef<mapboxgl.Marker>();
  const firstRenderRef = useRef(true);

  useEffect(() => {
    const repartidorActivoRef = firebase.database().ref(`/repartidores/${userUID}/activo`);

    if (repartirdorActivado === undefined) {
      repartidorActivoRef.on("value", data => setRepartidorActivado(data.val()));
      return;
    }

    repartidorActivoRef.set(repartirdorActivado);
  }, [repartirdorActivado]);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoicHByZzE5OTYiLCJhIjoiY2trdjJzanNwMHhubjJvcnU1MTBtOGhtciJ9.0n8i3rZBb7OJ5zaPmt8ODw";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 16,
    });

    markerRef.current = new mapboxgl.Marker().setLngLat([0, 0]).addTo(map);
    mapRef.current = map;

    navigator.geolocation.watchPosition(
      pos => {
        markerRef.current?.setLngLat([pos.coords.longitude, pos.coords.latitude]);
        mapRef.current?.setCenter([pos.coords.longitude, pos.coords.latitude]);
      },
      undefined,
      { enableHighAccuracy: true },
    );
  }, []);

  firstRenderRef.current = false;

  return (
    <div>
      <SwitchToggle
        label={repartirdorActivado ? "Disponible para repartir" : "No disposible para repartir"}
        checked={repartirdorActivado ?? false}
        setChecked={setRepartidorActivado}
      />

      <div className="mapboxgl-map" id="map" tw="h-80"></div>
    </div>
  );
};

export default Repartir;
