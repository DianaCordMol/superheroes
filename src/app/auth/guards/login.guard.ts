import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, CanLoad, CanActivateChild{

  constructor(
    private loginService: LoginService,
    private router: Router) { }

  canActivate( //Protección de activación
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    console.log('Bloqueado por canactive');

    return this.loginService.isAuthenticated().pipe(
      tap(resp => {
        if (!resp) {
          this.router.navigate(['/auth/login'])
        }
      })
    );
  }

  canLoad( //Protección de módulos
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    console.log('Bloqueado por canload');

    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    console.log('Bloqueado por canactivechild');

    return this.loginService.isAuthenticated().pipe(
      tap(resp => {
        console.log(resp);

        if (!resp) {
          this.router.navigate(['/auth/login'])
        }
      })
    );
  }
}
