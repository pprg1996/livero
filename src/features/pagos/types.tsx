export type MetodosDePago = {
  pm: { activo: boolean; cedula: number; telefono: string; codigoBanco: number };
  zelle: { titular: string; correo: string; activo: boolean };
  paypal: { correo: string; activo: boolean };
};
