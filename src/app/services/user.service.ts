import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { authInstanceFactory } from '@angular/fire/auth/auth.module';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth) { }

  getDisplayName() {
    return this.auth.currentUser!.displayName;
  }

  getPhotoURL() {
    return this.auth.currentUser!.photoURL;
  }

  getUid() {
    return this.auth.currentUser!.uid;
  }

  getUser() {
    var user: User | null;
    try {
      user = JSON.parse(localStorage.getItem("USER_CREDENTIAL") || "");
    } catch  {
      user = null;
    }
    return user;
  }
}
