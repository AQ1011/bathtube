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
  constructor(private queueService: QueuePlayerService, private modalService: NgbModal,
    private router: Router,
    private roomService: RoomService,
    private userService: UserService,private firestore: Firestore,) { }

  ngOnInit(): void {
    this.queueService.getMovie().pipe(
      map((movie:Movie[]) =>{
        this.movieLike = movie
      })
    ).subscribe()
  }
  showName(i: number) {
    let title = document.getElementById(i.toString()) as HTMLElement;
    title.className += ' show';
    title.parentElement!.className += ' hover-bg';
  }

  hideName(i: number) {
    let title = document.getElementById(i.toString()) as HTMLElement;
    title.className = 'movie-name';
    title.parentElement!.className = 'movie';
  }
  goMovie(videoId: string) {
    let roomId = this.makeid(9);
    let viewer = [this.userService.getDisplayName() || 'annon ' + this.makeid(4)];
    this.roomService.setRoom(new Room(roomId, [doc(this.firestore, 'video', videoId)], viewer, doc(this.firestore, 'chat', roomId)))
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
