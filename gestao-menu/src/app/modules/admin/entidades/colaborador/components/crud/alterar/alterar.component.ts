import { IReqColaborador } from './../../../interfaces/i-req-colaborador';
import { Component,Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { IDepartamento } from '../../../../departamento/interfaces/i-departamento';
import { DepartamentoCrudService } from '../../../../departamento/services/departamento-crud.service';
import { IHotel } from '../../../../hotel/interfaces/i-hotel';
import { IResponsePageableHotel } from '../../../../hotel/interfaces/i-response-pageable-hotel';
import { HotelCrudService } from '../../../../hotel/services/hotel-crud.service';
import { IResponsePageableTipocolaborador } from '../../../../tipocolaborador/interfaces/i-response-pageable-tipocolaborador';
import { ITipocolaborador } from '../../../../tipocolaborador/interfaces/i-tipocolaborador';
import { TipocolaboradorCrudService } from '../../../../tipocolaborador/services/tipocolaborador-crud.service';
import { ColaboradorCrudService } from '../../../services/colaborador-crud.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.component.html',
  styleUrls: ['./alterar.component.scss']
})
export class AlterarComponent implements OnInit {

     //CRIAR FORMULARIO
     form: FormGroup = this.formBuilder.group({});

     resultado: any = [];
     dataSourceSelectDepartamento: IDepartamento[] = [];
     dataSourceSelectHotel: IHotel[] = [];
     dataSourceSelectTipoColaborador: ITipocolaborador[] = [];

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


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private service: ColaboradorCrudService,
    private router: Router,
    private snack: MatSnackBar,
    private serviceDepartamento: DepartamentoCrudService,
    private serviceHotel: HotelCrudService,
    private serviceTColaborador: TipocolaboradorCrudService) { }

  ngOnInit(): void {
    this.carregarHotelSelect();
    this.carregarTipoColaboradoresSelect();

    this.form = this.formBuilder.group({
      id: [this.data.id],
      nomeColab: [this.data.nomeColab, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      telefoneColab: [this.data.telefoneColab, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      emailColab: [this.data.emailColab, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      enderecoColab: [this.data.enderecoColab, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      numeroRh: [this.data.numeroRh, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      hotel: [this.data.hotel],
      tipoColabFk: [this.data.tipoColabFk],
      departamentoFk: [this.data.departamentoFk],
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



  carregarTipoColaboradoresSelect() {


    //PAGINAÇÃO

    let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
    let pageSize = this.pageEvent? this.pageEvent.pageSize: 1000;

    //SORT
    this.sort = this.sortEvent? this.sortEvent.active : "nome";
    this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";

    let myObservable: Observable<IResponsePageableTipocolaborador>;

    this.estado = 'a';

    myObservable = this.serviceTColaborador.findByAtivo
    (this.estado, pageIndex, pageSize, this.sort, this.direccaoOrdem);


    myObservable.subscribe(
      (data: IResponsePageableTipocolaborador) => {
        console.log('Foi lido os seguintes dados, item: ', data._embedded.tipocolaboradores);
        this.dataSourceSelectTipoColaborador = data._embedded.tipocolaboradores;
        this.mypages = data.page;
        this.totalElements = this.mypages.totalElements;

      }

    )

  }

  carregarDepartamentoSelect() {

    //this.carregando = true;
    let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    let pageSize = this.pageEvent ? this.pageEvent.pageSize : 90;

    //SORT
    this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
    this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

    return this.serviceDepartamento
      .findByHotelFk(pageIndex, pageSize, this.sort, this.direccaoOrdem, this.form?.value.hotel)
      .subscribe((data: {}) => {
        this.resultado = data;
        //this.dataSourceSelectDepartamento = this.resultado;
        this.dataSourceSelectDepartamento = this.resultado._embedded.departamentos;

        this.mypages = this.resultado.page;
        this.totalElements = this.resultado.page.totalElements;

        console.log('Foi lido os seguintes dados, item: ', this.dataSourceSelectDepartamento);
      });

  }

  update(): void{
    console.log("Update JSON: "+ this.updateObjectoFromFROM())
    this.service.updateDatas(this.form?.value.id, this.updateObjectoFromFROM()).subscribe((success) =>{
      console.log("Update JSON: "+ this.updateObjectoFromFROM())
        this.message("Departamento Atualizado");
        console.error(success);
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
        this.router.navigate(['oa-admin/gestao/entidades/colaboradores/listar']);
        });

    }, err => {
        console.log(err)
    })

  }

  updateObjectoFromFROM(): IReqColaborador{
    //let API_URL = environment.API;
    return {

      "nomeColab": this.form?.value.nomeColab,
       "telefoneColab": this.form?.value.telefoneColab,
       "emailColab": this.form?.value.emailColab,
       "enderecoColab": this.form?.value.enderecoColab,
       "numeroRh": this.form?.value.numeroRh,
       "tipoColabFk": "/tipocolaboradores/"+this.form?.value.tipoColabFk,
       "departamentoFk": "/departamentos/"+this.form?.value.departamentoFk,

     }
  }

  message(msg: String): void{
    this.snack.open(`${msg}`, 'OK',{
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000
    })

  }

  resetFields(){
    this.form.reset();
    alert('CLEAN FIELDS');
  }

}
