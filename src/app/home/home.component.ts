import { Component, HostListener, OnInit, ViewChild,ViewEncapsulation,DoCheck } from '@angular/core';
import { User } from '@angular/fire/auth';
import { UserService } from '../services/user.service';
import { YouTubePlayer } from '@angular/youtube-player';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.moddel';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { MovieWatchedService } from '../services/movie-watched.service';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room.model';
import { doc, Firestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { QueuePlayerService } from '../services/queue-player.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,DoCheck {


  user: User | null;
  link: string = '';
  time: number = 0;
  roomId: string = '';
  apiLoaded: Boolean = false;
  @ViewChild(YouTubePlayer) player!: YouTubePlayer;

  movieList: Movie[] = []
  movieYear: Movie[] = []
  movieWatched: Movie[] = [];
  movieLike: Movie[] = [];
  public searchInput : string = '';
  searchKey:string ="";

  currentPopular: number = 0;
  navbarfixed: boolean = false;


  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private storage: Storage,
    private router: Router,
    private modalService: NgbModal,
    private movieWatchedService: MovieWatchedService,
    private roomService: RoomService,
    private queueService: QueuePlayerService,) {
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
    this.movieService.getAllMovie().pipe(
      map((data: any) =>data.map((videoYear:Movie) => ({...videoYear})).filter((videoYear:Movie) => videoYear.year == 2022))
    )
    .subscribe((movies) => {
      this.movieYear = [...movies];
      this.movieYear.forEach(movie => {
        if(movie.image)
          getDownloadURL(ref(this.storage, 'image/' + movie.image)).then(url => movie.image = url);
      });
    })
    // document.getElementsByClassName('movie')[0].className += 'active';
    // setInterval(() => {
    //   if(this.currentPopular <= this.movieList.length)
    //     this.currentPopular += 1
    //   else
    //     this.currentPopular = 0;
    //   document.getElementById('poplist')?.style.setProperty('transform', 'translateX(' + (-this.currentPopular*352).toString() + 'px)');
    // }, 5000)

    this.movieWatchedService.getMovieWatched().subscribe((movie) => {
      this.movieWatched = movie;
    })
    this.queueService.getMovie().pipe(
      map((movie:Movie[]) =>{
        this.movieLike = movie
      })
    ).subscribe()
  }

  ngDoCheck(){
  }
  getLink(): void {
    this.time = this.player.getCurrentTime();
  }

  goMovie(videoId: string) {
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

  @HostListener('window:scroll',['$event']) onScroll(){
    if(window.scrollY > 100){
      this.navbarfixed = true;
    }else{
      this.navbarfixed = false;
    }
  }

  // showName(i: number) {
  //   let title = document.getElementById(i.toString()) as HTMLElement;
  //   title.className += ' show';
  //   title.parentElement!.className += ' hover-bg';
  // }

  // hideName(i: number) {
  //   let title = document.getElementById(i.toString()) as HTMLElement;
  //   title.className = 'movie-name';
  //   title.parentElement!.className = 'movie';
  // }

  search(event: any){
    this.searchInput = (event.target as HTMLInputElement).value;
    this.movieService.search.next(this.searchInput);
  }
  removeSearch(){
    this.searchInput ='';
    this.movieService.search.next(this.searchInput);
    this.searchKey = '';
  }
}
