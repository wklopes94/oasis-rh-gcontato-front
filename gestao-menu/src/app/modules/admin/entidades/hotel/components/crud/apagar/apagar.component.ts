import { HotelCrudService } from './../../../services/hotel-crud.service';
import { IHotel } from './../../../interfaces/i-hotel';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-apagar',
  templateUrl: './apagar.component.html',
  styleUrls: ['./apagar.component.scss']
})
export class ApagarComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({});


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private service: HotelCrudService, private route: ActivatedRoute, private router: Router, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.data.id]
    });
  }
  delete(): void{
      this.service.delete(this.form?.value.id).subscribe((success) =>{
        this.message("Hotel Apagado");
        console.error(success);
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
        this.router.navigate(['oa-admin/gestao/entidades/hotels/listar']);
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
