import { FC, SyntheticEvent, useContext, useEffect, useState } from "react";
import Image from "next/image";
import "twin.macro";
import firebase from "firebase/app";
import { globalContext } from "./_app";

const bannerPlaceholderUrl = "/banner-placeholder.jpg";

interface TiendaProps {
  serverBannerPicUrl: string;
  titulo: string;
}

const cambiarFoto = () => {
  document.getElementById("banner-input")?.click();
};

const Vender = () => {
  const [bannerPicUrl, setBannerPicUrl] = useState(bannerPlaceholderUrl);
  const userUID = useContext(globalContext).user?.uid;

  // Cargar foto de banner la primera vez que carga la app
  useEffect(() => {
    const bannerPicFolderRef = firebase.storage().ref(`imagenes/tiendas/${userUID}/bannerPic`);
    bannerPicFolderRef.listAll().then(data => {
      const bannerPicRef = data.items[0];
      if (bannerPicRef) bannerPicRef.getDownloadURL().then(url => setBannerPicUrl(url));
    });
  }, [userUID]);

  // Subir foto de banner cuando hay un cambio en el archivo seleccionado
  const handleFileChange = (e: SyntheticEvent) => {
    const bannerPic = (e.currentTarget as HTMLInputElement).files?.[0];

    if (bannerPic) {
      const bannerPicFolderRef = firebase.storage().ref(`imagenes/tiendas/${userUID}/bannerPic`);
      const uploadTask = bannerPicFolderRef.child(`/${Date.now()}`).put(bannerPic);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, {
        complete: function () {
          if (bannerPicUrl !== bannerPlaceholderUrl) {
            console.log(bannerPicUrl);
            firebase
              .storage()
              .refFromURL(bannerPicUrl)
              .delete()
              .then(() => uploadTask.snapshot.ref.getDownloadURL().then(url => setBannerPicUrl(url)));
          } else uploadTask.snapshot.ref.getDownloadURL().then(url => setBannerPicUrl(url));
        },
      });
    }
  };

  return (
    <div tw="flex flex-col items-center">
      <div tw="flex bg-gray-500 relative">
        <Image src={bannerPicUrl} width={640} height={274} objectFit="contain" />
        <button onClick={cambiarFoto} tw="absolute right-4 bottom-4 bg-blue-700 p-1.5 rounded text-white text-sm">
          Cambiar foto
        </button>
        <input onChange={handleFileChange} type="file" tw="hidden" id="banner-input" accept="image/*" />
      </div>
    </div>
  );
};

export default Vender;
