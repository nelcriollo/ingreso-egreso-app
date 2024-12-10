import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import * as uiactions from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required], //!, Validators.email
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.cargando = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {
    if (this.registroForm.invalid) return;
    // console.log('registroForm :>> ', this.registroForm);
    // console.log('valid :>> ', this.registroForm.valid);
    // console.log('value :>> ', this.registroForm.value);

    // Swal.fire({
    //   title: 'Espere por favor!',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    this.store.dispatch(uiactions.isLoading());

    const { nombre, correo, password } = this.registroForm.value;
    this.authService
      .crearUsuario(nombre, correo, password)
      .then((credenciales) => {
        console.log('credenciales :>> ', credenciales);
        // Swal.close();
        this.store.dispatch(uiactions.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store.dispatch(uiactions.stopLoading());

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }
}
