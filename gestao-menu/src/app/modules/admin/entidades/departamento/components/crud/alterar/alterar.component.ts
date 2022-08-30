import { IReqDepartamento } from './../../../interfaces/i-req-departamento';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoCrudService } from './../../../services/departamento-crud.service';
import { Component, Inject, OnInit } from '@angular/core';
import { IDepartamento } from '../../../interfaces/i-departamento';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.component.html',
  styleUrls: ['./alterar.component.scss']
})
export class AlterarComponent implements OnInit {

 //CRIAR FORMULARIO
 form: FormGroup = this.formBuilder.group({});
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private snack: MatSnackBar, private service: DepartamentoCrudService, private route: ActivatedRoute , private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      id: [this.data.id],
      nome: [this.data.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      hotelFk: [this.data.hotelFk]
    });
  }

  resetFields(){
    this.form.reset();
    alert('CLEAN FIELDS');
  }

  update(): void{
    console.log("Update JSON: "+ this.updateObjectoFromFROM())
    this.service.updateDatas(this.form?.value.id, this.updateObjectoFromFROM()).subscribe((success) =>{
      console.log("Update JSON: "+ this.updateObjectoFromFROM())
        this.message("Departamento Atualizado");
        console.error(success);
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
        this.router.navigate(['oa-admin/gestao/entidades/departamentos/listar']);
        });

    }, err => {
        console.log(err)
    })

  }

  updateObjectoFromFROM(): IReqDepartamento{
    //let API_URL = environment.API;
    return {
     "nome": this.form?.value.nome,
      "hotelFk":"/hotels/"+this.form?.value.hotelFk,
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
