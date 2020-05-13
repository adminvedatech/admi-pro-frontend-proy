import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SalesByItems } from './Report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  httpHeaders: HttpHeaders;


  constructor(private http: HttpClient) { }


  getAllSales(): Observable<SalesByItems[]> {
    console.log('GET ALL ACCOUNTS TYPE');
     this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get<SalesByItems[]>( 'http://localhost:8080/api/report/getSalesByProduct', {params: {after: '01 01 2020', before:'31 01 2020'}, headers: this.httpHeaders})


    }

    getAllSalesFebrero(): Observable<SalesByItems[]> {
      console.log('GET ALL ACCOUNTS TYPE');
       this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.get<SalesByItems[]>( 'http://localhost:8080/api/report/getSalesByProduct', {params: {after: '01 02 2020', before:'28 02 2020'}, headers: this.httpHeaders})


      }
}
