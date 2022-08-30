import { IReqDepartamento } from './../../../interfaces/i-req-departamento';
import { DepartamentoCrudService } from './../../../services/departamento-crud.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHotel } from '../../../../hotel/interfaces/i-hotel';
import { MyPages } from 'src/app/my-shared/interfaces-shared/my-pages';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { IResponsePageableHotel } from '../../../../hotel/interfaces/i-response-pageable-hotel';
import { HotelCrudService } from '../../../../hotel/services/hotel-crud.service';

@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss']
})
export class CriarComponent implements OnInit {

  //CRIAR FORMULARIO
  form: FormGroup = this.formBuilder.group({});
  dataSourceSelect: IHotel[] = [];
  resultado: any = [];
  //PAGINAÇÃO
  mypages?: MyPages;

  totalElements: number = 0;
  sizeInicial: number = 3;
  sort: string = 'tipoColaborador';
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

  constructor(private service: DepartamentoCrudService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snack: MatSnackBar,
    private serviceHotel: HotelCrudService,) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      hotelFk: [''],
    });

    this.carregarColaboradoresSelect();

  }

  onSubmit(){
    console.log('O JSON É:', this.crearObjectoFromFROM());

    this.service.createDepartamentoFromIReqColab(this.crearObjectoFromFROM()).subscribe(
      success => {
        console.log('CRIADO TCONJUNTO: sucesso', this.crearObjectoFromFROM()),
        this.message("Departamento criado");
        console.error(success);
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/departamentos/listar']);
        });
     },
     error => {
       console.log("Criar Erro \n"+error);
       alert("Criar Erro \n"+error);
     },
     () => {
       console.log('Criar completo');
     }
     );
  }

  message(msg: String): void{
    this.snack.open(`${msg}`, 'OK',{
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000
    })
  }

  //CRIAR OBJECTO COM OS DADOS DE FORMULARIO, S/ ID, PARA SER ENVIADO NO PEDIDO
crearObjectoFromFROM(): IReqDepartamento{
  //let API_URL = environment.API;
  return {
   "nome": this.form?.value.nome,
    "hotelFk": "/hotels/"+this.form?.value.hotelFk,
  }
}

resetFields(){
  this.form.reset();
  alert('CLEAN FIELDS');
}

carregarColaboradoresSelect() {

  //this.carregando = true;
  let pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
  let pageSize = this.pageEvent ? this.pageEvent.pageSize : 10000;

  //SORT
  this.sort = this.sortEvent ? this.sortEvent.active : 'nome';
  this.direccaoOrdem = this.sortEvent ? this.sortEvent.direction : 'asc';

  this.estado = 'a';

  return this.serviceHotel
    .findByAtivo(pageIndex, pageSize, this.sort, this.direccaoOrdem, this.estado)
    .subscribe((data: IResponsePageableHotel) => {
      console.log('Data Hotel: ', data);

      this.resultado = data;
      this.dataSourceSelect = this.resultado._embedded.hotels;
      this.mypages = this.resultado.page;
      this.totalElements = this.resultado.page.totalElements;
      console.log('Foi lido os seguintes dados, item: ', this.dataSourceSelect);
    });
}
}
