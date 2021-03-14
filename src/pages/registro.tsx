import "twin.macro";
import firebase from "firebase/app";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Horario } from "features/horario/types";
import { Menu } from "features/menu/types";
import TextInput from "shared/components/TextInput";
import { Ubicacion } from "features/ubicacion/types";
import { Tienda } from "features/tienda/types";
import { Repartidor } from "features/repartidores/types";
import { Comprador } from "features/compradores/types";

type Inputs = {
  correo: string;
  contrasena: string;
  contrasena2: string;
};

const Registro = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const router = useRouter();

  const handleRegister = async ({ correo, contrasena, contrasena2 }: Inputs) => {
    if (contrasena !== contrasena2) {
      alert("Las contrasenas deben ser iguales");
      return;
    }

    const userCredential = await firebase.auth().createUserWithEmailAndPassword(correo, contrasena);

    const horarioDefault: Horario = {
      tipo: "manual",
      dias: {
        lunes: { horaApertura: "", horaCierre: "", isAbierto: true },
        martes: { horaApertura: "", horaCierre: "", isAbierto: true },
        miercoles: { horaApertura: "", horaCierre: "", isAbierto: true },
        jueves: { horaApertura: "", horaCierre: "", isAbierto: true },
        viernes: { horaApertura: "", horaCierre: "", isAbierto: true },
        sabado: { horaApertura: "", horaCierre: "", isAbierto: true },
        domingo: { horaApertura: "", horaCierre: "", isAbierto: true },
      },
    };

    const menuDefault: Menu = {
      categorias: [],
      articulos: {},
    };

    const ubicacionDefault: Ubicacion = { longitud: 0, latitud: 0 };

    const tienda: Tienda = {
      titulo: "Titulo",
      menu: menuDefault,
      horario: horarioDefault,
      activo: false,
      abierto: false,
      ubicacion: ubicacionDefault,
      operaciones: {},
    };

    const repartidor: Repartidor = {
      activo: false,
      disponible: true,
      operaciones: {},
      ubicacion: ubicacionDefault,
      nombre: "Nombre",
    };

    const comprador: Comprador = { operaciones: {}, nombre: "Nombre", ubicacion: ubicacionDefault, carritos: {} };

    firebase.database().ref(`tiendas/${userCredential.user?.uid}`).set(tienda);
    firebase.database().ref(`repartidores/${userCredential.user?.uid}`).set(repartidor);
    firebase.database().ref(`compradores/${userCredential.user?.uid}`).set(comprador);

    router.push("/rolselect");
  };

  return (
    <div tw="flex justify-center pt-8 px-4">
      <form tw="flex flex-col p-6 rounded shadow w-full max-w-sm" onSubmit={handleSubmit(handleRegister)}>
        <TextInput
          name="correo"
          type="email"
          placeholder="Correo Electronico"
          tw="mb-4"
          autoComplete="email"
          ref={register}
        />
        <TextInput
          name="contrasena"
          type="password"
          placeholder="Contrasena"
          tw="mb-4"
          autoComplete="new-password"
          ref={register}
        />
        <TextInput
          name="contrasena2"
          type="password"
          placeholder="Repetir Contrasena"
          tw="mb-12"
          autoComplete="new-password"
          ref={register}
        />

        <input type="submit" value="Registrar" tw="bg-gray-700 text-white text-base p-4 rounded cursor-pointer" />
      </form>
    </div>
  );
};

export default Registro;
