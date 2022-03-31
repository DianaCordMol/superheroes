import { Component, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HerosService } from '../../services/heros.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private _equipoPersonajes: any = []; //Equipo

  private _sumAppareance = { weight: 0, height: 0, promWeight: 0, promHeight: 0, };

  private _sumPowerStats: any = {
    combat: 0,
    durability: 0,
    intelligence: 0,
    power: 0,
    speed: 0,
    strength: 0,
  };

  private _sumAligment = { good: 0, bad: 0, }

  private _hayCupo = false;

  public items = [ //Para visibilizarse en el template
    { label: 'Peso (KG)', icon: 'bi bi-align-center', property: 0 },
    { label: 'Altura (CM)', icon: 'bi bi-arrows-expand', property: 0 },
    { label: 'Combate', icon: 'bi bi-heart-arrow', property: 0 },
    { label: 'Duración', icon: 'bi bi-heart-pulse', property: 0 },
    { label: 'Inteligencia', icon: 'bi bi-eyeglasses', property: 0 },
    { label: 'Poder', icon: 'bi bi-lightning', property: 0 },
    { label: 'Rapidez', icon: 'bi bi-speedometer', property: 0 },
    { label: 'Fuerza', icon: 'bi bi-radioactive', property: 0 },
    { label: 'Héroes', icon: 'bi bi-journal-check', property: 0 },
    { label: 'Villanos', icon: 'bi bi-journal-x', property: 0 },
  ];

  private _categoriaEquipo: string = "";

  constructor(
    private herosService: HerosService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getEquipoAleatorio();
  }

  get equipoPersonajes() {
    return this._equipoPersonajes;
  }

  get sumPowerStats() {
    return this._sumPowerStats;
  }

  get categoriaEquipo() {
    return this._categoriaEquipo;
  }

  get sumAppareance() {
    return this._sumAppareance;
  }

  get sumAlignment() {
    return this._sumAligment;
  }

  /**
   * Suma o resta el powerstats de un héroe a los valores acumulativos del grupo
   * 
   * @param pw objeto con los powerstats del héroe
   */
  private getPowerStats(opc: number, pw: any) {
    let keyPw: string[] = Object.keys(pw);

    if (opc !== 1) { //sumar
      for (let i = 0; i < keyPw.length; i++) {
        const element = keyPw[i];
        (pw[element] !== 'null') ? this._sumPowerStats[element] += parseInt(pw[element]) : '';
      }
    } else { //restar
      for (let i = 0; i < keyPw.length; i++) {
        const element = keyPw[i];
        (pw[element] !== 'null') ? this._sumPowerStats[element] -= parseInt(pw[element]) : '';
      }
    }

    this.items[2].property = this._sumPowerStats.combat;
    this.items[3].property = this._sumPowerStats.durability;
    this.items[4].property = this._sumPowerStats.intelligence;
    this.items[5].property = this._sumPowerStats.power;
    this.items[6].property = this._sumPowerStats.speed;
    this.items[7].property = this._sumPowerStats.strength;
  }

  /**
   * Obtiene el nombre de la categoría que tiene mayor powerstats del acumulado
   */
  private getCategoriaPowerStats() {
    const valSumPowerStats: number[] = Object.values(this._sumPowerStats); //values de sumpowerstats
    const max = Math.max(...valSumPowerStats); //Número máximo del arreglo

    const keysSumPowerStats: string[] = Object.keys(this._sumPowerStats); //keys de sumpowerstats
    const tradPowerStats = ['Combate', 'Duración', 'inteligencia', 'Poder', 'Rapidez', 'Fuerza'] //Traducción para el template

    for (let i = 0; i < tradPowerStats.length; i++) {
      if (this._sumPowerStats[keysSumPowerStats[i]] === max) {
        this._categoriaEquipo = tradPowerStats[i];
        break;
      }
    }
  }

  /**
   * Suma o resta el peso y la altura del personaje al acumulativo
   * 
   * @param opc -1 si añadir, 1 si eliminar
   * @param obj apariencia del personaje
   */
  private getPesoAltura(opc: number, obj: any) {
    const weightCut = obj.weight[1].split(" ");
    const weight = weightCut[0];

    const heightCut = obj.height[1].split(" ");
    const height = heightCut[0];

    if (opc !== 1) {
      this._sumAppareance.weight += (parseInt(weight));
      this._sumAppareance.height += (parseInt(height));
    } else {
      this._sumAppareance.weight -= (parseInt(weight));
      this._sumAppareance.height -= (parseInt(height));
    }

    this._sumAppareance.promWeight = this._sumAppareance.weight / this._equipoPersonajes.length;
    this.items[0].property = this._sumAppareance.promWeight;

    this._sumAppareance.promHeight = this._sumAppareance.height / this._equipoPersonajes.length;
    this.items[1].property = this._sumAppareance.promHeight;
  }

  /**
   * Verifica si la orientación del héroe aún tiene cupo en el equipo
   * si hay cupo, lo toma y retorna un true
   */
  private verificarAligment(opc: number, aligment: string) {
    this._hayCupo = true;

    if (opc !== 1) { //Agregar

      if (aligment === 'good') {
        if (this._sumAligment.good < 3) {
          this._sumAligment.good++;
        } else {
          this.toastr.error(
            'Se ha llegado al límite de cupos para héroes buenos',
            '¡Sin cupos!');
          this._hayCupo = false;
        }

      } else if (aligment === 'bad') {
        if (this._sumAligment.bad < 3) {
          this._sumAligment.bad++;
        } else {
          this.toastr.error(
            'Se ha llegado al límite de cupos para héroes malvados',
            '¡Sin cupos!');
          this._hayCupo = false;
        }
      }

    } else {
      if (aligment === 'good') {
        this._sumAligment.good--;
      } else if (aligment === 'bad') {
        this._sumAligment.bad--;
      }
    }

    this.items[8].property = this._sumAligment.good;
    this.items[9].property = this._sumAligment.bad;
  }

  /**
   * Añade el héroe elegido al grupo de héroes
   * 
   * @param id del héroe elegido
   */
  private addNewHero(id: number) {
    this.herosService.getById(id).subscribe(
      resp => {

        const alignment = resp.biography.alignment;
        this.verificarAligment(-1, alignment);

        if (!this._hayCupo) {
          if (!(this._equipoPersonajes.length < 6)) {
            this.toastr.warning(
              'No hay más cupos para añadir personajes, si deseas puedes eliminar uno existente',
              '¡Sin cupos!, personajes completos');
          }
          return;
        }

        const pw = resp.powerstats;
        const appearance = resp.appearance;

        this._equipoPersonajes.push(resp);
        this.toastr.success('¡El personaje fue añadido con éxito!', 'Registro exitoso');

        this.getPowerStats(0, pw);
        this.getCategoriaPowerStats();
        this.getPesoAltura(-1, appearance);
      }
    );
  }

  /**
   * Genera un equipo aleatorio de seís héroes
   */
  private getEquipoAleatorio() {
    // while (this._equipoPersonajes.length < 6) {
    //   const id = Math.floor(Math.random() * 49) + 1; //id aleatorio
    //   this.addNewHero(id); 
    // }
  }

  /**
   * Elimina al héroe por id
   * 
   * @param id del héroe a eliminar
   */
  public delete(id: number) {
    let pw = this._equipoPersonajes[id].powerstats;
    let appearance = this._equipoPersonajes[id].appearance;
    let alignment = this._equipoPersonajes[id].biography.alignment;

    this.getPowerStats(1, pw);
    this.getCategoriaPowerStats();
    this.getPesoAltura(1, appearance);

    this._equipoPersonajes.splice(id, 1);
    this.toastr.success('¡El personaje fue eliminado con éxito!', 'Nuevo cupo disponible');
    this.verificarAligment(1, alignment);
  }

  /**
   * Agrega el id del superhéroe elegido al equipo
   * 
   * @param id recibido del componente hijo, para agregarlo acá
   */
  public eventAdd(id: number) {
    this.addNewHero(id);
  }


  //TODO: HACER 
  //● Debe haber 3 miembros con orientación buena y 3 con orientación mala. Esto
  //debe validarse al intentar agregar un nuevo héroe.



}
