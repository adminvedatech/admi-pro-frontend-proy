import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpEvent, HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Bank, BankMovementRegister } from './bank.model';
import { URL_SERVICIOS } from '../auth/url/url';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  api = "api/bank-movement/get-bank-movement-csv";
  apiedit ="api/bank/get-banking-account-byId";
  apieditregister ="api/bank-movement/get-bank-movement-register";
  apidelete ="api/bank-movement/delete";
  apigetBankByAccount="api/bank/get-banking-account-byAccount";

  httpHeaders: HttpHeaders;

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  constructor(private http: HttpClient) { }


  addBank(bank: Bank): Observable<any> {
    this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    const req = new HttpRequest('POST', 'http://localhost:8080/api/bank/add-bank', bank,  {
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

  updateBank(bank: Bank): Observable<any> {
    this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    const req = new HttpRequest('PUT', 'http://localhost:8080/api/bank/update-bank', bank,  {
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


  getBankById(id: any): Observable<Bank> {
    console.log('GET ALL ACCOUNTS TYPE');
     this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get<Bank>(`${URL_SERVICIOS}/${this.apiedit}/${id}`,  {headers: this.httpHeaders})


    }


    getBankByAccount(id:any):Observable<Bank>{
      this.httpHeaders = new HttpHeaders({'Content-Type': 'application/html'});
      return this.http.get<Bank>(`${URL_SERVICIOS}/${this.apigetBankByAccount}/${id}`,  {headers: this.httpHeaders})


    }

    // getBankMovementRegisterById(id: any): Observable<Bank> {
    //   console.log('GET ALL ACCOUNTS TYPE');
    //    this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    //     return this.http.get<Bank>(`${URL_SERVICIOS}/${this.apieditregister}/${id}`,  {headers: this.httpHeaders})


    //   }


      getBankMovementRegisterById(id: any): Observable<BankMovementRegister> {
        console.log('GET ALL ACCOUNTS TYPE');
         this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
          return this.http.get<BankMovementRegister>(`${URL_SERVICIOS}/${this.apieditregister}/${id}`,  {headers: this.httpHeaders})


        }

    pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
      const formdata: FormData = new FormData();
      this.httpHeaders = new HttpHeaders({ Accept: "application/json" });
      formdata.append("file", file);
      console.log("FORM DATA ", formdata);

      const req = new HttpRequest(
        "POST",
        "http://localhost:8080/api/bank-movement/upload-service",
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


    addBankMovement(bankMovement: any): Observable<any> {
      this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      const req = new HttpRequest('POST', 'http://localhost:8080/api/bank-movement/add', bankMovement,  {
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

    deleteBankMovement(id: any): Observable<any> {
      this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      const req = new HttpRequest('DELETE', `${URL_SERVICIOS}/${this.apidelete}/${id}`, {
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


    getAllBankAccounts(): Observable<Bank[]> {
      console.log("GET ALL ACCOUNTS TYPE");
      this.httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
      return this.http
        .get<Bank[]>("http://localhost:8080/api/bank/get-all-bank-account", {
          headers: this.httpHeaders
        })
        .pipe(
          tap(() => {
            this._refreshNeeded$.next;
          })
        );
    }


    getAllBankMovementCsv(): Observable<any[]> {
      console.log('GET ALL ACCOUNTS TYPE');
       this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.get<any[]>(URL_SERVICIOS + '/api/bank-movement/get-bank-movement-csv', {headers: this.httpHeaders})
        .pipe(
          tap(() => {
            this._refreshNeeded$.next;
          })
        );

      }


      getAllBankMovementsRegister(): Observable<any[]> {
        console.log('GET ALL ACCOUNTS TYPE');
         this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
          return this.http.get<any[]>(URL_SERVICIOS + '/api/bank-movement/get-bank-movement-register', {headers: this.httpHeaders})
          // .pipe(
          //   map( obj => obj.filter(r => (r.subaccount.id !==null)[0]  )
          //   )
          // );


        }


      getBankMovementCsvById(id: any): Observable<any> {
        console.log("GET ALL ACCOUNTS TYPE");
        this.httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
        return this.http.get<any>(`${URL_SERVICIOS}/${this.api}/${id}`, {
          headers: this.httpHeaders
        });
      }




}
