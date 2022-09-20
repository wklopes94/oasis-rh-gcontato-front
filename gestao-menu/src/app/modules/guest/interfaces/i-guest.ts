import { IColaborador } from "../../admin/entidades/colaborador/interfaces/i-colaborador";
import { IDepartamento } from "../../admin/entidades/departamento/interfaces/i-departamento";
import { IExtensao } from "../../admin/entidades/extensao/interfaces/i-extensao";

export interface IGuest {
   /*Hotel related */
  id?: string,
  nome: string,
  numeroFixo: string,

  /*departamento related */
  departamento: IDepartamento [];
  /*Extensao related*/
  extensao: IExtensao[];

  /*colaborador related*/
  colaborador: IColaborador[],
  telefoneColab: String,
  emailColab: String,

  /*tipocolaborador related*/
  tipoColab: string,

  _links: {
    departamentosModel: { href: string ; };
  }
}
