import { IHotel } from './i-hotel';
import { MyPages } from "src/app/my-shared/interfaces-shared/my-pages";


export interface IResponsePageableHotel {

  _embedded: {hoteis: IHotel[]};
  _links: {
      self: { href: string ; };
      profile: { href: string ;};
      search: { href: string ; };
  };
  page: MyPages;
}

