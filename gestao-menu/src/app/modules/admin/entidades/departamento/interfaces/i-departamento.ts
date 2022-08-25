export interface IDepartamento {
  id?: String;
  nome: String;

  /*Hotel related*/
  hotelFk: string;

  _links: {
    hotelFk: { href: string ;};
  };
}


