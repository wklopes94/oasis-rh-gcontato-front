import { DepartamentoCrudService } from './../../../services/departamento-crud.service';
import { HotelCrudService } from './../../../../hotel/services/hotel-crud.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IDepartamento } from '../../../interfaces/i-departamento';

import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AlterarComponent } from '../alterar/alterar.component';
import { CriarComponent } from '../criar/criar.component';
import { ApagarComponent } from '../apagar/apagar.component';

import { IHotel } from '../../../../hotel/interfaces/i-hotel';
import { IResponsePageableHotel } from '../../../../hotel/interfaces/i-response-pageable-hotel';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements AfterViewInit {


  isPopupOpened = true;
  carregando: boolean = false;


  //CRIAR FORMULARIO
  formPesquisa: FormGroup = this.formBuilder.group({
      hotel: [null],
      departamento: [null]
  });

  //Pesquisa de Nome Departamento
  departamento: any[] = [];

  //Pequisa Departamento All
  resultado: any = [];
  colaboradores: any = [];
  dataSourceSelectDepartamento: IDepartamento[] = [];
  dataSourceSelectHotel: IHotel[] = [];
  dataSource$: IDepartamento[] = [];

  //PAGINAÇÃO
  mypages?: MyPages;

  totalElements: number = 0;
  sizeInicial: number = 3;
  sort: string = 'nome';
  direccaoOrdem: string = 'asc';

  //CABECALHO PARA PESQUISA ATIVO

  estado: string = 'a';

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

  displayedColumns: string[] = [ 'nome', 'hotelFk', 'acao'];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: DepartamentoCrudService,

    private dialog : MatDialog,
    private formBuilder: FormBuilder,
    private serviceHotel: HotelCrudService) { }


  ngAfterViewInit(): void {
    //this.carregarDepartamentoSelect();
    this.carregarDepartamento();
    this.carregarHotelSelect();
  }

  clickHotel(){
    this.carregarDepartamento();
    this.resetDep();
  }

  carregarDepartamento() {



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
        this.dataSource$ = this.resultado._embedded.departamentos;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource$);

        this.dataSource$.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.hotelFk.href)
            .subscribe((hotelfk: {}) => {
              let hotel = JSON.stringify(hotelfk);

              elem.hotelFk = JSON.parse(hotel).nome;
              console.log(elem.hotelFk);

              this.resetDep();
            });
        });
      });



  }

  carregarDepartamentoSelect() {

    //this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : 90;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';



    return this.service
      .findByHotelFk(pageIndex, pageSize, this.sort, this.direccaoOrdem, this.formPesquisa?.value.hotel)
      .subscribe((data: {}) => {
        this.resultado = data;
        //this.dataSourceSelectDepartamento = this.resultado;
        this.dataSourceSelectDepartamento = this.resultado._embedded.departamentos;
        this.dataSource$ = this.resultado._embedded.departamentos;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        this.carregando = false;
        console.log('Foi lido os seguintes dados, item: ', this.dataSourceSelectDepartamento);

        this.dataSource$.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.hotelFk.href)
            .subscribe((hotelfk: {}) => {
              let hotel = JSON.stringify(hotelfk);

              elem.hotelFk = JSON.parse(hotel).nome;
              console.log(elem.hotelFk);

            });
        });


      });

  }

  carregarHotelSelect() {

    //this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : 90;

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



  findByName(){
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : 1000;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    this.estado = 'a';
       console.log(this.formPesquisa?.value.hotel);

     return this.service.findByNomeAndHotelFk(this.formPesquisa?.value.departamento, this.formPesquisa?.value.hotel, pageIndex, pageSize, this.sort, this.direccaoOrdem).subscribe(data => {

        console.log('Dados do FIND: ', data);

        this.resultado = data;
        this.dataSource$ = this.resultado._embedded.departamentos;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource$);


        this.dataSource$.forEach((elem) => {
          return this.service
            .getDataByURLS(elem._links.hotelFk.href)
            .subscribe((hotelfk: {}) => {
              let hotel = JSON.stringify(hotelfk);

              elem.hotelFk = JSON.parse(hotel).nome;
              console.log(elem.hotelFk);

            });
        });


    })
  }

  getAllHotels() {
    return this.dataSource$;
  }

  alterarDepartamento(number: string){
    this.isPopupOpened = true;
    const departaemnto = this.getAllHotels().find(c => c.id == number);
    const dialogRef = this.dialog.open(AlterarComponent, {
        width: '30%',
        data: departaemnto
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  criarDepartamento(){
    const dialogRef = this.dialog.open(CriarComponent, {
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  apagarDepartamento(number: string){
    this.isPopupOpened = true;
    const departaemnto = this.getAllHotels().find(c => c.id == number);
    const dialogRef = this.dialog.open(ApagarComponent, {
      width: '30%',
      data: departaemnto
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  resetDep(): void{
    this.formPesquisa.get('departamento')?.reset();
  }
}
