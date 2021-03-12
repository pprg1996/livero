import { useContext, useEffect, useRef, useState } from "react";
import SwitchToggle from "shared/components/SwitchToggle";
import firebase from "firebase/app";
import { globalContext } from "./_app";
import mapboxgl from "mapbox-gl";
import "twin.macro";
import DeliveriesDisponibles from "features/repartidores/DeliveriesDisponibles";
import { useOperaciones, useCompradores, useRepartidores, useUpdateUbicacion, useVendedores } from "features/firebase";
import { distance } from "@turf/turf";
import markerStyles from "features/css/markerStyles.module.css";

const Repartir = () => {
  const userUID = useContext(globalContext).state.user?.uid;
  const [repartirdorActivado, setRepartidorActivado] = useState();
  const mapRef = useRef<mapboxgl.Map>();
  const repartidorMarkerRef = useRef<mapboxgl.Marker>();
  const compradorMarkerRef = useRef<mapboxgl.Marker>();
  const vendedorMarkerRef = useRef<mapboxgl.Marker>();
  const [selectedOperacionId, setSelectedOperacionId] = useState<string>();

  useUpdateUbicacion("repartidores");
  const operaciones = useOperaciones();
  const compradores = useCompradores();
  const vendedores = useVendedores();
  const repartidores = useRepartidores();

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

    const vendedorMarkerDiv = document.createElement("div");
    vendedorMarkerDiv.className = markerStyles.vendedorMarker;
    const compradorMarkerDiv = document.createElement("div");
    compradorMarkerDiv.className = markerStyles.compradorMarker;
    const repartidorMarkerDiv = document.createElement("div");
    repartidorMarkerDiv.className = markerStyles.repartidorMarker;

    compradorMarkerRef.current = new mapboxgl.Marker({ element: compradorMarkerDiv, anchor: "bottom-left" })
      .setLngLat([0, 0])
      .addTo(map);

    vendedorMarkerRef.current = new mapboxgl.Marker({ element: vendedorMarkerDiv, anchor: "bottom-left" })
      .setLngLat([0, 0])
      .addTo(map);

    repartidorMarkerRef.current = new mapboxgl.Marker({ element: repartidorMarkerDiv, anchor: "bottom-left" })
      .setLngLat([0, 0])
      .addTo(map);

    mapRef.current = map;
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        repartidorMarkerRef.current?.setLngLat([pos.coords.longitude, pos.coords.latitude]);

        if (!selectedOperacionId) {
          mapRef.current?.setCenter([pos.coords.longitude, pos.coords.latitude]);
        }
      },
      undefined,
      { enableHighAccuracy: true },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [selectedOperacionId]);

  useEffect(() => {
    if (!selectedOperacionId || !operaciones || !compradores || !vendedores || !repartidores) return;

    const selectedOperacion = operaciones[selectedOperacionId];
    const comprador = compradores[selectedOperacion.compradorId];
    const vendedor = vendedores[selectedOperacion.tiendaId];

    const compradorUbicacion = comprador.ubicacion;
    const vendedorUbicacion = vendedor.ubicacion;
    const repartidorUbicacion = repartidores[userUID as string].ubicacion;

    vendedorMarkerRef.current?.setLngLat([vendedorUbicacion.longitud, vendedorUbicacion.latitud]);
    compradorMarkerRef.current?.setLngLat([compradorUbicacion.longitud, compradorUbicacion.latitud]);

    const distancia = distance(
      [compradorUbicacion.longitud, compradorUbicacion.latitud],
      [vendedorUbicacion.longitud, vendedorUbicacion.latitud],
      {
        units: "kilometers",
      },
    );

    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            properties: {},
            coordinates: [
              [compradorUbicacion.longitud, compradorUbicacion.latitud],
              [vendedorUbicacion.longitud, vendedorUbicacion.latitud],
              [repartidorUbicacion.longitud, repartidorUbicacion.latitud],
            ],
          },
        },
      ],
    };

    var coordinates = geojson.features[0].geometry.coordinates;

    var bounds = coordinates.reduce(function (bounds, coord) {
      return bounds.extend(coord as [number, number]);
    }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[1] as [number, number]));

    mapRef.current?.fitBounds(bounds, {
      padding: 40,
    });
  }, [selectedOperacionId]);

  return (
    <div tw="space-y-2">
      <SwitchToggle
        label={repartirdorActivado ? "Disponible para repartir" : "No disposible para repartir"}
        checked={repartirdorActivado ?? false}
        setChecked={setRepartidorActivado}
      />

      <div className="mapboxgl-map" id="map" tw="h-80"></div>

      <DeliveriesDisponibles
        setSelectedOperacionId={setSelectedOperacionId}
        selectedOperacionId={selectedOperacionId}
      />
    </div>
  );
};

export default Repartir;
