import styled from "styled-components";
import tw from "twin.macro";
import firebase from "firebase/app";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Horario } from "features/horarios/types";

const Input = styled.input`
  ${tw`border p-2 rounded`}

  ::placeholder {
    ${tw`font-sans text-gray-600 text-xs`}
  }
`;

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

    const horario: Horario = {
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

    firebase
      .database()
      .ref(`tiendas/${userCredential.user?.uid}`)
      .set({ titulo: "Titulo", menu: false, horario, profilePicUrl: false, bannerPicUrl: false, activo: false });

    router.push("/rolselect");
  };

  return (
    <div tw="flex justify-center pt-8 px-4">
      <form tw="flex flex-col p-6 rounded shadow w-full max-w-sm" onSubmit={handleSubmit(handleRegister)}>
        <Input
          name="correo"
          type="email"
          placeholder="Correo Electronico"
          tw="mb-4"
          autoComplete="email"
          ref={register}
        />
        <Input
          name="contrasena"
          type="password"
          placeholder="Contrasena"
          tw="mb-4"
          autoComplete="new-password"
          ref={register}
        />
        <Input
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
