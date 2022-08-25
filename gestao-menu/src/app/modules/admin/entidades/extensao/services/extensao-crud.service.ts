import { IResponsePageableExtensao } from './../interfaces/i-response-pageable-extensao';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, take, catchError } from 'rxjs';
import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';
import { environment } from 'src/environments/environment';
import { IExtensao } from '../interfaces/i-extensao';

@Injectable({
  providedIn: 'root'
})
export class ExtensaoCrudService extends ApiCrudService<IExtensao>  {

  baseUrl: String = environment.baseUrl;

  constructor(protected override http: HttpClient) {
    super(http, 'extensoes');
  }

  createColaboradorFromIReqExtensao(record: any) {
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

  findAll(page: number, size: number, sort: string, ordem: string): Observable<IResponsePageableExtensao> {
    console.log('ENTROU');

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${
      super.getAPIURL
    }?page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http
      .get<IResponsePageableExtensao>(url, { headers: super.headers })
      .pipe(delay(500),take(1));
  }

  getDataByURLS(url: string): Observable<IResponsePageableExtensao> {
    return this.http
      .get<IResponsePageableExtensao>(url, { headers: super.headers })
      .pipe(take(1));
  }

  findById(id: String): Observable<IExtensao>{
    const url = `${this.baseUrl}/extensao/${id}`
    return this.http.get<IExtensao>(url)
  }

  create(extensao: IExtensao): Observable<IExtensao>{
    const url = `${this.baseUrl}/extensao`
    return this.http.post<IExtensao>(url, extensao);

  }

  createExt(departamento: IExtensao, id_dep: String){

    const url = `${this.baseUrl}/extensao?departamentoFk=${id_dep}`
    return this.http.post<IExtensao>(url, departamento)
  }

  delete(id: String): Observable<void>{
    const url = `${this.baseUrl}/extensao/${id}`
    return this.http.delete<void>(url)
  }

  update(extensao: IExtensao): Observable<void>{
    const url = `${this.baseUrl}/extensao/${extensao.id}`
    return this.http.put<void>(url, extensao)
  }
}
