import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  URI: string = env.API;

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get(this.URI + 'productos/all');
  }
  getProductByCode(code: string): Observable<any> {
    return this.http.get(this.URI + 'productos/' + code);
  }

  sendBandaData(data: any, location: string): Observable<any> {

    // Create the HTTP request
    return this.http.post(`${this.URI}bandas/ubic/store/${location}`, data);
  }


}
