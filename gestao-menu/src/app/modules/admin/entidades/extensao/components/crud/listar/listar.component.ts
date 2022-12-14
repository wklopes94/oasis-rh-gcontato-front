import { ExtensaoCrudService } from './../../../services/extensao-crud.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IExtensao } from '../../../interfaces/i-extensao';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AlterarComponent } from '../alterar/alterar.component';
import { CriarComponent } from '../criar/criar.component';
import { ApagarComponent } from '../apagar/apagar.component';
import { IDepartamento } from '../../../../departamento/interfaces/i-departamento';
import { IHotel } from '../../../../hotel/interfaces/i-hotel';
import { HotelCrudService } from '../../../../hotel/services/hotel-crud.service';
import { DepartamentoCrudService } from '../../../../departamento/services/departamento-crud.service';
import { IResponsePageableHotel } from '../../../../hotel/interfaces/i-response-pageable-hotel';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements AfterViewInit {

  isPopupOpened = true;
  carregando: boolean = false;
  estado: string = 'a';

  //CRIAR FORMULARIO
  formPesquisa: FormGroup = this.formBuilder.group({
   hotel: [null],
   departamento: [null],
   extensao: [null]
 });


 //Pequisa Colaboradores All
 resultado: any = [];
 dataSourceSelectExtensao: IExtensao[] = [];
 dataSourceSelectDepartamento: IDepartamento[] = [];
 dataSourceSelectHotel: IHotel[] = [];
 dataSource: IExtensao[] = [];

 //PAGINAÇÃO
 mypages?: MyPages;

 totalElements: number = 0;
 sizeInicial: number = 3;
 sort: string = 'numero';
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
   'numero',
   'departamento',
   'hotels',
   'acao'
 ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ExtensaoCrudService,
    private formBuilder: FormBuilder,
    private dialog : MatDialog,
    private serviceHotel: HotelCrudService,
    private serviceDepartamento: DepartamentoCrudService) { }

  ngAfterViewInit(): void {
    this.carregarHotelSelect();
    this.carregarExtensao();
  }

  carregarSelectDepartamentoEDatasorce(){
    this.carregarDepartamentoSelect();
    this.resetExt();
    this.findByHotelFk();
  }

  carregarSelectExtensoEDatasorce(){
    this.findByDepartamentoFkForDtasource();
    this.findByDepartamentoFkForSelect();
  }


  carregarExtensao() {

    this.resetDep();
    this.resetExt();

    this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.service
      .findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem)
      .subscribe((data: {}) => {
        this.resultado = data;
        this.dataSource = this.resultado._embedded.extensoes;
        this.mypages = this.resultado.page;
        this.totalElements = 1000;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

        this.dataSource.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.departamentoFk.href)
            .subscribe((departamentoFk: {}) => {
              let departamento = JSON.stringify(departamentoFk);

              elem.departamento = JSON.parse(departamento).nome;
              console.log('Departamentos',elem.departamento);

              return this.service
                    .getDataByURL(
                      JSON.parse(departamento)._links.hotelFk.href
                    )
                    .subscribe((hotel: {}) => {
                      let hotelColab = JSON.stringify(hotel);
                      elem.hotels = JSON.parse(hotelColab).nome;
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
        //this.dataSourceSelectDepartamento = this.resultado;
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


  findByDepartamentoAndHotel() {

    this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    console.log("Extensao: "+this.formPesquisa?.value.extensao);
    console.log("Departamento: "+this.formPesquisa?.value.departamento);

    return this.service
      .findByDepartamentoFkAndNumero(this.formPesquisa?.value.extensao, this.formPesquisa?.value.departamento, pageIndex, pageSize, this.sort, this.direccaoOrdem)
      .subscribe((data: {}) => {
        this.resultado = data;
        this.dataSource = this.resultado._embedded.extensoes;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

        this.dataSource.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.departamentoFk.href)
            .subscribe((departamentoFk: {}) => {
              let departamento = JSON.stringify(departamentoFk);

              elem.departamento = JSON.parse(departamento).nome;
              console.log('Departamentos',elem.departamento);

              return this.service
                    .getDataByURL(
                      JSON.parse(departamento)._links.hotelFk.href
                    )
                    .subscribe((hotel: {}) => {
                      let hotelColab = JSON.stringify(hotel);
                      elem.hotels = JSON.parse(hotelColab).nome;
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
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.service
      .findByDepartamentoFk(this.formPesquisa?.value.departamento, pageIndex, pageSize, this.sort, this.direccaoOrdem)
      .subscribe((data: {}) => {
        this.resultado = data;
        this.dataSource = this.resultado._embedded.extensoes;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

        this.dataSource.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.departamentoFk.href)
            .subscribe((departamentoFk: {}) => {
              let departamento = JSON.stringify(departamentoFk);

              elem.departamento = JSON.parse(departamento).nome;
              console.log('Departamentos',elem.departamento);

              return this.service
                    .getDataByURL(
                      JSON.parse(departamento)._links.hotelFk.href
                    )
                    .subscribe((hotel: {}) => {
                      let hotelColab = JSON.stringify(hotel);
                      elem.hotels = JSON.parse(hotelColab).nome;
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
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.service
      .findByDepartamentoFk(this.formPesquisa?.value.departamento, pageIndex, pageSize, this.sort, this.direccaoOrdem)
      .subscribe((data: {}) => {
        this.resultado = data;
        this.dataSourceSelectExtensao = this.resultado._embedded.extensoes;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

      });
  }


  findByHotelFk() {

    this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.service
      .findByHotelFk(pageIndex, pageSize, this.sort, this.direccaoOrdem, this.formPesquisa?.value.hotel)
      .subscribe((data: {}) => {
        this.resultado = data;
        this.dataSource = this.resultado._embedded.extensoes;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource);

        this.dataSource.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.departamentoFk.href)
            .subscribe((departamentoFk: {}) => {
              let departamento = JSON.stringify(departamentoFk);

              elem.departamento = JSON.parse(departamento).nome;
              console.log('Departamentos',elem.departamento);

              return this.service
                    .getDataByURL(
                      JSON.parse(departamento)._links.hotelFk.href
                    )
                    .subscribe((hotel: {}) => {
                      let hotelColab = JSON.stringify(hotel);
                      elem.hotels = JSON.parse(hotelColab).nome;
                    });

            });
        });
      });
  }

  getAllHotels() {
    return this.dataSource;
  }


  alterarExtensao(number: string){
    this.isPopupOpened = true;
    const extensao = this.getAllHotels().find(c => c.id == number);
    const dialogRef = this.dialog.open(AlterarComponent, {
        width: '30%',
        data: extensao
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  criarExtensao(){
    const dialogRef = this.dialog.open(CriarComponent, {
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  apagarExtensao(number: string){
    this.isPopupOpened = true;
    const extensao = this.getAllHotels().find(c => c.id == number);
    const dialogRef = this.dialog.open(ApagarComponent, {
      width: '30%',
      data: extensao
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  resetDep(): void{
    this.formPesquisa.get('departamento')?.reset();
  }
  resetExt(): void{
    this.formPesquisa.get('extensao')?.reset();
  }
}

