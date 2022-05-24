import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { YouTubePlayer } from '@angular/youtube-player';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.moddel';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { MovieWatchedService } from '../services/movie-watched.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  user: User | null;
  link: string = '';
  time: number = 0;
  roomId: string = '';
  apiLoaded: Boolean = false;
  @ViewChild(YouTubePlayer) player!: YouTubePlayer;

  movieList: Movie[] = []
  movieWatched: Movie[] = [];

  currentPopular: number = 0;


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private storage: Storage,
    private router: Router,
    private modalService: NgbModal,
    private movieWatchedService: MovieWatchedService) {
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

    this.movieService.getAllMovie().subscribe((movies) => {
      this.movieList = [...movies];
      this.movieList.forEach(movie => {
        if(movie.image)
          getDownloadURL(ref(this.storage, 'image/' + movie.image)).then(url => movie.image = url);
      });
    })
    document.getElementsByClassName('movie')[0].className += 'active';
    setInterval(() => {
      if(this.currentPopular <= this.movieList.length)
        this.currentPopular += 1
      else
        this.currentPopular = 0;
      document.getElementById('poplist')?.style.setProperty('transform', 'translateX(' + (-this.currentPopular*352).toString() + 'px)');
    }, 5000)

    this.movieWatchedService.getMovieWatched().subscribe((movie) => {
      this.movieWatched = movie;
      console.log(this.movieWatched);
    })
  }

  getLink(): void {
    this.time = this.player.getCurrentTime();
  }

  goMovie(videoId: string) {
    let roomId = this.makeid(9);
    let viewer = [this.userService.getDisplayName()];

    this.router.navigate(['player/'+ roomId])
  }
  getDetail(content: Movie){
    const modalRef = this.modalService.open(MovieDetailComponent, { size: 'lg' } );
    modalRef.componentInstance.movie = content;
  }

  makeid(length: number) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() *
    charactersLength));
   }
   return result;
  }
}
