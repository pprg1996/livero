import Card from "shared/components/Card";

const PagosConfigCard = () => {
  return (
    <Card tw="mb-4 py-2 space-y-4">
      <div>
        <h1 tw="font-medium text-lg">Pagos</h1>
        <h2>
          Las siguientes plataformas de pago electrónico pueden cobrar comisiones por las que ni Livero ni el comprador
          de tus productos se hará responsable
        </h2>
      </div>

      <div tw="flex flex-col space-y-2">
        <label tw="flex items-center flex-shrink-0 space-x-2">
          <input type="checkbox" />
          <h2>Pago móvil</h2>
        </label>

        <select tw="flex-grow">
          <option value="0001"> Banco Central de Venezuela (0001)</option>
          <option value="0003"> Banco Industrial de Venezuela (0003)</option>
          <option value="0102"> Banco de Venezuela (0102)</option>
          <option value="0104"> Venezolano de Crédito (0104)</option>
          <option value="0105"> Banco Mercantil (0105)</option>
          <option value="0108"> Banco Provincial (0108)</option>
          <option value="0114"> Bancaribe (0114)</option>
          <option value="0115"> Banco Exterior (0115)</option>
          <option value="0116"> Banco Occidental de Descuento (0116)</option>
          <option value="0128"> Banco Caroní (0128)</option>
          <option value="0134"> Banesco Banco Universal (0134)</option>
          <option value="0137"> Banco Sofitasa Banco Universal (0137)</option>
          <option value="0138"> Banco Plaza Banco Universal (0138)</option>
          <option value="0146"> Banco de la Gente Emprendedora (0146)</option>
          <option value="0149"> Banco del Pueblo Soberano (0149)</option>
          <option value="0151"> BFC Banco Fondo Común (0151)</option>
          <option value="0156"> 100% Banco (0156)</option>
          <option value="0157"> DelSur Banco Universal (0157)</option>
          <option value="0163"> Banco del Tesoro (0163)</option>
          <option value="0166"> Banco Agrícola de Venezuela (0166)</option>
          <option value="0168"> Bancrecer (0168)</option>
          <option value="0169"> Mi Banco Banco Microfinanciero (0169)</option>
          <option value="0171"> Banco Activo (0171)</option>
          <option value="0172"> Bancamiga Banco Microfinanciero (0172)</option>
          <option value="0173"> Banco Internacional de Desarrollo (0173)</option>
          <option value="0174"> Banplus Banco Universal (0174)</option>
          <option value="0175"> Banco Bicentenario Banco Universal (0175)</option>
          <option value="0176"> Banco Espirito Santo (0176)</option>
          <option value="0177"> Banco de la Fuerza Armada Nacional Bolivariana (0177)</option>
          <option value="0190"> Citibank N.A. (0190)</option>
          <option value="0191"> Banco Nacional de Crédito (0191)</option>
          <option value="0601"> Instituto Municipal de Crédito Popular (0601)</option>
        </select>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>Cédula</h2>
          <input type="number" tw="border rounded" />
        </label>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>Teléfono</h2>
          <input type="tel" tw="border rounded" />
        </label>
      </div>

      <div tw="flex flex-col space-y-2">
        <label tw="flex items-center flex-shrink-0 space-x-2">
          <input type="checkbox" />
          <h2>Zelle</h2>
        </label>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>A nombre de</h2>
          <input type="text" tw="border rounded" />
        </label>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>Correo</h2>
          <input type="email" tw="border rounded" />
        </label>
      </div>

      <div tw="flex flex-col space-y-2">
        <label tw="flex items-center flex-shrink-0 space-x-2">
          <input type="checkbox" />
          <h2>Paypal</h2>
        </label>

        <label tw="flex items-center flex-shrink-0 space-x-2 justify-between">
          <h2>Correo</h2>
          <input type="email" tw="border rounded" />
        </label>
      </div>
    </Card>
  );
};

export default PagosConfigCard;
