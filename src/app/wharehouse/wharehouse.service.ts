import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Invoice } from '../invoice/invoice.model';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Wharehouse } from './movement-wharehouse/wharehouse.model';
import { Inventory, MovementsWharehouse } from './wharehouse.model';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WharehouseService {

  httpHeaders: HttpHeaders;
  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }


  constructor(private http: HttpClient) { }

  getMovementsWharehouse(): Observable<Wharehouse[]> {
    console.log('GET ALL ACCOUNTS TYPE');
     this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get( 'http://localhost:8080/api/test/get-movements-wharehouse', {headers: this.httpHeaders})
      .pipe(
        map(res=> {
          let movements = res as Wharehouse[];
          return movements.map(movement => {
            movement.description = movement.description.toUpperCase();
             movement.fecha = formatDate(movement.fecha, 'yyyy-MM-dd', 'en-US');
          //  console.log('COMO LLEGA LA FECHA IS ', movement.fecha.toString().split(' ')[0]);

        //     console.log('FECHA ES ', Date.parse(movement.fecha));
         //    console.log('NUEVA FECHA IS ', new Date( Date.parse(movement.fecha)).toUTCString());
          //    console.log('FORMATE FECHA ARREEEE ', this.formatDate(movement.fecha) );
             //  this.formatDate(movement.fecha);

           //   movement.fecha  = new Date( Date.parse(movement.fecha)).toUTCString();
            return movement;
          });

        }),

      )}

      getInventory(): Observable<Inventory[]> {
        console.log('GET ALL ACCOUNTS TYPE');
         this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
          return this.http.get<Inventory[]>( 'http://localhost:8080/api/wharehouse/get-inventory', {headers: this.httpHeaders})
          .pipe(tap(()=>{

            this._refreshNeeded$.next;

          })


          )}


          addMovementWharehouse(movement: any): Observable<any> {
            this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
            const req = new HttpRequest('POST', 'http://localhost:8080/api/wharehouse/add-movement-wharehouse', movement,  {
              headers: this.httpHeaders,
              reportProgress: true,
              responseType: 'text'
            })
            return this.http.request(req).pipe(
              tap(() =>  {
                this._refreshNeeded$.next();
              })
            );

          }

          formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            //  console.log('SPLIT T', date.toISOString().split('T')[0] );

            return [year, month, day].join('-');
        }



}
