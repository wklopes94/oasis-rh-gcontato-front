import { IResponsePageableHotel } from './../../modules/admin/entidades/hotel/interfaces/i-response-pageable-hotel';

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take, delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { MatSnackBar } from '@angular/material/snack-bar';



@Injectable({
  providedIn: 'root'
})

export class ApiCrudService<T> {

   headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin','*');



  get getheaders(): any {
    return this.headers;
  }


private  API_URL: String;
  get getAPIURL(): any {
    return this.API_URL;
  }


  constructor(protected  http: HttpClient, private URI: String) {
    this.API_URL = environment.API+URI;
    console.log("API_URL: "+this.API_URL);
    }


  // Create
  createData(record: any) {
    let url = `${this.API_URL}`;
    return this.http.post(url, record,  { headers: this.headers })
      .pipe(
        take(1), //depois da resposta ele faz unsubscribe automaticamente
        catchError(this.errorMgmt)
      );
  }

  // Get all Data
  //getAllData(): Observable<T[]> {
    getAllData(): Observable<T[]> {
    console.log('URL: ', this.API_URL);
    return this.http.get<T[]>( `${this.API_URL}`).pipe(
      //delay(2000), //para remover em produção
      take(1), // com isso já não é preciso fazer unsubscribe
      catchError(this.errorMgmt)
    );
  }

  // Get all Data by URL
  getDataByURL(url: string): Observable<IResponsePageableHotel> {
    return this.http.get<IResponsePageableHotel>(url, {headers: this.headers}).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }

  // Get Data
  getData(id: number): Observable<T> {
    let url = `${this.API_URL}/${id}`;
    return this.http.get<T>(url, {headers: this.headers}).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }


  // Update Data
  updateData(id: number, record: T): Observable<T> {
    let url = `${this.API_URL}/${id}`;
    return this.http.put<T>(url, record, { headers: this.headers }).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }

  // Delete Data
  deleteData(id: number): Observable<void> {

    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }

    let url = `${this.API_URL}/${id}`;
    return this.http.delete<void>(url, requestOptions).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }


  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }



}
