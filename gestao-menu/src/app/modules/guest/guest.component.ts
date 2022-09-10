import { IColaborador } from './../admin/entidades/colaborador/interfaces/i-colaborador';
import { IHotel } from './../admin/entidades/hotel/interfaces/i-hotel';
import { DepartamentoCrudService } from './../admin/entidades/departamento/services/departamento-crud.service';
import { HotelCrudService } from './../admin/entidades/hotel/services/hotel-crud.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IReqColaborador } from '../admin/entidades/colaborador/interfaces/i-req-colaborador';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ColaboradorCrudService } from '../admin/entidades/colaborador/services/colaborador-crud.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IDepartamento } from '../admin/entidades/departamento/interfaces/i-departamento';
import { MatDialog } from '@angular/material/dialog';
import { IResponsePageableHotel } from '../admin/entidades/hotel/interfaces/i-response-pageable-hotel';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements AfterViewInit {
  carregando: boolean = false;
  estado: string = 'a';



  //CRIAR FORMULARIO
  formPesquisa: FormGroup = this.FormBuilder.group({
    hotel: [null],
    departamento: [null],
    colaborador: [null]
  });

  //Pequisa Colaboradores All
  resultado: any = [];
  dataSourceSelectColaborador: IColaborador[] = [];
  dataSourceSelectDepartamento: IDepartamento[] = [];
  dataSourceSelectHotel: IHotel[] = [];
  dataSource: IColaborador[] = [];

  //PAGINAÇÃO
  mypages?: MyPages;

  totalElements: number = 0;
  sizeInicial: number = 3;
  sort: string = 'tipoColaborador';
  direccaoOrdem: string = 'asc';

  pageSizeOptions: number[] = [1, 3, 6, 10];

  //PAGE_EVENT
  pageEvent?: PageEvent;

  //SORT_EVENT
  sortEvent?: Sort;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  displayedColumns: string[] = [
    'nomeColab',
    'telefoneColab',
    'emailColab',
    'enderecoColab',
    'numeroRh',
    'tipoColab',
    'departamento',
    'hotel',
    'acao',
  ];
  //dataSource = new MatTableDataSource<IColaborador>(this.colaboradores);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor( private service: ColaboradorCrudService,
    private router: Router,
    private FormBuilder: FormBuilder,
    private dialog : MatDialog,
    private serviceHotel: HotelCrudService,
    private serviceDepartamento: DepartamentoCrudService) {

  }


  ngAfterViewInit() {
    this.carregarColaboradores();
    this.carregarHotelSelect();
  }

  carregarSelectDepartamentoEDatasorce(){
    this.carregarDepartamentoSelect();
    this.resetColab();
    this.findByHotelFk();
  }

  carregarSelectColaboradorEDatasorce(){
    this.findByDepartamentoFkForDtasource();
    this.findByDepartamentoFkForSelect();
  }

  carregarColaboradores() {

    this.resetDep();
    this.resetColab();

    this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nomeColab';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.service
      .findAl(pageIndex, pageSize, this.sort, this.direccaoOrdem)
      .subscribe((data: {}) => {
        this.resultado = data;
        //this.colaboradoreSearch = this.resultado._embedded.colaboradores;
        this.dataSource = this.resultado._embedded.colaboradores;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

        this.dataSource.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.tipoColabFk.href)
            .subscribe((tipoColab: {}) => {
              let tipoColabo = JSON.stringify(tipoColab);

              elem.tipoColab = JSON.parse(tipoColabo).tipoColaborador;

              return this.service
                .getDataByURLS(elem._links.departamentoFk.href)
                .subscribe((depart: {}) => {
                  let departamentoColab = JSON.stringify(depart);
                  elem.nomeDep = JSON.parse(departamentoColab).nome;

                  return this.service
                    .getDataByURL(
                      JSON.parse(departamentoColab)._links.hotelFk.href
                    )
                    .subscribe((hotel: {}) => {
                      let hotelColab = JSON.stringify(hotel);
                      elem.nomeHotel = JSON.parse(hotelColab).nome;
                    });
                });
            });
        });
      });
  }

  carregarDepartamentoSelect() {

    //this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : 1000;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';



    return this.serviceDepartamento
      .findByHotelFk(pageIndex, pageSize, this.sort, this.direccaoOrdem, this.formPesquisa?.value.hotel)
      .subscribe((data: {}) => {
        this.resultado = data;
        this.dataSourceSelectDepartamento = this.resultado._embedded.departamentos;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSourceSelectDepartamento);


      });

  }

  carregarHotelSelect() {

    //this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : 1000;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    this.estado = 'a';

    return this.serviceHotel
      .findByAtivo(pageIndex, pageSize, this.sort, this.direccaoOrdem, this.estado)
      .subscribe((data: IResponsePageableHotel) => {
        console.log('Data Hotel: ', data);

        this.resultado = data;
        this.dataSourceSelectHotel = this.resultado._embedded.hotels;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        console.log('Foi lido os seguintes dados, item: ', this.dataSourceSelectHotel);
      });
  }

  findByHotelFk() {

    this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nomeColab';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.service
      .findByHotelFk(pageIndex, pageSize, this.sort, this.direccaoOrdem, this.formPesquisa?.value.hotel)
      .subscribe((data: {}) => {
        this.resultado = data;
        //this.colaboradoreSearch = this.resultado._embedded.colaboradores;
        this.dataSource = this.resultado._embedded.colaboradores;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

        this.dataSource.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.tipoColabFk.href)
            .subscribe((tipoColab: {}) => {
              let tipoColabo = JSON.stringify(tipoColab);

              elem.tipoColab = JSON.parse(tipoColabo).tipoColaborador;

              return this.service
                .getDataByURLS(elem._links.departamentoFk.href)
                .subscribe((depart: {}) => {
                  let departamentoColab = JSON.stringify(depart);
                  elem.nomeDep = JSON.parse(departamentoColab).nome;

                  return this.service
                    .getDataByURL(
                      JSON.parse(departamentoColab)._links.hotelFk.href
                    )
                    .subscribe((hotel: {}) => {
                      let hotelColab = JSON.stringify(hotel);
                      elem.nomeHotel = JSON.parse(hotelColab).nome;
                    });
                });
            });
        });
      });
  }

  findByDepartamentoFkForDtasource() {

    this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nomeColab';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.service
      .findByDepartamentoFkHotelFkNomeAndDepartamentoFkNome(this.formPesquisa?.value.hotel,
        this.formPesquisa?.value.departamento,
        pageIndex,
        pageSize,
        this.sort,
        this.direccaoOrdem)
      .subscribe((data: {}) => {
        this.resultado = data;
        //this.colaboradoreSearch = this.resultado._embedded.colaboradores;
        this.dataSource = this.resultado._embedded.colaboradores;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

        this.dataSource.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.tipoColabFk.href)
            .subscribe((tipoColab: {}) => {
              let tipoColabo = JSON.stringify(tipoColab);

              elem.tipoColab = JSON.parse(tipoColabo).tipoColaborador;

              return this.service
                .getDataByURLS(elem._links.departamentoFk.href)
                .subscribe((depart: {}) => {
                  let departamentoColab = JSON.stringify(depart);
                  elem.nomeDep = JSON.parse(departamentoColab).nome;

                  return this.service
                    .getDataByURL(
                      JSON.parse(departamentoColab)._links.hotelFk.href
                    )
                    .subscribe((hotel: {}) => {
                      let hotelColab = JSON.stringify(hotel);
                      elem.nomeHotel = JSON.parse(hotelColab).nome;
                    });
                });
            });
        });
      });
  }

  findByDepartamentoFkForSelect() {

    this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : 1000;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nomeColab';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.service
      .findByDepartamentoFkHotelFkNomeAndDepartamentoFkNome(this.formPesquisa?.value.hotel, this.formPesquisa?.value.departamento, pageIndex, pageSize, this.sort, this.direccaoOrdem)
      .subscribe((data: {}) => {
        this.resultado = data;
        this.dataSourceSelectColaborador = this.resultado._embedded.colaboradores;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

      });
  }

  findByDepartamentoAndNomeColaboradore() {

    this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nomeColab';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    console.log('Colaborador: ', this.formPesquisa?.value.colaborador);
    console.log('Departamento: ', this.formPesquisa?.value.departamento);

    return this.service
      .findByDepartamentoFkHotelFkNomeAndDepartamentoFkNomeAndNomeColab(this.formPesquisa?.value.hotel, this.formPesquisa?.value.departamento, this.formPesquisa?.value.colaborador, pageIndex, pageSize, this.sort, this.direccaoOrdem)
      .subscribe((data: {}) => {
        this.resultado = data;
        //this.colaboradoreSearch = this.resultado._embedded.colaboradores;
        this.dataSource = this.resultado._embedded.colaboradores;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

        this.dataSource.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.tipoColabFk.href)
            .subscribe((tipoColab: {}) => {
              let tipoColabo = JSON.stringify(tipoColab);

              elem.tipoColab = JSON.parse(tipoColabo).tipoColaborador;

              return this.service
                .getDataByURLS(elem._links.departamentoFk.href)
                .subscribe((depart: {}) => {
                  let departamentoColab = JSON.stringify(depart);
                  elem.nomeDep = JSON.parse(departamentoColab).nome;

                  return this.service
                    .getDataByURL(
                      JSON.parse(departamentoColab)._links.hotelFk.href
                    )
                    .subscribe((hotel: {}) => {
                      let hotelColab = JSON.stringify(hotel);
                      elem.nomeHotel = JSON.parse(hotelColab).nome;
                    });
                });
            });
        });
      });
  }

  resetDep(): void{
    this.formPesquisa.get('departamento')?.reset();
  }
  resetColab(): void{
    this.formPesquisa.get('colaborador')?.reset();
  }

}


