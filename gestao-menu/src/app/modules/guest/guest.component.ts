import { IColaborador } from './../admin/entidades/colaborador/interfaces/i-colaborador';
import { IHotel } from './../admin/entidades/hotel/interfaces/i-hotel';
import { DepartamentoCrudService } from './../admin/entidades/departamento/services/departamento-crud.service';
import { HotelCrudService } from './../admin/entidades/hotel/services/hotel-crud.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IReqColaborador } from '../admin/entidades/colaborador/interfaces/i-req-colaborador';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ColaboradorCrudService } from '../admin/entidades/colaborador/services/colaborador-crud.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit {

  hoteis: any[] = [];
  hotelSelect: any[] = [];

  departamentos: any[] = [];
  departamentosSelect: any[] = [];

  colaboradores: any[] = [];
  colaboradoresSelect: any[] = [];


  hotel: any ={
    id: '',
    nome: '',
    numeroFixo: '',
    departamentosModel:[{
      id:'',
      nome:'',

    }]

  }

    //Pequisa Colaboradores All
    resultado: any = [];
    dataSource$: IColaborador[] = [];

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

  dataSource = new MatTableDataSource<IHotel>(this.hoteis);


  constructor(private service: HotelCrudService,
              private serviceDep: DepartamentoCrudService,
              private router: Router,
              private services: ColaboradorCrudService) { }

  ngOnInit(): void {
    //this.findAllHotel();
    this.carregarColaboradores();
  }




  findAllHotel(){
        this.service.findAll().subscribe(resposta => {
        this.hoteis = resposta;
        this.hotelSelect = resposta;
        this.dataSource = new MatTableDataSource<IHotel>(this.hoteis);
        console.log(resposta)
      })
  }

  findByName(){
    this.service.findByName(this.hotel.nome).subscribe(resposta => {
      if(this.hotel.nome == null){
        this.findAllHotel();
      }else{
        this.hoteis = resposta;
        this.departamentosSelect = resposta;
        console.log(resposta)

      }
    })
  }

  carregarColaboradores() {
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : this.sizeInicial;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nomeColab';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.services
      .findAl(pageIndex, pageSize, this.sort, this.direccaoOrdem)
      .subscribe((data: {}) => {
        this.resultado = data;
        //this.colaboradoreSearch = this.resultado._embedded.colaboradores;
        this.dataSource$ = this.resultado._embedded.colaboradores;
        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;
        console.log('Foi lido os seguintes dados, item: ', this.dataSource$);

        this.dataSource$.forEach((elem) => {
          return this.services
            .getDataByURLS(elem._links.tipoColabFk.href)
            .subscribe((tipoColab: {}) => {
              let tipoColabo = JSON.stringify(tipoColab);

              elem.tipoColab = JSON.parse(tipoColabo).tipoColaborador;

              return this.services
                .getDataByURLS(elem._links.departamentoFk.href)
                .subscribe((depart: {}) => {
                  let departamentoColab = JSON.stringify(depart);
                  elem.nomeDep = JSON.parse(departamentoColab).nome;

                  return this.services
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

  findByDepartamento(){
    //this.serviceDep.findAllByHotel()

  }


}
