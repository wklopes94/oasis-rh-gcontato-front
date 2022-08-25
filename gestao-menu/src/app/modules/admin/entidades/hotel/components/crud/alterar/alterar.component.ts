import { HotelCrudService } from './../../../services/hotel-crud.service';
import { IHotel } from './../../../interfaces/i-hotel';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IReqHotel } from '../../../interfaces/i-req-hotel';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.component.html',
  styleUrls: ['./alterar.component.scss']
})
export class AlterarComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,private service: HotelCrudService, private route: ActivatedRoute , private router: Router, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.data.id],
      nome: [this.data.nome , [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      numeroFixo: [this.data.numeroFixo, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
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
        this.message("Hotel Atualizado");
        console.error(success);
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
        this.router.navigate(['oa-admin/gestao/entidades/hotels/listar']);
        });

    }, err => {
        console.log(err)
    })

  }

  updateObjectoFromFROM(): IReqHotel{
    //let API_URL = environment.API;
    return {
     "nome": this.form?.value.nome,
      "numeroFixo": this.form?.value.numeroFixo,
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
