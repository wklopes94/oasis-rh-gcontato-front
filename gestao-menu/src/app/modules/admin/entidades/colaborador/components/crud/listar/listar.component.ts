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

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarComponent implements AfterViewInit {



  carregando: boolean = false;

  //Pesquisa de Nome Hotel
  hotel: any[] = [];
  //CRIAR FORMULARIO
  formPesquisa: FormGroup = this.formBuilder.group({
    hotel: [null],
    departamento: [null],
    colaborador: [null]
  });

  //Pequisa Colaboradores All
  resultado: any = [];
  colaboradores: any = [];

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

  constructor( private service: ColaboradorCrudService, private router: Router, private serviceHotel: HotelCrudService, private formBuilder: FormBuilder, private dialog : MatDialog) {

  }


  ngAfterViewInit() {
    this.carregarColaboradores();
  }

  carregarColaboradores() {

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

}
