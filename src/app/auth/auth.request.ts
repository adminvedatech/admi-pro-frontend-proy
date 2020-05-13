import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

// quitamos esto en setHeader para mandar individual 'Content-Type': 'application/json',
@Injectable()
export class AuthRequestOptions implements HttpInterceptor  {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('JWT_TOKEN');
    if (token) {
        request = request.clone({
            setHeaders: { Authorization: `Bearer ${token}`
            }
        });
    }

    return next.handle(request);
}

}
