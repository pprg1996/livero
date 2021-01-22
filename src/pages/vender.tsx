import { SyntheticEvent, useContext } from "react";
import Image from "next/image";
import "twin.macro";
import { globalContext } from "pages/_app";
import { useFirebaseTiendaImg, useFirebaseTiendaTitulo } from "features/firebase";
import EditSvg from "../assets/icons/edit.svg";
import HorariosConfigCard from "features/horarios/HorariosConfigCard";

const triggerInputClick = (id: string) => {
  document.getElementById(id)?.click();
};

const Vender = () => {
  const userUID = useContext(globalContext).user?.uid;
  const { imgUrl: bannerImgUrl, actualizarImg: actualizarBannerImg } = useFirebaseTiendaImg(userUID, "banner");
  const { imgUrl: profileImgUrl, actualizarImg: actualizarProfileImg } = useFirebaseTiendaImg(userUID, "profile");
  const { titulo, actualizarTitulo } = useFirebaseTiendaTitulo(userUID);

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

  return (
    <div tw="flex flex-col">
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

      <div className="titulo" tw="-mt-10 ml-32 flex items-center">
        <h1 tw="font-medium text-lg">{titulo}</h1>
        <button tw="ml-2" onClick={cambiarTitulo}>
          <EditSvg tw="w-4" />
        </button>
      </div>

      <HorariosConfigCard />
    </div>
  );
};

export default Vender;
