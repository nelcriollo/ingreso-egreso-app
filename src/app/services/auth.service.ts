import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      console.log('fuser :>> ', fuser);
      console.log('fuser :>> ', fuser?.uid);
      console.log('fuser :>> ', fuser?.email);
      console.log('fuser :>> ', fuser?.emailVerified);
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
