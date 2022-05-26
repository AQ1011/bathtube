import { Component, Input, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { doc, Firestore } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.moddel';
import { Room } from '../models/room.model';
import { MovieWatchedService } from '../services/movie-watched.service';
import { MovieService } from '../services/movie.service';
import { RoomService } from '../services/room.service';
import { UserService } from '../services/user.service';
import { QueuePlayerService } from '../services/queue-player.service';

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
    private firestore: Firestore,
    private userService: UserService,
    private movieService: MovieService,
    private storage: Storage,
    private router: Router,
    private movieWatchedService: MovieWatchedService,
    private roomService: RoomService,
    private queueService: QueuePlayerService) {
      this.user = userService.getUser();
    }

  ngOnInit(): void {
    this.movieService.getAllMovie().pipe(
      map((data: any) =>data.map((videoS:Movie) => ({...videoS})).filter((videoS:Movie) => videoS.age >= this.movie.age))
    )
    .subscribe((movies) => {
      this.similars = movies;
      this.similars.forEach(movie => {
        if(movie.image)
          getDownloadURL(ref(this.storage, 'image/' + movie.image)).then(url => movie.image = url);
      });
    });
  }

  goToMovie(videoId: string) {
    this.activeModal.dismiss();
    let roomId = this.makeid(9);
    let viewer = [this.userService.getDisplayName() || 'annon ' + this.makeid(4)];
    this.roomService.setRoom(
      new Room(
        roomId,
        [doc(this.firestore, 'video', videoId)],
        viewer,
        doc(this.firestore, 'chat', roomId)
      ))
    this.router.navigate(['player/'+ roomId])
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

  saveMovie(movie: Movie) {
    this.movieWatchedService.addMovieWatched(movie);
  }
  addLibraby(movie: Movie){
    this.queueService.addMovie(movie)
  }
}
