import { DepartamentoCrudService } from './../../../services/departamento-crud.service';
import { HotelCrudService } from './../../../../hotel/services/hotel-crud.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IDepartamento } from '../../../interfaces/i-departamento';
import { Router } from '@angular/router';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AlterarComponent } from '../alterar/alterar.component';
import { CriarComponent } from '../criar/criar.component';
import { ApagarComponent } from '../apagar/apagar.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements AfterViewInit {



  carregando: boolean = false;


    //CRIAR FORMULARIO
    formPesquisa: FormGroup = this.formBuilder.group({
      hotel: [null],
      departamento: [null],
      colaborador: [null]
    });

  //Pesquisa de Nome Departamento
  departamento: any[] = [];

  //Pequisa Departamento All
  resultado: any = [];
  colaboradores: any = [];
  dataSources$: IDepartamento[] = [];
  dataSource$: IDepartamento[] = [];

  //PAGINAÇÃO
  mypages?: MyPages;

  totalElements: number = 0;
  sizeInicial: number = 3;
  sort: string = 'nome';
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

  displayedColumns: string[] = [ 'nome', 'hotelFk', 'acao'];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private serviceHot: HotelCrudService, private service: DepartamentoCrudService, private router: Router, private dialog : MatDialog, private formBuilder: FormBuilder) { }


  ngAfterViewInit(): void {
    this.carregarDepartamento();

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

            });
        });
      });
  }

  alterarDepartamento(){
    const dialogRef = this.dialog.open(AlterarComponent, {
        width: '30%'
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

  apagarDepartamento(){
    const dialogRef = this.dialog.open(ApagarComponent, {
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
