export interface IExtensao {
  id?: String,
  numero: String;

  /*Hotel related*/
  departamento: String;

  /*Hotel related*/
  hotels: string;

  _links: {
    departamentoFk: { href: string ;};
    hotelFk: { href: string ;};
  };
}
