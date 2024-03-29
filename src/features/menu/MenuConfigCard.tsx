import Card from "shared/components/Card";
import { FC, SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import PlusSvg from "../../assets/icons/plus.svg";
import { useClickOutside } from "shared/hooks";
import { globalContext } from "pages/_app";
import firebase from "firebase/app";
import { Articulo } from "./types";
import TextInput from "shared/components/TextInput";
import { useForm } from "react-hook-form";
import { useVendedores } from "features/firebase";
import ArticuloCartaConDescripcion from "./ArticuloCartaConDescripcion";

const MenuConfigCard = () => {
  const [categoria, setCategoria] = useState("todo");
  const [tipo, setTipo] = useState("comida");
  const [openCrearArticulo, setOpenCrearArticulo] = useState(false);
  const userUID = useContext(globalContext).state.user?.uid;

  const vendedores = useVendedores();
  let articulosFiltrados: [id: string, articulo: Articulo][] = [];

  if (vendedores && userUID) {
    articulosFiltrados = Object.entries(vendedores[userUID]?.menu?.articulos ?? {}).filter(([id, articulo]) => {
      return articulo.tipo === tipo && (articulo.categoria === categoria || categoria === "todo");
    });
  }

  return (
    <Card className="menu" tw="mb-4">
      <div tw="flex flex-col gap-2 py-2">
        <div tw="flex justify-between">
          <h1 tw="font-medium text-lg">Menú</h1>

          {categoria !== "todo" ? (
            <button tw="w-6" onClick={() => setOpenCrearArticulo(true)}>
              <PlusSvg />
            </button>
          ) : null}
        </div>

        <div tw="flex gap-2 justify-end">
          <TipoDropdown {...{ tipo, setTipo }} />
          <CategoriaDropdown {...{ categoria, setCategoria }} />
        </div>
      </div>

      <div className="card-body" tw="py-2 flex flex-col items-center space-y-4">
        {openCrearArticulo ? (
          <MenuArticuloCreator setOpenCrearArticulo={setOpenCrearArticulo} categoria={categoria} tipo={tipo} />
        ) : null}

        {articulosFiltrados.length > 0 ? (
          articulosFiltrados.map(([id, articulo]) => (
            <ArticuloCartaConDescripcion key={id} articulo={articulo} id={id} editable />
          ))
        ) : (
          <h2>No tienes artículos en tu menú</h2>
        )}
      </div>
    </Card>
  );
};

const MenuArticuloCreator: FC<{ tipo: string; categoria: string; setOpenCrearArticulo: Function }> = ({
  tipo,
  categoria,
  setOpenCrearArticulo,
}) => {
  const userUID = useContext(globalContext).state.user?.uid;

  const { register, handleSubmit, watch } = useForm<{
    titulo: string;
    descripcion: string;
    precio: number;
    moneda: string;
    categoria: string;
    imgFileList: FileList;
    tipo: Articulo["tipo"];
  }>();
  const handleArticleCreation = handleSubmit(
    ({ titulo, descripcion, precio, moneda, categoria, imgFileList, tipo }) => {
      if (!imgFileList?.[0]) return;

      const articleRef = firebase.database().ref(`/tiendas/${userUID}/menu/articulos`).push();

      const uploadTask = firebase
        .storage()
        .ref(`/imagenes/tiendas/${userUID}/menu/articulos/${articleRef.key}`)
        .put(imgFileList[0]);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, null, null, () =>
        uploadTask.snapshot.ref.getDownloadURL().then(imgUrl => {
          const nuevoArticulo: Articulo = {
            titulo,
            descripcion,
            precio: Number(precio),
            moneda,
            categoria: categoria.toLowerCase(),
            imgUrl,
            tipo,
          };

          articleRef.set(nuevoArticulo).then(() => setOpenCrearArticulo(false));
        }),
      );
    },
  );

  const previewImgFile = watch("imgFileList")?.[0];
  const previewImgUrl = previewImgFile !== undefined ? URL.createObjectURL(previewImgFile) : "";

  return (
    <form tw="space-y-3" onSubmit={handleArticleCreation}>
      <div tw="flex justify-between">
        <h2 tw="font-medium text-gray-700">Nuevo artículo</h2>

        <div tw="flex flex-col items-end">
          <span tw="text-gray-700">Tipo: {tipo.charAt(0).toUpperCase() + tipo.substring(1)}</span>
          <span tw="text-gray-700">Categoria: {categoria.charAt(0).toUpperCase() + categoria.substring(1)}</span>
        </div>
      </div>

      <div tw="flex flex-col space-y-2">
        <input type="text" readOnly value={tipo} tw="hidden" ref={register} name="tipo" />
        <input type="text" readOnly value={categoria} tw="hidden" ref={register} name="categoria" />
        <img src={previewImgUrl} tw="w-80 self-center" />
        <input
          id="img-input"
          ref={register}
          name="imgFileList"
          type="file"
          placeholder="Foto"
          tw="hidden"
          accept="image/*"
          required
        />

        <button
          tw="border border-blue-700 bg-blue-700 rounded p-1.5 text-sm text-white"
          onClick={e => {
            e.preventDefault();
            document.getElementById("img-input")?.click();
          }}
        >
          Elegir foto
        </button>

        <TextInput
          required
          ref={register}
          name="titulo"
          type="text"
          placeholder="Nombre del artículo"
          autoComplete="off"
        />
        <TextInput required ref={register} name="descripcion" as="textarea" placeholder="Descripcion del artículo" />

        <div tw="space-x-2">
          <TextInput
            required
            ref={register}
            name="precio"
            tw="w-32"
            type="number"
            placeholder="Precio"
            step={0.1}
            min={0.1}
          />
          <span tw="text-gray-700">Dólares</span>
          <select tw="hidden" required ref={register} name="moneda">
            <option value="dolares">Dolares</option>
            <option value="bolivares">Bolivares</option>
          </select>
        </div>
      </div>

      <div tw="space-x-2 flex justify-end">
        <input
          type="submit"
          value="Crear artículo"
          tw="border border-blue-700 bg-blue-700 rounded p-1.5 text-sm text-white"
        />

        <button
          tw="border border-gray-700 rounded p-1.5 text-sm text-gray-700"
          onClick={() => setOpenCrearArticulo(false)}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

const CategoriaDropdown: FC<{ categoria: string; setCategoria: Function }> = ({ categoria, setCategoria }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [categoriaList, setCategoriaList] = useState<string[]>([]);
  const userUID = useContext(globalContext).state.user?.uid;

  useEffect(() => {
    firebase
      .database()
      .ref(`/tiendas/${userUID}/menu/categorias`)
      .on("value", data => {
        setCategoriaList(data.val() ?? []);
      });
  }, []);

  useClickOutside(menuRef, () => {
    if (showMenu) setShowMenu(false);
  });

  const addCategoria = () => {
    firebase
      .database()
      .ref(`/tiendas/${userUID}/menu/categorias`)
      .set([...categoriaList, prompt("Nueva categoria")?.toLowerCase()]);
  };

  const eliminarCategoria = (e: SyntheticEvent) => {
    const categoria = e.currentTarget.getAttribute("data-categoria") as string;
    const indiceAEliminar = categoriaList.indexOf(categoria);
    const tempArr = [...categoriaList];
    tempArr.splice(indiceAEliminar, 1);

    setTimeout(() => firebase.database().ref(`/tiendas/${userUID}/menu/categorias`).set(tempArr), 1);
  };

  const selectCategoria = (e: SyntheticEvent) => {
    const categoria = e.currentTarget.getAttribute("data-categoria") as string;

    setCategoria(categoria);
  };

  return (
    <div tw="relative inline-block text-left" ref={menuRef}>
      <div>
        <button
          tw="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          onClick={() => setShowMenu(s => !s)}
        >
          Categoria: {categoria.charAt(0).toUpperCase() + categoria.substring(1)}
          <svg
            tw="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        css={[
          tw`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`,
          showMenu ? null : tw`hidden`,
        ]}
      >
        <button
          onClick={selectCategoria}
          data-categoria="todo"
          tw="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Todo
        </button>

        {categoriaList.map(categoria => (
          <div key={categoria} tw="w-full flex">
            <button
              onClick={selectCategoria}
              data-categoria={categoria}
              tw="flex-grow text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {categoria.charAt(0).toUpperCase() + categoria.substring(1)}
            </button>

            <button
              onClick={eliminarCategoria}
              data-categoria={categoria}
              tw="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              X
            </button>
          </div>
        ))}

        <button
          onClick={addCategoria}
          tw="w-full px-4 py-3 text-sm text-gray-700 bg-blue-200 hover:bg-blue-100 hover:text-gray-900"
        >
          Nueva categoria
        </button>
      </div>
    </div>
  );
};

