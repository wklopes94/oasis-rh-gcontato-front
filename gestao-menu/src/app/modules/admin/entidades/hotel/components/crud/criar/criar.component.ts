import { IReqHotel } from './../../../interfaces/i-req-hotel';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotelCrudService } from './../../../services/hotel-crud.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss']
})
export class CriarComponent implements OnInit {


  form: FormGroup = this.formBuilder.group({});

  constructor(private formBuilder: FormBuilder, private service: HotelCrudService, private router: Router, private snack: MatSnackBar){}


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      numeroFixo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
    });

  }

  onSubmit(){
    console.log('O JSON É:', this.crearObjectoFromFROM());

    this.service.createColaboradorFromIReqHotel(this.crearObjectoFromFROM()).subscribe(
      success => {
        console.log('Hotel criado', this.crearObjectoFromFROM()),
        this.message("Hotel criado");
        console.error(success);
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['oa-admin/gestao/entidades/hotels/listar']);
        });

     });
  }

  message(msg: String): void{
    this.snack.open(`${msg}`, 'OK',{
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000
    })

  }

  crearObjectoFromFROM(): IReqHotel{
    //let API_URL = environment.API;
    return {
     "nome": this.form?.value.nome,
      "numeroFixo": this.form?.value.numeroFixo,
    }
  }

  ddReserva(){
    console.log("ADICIONAR UMA RESERVA");

  }

  resetFields(){
    this.form.reset();
    alert('CLEAN FIELDS');
  }

  }

