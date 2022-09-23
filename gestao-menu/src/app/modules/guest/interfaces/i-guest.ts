import { IColaborador } from "../../admin/entidades/colaborador/interfaces/i-colaborador";
import { IDepartamento } from "../../admin/entidades/departamento/interfaces/i-departamento";
import { IExtensao } from "../../admin/entidades/extensao/interfaces/i-extensao";

export interface IGuest {
   /*Hotel related */
  id?: string,
  nome: string,
  numeroFixo: string,

  /*departamento related */
  departamentosModel: IDepartamento [],

  /*Extensao related*/
  extensaoModel: IExtensao [],

  /*colaborador related*/
  colaborador: IColaborador[],

  /*tipocolaborador related*/
  tipoColab: string,

  _links: {
    departamentosModel: { href: string ; };
  }
}
