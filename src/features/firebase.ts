import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/database";
import "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { globalContext } from "pages/_app";
import { Operacion } from "./compradores/types";

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
    const imgFolderRef = firebase.storage().ref(`imagenes/tiendas/${uid}/${type}`);
    imgFolderRef.listAll().then(data => {
      const imgRef = data.items[0];
      if (imgRef) imgRef.getDownloadURL().then(url => setImgUrl(url));
    });
  }, []);

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
    firebase
      .database()
      .ref(`/tiendas/${uid}/titulo`)
      .on("value", data => {
        setTitulo(data.val());
      });
  }, []);

  const actualizarTitulo = (nuevoTitulo: string) => {
    firebase.database().ref(`/tiendas/${uid}/titulo`).set(nuevoTitulo);
  };

  return { titulo, actualizarTitulo };
};

const useOperaciones = (tipoUsuario: "tiendas" | "compradores" | "repartidores") => {
  const userUID = useContext(globalContext).user?.uid;
  const [operacionesIdRecord, setOperacionesIdRecord] = useState<Record<string, string>>({});
  const [operaciones, setOperaciones] = useState<Record<string, Operacion>>();

  useEffect(() => {
    firebase
      .database()
      .ref(`/${tipoUsuario}/${userUID}/operaciones`)
      .on("value", data => setOperacionesIdRecord(data.val()));
  }, []);

  useEffect(() => {
    let operacionesRefs: firebase.database.Reference[] = [];

    for (const operacionKey in operacionesIdRecord) {
      const onValue = (data: firebase.database.DataSnapshot): void => {
        const key = data.key as string;

        const newOperaciones: Record<string, Operacion> = {};
        newOperaciones[key] = data.val();

        setOperaciones(ops => {
          return { ...ops, ...newOperaciones };
        });
      };

      const operacionRef = firebase.database().ref(`/operaciones/${operacionesIdRecord[operacionKey]}`);
      operacionRef.on("value", onValue);

      operacionesRefs.push(operacionRef);
    }

    return () => {
      for (const operacionRef of operacionesRefs) {
        operacionRef.off();
      }
    };
  }, [operacionesIdRecord]);

  return operaciones;
};

export { useFirebaseTiendaImg, useFirebaseTiendaTitulo, useOperaciones };
