import { IReqDepartamento } from './../../../interfaces/i-req-departamento';
import { DepartamentoCrudService } from './../../../services/departamento-crud.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss']
})
export class CriarComponent implements OnInit {

  //CRIAR FORMULARIO
  form: FormGroup = this.formBuilder.group({});


  constructor(private service: DepartamentoCrudService, private formBuilder: FormBuilder,  private router: Router,  private snack: MatSnackBar) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      hotelFk: [''],
    });


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
}
