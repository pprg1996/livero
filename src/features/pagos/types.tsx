export type MetodosDePago = {
  pm: { activo: boolean; cedula: string; telefono: string; codigoBanco: string };
  zelle: { titular: string; correo: string; activo: boolean };
  paypal: { correo: string; activo: boolean };
};
