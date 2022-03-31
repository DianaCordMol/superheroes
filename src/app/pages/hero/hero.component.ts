import { Component, OnInit, Output, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HerosService } from '../../services/heros.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  private idRoute!: number;

  private _dataHero = {
    weight: '',
    height: '',
    name: '',
    aliases: '',
    eye_color: '',
    hair_color: '',
    work: '',
    image: '',
  };;

  constructor(
    private activatedRoute: ActivatedRoute,
    private herosService: HerosService
  ) { }

  ngOnInit(): void {
    this.getHeroById();
  }

  get dataHero() {
    return this._dataHero;
  }

  /**
   * Obtiene el parámetro id de la url
   */
  private getParamId() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.idRoute = params['id'];
      }
    );
  }

  /**
   * Trae la información del héroe con el id especificado
   */
  private getHeroById() {
    this.getParamId();

    this.herosService.getById(this.idRoute).subscribe(
      resp => {
        console.log(resp);
        this._dataHero = {
          weight: resp.appearance.weight,
          height: resp.appearance.height[1],
          name: resp.name,
          aliases: resp.biography.aliases,
          eye_color: resp.appearance['eye-color'],
          hair_color: resp.appearance['hair-color'],
          work: resp.work.ocuppation,
          image: resp.image.url,
        };

      }
    );
  }
}
