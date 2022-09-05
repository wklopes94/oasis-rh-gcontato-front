import { catchError, delay, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';
import { environment } from 'src/environments/environment';
import { IColaborador } from '../interfaces/i-colaborador';
import { IReqColaborador } from '../interfaces/i-req-colaborador';
import { IResponsePageableColaborador } from '../interfaces/i-response-pageable-colaborador';
import { IResponsePageableTipocolaborador } from '../../tipocolaborador/interfaces/i-response-pageable-tipocolaborador';

@Injectable({
  providedIn: 'root',
})

export class ColaboradorCrudService extends ApiCrudService<IColaborador> {
  baseUrl: String = environment.baseUrl;



  constructor(protected override http: HttpClient) {
    super(http, 'colaboradores');
  }



  findAl(page: number, size: number, sort: string, ordem: string): Observable<IResponsePageableColaborador> {
    console.log('ENTROU');

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${
      super.getAPIURL
    }?page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http
      .get<IResponsePageableColaborador>(url, { headers: super.headers })
      .pipe(delay(500),take(1));
  }

  createColaboradorFromIReqColab(record: IReqColaborador) {
    let url = `${super.getAPIURL}`;
    //let data: JSON.stringify(record),
    return this.http.post(url, record,  { headers: super.getheaders })
      .pipe(
        take(1), //depois da resposta ele faz unsubscribe automaticamente
        catchError(this.errorMgmt)
      );
  }


  // Get all Data by URL
  getDataByURLS(url: string): Observable<IResponsePageableColaborador> {
    return this.http
      .get<IResponsePageableColaborador>(url, { headers: super.headers })
      .pipe(take(1));
  }

  findByHotelFk(page: number,
    size: number,
    sort: string,
    ordem: string,
    hotel: string): Observable<IResponsePageableColaborador>{
    let url = `${super.getAPIURL}/search/findByDepartamentoFkHotelFkNome?nome=${hotel}&page=${page}&size=${size}&sort=${sort},${ordem}`

    return this.http
    .get<IResponsePageableColaborador>(url, { headers: super.headers })
    .pipe(delay(0),take(1));
  }

  findByDepartamentoFk(departamento: string,
    page: number,
    size: number,
    sort: string,
    ordem: string,

    ): Observable<IResponsePageableColaborador>{
    let url = `${super.getAPIURL}/search/findByDepartamentoFkNome?nome=${departamento}&page=${page}&size=${size}&sort=${sort},${ordem}`

    return this.http
    .get<IResponsePageableColaborador>(url, { headers: super.headers })
    .pipe(delay(0),take(1));
  }


  findByDepartamentoFkAndNomeColab(
    nome: string,
    departamento: string,
    page: number,
    size: number,
    sort: string,
    ordem: string,

    ): Observable<IResponsePageableColaborador>{
    let url = `${super.getAPIURL}/search/findByNomeColabAndDepartamentoFkNome?numero=${nome}&departamento=${departamento}&page=${page}&size=${size}&sort=${sort},${ordem}`

    return this.http
    .get<IResponsePageableColaborador>(url, { headers: super.headers })
    .pipe(delay(0),take(1));
  }


}
