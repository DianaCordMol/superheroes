import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HerosService {

  constructor(private http: HttpClient) { }

  /**
   * Realiza la petición http para la búsqueda de superheroes coincidentes con un nombre
   * 
   * @param name nombre a buscar
   * @returns Observable<any>
   */
  public getMatchesByName(name: string) {
    let url = `${environment.urlApi}/search/${name}`;

    return this.http.get<any>(url);
  }

  /**
   * Realiza la petición http para la búsqueda del superheroe con el id pasado por parametro
   * 
   * @param id id del personaje
   * @returns Observable<any>
   */
  public getById(id: number) {
    let url = `${environment.urlApi}/${id}`;

    return this.http.get<any>(url);
  }

  
}
