import { ColaboradorCrudService } from './../../../services/colaborador-crud.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HotelCrudService } from '../../../../hotel/services/hotel-crud.service';
import { DepartamentoCrudService } from '../../../../departamento/services/departamento-crud.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-apagar',
  templateUrl: './apagar.component.html',
  styleUrls: ['./apagar.component.scss']
})
export class ApagarComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private snack: MatSnackBar,
  private formBuilder: FormBuilder,
  private service: ColaboradorCrudService,
  private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.data.id]
    });
  }

  delete(): void{
    this.service.delete(this.form?.value.id).subscribe((success) =>{
      this.message("Colaborador Apagado");
      console.error(success);
      this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
      this.router.navigate(['oa-admin/gestao/entidades/colaboradores/listar']);
      });
}, err => {
  console.log(err)
})}

message(msg: String): void{
  this.snack.open(`${msg}`, 'OK',{
    horizontalPosition: 'end',
    verticalPosition: 'top',
    duration: 4000
  })

}
}
