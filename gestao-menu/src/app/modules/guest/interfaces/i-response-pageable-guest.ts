
import { IGuest } from "./i-guest";
import { MyPages } from "src/app/my-shared/interfaces-shared/my-pages";


export interface IResponsePageableGuest {

  _embedded: {hoteis: IGuest[]};
  _links: {
      self: { href: string ; };
      profile: { href: string ;};
      search: { href: string ; };
  };
  page: MyPages;
}


