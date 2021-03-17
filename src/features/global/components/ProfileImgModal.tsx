import { useFirebaseTiendaImg } from "features/firebase";
import { globalContext } from "pages/_app";
import { FC, MouseEventHandler, SyntheticEvent, useContext } from "react";
import ReactDOM from "react-dom";
import { triggerInputClick } from "shared/utils";

const ProfileImgModal: FC<{ pathname: string; setShowProfileImgModal: Function }> = ({
  pathname,
  setShowProfileImgModal,
}) => {
  const userUID = useContext(globalContext).state.user?.uid;
  const tipo = pathname === "/comprar" ? "compradores" : "repartidores";
  const { imgUrl, actualizarImg } = useFirebaseTiendaImg(userUID, "profile", tipo);

  const handleProfileImgChange = (e: SyntheticEvent) => {
    const profileImg = (e.currentTarget as HTMLInputElement).files?.[0];

    if (profileImg) {
      actualizarImg(profileImg);
    }
  };

  const cerrarModal: MouseEventHandler<HTMLDivElement> = e => {
    if (e.currentTarget === e.target) setShowProfileImgModal(false);
  };

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      onClick={cerrarModal}
      tw="absolute top-1/2 left-1/2 transform[translate(-50%, -50%)] bg-gray-200 w-full h-full bg-opacity-30 flex items-center justify-center"
    >
      <div tw="bg-white shadow rounded p-4 flex flex-col items-center space-y-2">
        <img src={imgUrl} tw="w-64 h-64 object-contain" />

        <input tw="hidden" accept="image/*" type="file" id="profile-img-input" onChange={handleProfileImgChange} />

        <button onClick={() => triggerInputClick("profile-img-input")} tw="bg-blue-700 rounded p-2 text-xs text-white">
          Cambiar foto de perfil
        </button>
      </div>
    </div>,
    document.getElementById("overlay") as HTMLDivElement,
  );
};

export default ProfileImgModal;
