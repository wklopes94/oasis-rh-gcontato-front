import { Observable } from 'rxjs';
import { IResponsePageableTipocolaborador } from './../../../interfaces/i-response-pageable-tipocolaborador';
import { ITipocolaborador } from './../../../interfaces/i-tipocolaborador';
import { TipocolaboradorCrudService } from './../../../services/tipocolaborador-crud.service';

import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CriaralterarComponent } from '../criaralterar/criaralterar.component';
import { ApagarComponent } from '../apagar/apagar.component';
import { AlterarComponent } from '../alterar/alterar.component';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements AfterViewInit {
  isPopupOpened = true;
  carregando: boolean = false;
  estado: string = 'a';
  resultado: any = [];

  tipoColaboradores: ITipocolaborador[] = []
  displayedColumns: string[] = ['tipoColaborador', 'acao'];
  dataSource: ITipocolaborador[] = [];
  dataSourceSelectTipoColaborador: ITipocolaborador[] = [];

     //CRIAR FORMULARIO
     formPesquisa: FormGroup = this.formBuilder.group({
      tipoColaborador: [null]
    });


  //PAGINAÇÃO
  mypages?: MyPages;


  totalElements: number =0;
  sizeInicial: number =3;
  sort: string ="tipoColaborador";
  direccaoOrdem: string ="asc";

  pageSizeOptions: number[] = [1, 2, 5, 10];

  //PAGE_EVENT
  pageEvent?: PageEvent;

  //SORT_EVENT
  sortEvent?: Sort;


  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private service: TipocolaboradorCrudService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog : MatDialog) { }

  ngAfterViewInit(): void {
    this.carregarTipoColaboradores();
    this.carregarTipoColaboradoresSelect();


  }


  carregarTipoColaboradores() {

  this.carregando = true;
  //PAGINAÇÃO

  let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
  let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;

  //SORT
  this.sort = this.sortEvent? this.sortEvent.active : "nome";
  this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";

  let myObservable$: Observable<IResponsePageableTipocolaborador>;

  this.estado = 'a';

  myObservable$ = this.service.findByAtivo
  (this.estado, pageIndex, pageSize, this.sort, this.direccaoOrdem);


  myObservable$.subscribe(
    (data: IResponsePageableTipocolaborador) => {
      console.log('Foi lido os seguintes dados, item: ', data._embedded.tipocolaboradores);
      this.dataSource = data._embedded.tipocolaboradores;
      this.dataSourceSelectTipoColaborador = data._embedded.tipocolaboradores;
      this.mypages = data.page;
      this.totalElements = this.mypages.totalElements;

    }

  )

}

carregarTipoColaboradoresSelect() {

  //this.carregando = true;
  let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
  let pageSize = this.pageEvent ? this.pageEvent.pageSize :  1000;

  //SORT
  this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
  this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

  this.estado = 'a';

  return this.service
    .findByTipoColaboradorAndEstado(this.formPesquisa?.value.tipoColaborador, this.estado, pageIndex, pageSize, this.sort, this.direccaoOrdem)
    .subscribe((data: IResponsePageableTipocolaborador) => {
      console.log('Data Hotel: ', data);

      this.resultado = data;
      this.dataSourceSelectTipoColaborador = this.resultado._embedded.tipocolaboradores;
      this.mypages = this.resultado.page;
      this.totalElements = this.resultado.page.totalElements;
      console.log('Foi lido os seguintes dados, item: ', this.dataSource);
    });
}

carregarTipoColaboradoresDataSource() {

  //this.carregando = true;
  let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
  let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

  //SORT
  this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
  this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

  this.estado = 'a';

  return this.service
    .findByTipoColaboradorAndEstado(this.formPesquisa?.value.tipoColaborador, this.estado, pageIndex, pageSize, this.sort, this.direccaoOrdem)
    .subscribe((data: IResponsePageableTipocolaborador) => {
      console.log('Data Hotel: ', data);

      this.resultado = data;
      this.dataSource = this.resultado._embedded.tipocolaboradores;
      this.mypages = this.resultado.page;
      this.totalElements = this.resultado.page.totalElements;
      console.log('Foi lido os seguintes dados, item: ', this.dataSource);
    });
}

getAllHotels() {
  return this.dataSource;
}

alterarTipoColaborador(number: string){
  this.isPopupOpened = true;
  const tipocolaborador = this.getAllHotels().find(c => c.id == number);
  const dialogRef = this.dialog.open(AlterarComponent, {
      width: '30%',
      data: tipocolaborador
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

criarTipoColaborador(){
  const dialogRef = this.dialog.open(CriaralterarComponent, {
    width: '30%'
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

apagarTipoColaborador(number: string){
  this.isPopupOpened = true;
  const tipocolaborador = this.getAllHotels().find(c => c.id == number);
  const dialogRef = this.dialog.open(ApagarComponent, {
    width: '30%',
    data: tipocolaborador
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

}
