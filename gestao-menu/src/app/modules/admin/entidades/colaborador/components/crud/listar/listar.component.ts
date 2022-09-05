import { CriaralterarComponent } from './../../../../tipocolaborador/components/crud/criaralterar/criaralterar.component';
import { HotelCrudService } from './../../../../hotel/services/hotel-crud.service';


import { ColaboradorCrudService } from './../../../services/colaborador-crud.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { IColaborador } from '../../../interfaces/i-colaborador';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApagarComponent } from '../apagar/apagar.component';
import { AlterarComponent } from '../alterar/alterar.component';
import { IDepartamento } from '../../../../departamento/interfaces/i-departamento';
import { IHotel } from '../../../../hotel/interfaces/i-hotel';
import { DepartamentoCrudService } from '../../../../departamento/services/departamento-crud.service';
import { IResponsePageableHotel } from '../../../../hotel/interfaces/i-response-pageable-hotel';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarComponent implements AfterViewInit {



  carregando: boolean = false;
  estado: string = 'a';



  //CRIAR FORMULARIO
  formPesquisa: FormGroup = this.formBuilder.group({
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
    private formBuilder: FormBuilder,
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
      .findByDepartamentoFk(this.formPesquisa?.value.departamento, pageIndex, pageSize, this.sort, this.direccaoOrdem)
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
      .findByDepartamentoFk(this.formPesquisa?.value.departamento, pageIndex, pageSize, this.sort, this.direccaoOrdem)
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

    return this.service
      .findByDepartamentoFkAndNomeColab(this.formPesquisa?.value.colaborador, this.formPesquisa?.value.departamento, pageIndex, pageSize, this.sort, this.direccaoOrdem)
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



alterarColaborador(){
  const dialogRef = this.dialog.open(AlterarComponent, {
      width: '30%'
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

criarColaborador(){
  const dialogRef = this.dialog.open(CriaralterarComponent, {
    width: '30%'
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

apagarColaborador(){
  const dialogRef = this.dialog.open(ApagarComponent, {
    width: '30%'
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

resetDep(): void{
  this.formPesquisa.get('departamento')?.reset();
}
resetColab(): void{
  this.formPesquisa.get('colaborador')?.reset();
}

}
