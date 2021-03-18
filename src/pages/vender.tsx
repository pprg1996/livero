import { SyntheticEvent, useContext, useEffect, useState } from "react";
import Image from "next/image";
import tw from "twin.macro";
import { globalContext } from "pages/_app";
import { useFirebaseImg, useFirebaseTiendaTitulo } from "features/firebase";
import EditSvg from "../assets/icons/edit.svg";
import HorariosConfigCard from "features/horario/HorariosConfigCard";
import MenuConfigCard from "features/menu/MenuConfigCard";
import UbicacionConfigCard from "features/ubicacion/UbicacionConfigCard";
import firebase from "firebase/app";
import SwitchToggle from "shared/components/SwitchToggle";
import { useOperacionesPersonales } from "features/firebase";
import { triggerInputClick } from "shared/utils";

const Vender = () => {
  const userUID = useContext(globalContext).state.user?.uid;
  const { imgUrl: bannerImgUrl, actualizarImg: actualizarBannerImg } = useFirebaseImg(userUID, "banner");
  const { imgUrl: profileImgUrl, actualizarImg: actualizarProfileImg } = useFirebaseImg(userUID, "profile");
  const { titulo, actualizarTitulo } = useFirebaseTiendaTitulo(userUID);
  const [tiendaActivada, setTiendaActivada] = useState();
  const operaciones = useOperacionesPersonales("tiendas");

  // Subir foto de banner cuando hay un cambio en el archivo seleccionado
  const handleBannerImgChange = (e: SyntheticEvent) => {
    const bannerImg = (e.currentTarget as HTMLInputElement).files?.[0];

    if (bannerImg) {
      actualizarBannerImg(bannerImg);
    }
  };

  const handleProfileImgChange = (e: SyntheticEvent) => {
    const profileImg = (e.currentTarget as HTMLInputElement).files?.[0];

    if (profileImg) {
      actualizarProfileImg(profileImg);
    }
  };

  const cambiarTitulo = () => {
    actualizarTitulo(prompt("Ingrese el titulo nuevo") ?? "");
  };

  useEffect(() => {
    const tiendaActivadaRef = firebase.database().ref(`/tiendas/${userUID}/activo`);

    if (tiendaActivada === undefined) {
      tiendaActivadaRef.on("value", data => setTiendaActivada(data.val()));
      return;
    }

    tiendaActivadaRef.set(tiendaActivada);
  }, [tiendaActivada]);

  return (
    <div tw="flex flex-col pb-2">
      <div className="banner-img" tw="flex bg-gray-500 relative">
        <Image src={bannerImgUrl} width={640} height={274} objectFit="contain" />
        <button
          onClick={() => triggerInputClick("banner-img-input")}
          tw="absolute right-4 bottom-4 bg-blue-700 p-1.5 rounded text-white text-sm"
        >
          Cambiar foto
        </button>
        <input id="banner-img-input" onChange={handleBannerImgChange} type="file" tw="hidden" accept="image/*" />
      </div>

      <div className="profile-img" tw="flex flex-col -mt-14 ml-8 self-start">
        <Image src={profileImgUrl} width={82} height={82} objectFit="contain" tw="rounded" />
        <button
          onClick={() => triggerInputClick("profile-img-input")}
          tw="bottom-4 bg-blue-700 p-1.5 pt-3 rounded text-white text-xs -mt-2"
        >
          Cambiar foto
        </button>
        <input id="profile-img-input" onChange={handleProfileImgChange} type="file" tw="hidden" accept="image/*" />
      </div>

      <div className="titulo" tw="-mt-10 mb-8 ml-32 flex items-center">
        <h1 tw="font-medium text-lg">{titulo}</h1>
        <button tw="ml-2" onClick={cambiarTitulo}>
          <EditSvg tw="w-4" />
        </button>
      </div>

      <SwitchToggle
        checked={tiendaActivada ?? true}
        setChecked={setTiendaActivada}
        label={tiendaActivada ? "Tienda activada" : "Tienda desactivada"}
        wrapperTW={tw`self-center mb-2`}
      />

      {tiendaActivada ? (
        <>
          <UbicacionConfigCard />

          <MenuConfigCard />

          <HorariosConfigCard />
        </>
      ) : (
        <h1 tw="text-xl text-center px-2">Activa tu tienda para configurarla y empezar a vender!</h1>
      )}
    </div>
  );
};

export default Vender;
