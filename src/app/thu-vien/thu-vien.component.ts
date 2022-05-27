import { Component, OnInit } from '@angular/core';
import { QueuePlayerService } from '../services/queue-player.service';
import { Movie } from '../models/movie.moddel';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { doc, Firestore } from '@angular/fire/firestore';
import { Room } from '../models/room.model';

@Component({
  selector: 'app-thu-vien',
  templateUrl: './thu-vien.component.html',
  styleUrls: ['./thu-vien.component.scss']
})
export class ThuVienComponent implements OnInit {

  movieLike!: Movie[];
  constructor(private queueService: QueuePlayerService) { }

  ngOnInit(): void {
    this.queueService.getMovie().pipe(
      map((movie:Movie[]) =>{
        this.movieLike = movie
      })
    ).subscribe()
  }
}
