import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiactions from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
      console.log('ui :>> ', 'cargando sub');
    });
  }

  loginUser() {
    if (this.loginForm.invalid) return;

    // console.log('object :>> ', this.loginForm);
    // console.log('object :>> ', this.loginForm.valid);
    // console.log('object :>> ', this.loginForm.value);

    this.store.dispatch(uiactions.isLoading());

    // Swal.fire({
    //   title: 'Espere por favor!',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { email, password } = this.loginForm.value;

    this.authService
      .loginUser(email, password)
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

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }
}
