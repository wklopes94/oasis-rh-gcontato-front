import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { IDepartamento } from './i-departamento';
export interface IResponsePageableDepartamento {
  _embedded: {departamentos: IDepartamento[]};
  _links: {
      self: { href: string ; };
      profile: { href: string ;};
      search: { href: string ; };
  };
  page: MyPages;
}
