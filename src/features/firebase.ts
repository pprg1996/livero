import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/database";
import "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { globalContext } from "pages/_app";
import { Comprador, Mensaje, Operacion } from "./compradores/types";
import { Ubicacion } from "./ubicacion/types";
import { Tienda } from "./tienda/types";
import { Repartidor } from "./repartidores/types";

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

export const useFirebaseTiendaImg: FirebaseImg = (uid, type) => {
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

export const useFirebaseTiendaTitulo = (uid: string | undefined) => {
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

export const useOperacionesPersonales = (tipoUsuario: "tiendas" | "compradores" | "repartidores") => {
  const userUID = useContext(globalContext).state.user?.uid;
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

export const useOperaciones = () => {
  const [operacionesRecord, setOperacionesRecord] = useState<Record<string, Operacion>>();

  useEffect(() => {
    firebase
      .database()
      .ref(`/operaciones`)
      .on("value", data => setOperacionesRecord(data.val()));
  }, []);

  return operacionesRecord;
};

export const useUpdateUbicacion = (tipo: "tiendas" | "compradores" | "repartidores") => {
  const userUID = useContext(globalContext).state.user?.uid;

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const ubicacion: Ubicacion = { longitud: pos.coords.longitude, latitud: pos.coords.latitude };
        firebase.database().ref(`${tipo}/${userUID}/ubicacion`).set(ubicacion);
      },
      undefined,
      { enableHighAccuracy: true },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
};

export const mandarMensaje = (mensaje: Mensaje, operacionId: string) => {
  firebase.database().ref(`/operaciones/${operacionId}/mensajes`).push(mensaje);
};

export const useCompradores = () => {
  const [compradores, setCompradores] = useState<Record<string, Comprador>>();

  useEffect(() => {
    const compradoresRef = firebase.database().ref("/compradores");

    compradoresRef.on("value", data => {
      if (!data.exists()) return;

      setCompradores(data.val());
    });

    return () => {
      compradoresRef.off();
    };
  }, []);

  return compradores;
};

export const useVendedores = () => {
  const [vendedores, setVendedores] = useState<Record<string, Tienda>>();

  useEffect(() => {
    const vendedoresRef = firebase.database().ref("/tiendas");

    vendedoresRef.on("value", data => {
      if (!data.exists()) return;

      setVendedores(data.val());
    });

    return () => {
      vendedoresRef.off();
    };
  }, []);

  return vendedores;
};

export const useRepartidores = () => {
  const [repartidores, setRepartidores] = useState<Record<string, Repartidor>>();

  useEffect(() => {
    const repartidoresRef = firebase.database().ref("/repartidores");

    repartidoresRef.on("value", data => {
      if (!data.exists()) return;

      setRepartidores(data.val());
    });

    return () => {
      repartidoresRef.off();
    };
  }, []);

  return repartidores;
};
