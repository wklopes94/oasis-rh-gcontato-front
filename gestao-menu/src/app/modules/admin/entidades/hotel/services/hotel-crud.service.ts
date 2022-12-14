import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';
import { take, catchError, delay } from 'rxjs/operators';
import { IReqHotel } from './../interfaces/i-req-hotel';
import { IResponsePageableHotel } from './../interfaces/i-response-pageable-hotel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IHotel } from '../interfaces/i-hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelCrudService extends ApiCrudService<IReqHotel> {

  baseUrl: String = environment.baseUrl;

  constructor(protected override http: HttpClient) {
    super(http, 'hotels');
  }


    createColaboradorFromIReqHotel(record: any) {
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

    findById(id: String): Observable<IHotel>{
      const url = `${this.baseUrl}/hotels/${id}`
      return this.http.get<IHotel>(url)
    }



      // Get all Data by URL
  getDataByURLS(url: string): Observable<IResponsePageableHotel> {
    return this.http
      .get<IResponsePageableHotel>(url, { headers: this.headers })
      .pipe(delay(2000),take(1));
  }

    findAl(
      page: number,
      size: number,
      sort: string,
      ordem: string
    ): Observable<IResponsePageableHotel> {
      console.log('ENTROU');

      //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

      let url = `${
        super.getAPIURL
      }?page=${page}&size=${size}&sort=${sort},${ordem}`;
      return this.http
        .get<IResponsePageableHotel>(url, { headers: super.headers })
        .pipe(delay(2000),take(1));
    }

    delete(id: String): Observable<void>{
      const url = `${this.baseUrl}/hotels/${id}`
      return this.http.delete<void>(url)
    }

      // Update Data
  updateDatas(id: number, record: IReqHotel): Observable<IResponsePageableHotel> {
    let url = `${super.getAPIURL}/${id}`;
    return this.http.put<IResponsePageableHotel>(url, record, { headers: this.headers }).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }

    findBydepartamentosNome(nome: String): Observable<IReqHotel[]>{
      const  url = `${this.baseUrl}/hotels/search/findBydepartamentosModelNome?nome=${nome}`
      return this.http.get<IReqHotel[]>(url)
    }

    findByName(
      page: number,
      size: number,
      sort: string,
      ordem: string,
      nome: string
    ): Observable<IResponsePageableHotel>{
      const  url = `${this.baseUrl}/hotels/search/findBynome?nome=${nome}&page=${page}&size=${size}&sort=${sort},${ordem}`
      return this.http.get<IResponsePageableHotel>(url, { headers: super.headers }).pipe(delay(0),take(1));
    }

    findByAtivo(
      page: number,
      size: number,
      sort: string,
      ordem: string,
      estado: string
    ): Observable<IResponsePageableHotel> {
      console.log('ENTROU');

      //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

      let url = `${super.getAPIURL}/search/findByestado?estado=${estado}&page=${page}&size=${size}&sort=${sort},${ordem}`;
      return this.http
        .get<IResponsePageableHotel>(url, { headers: super.headers })
        .pipe(delay(0),take(1));
    }
}
