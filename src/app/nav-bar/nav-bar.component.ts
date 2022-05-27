import { Component, OnInit } from '@angular/core';
import { Firestore, doc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Movie } from '../models/movie.moddel';
import { Room } from '../models/room.model';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { MovieWatchedService } from '../services/movie-watched.service';
import { MovieService } from '../services/movie.service';
import { QueuePlayerService } from '../services/queue-player.service';
import { RoomService } from '../services/room.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public searchInput : string = '';
  searchKey:string ="";
  movieList: Movie[] = []

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private storage: Storage,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private modalService: NgbModal,
    private movieWatchedService: MovieWatchedService,
    private roomService: RoomService,
    private queueService: QueuePlayerService,
    ) { }

  ngOnInit(): void {
    this.movieService.getAllMovie().subscribe((movies) => {
      this.movieList = [...movies];
      this.movieList.forEach(movie => {
        if(movie.image)
          getDownloadURL(ref(this.storage, 'image/' + movie.image)).then(url => movie.image = url);
      });
    })
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

  getDetail(content: Movie){
    const modalRef = this.modalService.open(MovieDetailComponent, { size: 'lg' } );
    modalRef.componentInstance.movie = content;
  }

  goMovie(videoId: string) {
    let roomId = this.makeid(9);
    let viewer = [this.userService.getDisplayName() || 'annon ' + this.makeid(4)];
    this.roomService.setRoom(new Room(roomId, [doc(this.firestore, 'video', videoId)], viewer, doc(this.firestore, 'chat', roomId)))
    this.router.navigate(['player/'+ roomId])
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

  search(){
    this.movieService.search.next(this.searchInput);
  }
  removeSearch(){
    this.searchInput ='';
    this.movieService.search.next(this.searchInput);
    this.searchKey = '';
  }

}
