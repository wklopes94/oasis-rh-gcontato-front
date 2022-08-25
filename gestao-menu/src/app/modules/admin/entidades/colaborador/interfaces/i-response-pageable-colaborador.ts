import { IColaborador } from './i-colaborador';
import { MyPages } from "src/app/my-shared/interfaces-shared/my-pages";

export interface IResponsePageableColaborador {

  _embedded: {colaboradores: IColaborador[]};
  _links: {
      self: { href: string ; };
      profile: { href: string ;};
      search: { href: string ; };
  };
  page: MyPages;
}
