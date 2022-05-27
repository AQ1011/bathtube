import { Component, OnInit } from '@angular/core';
import { Auth, getRedirectResult } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(private authService: AuthService,
    private auth: Auth,
    private router: Router,) { }

  ngOnInit(): void {
    getRedirectResult(this.auth).then(
      (userCredential) => {
        if(userCredential) {
          localStorage.setItem('USER_CREDENTIAL', JSON.stringify(userCredential))
        }
      }
    )
  }

  signIn(){
    this.authService.signOut();
    this.authService.signIn()
  }

}
