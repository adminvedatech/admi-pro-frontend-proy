import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

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
      // responseType: 'text'
    })
    return this.http.request(req).pipe(
      tap(() =>  {
        this._refreshNeeded$.next();
      })
    );
    return this.http.request(req);
  }

}
