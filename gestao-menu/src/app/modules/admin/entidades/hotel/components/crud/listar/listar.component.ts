import { IHotel } from './../../../interfaces/i-hotel';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';


import { AlterarComponent } from './../alterar/alterar.component';
import { IResponsePageableHotel } from './../../../interfaces/i-response-pageable-hotel';

import { HotelCrudService } from './../../../services/hotel-crud.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';


import { Router } from '@angular/router';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { ApagarComponent } from '../apagar/apagar.component';
import { CriarComponent } from '../criar/criar.component';

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
    departamento: [null],
    colaborador: [null]
  });


  //Pequisa Colaboradores All
  resultado: any = [];
  dataSource: IHotel[] = [];

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
    'nome',
    'numeroFixo',
    'acao'
  ];


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private service: HotelCrudService, private router: Router, private formBuilder: FormBuilder, private dialog : MatDialog) {


   }

  searchKey!: string;

  ngAfterViewInit()  {
    this.carregarColaboradores();
  }


carregarColaboradores() {

  //this.carregando = true;
  let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
  let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

  //SORT
  this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
  this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

  return this.service
    .findAl(pageIndex, pageSize, this.sort, this.direccaoOrdem)
    .subscribe((data: IResponsePageableHotel) => {
      console.log('Data Hotel: ', data);

      this.resultado = data;
      this.dataSource = this.resultado._embedded.hotels;
      this.mypages = this.resultado.page;
      this.totalElements = this.resultado.page.totalElements;
      console.log('Foi lido os seguintes dados, item: ', this.dataSource);
    });

}

  HotelCreate(): void{
    this.router.navigate(["hotel/create"])
  }

  getAllHotels() {
    return this.dataSource;
  }

  alterarHotel(number: string){

    this.isPopupOpened = true;
    const hotel = this.getAllHotels().find(c => c.id == number);
    const dialogRef = this.dialog.open(AlterarComponent, {
        width: '30%',
        data: hotel
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  criarHotel(){
    const dialogRef = this.dialog.open(CriarComponent, {
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  apagarHotel(number: string){
    this.isPopupOpened = true;
    const hotel = this.getAllHotels().find(c => c.id == number);
    const dialogRef = this.dialog.open(ApagarComponent, {
      width: '30%',
      data: hotel
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
