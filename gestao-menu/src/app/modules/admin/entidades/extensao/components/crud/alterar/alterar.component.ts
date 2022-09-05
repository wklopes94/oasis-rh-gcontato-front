import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { IDepartamento } from '../../../../departamento/interfaces/i-departamento';
import { DepartamentoCrudService } from '../../../../departamento/services/departamento-crud.service';
import { IHotel } from '../../../../hotel/interfaces/i-hotel';
import { IResponsePageableHotel } from '../../../../hotel/interfaces/i-response-pageable-hotel';
import { HotelCrudService } from '../../../../hotel/services/hotel-crud.service';
import { IReqExtensao } from '../../../interfaces/i-req-extensao';
import { ExtensaoCrudService } from '../../../services/extensao-crud.service';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.component.html',
  styleUrls: ['./alterar.component.scss']
})


export class AlterarComponent implements OnInit {

   resultado: any = [];
   dataSourceSelectDepartamento: IDepartamento[] = [];
   dataSourceSelectHotel: IHotel[] = [];

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


  //CRIAR FORMULARIO
 form: FormGroup = this.formBuilder.group({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private formBuilder: FormBuilder,
  private snack: MatSnackBar,
  private service: ExtensaoCrudService,
  private router: Router,
  private serviceDepartamento: DepartamentoCrudService,
  private serviceHotel: HotelCrudService) { }

  ngOnInit(): void {

    this.carregarHotelSelect();

    this.form = this.formBuilder.group({
      id: [this.data.id],
      numero: [this.data.numero, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      hotel: [null],
      departamentoFk: [this.data.departamentoFk]
    });

  }

  resetFields(){
    this.form.reset();
    alert('CLEAN FIELDS');
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
        this.message("Extensao Atualizado");
        console.error(success);
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
        this.router.navigate(['oa-admin/gestao/entidades/extensoes/listar']);
        });

    }, err => {
        console.log(err)
    })

  }

  updateObjectoFromFROM(): IReqExtensao{
    //let API_URL = environment.API;
    return {
      "numero": this.form?.value.numero,
      "departamentoFk":"/departamentos/"+ this.form?.value.departamentoFk,
    }
  }

  message(msg: String): void{
    this.snack.open(`${msg}`, 'OK',{
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000
    })

  }

}
