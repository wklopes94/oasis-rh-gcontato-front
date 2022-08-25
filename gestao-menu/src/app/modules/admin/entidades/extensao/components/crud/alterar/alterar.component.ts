import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IExtensao } from '../../../interfaces/i-extensao';
import { ExtensaoCrudService } from '../../../services/extensao-crud.service';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.component.html',
  styleUrls: ['./alterar.component.scss']
})
export class AlterarComponent implements OnInit {



  constructor(private service: ExtensaoCrudService, private route: ActivatedRoute , private router: Router) { }

  ngOnInit(): void {
   // this.extensao.id = this.route.snapshot.paramMap.get('id')!
    //this.findById()

  }
/*
  findById(): void{
    this.service.findById(this.extensao.id!).subscribe((resposta) =>{
      this.extensao = resposta
      console.log(this.extensao)
    })
  }

  HotelCancel(): void{
    this.router.navigate(["oa-admin/gestao/entidades/extensao/listar"])
  }
  update(): void{
    this.service.update(this.extensao).subscribe((resposta) =>{
    this.router.navigate(['oa-admin/gestao/entidades/extensao/listar']);

    }, err => {
        console.log(err)
    })

  }
*/
}
