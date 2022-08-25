import { IDepartamento } from './../../../../departamento/interfaces/i-departamento';
import { ExtensaoCrudService } from './../../../services/extensao-crud.service';
import { Component, OnInit } from '@angular/core';
import { IExtensao } from '../../../interfaces/i-extensao';
import { Router } from '@angular/router';
import { DepartamentoCrudService } from '../../../../departamento/services/departamento-crud.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IReqExtensao } from '../../../interfaces/i-req-extensao';

@Component({
  selector: 'app-criar',
  templateUrl: './criar.component.html',
  styleUrls: ['./criar.component.scss']
})
export class CriarComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({});


  constructor(private service: ExtensaoCrudService, private router: Router, private formBuilder: FormBuilder, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      numero: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      departamentoFk: [''],
    });

  }

  onSubmit(){
    console.log('O JSON É:', this.crearObjectoFromFROM());

    this.service.createColaboradorFromIReqExtensao(this.crearObjectoFromFROM()).subscribe(
      success => {
        console.log('CRIADO TCONJUNTO: sucesso', this.crearObjectoFromFROM()),
        this.message("Extensão criado");
        console.error(success);
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['oa-admin/gestao/entidades/extensoes/listar']);
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

  crearObjectoFromFROM(): IReqExtensao{
    //let API_URL = environment.API;
    return {
     "numero": this.form?.value.numero,
      "departamentoFk":"/departamentos/"+ this.form?.value.departamentoFk,
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
