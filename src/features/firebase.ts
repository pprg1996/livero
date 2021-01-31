import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/database";
import "firebase/storage";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDkznvRFE3D4oq41Yeos82CeINR9W60Ptg",
  authDomain: "livero-337cb.firebaseapp.com",
  projectId: "livero-337cb",
  storageBucket: "livero-337cb.appspot.com",
  messagingSenderId: "12328114091",
  appId: "1:12328114091:web:2f08b01fa9520c02fa64ee",
  measurementId: "G-BMY942BXHX",
  databaseUrl: "https://livero-337cb-default-rtdb.firebaseio.com/",
};

if (typeof window !== "undefined") firebase.initializeApp(firebaseConfig);

interface FirebaseImg {
  (uid: string | undefined, type: "profile" | "banner"): { imgUrl: string; actualizarImg: Function };
}

const useFirebaseTiendaImg: FirebaseImg = (uid, type) => {
  let placeholderUrl = "/profile-placeholder.jpg";
  switch (type) {
    case "banner":
      placeholderUrl = "/banner-placeholder.jpg";
      break;
  }

  const [imgUrl, setImgUrl] = useState(placeholderUrl);

  // Cargar foto la primera vez que carga la app
  useEffect(() => {
    if (!uid) return;

    const imgFolderRef = firebase.storage().ref(`imagenes/tiendas/${uid}/${type}`);
    imgFolderRef.listAll().then(data => {
      const imgRef = data.items[0];
      if (imgRef) imgRef.getDownloadURL().then(url => setImgUrl(url));
    });
  }, [uid]);

  // Actualiza la imagen y borra la anterior
  const actualizarImg = (imgFile: File) => {
    const imgFolderRef = firebase.storage().ref(`imagenes/tiendas/${uid}/${type}`);
    const uploadTask = imgFolderRef.child(`/${Date.now()}`).put(imgFile);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, {
      complete: function () {
        if (imgUrl !== placeholderUrl) {
          firebase
            .storage()
            .refFromURL(imgUrl)
            .delete()
            .then(() => uploadTask.snapshot.ref.getDownloadURL().then(url => setImgUrl(url)));
        } else uploadTask.snapshot.ref.getDownloadURL().then(url => setImgUrl(url));
      },
    });
  };

  return { imgUrl, actualizarImg };
};

const useFirebaseTiendaTitulo = (uid: string | undefined) => {
  const [titulo, setTitulo] = useState("Titulo");

  useEffect(() => {
    if (!uid) return;

    firebase
      .database()
      .ref(`/tiendas/${uid}/titulo`)
      .on("value", data => {
        setTitulo(data.val());
      });
  }, [uid]);

  const actualizarTitulo = (nuevoTitulo: string) => {
    firebase.database().ref(`/tiendas/${uid}/titulo`).set(nuevoTitulo);
  };

  return { titulo, actualizarTitulo };
};

export { useFirebaseTiendaImg, useFirebaseTiendaTitulo };
