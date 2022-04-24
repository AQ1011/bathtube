import { getUrlScheme } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, User, UserCredential } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { YouTubePlayer, YouTubePlayerModule } from '@angular/youtube-player';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  user: User | null;
  link: string = '';
  time: number = 0;
  roomId: string = '';
  apiLoaded: Boolean = false;
  @ViewChild(YouTubePlayer) player!: YouTubePlayer;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute) {
      this.user = userService.getUser();
      this.route.queryParams.subscribe(params => {
        this.roomId =  params['roomId'];
      })
  }

  ngOnInit(): void {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  getLink(): void {
    this.time = this.player.getCurrentTime();
  }

  signOut() {
    this.authService.signOut()
    window.location.reload();
  }

}
