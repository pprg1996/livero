import ShoppingCartSvg from "../assets/icons/shopping-cart.svg";
import StandSvg from "../assets/icons/stand.svg";
import DeliveryManSvg from "../assets/icons/delivery-man.svg";
import tw from "twin.macro";
import Link from "next/link";

const RolLink = tw.a`bg-gray-700 flex flex-col justify-between items-center rounded px-5 py-4 mx-2 w-24 h-24`;
const RolTitle = tw.h1`text-white`;

const RolSelect = () => {
  return (
    <div tw="flex justify-center pt-20">
      <Link href="/comprar" passHref>
        <RolLink>
          <ShoppingCartSvg tw="text-white fill-current" />
          <RolTitle>Comprar</RolTitle>
        </RolLink>
      </Link>

      <Link href="/vender" passHref>
        <RolLink>
          <StandSvg />
          <RolTitle>Vender</RolTitle>
        </RolLink>
      </Link>

      <Link href="/repartir" passHref>
        <RolLink>
          <DeliveryManSvg />
          <RolTitle>Repartir</RolTitle>
        </RolLink>
      </Link>
    </div>
  );
};

export default RolSelect;
