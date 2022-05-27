import { Component, OnInit } from '@angular/core';
import { Auth, getRedirectResult, User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bathtube';

  user!: User | null;

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    getRedirectResult(this.auth).then(
      (userCredential) => {
        if(userCredential) {
          localStorage.setItem('USER_CREDENTIAL', JSON.stringify(userCredential))
        }
      }
    )
    this.user = this.userService.getUser();
  }

  signOut() {
    this.authService.signOut()
    window.location.reload();
  }

}
