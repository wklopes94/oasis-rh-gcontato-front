import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CriarComponent } from '../crud/criar/criar.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(private router: Router, private dialog : MatDialog) { }

  ngOnInit(): void {
  }

  navegarParaCriarConjunto(){
    this.router.navigate(["./oa-admin/gestao/entidades/extensoes/create"])
  }

  navegarParaListarConjunto(){
    this.router.navigate(["./oa-admin/gestao/entidades/extensoes/listar"])
  }

  openDialog() {
    const dialogRef = this.dialog.open(CriarComponent, {
        width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }


}
