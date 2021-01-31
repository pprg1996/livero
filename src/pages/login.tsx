import Link from "next/link";
import "twin.macro";
import { useForm } from "react-hook-form";
import firebase from "firebase";
import { useRouter } from "next/router";
import TextInput from "shared/components/TextInput";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const handleLogin = ({ correo, contrasena }: { correo: string; contrasena: string }) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(correo, contrasena)
      .then(() => router.push("/rolselect"));
  };

  return (
    <div tw="flex justify-center pt-8 px-4">
      <form tw="flex flex-col p-6 rounded shadow w-full max-w-sm" onSubmit={handleSubmit(handleLogin)}>
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
          tw="mb-12"
          autoComplete="current-password"
          ref={register}
        />

        <div tw="flex justify-between items-end">
          <Link href="/registro" passHref>
            <a tw="font-medium text-base text-gray-700 underline mr-12">Crear Cuenta</a>
          </Link>
          <input type="submit" value="Iniciar sesion" tw="bg-gray-700 text-white text-base p-4 rounded" />
        </div>
      </form>
    </div>
  );
};

export default Login;