const TipoDropdown: FC<{ tipo: string; setTipo: Function }> = ({ tipo, setTipo }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    if (showMenu) setShowMenu(false);
  });

  const selectTipo = (e: SyntheticEvent) => {
    const tipo = e.currentTarget.getAttribute("data-categoria") as string;

    setTipo(tipo);
  };

  return (
    <div tw="relative inline-block text-left z-10" ref={menuRef}>
      <div>
        <button
          tw="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          onClick={() => setShowMenu(s => !s)}
        >
          Tipo: {tipo.charAt(0).toUpperCase() + tipo.substring(1)}
          <svg
            tw="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        css={[
          tw`origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`,
          showMenu ? null : tw`hidden`,
        ]}
      >
        <button
          onClick={selectTipo}
          data-categoria="comida"
          tw="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Comida
        </button>

        <button
          onClick={selectTipo}
          data-categoria="medicina"
          tw="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Medicina
        </button>

        <button
          onClick={selectTipo}
          data-categoria="vestimenta"
          tw="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Vestimenta
        </button>

        <button
          onClick={selectTipo}
          data-categoria="tecnologia"
          tw="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Tecnologia
        </button>

        <button
          onClick={selectTipo}
          data-categoria="hogar"
          tw="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Hogar
        </button>

        <button
          onClick={selectTipo}
          data-categoria="herramienta"
          tw="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Herramienta
        </button>
      </div>
    </div>
  );
};

export default MenuConfigCard;
