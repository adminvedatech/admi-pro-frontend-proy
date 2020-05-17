import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpHeaders, HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../auth/url/url';
import { AccountType, SubAccount, Poliza, Cuentas} from './account.model';
import { tap, map } from 'rxjs/operators';
import { Invoice } from '../invoice/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  numPoliza="api/poliza/get-poliza-by-number";
  invoice="api/supplier/get-supplier-invoice";
  subAccountNumber="api/contabilidad/get-subaccount-by-number";

  subAccount:any;
  private httpHeaders = new HttpHeaders();

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }


  constructor(private http: HttpClient) { }


  createSubAccount(object: SubAccount): Observable<SubAccount> {
    this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      // url += '?token=' + this.token;
      return this.http.post<SubAccount>(URL_SERVICIOS +
          '/api/contabilidad/addSubAccount', object, {headers: this.httpHeaders})

    }


    // createPoliza(object: any): Observable<String> {
    //   this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    //     // url += '?token=' + this.token;
    //     return this.http.post<String>(URL_SERVICIOS +
    //         '/api/poliza/add-poliza', object, {headers: this.httpHeaders})

    //   }


      createPoliza(obj: any): Observable<any> {
        this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        const req = new HttpRequest('POST', 'http://localhost:8080/api/poliza/add-poliza', obj,  {
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


      createInvoicePoliza(obj: any): Observable<any> {
        this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        const req = new HttpRequest('POST', 'http://localhost:8080/api/poliza/add-invoice-poliza', obj,  {
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



      updatePoliza(object: Poliza): Observable<Poliza> {
        this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
          // url += '?token=' + this.token;
          return this.http.put<Poliza>(URL_SERVICIOS +
              '/api/poliza/update-poliza', object, {headers: this.httpHeaders})

        }

      pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
        const formdata: FormData = new FormData();
        this.httpHeaders = new HttpHeaders({ Accept: "application/json" });
        formdata.append("file", file);
        console.log("FORM DATA ", formdata);

        const req = new HttpRequest(
          "POST",
          "http://localhost:8080/api/contabilidad/upload-service",
          formdata,
          {
            headers: this.httpHeaders,
            reportProgress: true,
            responseType: "text"
          }
        );
        return this.http.request(req).pipe(
          tap(() => {
            this._refreshNeeded$.next();
          })
        );
      }


    getAllAccounts(): Observable<Cuentas[]> {
      console.log('GET ALL ACCOUNTS TYPE');
       this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.get<Cuentas[]>(URL_SERVICIOS + '/api/contabilidad/getAllCuentas', {headers: this.httpHeaders})
        // .pipe(
        //   map( obj => obj.filter(r => (r.subaccount.id !==null)[0]  )
        //   )
        // );


      }


    getAllSubAccounts(): Observable<SubAccount[]> {
      console.log('GET ALL ACCOUNTS TYPE');
       this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.get<SubAccount[]>(URL_SERVICIOS + '/api/contabilidad/get-all-subaccounts', {headers: this.httpHeaders})


      }

      getAllSubAccounts2(): Observable<any[]> {
        console.log('GET ALL ACCOUNTS TYPE');
         this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
          return this.http.get<any[]>(URL_SERVICIOS + '/api/contabilidad/get-all-subaccounts', {headers: this.httpHeaders})


        }

  getBankMovementPolizaByNumber(num: any): Observable<any> {
    console.log('GET ALL ACCOUNTS TYPE');
      this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get<any>(`${URL_SERVICIOS}/${this.numPoliza}/${num}`,  {headers: this.httpHeaders})


    }

    getInvoiceById(id: any): Observable<Invoice> {
      console.log('GET ALL ACCOUNTS TYPE');
        this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.get<Invoice>(`${URL_SERVICIOS}/${this.invoice}/${id}`,  {headers: this.httpHeaders})


      }


      getSubAccountBySubAccountNumber(num: any): Observable<any> {
        console.log('GET ALL ACCOUNTS TYPE');
          this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
          return this.http.get<any>(`${URL_SERVICIOS}/${this.subAccountNumber}/${num}`,  {headers: this.httpHeaders})


        }


       getAsyncData(num:any) {
          this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
           const promise = this.http.get(`${URL_SERVICIOS}/${this.subAccountNumber}/${num}`,  {headers: this.httpHeaders}).toPromise();
          console.log('PRIMISE ', promise);
          promise.then((data)=>{
            console.log("Promise resolved with: " + JSON.stringify(data));
             this.subAccount = data
          }).catch((error)=>{
            console.log("Promise rejected with " + JSON.stringify(error));
          });
          return this.subAccount;
      }

        getPosts(num:any) {
          const promise = new Promise((resolve, reject) => {
         //   const apiURL = this.api;
         this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
            this.http
              .get<any>(`${URL_SERVICIOS}/${this.subAccountNumber}/${num}`,  {headers: this.httpHeaders})
              .toPromise()
              .then((res: any) => {
                // Success
                 this.subAccount = res.map((res: any) => {
                   this.subAccount = res;
                //   return new Post(
                //     res.userId,
                //     res.id,
                //     res.title,
                //     res.body
                //   );
                 });
                resolve();
              },
                err => {
                  // Error
                  reject(err);
                }
              );
          });
          return promise;
        }
      }


