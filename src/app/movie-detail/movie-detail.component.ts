import { Component, Input, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Movie } from '../models/movie.moddel';
import { MovieWatchedService } from '../services/movie-watched.service';
import { MovieService } from '../services/movie.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {

  @Input() movie!: Movie;
  user: User | null;
  similars: Movie[] = [];

  constructor(public activeModal: NgbActiveModal,
    private userService: UserService,
    private movieService: MovieService,
    private storage: Storage,
    private router: Router,
    private movieWatchedService: MovieWatchedService) {
      this.user = userService.getUser();
    }

  ngOnInit(): void {
    this.movieService.getAllMovie().subscribe((movies) => {
      this.similars = movies;
      this.similars.forEach(movie => {
        if(movie.image)
          getDownloadURL(ref(this.storage, 'image/' + movie.image)).then(url => movie.image = url);
      });
    });
  }

  goToMovie(movie: Movie) {
    this.activeModal.dismiss();
    this.router.navigate(['player/' + movie.videoId])
  }
  saveMovie(movie: Movie) {
    this.movieWatchedService.addMovieWatched(movie);
  }

}
