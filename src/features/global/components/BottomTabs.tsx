import HomeSvg from "../../../assets/icons/home.svg";
import BookOpenSvg from "../../../assets/icons/book-open.svg";

const BottomTabs = () => {
  return (
    <div tw="border-t flex justify-between fixed bottom-0 left-1/2 transform -translate-x-1/2 z-10 bg-white w-full max-w-screen-sm">
      <a href="#" tw="w-full hocus:text-gray-500 justify-center inline-block text-center pt-2 pb-1">
        <HomeSvg tw="inline-block mb-1 w-7 h-7" />
      </a>
      <a href="#" tw="w-full hocus:text-gray-500 justify-center inline-block text-center pt-2 pb-1">
        <BookOpenSvg tw="inline-block mb-1 w-7 h-7" />
      </a>
    </div>
  );
};
export default BottomTabs;
