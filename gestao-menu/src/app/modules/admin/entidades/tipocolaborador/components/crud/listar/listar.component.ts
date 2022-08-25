import { Observable } from 'rxjs';
import { IResponsePageableTipocolaborador } from './../../../interfaces/i-response-pageable-tipocolaborador';
import { ITipocolaborador } from './../../../interfaces/i-tipocolaborador';
import { TipocolaboradorCrudService } from './../../../services/tipocolaborador-crud.service';

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CriaralterarComponent } from '../criaralterar/criaralterar.component';
import { ApagarComponent } from '../apagar/apagar.component';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements AfterViewInit {

  carregando: boolean = false;

  tipoColaboradores: ITipocolaborador[] = []
  displayedColumns: string[] = ['tipoColaborador', 'acao'];
  dataSource: ITipocolaborador[] = [];

     //CRIAR FORMULARIO
     formPesquisa: FormGroup = this.formBuilder.group({
      hotel: [null],
      departamento: [null],
      colaborador: [null]
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


  constructor(private service: TipocolaboradorCrudService, private router: Router,  private formBuilder: FormBuilder, private dialog : MatDialog) { }

  ngAfterViewInit(): void {
    this.carregarTipoColaboradores();

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


  myObservable$ = this.service.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);


  myObservable$.subscribe(
    (data: IResponsePageableTipocolaborador) => {
      console.log('Foi lido os seguintes dados, item: ', data._embedded.tipocolaboradores);
      this.dataSource = data._embedded.tipocolaboradores;
      this.mypages = data.page;
      this.totalElements = this.mypages.totalElements;

    }

  )

}
alterarTipoColaborador(){
  const dialogRef = this.dialog.open(CriaralterarComponent, {
      width: '30%'
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

apagarTipoColaborador(){
  const dialogRef = this.dialog.open(ApagarComponent, {
    width: '30%'
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

}
