import { useEffect, useRef } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "twin.macro";
import markerStyles from "features/css/markerStyles.module.css";
import { useCompradores, useOperaciones, useRepartidores, useVendedores } from "features/firebase";
import { Ubicacion } from "./types";

export const useMap = (selectedOperacionId: string) => {
  const mapRef = useRef<mapboxgl.Map>();

  const repartidorMarkerRef = useRef<mapboxgl.Marker>();
  const compradorMarkerRef = useRef<mapboxgl.Marker>();
  const vendedorMarkerRef = useRef<mapboxgl.Marker>();

  const operaciones = useOperaciones();
  const compradores = useCompradores();
  const vendedores = useVendedores();
  const repartidores = useRepartidores();

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

    compradorMarkerRef.current = new mapboxgl.Marker({ element: compradorMarkerDiv, anchor: "bottom-left" })
      .setLngLat([0, 0])
      .addTo(map);

    vendedorMarkerRef.current = new mapboxgl.Marker({ element: vendedorMarkerDiv, anchor: "bottom-left" })
      .setLngLat([0, 0])
      .addTo(map);

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!operaciones!?.[selectedOperacionId].repartidorId) return;

    const repartidorMarkerDiv = document.createElement("div");
    repartidorMarkerDiv.className = markerStyles.repartidorMarker;

    repartidorMarkerRef.current = new mapboxgl.Marker({ element: repartidorMarkerDiv, anchor: "bottom-left" })
      .setLngLat([0, 0])
      .addTo(mapRef.current as Map);
  }, [operaciones?.[selectedOperacionId].repartidorId]);

  if (!selectedOperacionId || !operaciones || !compradores || !vendedores || !repartidores) return;

  const selectedOperacion = operaciones[selectedOperacionId];
  const comprador = compradores[selectedOperacion.compradorId];
  const vendedor = vendedores[selectedOperacion.tiendaId];

  const compradorUbicacion = comprador.ubicacion;
  const vendedorUbicacion = vendedor.ubicacion;
  let repartidorUbicacion: Ubicacion | undefined;

  if (selectedOperacion.repartidorId) {
    const repartidor = repartidores[selectedOperacion.repartidorId];
    repartidorUbicacion = repartidor.ubicacion;
  }

  vendedorMarkerRef.current?.setLngLat([vendedorUbicacion.longitud, vendedorUbicacion.latitud]);
  compradorMarkerRef.current?.setLngLat([compradorUbicacion.longitud, compradorUbicacion.latitud]);

  if (repartidorUbicacion) {
    repartidorMarkerRef.current?.setLngLat([repartidorUbicacion.longitud, repartidorUbicacion.latitud]);
  }

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
            repartidorUbicacion ? [repartidorUbicacion.longitud, repartidorUbicacion.latitud] : undefined,
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
};
