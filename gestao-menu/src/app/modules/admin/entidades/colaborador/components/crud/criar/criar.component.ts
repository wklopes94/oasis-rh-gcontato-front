import { IReqColaborador } from './../../../interfaces/i-req-colaborador';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';

import { ColaboradorCrudService } from '../../../services/colaborador-crud.service';

@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss']
})
export class CriarComponent implements OnInit {

   //CRIAR FORMULARIO
   form: FormGroup = this.formBuilder.group({});

  constructor(private formBuilder: FormBuilder, private service: ColaboradorCrudService, private router: Router,  private snack: MatSnackBar) {

              }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      nomeColab: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      telefoneColab: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      emailColab: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      enderecoColab: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      numeroRh: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      extensaofk: [''],
      tipoColabFk: [''],
      departamentoFk: [''],

    });

  }


 onSubmit(){
  console.log('O JSON É:', this.crearObjectoFromFROM());
  this.service.createColaboradorFromIReqColab(this.crearObjectoFromFROM()).subscribe(
    success => {
      console.log('CRIADO TCONJUNTO: sucesso', this.crearObjectoFromFROM()),
      this.message("Colaborador criado");
      console.error(success);
      this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
        this.router.navigate(['/oa-admin/gestao/entidades/colaboradores/listar']);
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

onCancel(){
  this.router.navigate(['/oa-admin/gestao/entidades/colaborador/listar']);
}

message(msg: String): void{
  this.snack.open(`${msg}`, 'OK',{
    horizontalPosition: 'end',
    verticalPosition: 'top',
    duration: 4000
  })

}

//CRIAR OBJECTO COM OS DADOS DE FORMULARIO, S/ ID, PARA SER ENVIADO NO PEDIDO
crearObjectoFromFROM(): IReqColaborador{
  //let API_URL = environment.API;
  return {

   "nomeColab": this.form?.value.nomeColab,
    "telefoneColab": this.form?.value.telefoneColab,
    "emailColab": this.form?.value.emailColab,
    "enderecoColab": this.form?.value.enderecoColab,
    "numeroRh": this.form?.value.numeroRh,
    "tipoColabFk": "/tipocolaboradores/"+this.form?.value.tipoColabFk,
    "departamentoFk": "/departamentos/"+this.form?.value.departamentoFk,
    "extensaofk": "/extensoes/"+this.form?.value.extensaofk

  }
}


addReserva(){
  console.log("ADICIONAR UMA RESERVA");

}

resetFields(){
  this.form.reset();
  alert('CLEAN FIELDS');
}
}
