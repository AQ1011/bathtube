import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Movie } from '../models/movie.moddel';
import { Room } from '../models/room.model';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { AuthService } from '../services/auth.service';
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

  public searchInput = '';
  searchKey ="";
  movieList: Movie[] = []
  isSignedIn: boolean = false;
  user?: User;
  avatar: string = '';
  isVisible = false;
  confirmModal?: NzModalRef;

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
    private modal: NzModalService,
    private authService: AuthService,
    private auth: Auth,
    private notification: NzNotificationService
    ) { }

  ngOnInit(): void {
    this.movieService.getAllMovie().subscribe((movies) => {
      this.movieList = [...movies];
      this.movieList.forEach(movie => {
        if(movie.image)
          getDownloadURL(ref(this.storage, 'image/' + movie.image)).then(url => movie.image = url);
      });
    })
    this.auth.onAuthStateChanged(
      (user) => {
        if(user) {
          this.user = user;
          this.avatar = user.photoURL || '';
          this.isSignedIn = true;
        }
        else
          this.isSignedIn = false;
      }
    )
    this.movieService.search.subscribe((val :any) =>{
      this.searchKey = val;
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

  search(event: any){
    this.searchInput = (event.target as HTMLInputElement).value;
    this.movieService.search.next(this.searchInput);
  }
  removeSearch(){
    this.searchInput ='';
    this.movieService.search.next(this.searchInput);
    this.searchKey = '';
  }

  signIn() {
    this.authService.signOut();
    this.authService.signIn();
  }

  signOut() {
    this.isVisible = true;
  }

  showModal(): void {
    this.isVisible = true;
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Bạn có muốn đăng xuất ?',
      nzOnOk: () =>  {
        this.authService.signOut();
        this.isSignedIn = false;
        this.router.navigate(['/login']);
        this.notification.create('success',
          'Thông báo',
          'Đăng xuất thành công',
          { nzDuration: 1000  }
        );
      },
    });
  }

}
