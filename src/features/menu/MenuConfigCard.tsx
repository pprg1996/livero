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

const MenuConfigCard = () => {
  const [categoria, setCategoria] = useState("ninguna");
  const [articulosList, setArticulosList] = useState<Articulo[]>([]);
  const [openCrearArticulo, setOpenCrearArticulo] = useState(false);

  return (
    <Card className="menu" tw="mb-4">
      <div tw="flex justify-between py-2">
        <h1 tw="font-medium text-lg">Menu</h1>

        <div tw="flex items-center">
          <CategoriaDropdown {...{ categoria, setCategoria }} />

          <button tw="w-6 ml-4" onClick={() => setOpenCrearArticulo(true)}>
            <PlusSvg />
          </button>
        </div>
      </div>

      <div className="card-body" tw="py-2">
        {openCrearArticulo ? (
          <MenuArticuloCreator setOpenCrearArticulo={setOpenCrearArticulo} categoria={categoria} />
        ) : (
          <h2>No tienes articulos en tu menu</h2>
        )}
      </div>
    </Card>
  );
};

const MenuArticuloCreator: FC<{ categoria: string; setOpenCrearArticulo: Function }> = ({
  categoria,
  setOpenCrearArticulo,
}) => {
  const { register, handleSubmit, watch } = useForm<{
    titulo: string;
    descripcion: string;
    precio: number;
    moneda: string;
    categoria: string;
    imgInput: FileList;
  }>();
  const handleArticleCreation = handleSubmit(({ titulo, descripcion, precio, moneda, categoria, imgInput }) => {});

  const previewImgFile = watch("imgInput")?.[0];
  const previewImgUrl = previewImgFile !== undefined ? URL.createObjectURL(watch("imgInput")?.[0]) : "";

  return (
    <form tw="space-y-3" onSubmit={handleArticleCreation}>
      <div tw="flex justify-between">
        <h2 tw="font-medium text-gray-700">Nuevo articulo</h2>
        <span tw="text-gray-700">Categoria: {categoria.charAt(0).toUpperCase() + categoria.substring(1)}</span>
      </div>

      <div tw="flex flex-col space-y-2">
        <input type="text" readOnly value={categoria} tw="hidden" name="categoria" />
        <img src={previewImgUrl} tw="w-80 m-0 self-center" />
        <input
          id="img-input"
          ref={register}
          name="imgInput"
          type="file"
          placeholder="Foto"
          tw="hidden"
          accept="image/*"
        />

        <button
          tw="border border-blue-700 bg-blue-700 rounded p-1.5 text-sm text-white"
          onClick={() => document.getElementById("img-input")?.click()}
        >
          Elegir foto
        </button>

        <TextInput ref={register} name="titulo" type="text" placeholder="Nombre del articulo" />
        <TextInput ref={register} name="descripcion" as="textarea" placeholder="Descripcion del articulo" />

        <div tw="space-x-2">
          <TextInput ref={register} name="precio" tw="w-32" type="number" placeholder="Precio" />
          <select ref={register} name="moneda">
            <option value="dolares">Dolares</option>
            <option value="bolivares">Bolivares</option>
          </select>
        </div>
      </div>

      <div tw="space-x-2 flex justify-end">
        <input
          type="submit"
          value="Crear articulo"
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
  const userUID = useContext(globalContext).user?.uid;

  useEffect(() => {
    if (!userUID) return;

    firebase
      .database()
      .ref(`/tiendas/${userUID}/menu/categorias`)
      .on("value", data => {
        setCategoriaList(data.val() ?? []);
      });
  }, [userUID]);

  useClickOutside(menuRef, () => {
    if (showMenu) setShowMenu(false);
  });

  const addCategoria = () => {
    firebase
      .database()
      .ref(`/tiendas/${userUID}/menu/categorias`)
      .set([...categoriaList, prompt("Nueva categoria")]);
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
          data-categoria="ninguna"
          tw="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Ninguna
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

export default MenuConfigCard;
