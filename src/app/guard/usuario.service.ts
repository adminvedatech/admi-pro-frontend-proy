import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/urls';
import { Usuario } from './usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

export const TOKEN_NAME = 'jwt_token';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  currentUser: Boolean = false;

   constructor(
    public http: HttpClient,
    public router: Router,
    // public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.currentUser) ? true : false;
  }

  cargarStorage() {
console.log('CARGAR STORAGE');

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('user') );
    } else {
      this.token = '';
     // this.usuario = null;
    }

  }

  isTokenExpired(token?: string): boolean {
    if (!token) {

      token = this.getToken();
      return true;
    }


    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {

      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  getToken(): string {
    console.log('Token en getToken ', this.token);
    
    return localStorage.getItem(this.token);
  }

   setToken(token: string): void {
     localStorage.setItem(TOKEN_NAME, token);
   }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }


  guardarStorage( token: string, usuario: Usuario ) {

    console.log('Recibimos Token ', token);
    
  //  localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('user', JSON.stringify(usuario) );

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  // loginGoogle( token: string ) {

  //   let url = URL_SERVICIOS + '/login/google';

  //   return this.http.post( url, { token } ).pipe(
  //               map( (resp: any) => {
  //                 this.guardarStorage( resp.token, resp.usuario );
  //                 return true;
  //               }));


  // }

  login( usuario: Usuario, recordar: boolean = false ) {

    if ( recordar ) {
      localStorage.setItem('email', usuario.email );
    } else {

      console.log('ENTRAMOS A LOGIN CON TOKEN: ', this.token);

    }

    const url = URL_SERVICIOS + '/api/login';
    return this.http.post( url, usuario ).pipe(
                map( (resp: any) => {
                  if (resp && resp.token) {
                    localStorage.setItem('currentUser', JSON.stringify(resp));
                    this.currentUser = true;
                  }
                  console.log('Respuesta Recivida ', resp);
                  return true;
                }));

  }

}