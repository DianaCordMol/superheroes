import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth, Token } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _urlApi = 'http://challenge-react.alkemy.org/';
  private _respLogin!: Token | undefined;

  constructor(private http: HttpClient) { }

  public get respLogin() {
    return { ...this._respLogin };
  }

  /**
   * Verifica que haya un token
   * @returns true si hay token, false si no
   */
  public isAuthenticated(): Observable<boolean> {
    if (!localStorage.getItem('token')) { //si no encuentra el token en localstorage
      return of(false);
    } 
    return of(true);
  }

  /**
   * Realiza la petición http para el envío de los datos del login, captura la respuesta para 
   * usarla en la protección de rutas y módulos y para almacenar al usuario en localstorage
   * 
   * @param body Valores del formulario
   * @returns Observable<Auth>   
   */
  public postLogin(body: Auth) {

    return this.http.post<Token>(this._urlApi, body).pipe(
      tap(resp => this._respLogin = resp),
      tap(resp => localStorage.setItem('token', resp.token))
    );
  }

  /**
   * Desloguea al usuario volviendo undefined la respuesta al haberse logueado y
   * eliminando de localstorage el token
   */
  public logOut() {
    this._respLogin = undefined;
    localStorage.removeItem('token');
  }
}
