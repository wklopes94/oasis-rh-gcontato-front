import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoCrudService } from './../../../services/departamento-crud.service';
import { Component, OnInit } from '@angular/core';
import { IDepartamento } from '../../../interfaces/i-departamento';

@Component({
  selector: 'app-alterar',
  templateUrl: './alterar.component.html',
  styleUrls: ['./alterar.component.scss']
})
export class AlterarComponent implements OnInit {


  constructor(private service: DepartamentoCrudService, private route: ActivatedRoute , private router: Router) { }

  ngOnInit(): void {


  }




}
