import { Component, Input, OnInit } from '@angular/core';
import { Firestore, doc } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Movie } from 'src/app/models/movie.moddel';
import { Room } from 'src/app/models/room.model';
import { MovieDetailComponent } from 'src/app/movie-detail/movie-detail.component';
import { MovieWatchedService } from 'src/app/services/movie-watched.service';
import { MovieService } from 'src/app/services/movie.service';
import { QueuePlayerService } from 'src/app/services/queue-player.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  @Input() movieList: Movie[] = [];
  @Input() title = '';
  imageLoaded = false;

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal,
    private roomService: RoomService,) { }

  ngOnInit(): void {
  }

  goMovie(videoId: string): void {
    let roomId = this.makeid(9);
    let viewer = [this.userService.getUid()];
    this.roomService.setRoom(new Room(
      roomId,
      [doc(this.firestore, 'video', videoId)],
      viewer,
      doc(this.firestore, 'chat', roomId)
    ));
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
