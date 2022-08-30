import { IReqDepartamento } from './../interfaces/i-req-departamento';
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
          // Update Data
  updateDatas(id: number, record: IReqDepartamento): Observable<IResponsePageableDepartamento> {
    let url = `${super.getAPIURL}/${id}`;
    return this.http.put<IResponsePageableDepartamento>(url, record, { headers: this.headers }).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }

  delete(id: String): Observable<void>{
    const url = `${this.baseUrl}/departamentos/${id}`
    return this.http.delete<void>(url)
  }


  findByName(
    page: number,
    size: number,
    sort: string,
    ordem: string,
    nome: string
  ): Observable<IResponsePageableDepartamento>{
    const  url = `${this.baseUrl}/departamentos/search/findBynome?nome=${nome}&page=${page}&size=${size}&sort=${sort},${ordem}`
    return this.http.get<IResponsePageableDepartamento>(url, { headers: super.headers }).pipe(delay(0),take(1));
  }

  findByAtivo(
    page: number,
    size: number,
    sort: string,
    ordem: string,
    estado: string
  ): Observable<IResponsePageableDepartamento> {
    console.log('ENTROU');

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${super.getAPIURL}/search/findByEstado?estado=${estado}&page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http
      .get<IResponsePageableDepartamento>(url, { headers: super.headers })
      .pipe(delay(0),take(1));
  }

  findByHotelFk(page: number,
    size: number,
    sort: string,
    ordem: string,
    hotel: string): Observable<IResponsePageableDepartamento>{
    let url = `${super.getAPIURL}/search/findByhotelFkNome?nome=${hotel}&page=${page}&size=${size}&sort=${sort},${ordem}`

    return this.http
    .get<IResponsePageableDepartamento>(url, { headers: super.headers })
    .pipe(delay(0),take(1));
  }

  findByNomeAndHotelFk(nome: string,
    hotel: string,
    page: number,
    size: number,
    sort: string,
    ordem: string,

    ): Observable<IResponsePageableDepartamento>{
    let url = `${super.getAPIURL}/search/findByNomeAndHotelFkNome?nome=${nome}&hotel=${hotel}&page=${page}&size=${size}&sort=${sort},${ordem}`

    return this.http
    .get<IResponsePageableDepartamento>(url, { headers: super.headers })
    .pipe(delay(0),take(1));
  }

}
