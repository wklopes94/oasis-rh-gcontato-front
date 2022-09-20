import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, take } from 'rxjs';
import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';
import { environment } from 'src/environments/environment';
import { IReqHotel } from '../../admin/entidades/hotel/interfaces/i-req-hotel';
import { IResponsePageableGuest } from '../interfaces/i-response-pageable-guest';

@Injectable({
  providedIn: 'root'
})
export class GuestCrudService extends ApiCrudService<IReqHotel> {

  baseUrl: String = environment.baseUrl;

  constructor(protected override http: HttpClient) {
    super(http, 'hotels');
  }

  getDataByURLS(url: string): Observable<IResponsePageableGuest> {
    return this.http
      .get<IResponsePageableGuest>(url, { headers: this.headers })
      .pipe(delay(2000),take(1));
  }

  findByAtivo(
    page: number,
    size: number,
    sort: string,
    ordem: string,
    estado: string
  ): Observable<IResponsePageableGuest> {
    console.log('ENTROU');

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${super.getAPIURL}/search/findByestado?estado=${estado}&page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http
      .get<IResponsePageableGuest>(url, { headers: super.headers })
      .pipe(delay(0),take(1));
  }


}
