import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoCrudService } from './../../../services/departamento-crud.service';
import { HotelCrudService } from './../../../../hotel/services/hotel-crud.service';
import { Component, OnInit } from '@angular/core';
import { IDepartamento } from '../../../interfaces/i-departamento';

@Component({
  selector: 'app-apagar',
  templateUrl: './apagar.component.html',
  styleUrls: ['./apagar.component.scss']
})
export class ApagarComponent implements OnInit {



  constructor(private servicoHotel: HotelCrudService,private service: DepartamentoCrudService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

  }

}
