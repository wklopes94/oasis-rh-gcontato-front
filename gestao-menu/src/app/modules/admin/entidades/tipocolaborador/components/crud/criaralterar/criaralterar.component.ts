
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipocolaboradorCrudService } from './../../../services/tipocolaborador-crud.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReqTipocolaborador } from '../../../interfaces/i-req-tipocolaborador';

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss']
})
export class CriaralterarComponent implements OnInit {


  //CRIAR FORMULARIO
  form: FormGroup = this.formBuilder.group({});

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private service: TipocolaboradorCrudService,
              private snack: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tipoColaborador: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    });

  }

  onSubmit(){
    console.log('O JSON É:', this.crearObjectoFromFROM());

    this.service.createColaboradorFromIReqTipoColaborador(this.crearObjectoFromFROM()).subscribe(
      success => {
        console.log('CRIADO TCONJUNTO: sucesso', this.crearObjectoFromFROM()),
        this.message("Tipo Colaborador criado");
        console.error(success);
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['oa-admin/gestao/entidades/tipocolaboradores/listar']);
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

  crearObjectoFromFROM(): IReqTipocolaborador{
    //let API_URL = environment.API;
    return {
     "tipoColaborador": this.form?.value.tipoColaborador
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
