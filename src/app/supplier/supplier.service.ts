import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';
import { Supplier } from './supplier.model';
import { tap } from 'rxjs/operators';
import { URL_SERVICIOS } from '../auth/url/url';
import { InvoiceComponent } from '../invoice/invoice.component';
import { Invoice } from '../invoice/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  api = "api/supplier/get-supplier"

  setTruePayment = "api/invoice/setTruePaymentInvoiceById";
  setFalsePayment = "api/invoice/setFalsePaymentInvoiceById";
  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) { }

  addSupplier(supplier: Supplier): Observable<any> {
    this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    const req = new HttpRequest('POST', 'http://localhost:8080/api/supplier/add-supplier', supplier,  {
      headers: this.httpHeaders,
      reportProgress: true,
      responseType: 'text'
    })
    return this.http.request(req).pipe(
      // tap(() =>  {
      //   this._refreshNeeded$.next();
      // })
    );

  }


  updateSupplier(supplier: Supplier): Observable<any> {
    this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    const req = new HttpRequest('PUT', 'http://localhost:8080/api/supplier/update-supplier', supplier,  {
      headers: this.httpHeaders,
      reportProgress: true,
      responseType: 'text'
    })
    return this.http.request(req).pipe(
      // tap(() =>  {
      //   this._refreshNeeded$.next();
      // })
    );

  }

  getAllSuppliers(): Observable<Supplier[]> {
    console.log('GET ALL ACCOUNTS TYPE');
     this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get<Supplier[]>( 'http://localhost:8080/api/supplier/get-suppliers', {headers: this.httpHeaders})
      .pipe(tap(()=>{

        this._refreshNeeded$.next;

      })
  )}


  getInvoiceSuppliers(): Observable<any[]> {
    console.log('GET ALL ACCOUNTS TYPE');
     this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get<any[]>( 'http://localhost:8080/api/supplier//get-supplier-invoice', {headers: this.httpHeaders})
      .pipe(tap(()=>{

        this._refreshNeeded$.next;

      })
  )}



      getSupplierById(id: any): Observable<Supplier> {
        console.log('GET ALL ACCOUNTS TYPE');
         this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
          return this.http.get<Supplier>(`${URL_SERVICIOS}/${this.api}/${id}`,  {headers: this.httpHeaders})


        }


        addInvoiceSupplier(invoice: any): Observable<any> {
          this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
          const req = new HttpRequest('POST', 'http://localhost:8080/api/supplier/add-supplier-invoice', invoice,  {
            headers: this.httpHeaders,
            reportProgress: true,
            responseType: 'text'
          })
          return this.http.request(req).pipe(
            // tap(() =>  {
            //   this._refreshNeeded$.next();
            // })
          );

        }


}
