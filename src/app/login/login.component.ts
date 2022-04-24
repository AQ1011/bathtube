import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isSignedIn: boolean = false;
  user?: User;
  avatar: string = '';
  constructor(
    private authService: AuthService,
    private userService: UserService,) { }

  ngOnInit(): void {
    if(this.userService.getUser()) {
      this.user = this.userService.getUser()!;
      this.avatar = this.user.photoURL!;
      this.isSignedIn = true;
    } else {
      this.isSignedIn = false;
    }
  }

  signIn() {
    this.authService.signOut();
    this.authService.signIn().then((userCredential) => {
      localStorage.setItem("CURRENT_USER",JSON.stringify(userCredential.user));
      this.isSignedIn = true;
      this.avatar = userCredential.user.photoURL!;
    })
  }

  signOut() {
    this.authService.signOut();
    this.isSignedIn = false;
  }

}
