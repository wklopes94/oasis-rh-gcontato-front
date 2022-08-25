import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, take } from 'rxjs';
import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';
import { environment } from 'src/environments/environment';
import { IDepartamento } from '../interfaces/i-departamento';
import { IResponsePageableDepartamento } from '../interfaces/i-response-pageable-departamento';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoCrudService extends ApiCrudService<IDepartamento> {

  baseUrl: String = environment.baseUrl

  constructor( protected override http: HttpClient) {
    super(http, 'departamentos');
   }


  createDep(departamento: IResponsePageableDepartamento, id_dep: String){

    const url = `${this.baseUrl}/departamentos?hotelFk=${id_dep}`
    return this.http.post<IResponsePageableDepartamento>(url, departamento)
  }

  findAll(page: number, size: number, sort: string, ordem: string): Observable<IResponsePageableDepartamento> {
    console.log('ENTROU');

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${
      super.getAPIURL
    }?page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http
      .get<IResponsePageableDepartamento>(url, { headers: super.headers })
      .pipe(delay(500),take(1));
  }

    // Get all Data by URL
    getDataByURLS(url: string): Observable<IResponsePageableDepartamento> {
      return this.http
        .get<IResponsePageableDepartamento>(url, { headers: super.headers })
        .pipe(take(1));

    }

    createDepartamentoFromIReqColab(record: any) {
      let url = `${super.getAPIURL}`;
      //let data: JSON.stringify(record),
      return this.http.post(url, record,  { headers: super.getheaders })
        .pipe(
          take(1), //depois da resposta ele faz unsubscribe automaticamente
          catchError(this.errorMgmt)
        );
    }



}
