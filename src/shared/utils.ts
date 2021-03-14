import distance from "@turf/distance";
import { Tienda } from "features/tienda/types";
import { Ubicacion } from "features/ubicacion/types";

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.substring(1);
};

export const filtrarVendedorPorHorario = (vendedor: Tienda) => {
  const tiempoActual = new Date();

  if (vendedor.horario.tipo === "manual" && vendedor.abierto) return true;

  if (vendedor.horario.tipo === "automatico") {
    let diaDeLaSemanaActual: keyof typeof vendedor.horario.dias = "lunes";

    switch (tiempoActual.getDay()) {
      case 0:
        diaDeLaSemanaActual = "domingo";
        break;
      case 1:
        diaDeLaSemanaActual = "lunes";
        break;
      case 2:
        diaDeLaSemanaActual = "martes";
        break;
      case 3:
        diaDeLaSemanaActual = "miercoles";
        break;
      case 4:
        diaDeLaSemanaActual = "jueves";
        break;
      case 5:
        diaDeLaSemanaActual = "viernes";
        break;
      case 6:
        diaDeLaSemanaActual = "sabado";
        break;
    }

    const dia = vendedor.horario.dias[diaDeLaSemanaActual];

    if (!dia.isAbierto) return false;
    else {
      if (dia.horaApertura === "" || dia.horaCierre === "") return true;
      else {
        const horaLocalMilitar = Number(`${tiempoActual.getHours()}${tiempoActual.getMinutes()}`);
        const horaAperturaMilitar = Number(`${dia.horaApertura.split(":")[0]}${dia.horaApertura.split(":")[1]}`);
        const horaCierreMilitar = Number(`${dia.horaCierre.split(":")[0]}${dia.horaCierre.split(":")[1]}`);

        if (horaLocalMilitar > horaAperturaMilitar && horaLocalMilitar < horaCierreMilitar) return true;
      }
    }
  }

  return false;
};

export const distanciaEntreUbicaciones = (ubicacion1: Ubicacion, ubicacion2: Ubicacion) => {
  const distancia = distance([ubicacion1.longitud, ubicacion1.latitud], [ubicacion2.longitud, ubicacion2.latitud], {
    units: "kilometers",
  });

  return Number(distancia.toFixed(2));
};

export const filtrarVendedorPorDistancia = (
  distanciaMaxima: number,
  vendedor: Tienda,
  compradorUbicacion: Ubicacion,
) => {
  const vendedorUbicacion = vendedor.ubicacion;

  const distancia = distanciaEntreUbicaciones(vendedorUbicacion, compradorUbicacion);

  if (distancia <= distanciaMaxima) return true;
  return false;
};
