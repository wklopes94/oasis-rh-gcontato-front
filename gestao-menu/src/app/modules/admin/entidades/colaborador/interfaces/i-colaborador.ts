export interface IColaborador {
  id?: String,
  nomeColab: String,
  telefoneColab: String,
  emailColab: String,
  enderecoColab: String,
  numeroRh: String,
  tipoColabFk: String,
  departamentoFk: String

      /*tipocolaborador related*/
      tipoColab: string;

      /*Extensao related*/
      extensao: string;

      /*departamento related */
      nomeDep: string;

      /*Hotel related */
      nomeHotel: string;

  _links: {
    tipoColabFk: { href: string ; };
    extensaofk: { href: string ;};
    departamentoFk: { href: string ; };

  }

}
