import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesByItems } from '../report/Report';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) { }



  getAllSalesFebrero(): Observable<any> {
    console.log('GET ALL ACCOUNTS TYPE');
     this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get<any>( 'http://localhost:8080/api/test/getCantidad', { headers: this.httpHeaders})


    }

    getCostByMonth(): Observable<any> {
      console.log('GET ALL ACCOUNTS TYPE');
       this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.get<any>( 'http://localhost:8080/api/test/get-cost-by-mont', { headers: this.httpHeaders})


      }

      getMovementWharehouse(): Observable<any> {
        console.log('GET ALL ACCOUNTS TYPE');
         this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
          return this.http.get<any>( 'http://localhost:8080/api/test/get-movements-wharehouse', { headers: this.httpHeaders})


        }

        getProductionDate(): Observable<any> {
          console.log('GET ALL ACCOUNTS TYPE');
           this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
            return this.http.get<any>( 'http://localhost:8080/api/test/get-production-date', { headers: this.httpHeaders})


          }
}

