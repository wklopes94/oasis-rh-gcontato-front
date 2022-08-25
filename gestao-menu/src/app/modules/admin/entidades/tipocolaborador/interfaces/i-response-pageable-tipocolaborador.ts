import { MyPages } from "src/app/my-shared/interfaces-shared/my-pages";
import { ITipocolaborador } from "./i-tipocolaborador";

export interface IResponsePageableTipocolaborador {
  _embedded: {tipocolaboradores: ITipocolaborador[]};
  _links: {
      self: { href: string ; };
      profile: { href: string ;};
      search: { href: string ; };
  };
  page: MyPages;
}
