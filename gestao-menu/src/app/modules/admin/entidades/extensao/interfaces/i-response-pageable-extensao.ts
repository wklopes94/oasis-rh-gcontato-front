import { IExtensao } from "./i-extensao";
import { MyPages } from "src/app/my-shared/interfaces-shared/my-pages";


export interface IResponsePageableExtensao {

  _embedded: {extensoes: IExtensao[]};
  _links: {
      self: { href: string ; };
      profile: { href: string ;};
      search: { href: string ; };
  };
  page: MyPages;
}
