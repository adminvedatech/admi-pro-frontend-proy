import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Invoice } from './invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  httpHeaders: HttpHeaders;
  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }


  constructor(private http: HttpClient) { }

  sendXmlCustomerInvoice(fileXml: File): Observable<any> {
    const formdata: FormData = new FormData();
    this.httpHeaders = new HttpHeaders({'Content-Type': 'application/xml'});
    formdata.append('file', fileXml);
    console.log('FORM DATA ', formdata);
    const req = new HttpRequest('POST', 'http://localhost:8080/api/invoice/customer-xml-file', fileXml,  {
     headers: this.httpHeaders,
      reportProgress: true,
      responseType: 'text'
    })
    return this.http.request(req).pipe(
      tap(() =>  {
        this._refreshNeeded$.next();
      })
    );
    return this.http.request(req);
  }

  sendXmlCustomerInvoiceParam(fileXml: File): Observable<any> {
    const formdata: FormData = new FormData();
    this.httpHeaders = new HttpHeaders({'Content-Type': 'application/xml'});
    formdata.append('file', fileXml);
    console.log('FORM DATA ', formdata);
    const req = new HttpRequest('POST', 'http://localhost:8080/api/invoice/supplier-xml-file', fileXml,  {
     headers: this.httpHeaders,
      reportProgress: true,
     // responseType: 'text'
    })
    // return this.http.request(req).pipe(
    //   tap(() =>  {
    //     this._refreshNeeded$.next();
    //   })
    // );
    return this.http.request(req);
  }

  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    this.httpHeaders = new HttpHeaders({'Accept': 'application/json'});
    formdata.append('file', file);
    console.log('FORM DATA ', formdata);

    const req = new HttpRequest('POST', 'http://localhost:8080/api/param/upload-service', formdata,  {
      headers: this.httpHeaders,
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req)
     .pipe(
      tap(() =>  {
        this._refreshNeeded$.next();
      })
    );
  }


  uploadFileToServer(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    this.httpHeaders = new HttpHeaders({'Accept': 'application/json'});
    formdata.append('file', file);
    console.log('FORM DATA ', formdata);

    const req = new HttpRequest('POST', 'http://localhost:8080/api/param/upload-supplier-service', formdata,  {
      headers: this.httpHeaders,
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req)
     .pipe(
      tap(() =>  {
        this._refreshNeeded$.next();
      })
    );
  }


  sendXmlSupplierInvoice(fileXml: File): Observable<any> {
    const formdata: FormData = new FormData();
    this.httpHeaders = new HttpHeaders({'Content-Type': 'application/xml'});
    formdata.append('file', fileXml);
    console.log('FORM DATA ', formdata);
    const req = new HttpRequest('POST', 'http://localhost:8080/api/invoice/supplier-xml-file', fileXml,  {
     headers: this.httpHeaders,
      reportProgress: true,
      responseType: 'text'
    })
    return this.http.request(req).pipe(
      tap(() =>  {
        this._refreshNeeded$.next();
      })
    );
    return this.http.request(req);
  }



  getAllSales(): Observable<any[]> {
    console.log('GET ALL ACCOUNTS TYPE');
     this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get<any[]>( 'http://localhost:8080/api/report/getSalesByProduct', {headers: this.httpHeaders})


    }

    getSupplierInvoices(): Observable<Invoice[]> {
      console.log('GET ALL ACCOUNTS TYPE');
       this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.get<Invoice[]>( 'http://localhost:8080/api/supplier/get-supplier-invoice', {headers: this.httpHeaders})
        .pipe(tap(()=>{

          this._refreshNeeded$.next;

        })
  )}


  getCustomerInvoices(): Observable<Invoice[]> {
    console.log('GET ALL ACCOUNTS TYPE');
     this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get<Invoice[]>( 'http://localhost:8080/api/supplier/get-customer-invoice', {headers: this.httpHeaders})
      .pipe(tap(()=>{

        this._refreshNeeded$.next;

      })
)}


}
