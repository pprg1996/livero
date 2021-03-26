import HomeSvg from "../../../assets/icons/home.svg";
import BookOpenSvg from "../../../assets/icons/book-open.svg";
import { useRouter } from "next/router";
import Link from "next/link";
import { Actions, globalContext } from "pages/_app";
import { useContext } from "react";
import tw from "twin.macro";

const BottomTabs = () => {
  const router = useRouter();
  const dispatch = useContext(globalContext).dispatch;

  let homeHref = "/comprar";
  let chatHref = "/chatcomprador";
  switch (router.pathname) {
    case "/vender":
    case "/chatvendedor":
      homeHref = "/vender";
      chatHref = "/chatvendedor";
      break;
    case "/repartir":
    case "/chatrepartidor":
      homeHref = "/repartir";
      chatHref = "/chatrepartidor";

    default:
      break;
  }

  return (
    <div tw="border-t flex justify-between bg-white">
      <Link href={homeHref} passHref>
        <a
          tw="w-full hocus:text-gray-500 justify-center inline-block text-center pt-2 pb-1"
          css={[router.pathname === homeHref ? tw`border-b-4 border-gray-700` : null]}
        >
          <HomeSvg tw="inline-block mb-1 w-7 h-7" />
        </a>
      </Link>

      <Link href={chatHref} passHref>
        <a
          onClick={() => dispatch({ type: Actions.SET_OPERACION_CHAT_ID, payload: undefined })}
          tw="w-full hocus:text-gray-500 justify-center inline-block text-center pt-2 pb-1"
          css={[router.pathname === chatHref ? tw`border-b-4 border-gray-700` : null]}
        >
          <BookOpenSvg tw="inline-block mb-1 w-7 h-7" />
        </a>
      </Link>
    </div>
  );
};
export default BottomTabs;
