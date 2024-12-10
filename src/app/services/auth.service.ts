import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription!: Subscription;
  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      // console.log('fuser :>> ', fuser);
      // console.log('fuser :>> ', fuser?.uid);
      // console.log('fuser :>> ', fuser?.email);
      // console.log('fuser :>> ', fuser?.emailVerified);
      if (fuser) {
        this.userSubscription = this.firestore
          .doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {
            console.log('firestoreUser :>> ', firestoreUser);

            const tempUser = Usuario.fromFirebase(firestoreUser);
            this.store.dispatch(authActions.setUser({ user: tempUser }));
          });
      } else {
        this.userSubscription?.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
        console.log('Llamar unset del user :>> ', 'Llamar unset del user');
      }
    });
  }

  crearUsuario(nombre: string, correo: string, password: string) {
    console.log('AuthService :>> ', { nombre, correo, password });
    return this.auth
      .createUserWithEmailAndPassword(correo, password)
      .then(({ user }) => {
        const newUser = new Usuario(user!.uid, nombre, correo);

        return this.firestore.doc(`${user?.uid}/usuario`).set({ ...newUser });
      });
  }

  loginUser(email: string, password: string) {
    console.log('AuthService :>> ', { email, password });
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((fuser) => fuser != null));
  }
}
