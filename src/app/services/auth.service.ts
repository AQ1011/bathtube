import { Injectable } from '@angular/core';
import { signInWithPopup, GoogleAuthProvider, Auth, UserCredential, signInWithRedirect, User, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth,
    private userSvc: UserService) {
      auth.setPersistence(browserLocalPersistence);
    }

  signIn(): void {
    signInWithRedirect(this.auth, new GoogleAuthProvider());
  }

  signOut() {
    this.auth.signOut();
    localStorage.clear();
  }

  isSignedIn(): boolean {
    if (this.auth.currentUser)
      return true;
    return false;
  }

  getUser(): User | null {
    return this.auth.currentUser;
  }
}
