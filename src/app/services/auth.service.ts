import { Injectable } from '@angular/core';
import { signInWithPopup, GoogleAuthProvider, Auth, UserCredential } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  signIn(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  signOut() {
    this.auth.signOut();
    localStorage.clear();
  }
}
