const TiendaCarta = () => {
  return (
    <div tw="p-4 shadow min-w-full">
      <div tw="aspect-w-7 aspect-h-3">
        <img src="banner0.jpg" tw="object-cover" />
      </div>

      <div tw="flex items-center justify-between px-4 -mt-6 mb-4">
        <div tw="w-16 rounded overflow-hidden ">
          <div tw="aspect-w-1 aspect-h-1">
            <img src="logo0.webp" tw="object-cover" />
          </div>
        </div>

        <h2 tw="mt-4 text-gray-700 font-medium">Ham & Donnut</h2>
      </div>

      <span tw="bg-gray-300 p-1 rounded mr-4">Comida</span>
      <span tw="bg-gray-300 p-1 rounded">1.3 Km</span>
    </div>
  );
};

export default TiendaCarta;
