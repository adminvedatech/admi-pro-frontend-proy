import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest
} from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { Product, Production } from "./Product.model";
import { URL_SERVICIOS } from "../auth/url/url";
import { ProductListComponent } from "./product-list/product-list.component";

@Injectable({
  providedIn: "root"
})
export class ProductionService {
  httpHeaders: HttpHeaders;
  api = "api/production/get-product";

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  constructor(private http: HttpClient) {}

  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    this.httpHeaders = new HttpHeaders({ Accept: "application/json" });
    formdata.append("file", file);
    console.log("FORM DATA ", formdata);

    const req = new HttpRequest(
      "POST",
      "http://localhost:8080/api/production/upload-service",
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

  getAllProducts(): Observable<Product[]> {
    console.log("GET ALL ACCOUNTS TYPE");
    this.httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http
      .get<Product[]>("http://localhost:8080/api/production/getAllProducts", {
        headers: this.httpHeaders
      })
      .pipe(
        tap(() => {
          this._refreshNeeded$.next;
        })
      );
  }

  addProduct(product: Product): Observable<any> {
    this.httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    const req = new HttpRequest(
      "POST",
      "http://localhost:8080/api/production/add-product",
      product,
      {
        headers: this.httpHeaders,
        reportProgress: true,
        responseType: "text"
      }
    );
    return this.http
      .request(req)
      .pipe
      // tap(() =>  {
      //   this._refreshNeeded$.next();
      // })
      ();
  }

  updateProduct(product: Product): Observable<any> {
    this.httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    const req = new HttpRequest(
      "PUT",
      "http://localhost:8080/api/production/update-product",
      product,
      {
        headers: this.httpHeaders,
        reportProgress: true,
        responseType: "text"
      }
    );
    return this.http
      .request(req)
      .pipe
      // tap(() =>  {
      //   this._refreshNeeded$.next();
      // })
      ();
  }

  getProductById(id: any): Observable<Product> {
    console.log("GET ALL ACCOUNTS TYPE");
    this.httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.get<Product>(`${URL_SERVICIOS}/${this.api}/${id}`, {
      headers: this.httpHeaders
    });
  }

  addProduction(production: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
    const req = new HttpRequest(
      "POST",
      "http://localhost:8080/api/production/add-production",
      production,
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
}
