import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario
   */
  private initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
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
   * Llama al servicio que hace la petición de envío, luego controla las posibles respuestas
   */
  private postLogin(): void {
    this.loginService.postLogin(this.form.value).subscribe(
      {
        next: (resp) => {
          if(resp.token) {
            this.router.navigate(['./home']);
          }
        },
        error: (err) => {
          switch (err.status) {
            case 0:
              this.toastr.error('No hay conexión al servidor', 'Conexión fallida');
              break;
            case 401:
              this.toastr.error('Vuelve a intentarlo', 'Credenciales incorrectas');
              break;
            default:
              this.toastr.error('Vuelve a intentarlo', 'Ocurrió un error', );
              break;
          }
        },
        // complete: () => { console.info('complete') }
      }
    );
  }

  /**
   * Comprueba la validez del formulario, si es válido hace la petición de envío
   * 
   * @returns si el formulario es inválido
   */
  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.postLogin();
  }
}
