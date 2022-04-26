import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bathtube';

  user: User | null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
      this.user = userService.getUser();
  }
  signOut() {
    this.authService.signOut()
    window.location.reload();
  }

}
