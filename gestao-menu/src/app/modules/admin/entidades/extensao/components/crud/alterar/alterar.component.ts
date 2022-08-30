import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IReqExtensao } from '../../../interfaces/i-req-extensao';
import { ExtensaoCrudService } from '../../../services/extensao-crud.service';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.component.html',
  styleUrls: ['./alterar.component.scss']
})
export class AlterarComponent implements OnInit {


  //CRIAR FORMULARIO
 form: FormGroup = this.formBuilder.group({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private snack: MatSnackBar, private service: ExtensaoCrudService, private route: ActivatedRoute , private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.data.id],
      numero: [this.data.numero, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      departamentoFk: [this.data.departamentoFk]
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
