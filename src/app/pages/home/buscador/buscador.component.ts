import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { HerosService } from '../../../services/heros.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {

  @Input() sumAlignment: any;

  @Output() eventAdd = new EventEmitter<number>();

  public form!: FormGroup;
  private _data = [];
  private _dataPage: any = [];
  private _pages: number[] = [];

  public active!: number;
  public previous!: number;
  public next!: number;

  constructor(
    private fb: FormBuilder,
    private herosService: HerosService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  get pages() {
    return this._pages;
  }

  get dataPages() {
    return this._dataPage;
  }

  /**
   * Inicializa el formulario
   */
  private initForm(): void {
    this.form = this.fb.group({
      query: ['', Validators.required]
    });
  }

  /**
   * Valida si el campo será o no marcado con texto de advertencia
   * 
   * @param nameField nombre del control a evaluar
   * 
   * @returns true si el control tiene errores y fue tocado
   */
  public isFieldInvalid(nameField: string) {
    let field = this.form.get(nameField);

    return field?.errors && field.touched;
  }

  /**
   * Resetea el formulario y los arreglos que dieron anteriormente información
   */
  private resetValues() {
    this._dataPage = [];
    this._pages = [];
    this.form.reset();
  }

  /**
   * Al abrir la modal
   */
  public openModal() {
    this.resetValues();
  }

  /**
   * Obtiene el número de paginaciones que se hará dividiendo el número de datos sobre 10 
   * para saber cuántas páginas se mostrarán. Para el caso donde no vienen más de diez
   * datos, no se hace paginación.
   * 
   * @param resp respuesta al hacer la búsqueda
   * @returns si la data coincidente no sobrepasa al número de items para una página
   */
  private getPagination(resp: any) {
    this._data = resp.results.slice(0, 100);

    if (!(this._data.length > 10)) {
      this._dataPage = this._data;
      return;
    }
    const numPages = Math.ceil(this._data.length / 10);
    this._pages = Array(numPages).fill(1).map((x, i) => i + 1);
  }

  /**
   * Obtiene la data correspondiente al número de página dado (de diez en diez por página)
   * 
   * @param pageActive número de página donde se pulsó click
   */
  public getDataByPage(pageActive: number) {
    let final = pageActive * 10;

    this._dataPage = this._data.slice(final - 10, final);

    this.previous = pageActive - 1;
    this.active = pageActive;
    this.next = pageActive + 1;
  }

  /**
   * Realiza la búsqueda de todos los personajes que tengan coincidencia con el nombre buscado
   */
  public buscar(): void {
    this._pages = [];
    let value = this.form.get('query')?.value;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.herosService.getMatchesByName(value).subscribe(
      {
        next: (resp) => {
          if (resp.response === 'success') {
            this.getPagination(resp);
            this.getDataByPage(1);
          } else {
            this.toastr.warning(
              'No hay coincidencias con el nombre de un personaje, intenta otro nombre',
              'Búsqueda fallida');
          }
        },
        error: (err) => {
          if (err.status === 0) {
            this.toastr.error('No hay conexión con el servidor', '¡Conexión fallida!');
          } else {
            this.toastr.error('Ha ocurrido un error al hacer la búsqueda', '¡Error!');
          }
        }
      }
    );
  }

  /**
   * Envía el id al componente padre, para que este último lo agregue al equipo
   * 
   * @param id del superhéroe
   */
  public agregar(id: number) {
    if (!(this.sumAlignment.good < 3) && !(this.sumAlignment.bad < 3)) {
      this.toastr.error('No hay más cupos', '¡Sin cupos!');
    } else {
      this.eventAdd.emit(id);
    }
  }
}
