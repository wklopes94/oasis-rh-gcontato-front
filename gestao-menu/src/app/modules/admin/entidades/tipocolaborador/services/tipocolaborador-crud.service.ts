import { IReqTipocolaborador } from './../interfaces/i-req-tipocolaborador';
import { IReqColaborador } from './../../colaborador/interfaces/i-req-colaborador';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IResponsePageableTipocolaborador } from './../interfaces/i-response-pageable-tipocolaborador';
import { take, delay, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITipocolaborador } from '../interfaces/i-tipocolaborador';
import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';

@Injectable({
  providedIn: 'root'
})
export class TipocolaboradorCrudService extends ApiCrudService<ITipocolaborador> {

  baseUrl: String = environment.baseUrl;

  constructor(protected override http: HttpClient, ) {
    super(http, "tipocolaboradores");
  }

  createColaboradorFromIReqTipoColaborador(record: any) {
    console.log('Json: ', record);
    let url = `${super.getAPIURL}`;
    console.log('url: ', url);

    //let data: JSON.stringify(record),
    return this.http.post(url, record,  { headers: super.getheaders })
      .pipe(
        take(1), //depois da resposta ele faz unsubscribe automaticamente
        catchError(this.errorMgmt)
      );
  }

  findById(id: String): Observable<ITipocolaborador>{
    const url = `${this.baseUrl}/tipocolaborador/${id}`
    return this.http.get<ITipocolaborador>(url).pipe(
      //delay(2000), //para remover em produção
      take(1)); // com isso já não é preciso fazer unsubscribe
  }

  findAll(page: number, size: number, sort: string, ordem: string): Observable<IResponsePageableTipocolaborador> {
    console.log("ENTROU");

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${super.getAPIURL}?page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http.get<IResponsePageableTipocolaborador>(url, {'headers': super.headers}).pipe(
      delay(2000),
      take(1),
      catchError(this.errorMgmt));
  }

  create(departamento: IReqColaborador): Observable<IReqColaborador>{
    const url = `${this.baseUrl}/tipocolaboradores`
    return this.http.post<IReqColaborador>(url, departamento).pipe(
      //delay(2000), //para remover em produção
      take(1)); // com isso já não é preciso fazer unsubscribe

  }

  creater(departamento: IReqTipocolaborador): Observable<IReqTipocolaborador>{
    const url = `${this.baseUrl}/tipocolaboradores`
    return this.http.post<IReqTipocolaborador>(url, departamento);

  }

  delete(id: String): Observable<void>{
    const url = `${this.baseUrl}/tipocolaborador/${id}`
    return this.http.delete<void>(url).pipe(
      //delay(2000), //para remover em produção
      take(1)); // com isso já não é preciso fazer unsubscribe
  }

  update(departamento: ITipocolaborador): Observable<void>{
    const url = `${this.baseUrl}/tipocolaborador/${departamento.id}`
    return this.http.put<void>(url, departamento).pipe(
      //delay(2000), //para remover em produção
      take(1)); // com isso já não é preciso fazer unsubscribe
  }


}
