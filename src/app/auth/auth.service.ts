import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { URL_SERVICIOS } from './url/url';

// import { config } from './../../config';
//import { Tokens } from '../models/tokens';

// import { TOKEN_NAME } from '../../guard/usuario.service';
export class Tokens {
  jwt: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  constructor(private http: HttpClient,
             ) {}

  login(user: { username: string, password: string }): Observable<boolean> {
    console.log('LOGIN');

    return this.http.post<any>(`${URL_SERVICIOS}/api/login`, user)
      .pipe(
        tap(token => {
          console.log('TOKEN ', token);
          this.doLoginUser(token.user, token.token);
        }),
        mapTo(true),
        catchError(error => {
        //   this.snackbar.warn('Error en los datos: Usuario o Password!');
          // alert(error.error);
          return of(false);
        }));
  }

  logout() {
    return this.http.post<any>(`${URL_SERVICIOS}/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  //  return true;  //for testing porpouse only
  }

  refreshToken() {
    return this.http.post<any>(`${URL_SERVICIOS}/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.jwt);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, tokens) {
    console.log('DO LOGIN USER', username, 'TOKEN ', tokens);
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens) {
    console.log('STORE TOKEN');
    localStorage.setItem(this.JWT_TOKEN, tokens);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
