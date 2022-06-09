import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Firestore, doc, docSnapshots, getDoc,  } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { arrayUnion, DocumentReference, updateDoc } from '@firebase/firestore';
import { Chat, Room } from '../models/room.model';
import { UserService } from '../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../models/movie.moddel';
import { RoomService } from '../services/room.service';
import { PlayerListComponent } from './player-list/player-list.component';
import { ChatService } from '../services/chat.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ClipboardService } from 'ngx-clipboard';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  @ViewChild('pp') ref!: ElementRef;
  roomId: string = '';
  apiLoaded = false;
  messages: Chat[] = [];
  chatContent: string = '';
  showChat = true;
  showSearch: boolean = false;
  currentVideoId: string = '';
  player: any;
  vId = new BehaviorSubject<string>('');
  playList: Movie[] = []
  playerState: number = -1;
  room!: Room;
  chatLog: Chat[] = []
  chatRef!: DocumentReference;
  queueEnded = false;
  color: string = '';
  showHeader = false;
  viewer: string[] = [];
  urlPlayer = 'http://localhost:4200/player/';
  chatsound = new Audio();

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private userSvc: UserService,
    private modalService: NgbModal,
    private roomService: RoomService,
    private router: Router,
    private chatSvc: ChatService,
    private _clipboardService: ClipboardService,private notification: NzNotificationService) {
    this.route.params.subscribe((params) => {
      this.roomId = params['id'];
      this.urlPlayer = this.urlPlayer + this.roomId;
    });
    this.chatsound.src = '../../assets/sounds/facebookchat.mp3';
    // this.chatsound.volume = 0.3;
  }

  ngOnInit(): void {
    this.getChatColor();
    this.roomService.getRoom(this.roomId).subscribe((room) => {
      this.room = room;
      this.viewer = room.viewer;
      // if(room.viewer[0] !== this.userSvc.getUid()) {
      //   let uid = this.userSvc.getUid();
      //   updateDoc(doc(this.firestore, 'room', this.roomId), {
      //     viewer: arrayUnion(uid)
      //   })
      // }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.scrollBy({left: 0, top: 80, behavior: 'smooth'});
    }, (1000));
    this.chatSvc.onJoin().subscribe(joinMsg => {
    })
    this.chatSvc.connectToRoom(this.userSvc.getDisplayName()!, this.roomId);
    this.chatSvc.onMessage().subscribe(chat => {
      this.chatLog.push(chat);
      this.chatsound.load();
      this.chatsound.play();
    })

    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('yt-player', {
        height: '320',
        width: '640',
        videoId: this.currentVideoId,
        host: 'https://www.youtube.com',
        playerVars: {
          'origin': 'http://localhost:4200',
          'controls': 1,
          'modestbranding': 0,
          'rel': 0,
          'color': 'white',
          'autoplay': 0,
        },
        events: {
          'onReady': this.onReady.bind(this),
          'onStateChange': this.onPlayerStateChange.bind(this),
        }
      });
    }
  }

  getChatColor() {
    if (!localStorage.getItem('chatColor')) {
      let letters = '0123456789ABCDEF';
      this.color = '#'; // <-----------
      for (var i = 0; i < 6; i++) {
          this.color += letters[Math.floor(Math.random() * 16)];
      }
      localStorage.setItem('chatColor', this.color);
      console.log(this.color);
    } else {
      this.color = localStorage.getItem('chatColor')!;
    }
  }

  onReady() {
    this.resize()
    getDoc(doc(this.firestore, 'room', this.roomId!))
      .then((doc) => {
        this.room = doc.data() as Room;
        // if(this.room.viewer[0] !== this.userSvc.getDisplayName())
        //   this.syncWithHost();
        this.player.loadVideoById(this.room.videos[this.room.currentPlay].id, this.room.videoTime);
        this.playList = [];
        this.room.videos.forEach(ref => {
          getDoc(ref)
            .then( video => this.playList.push(video.data() as Movie)
            ).catch(err => console.log(err));
        })
      });

    // this.vId.subscribe(id => {
    //   this.player.loadVideoById(id, 0);
    // })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resize()
    window.scrollBy(80,0);
  }

  onPlayerStateChange(e: any) {
    if(this.userSvc.getDisplayName() === this.room.viewer[0]) {
      this.room.videoState = e.data;
      this.room.videoTime = this.player.getCurrentTime();
      this.roomService.setRoom(this.room);
    }
    switch (this.room.videoState) {
      case 0:
        this.nextVideo();
        break;
      case 1:
        this.player.playVideo();
        break;
      case 2:
        this.player.pauseVideo();
        break;
    }
  }

  nextVideo() {
    this.room.currentPlay++;
    if(this.room.currentPlay > this.room.videos.length) {
      this.queueEnded = true;
      return;
    }
    // this.roomService.setRoom(this.room);
    this.player.loadVideoById(this.playList[this.room.currentPlay].videoId, 0);
  }

  sendChat() {
    if(this.chatContent) {
      this.chatSvc.sendMessageToRoom(this.roomId, {
        uid: this.uid,
        user: this.userSvc.getDisplayName() || 'guest ;_;',
        content: this.chatContent, time: new Date(),
        color: this.color || '#ffffff',
      });
    }
    this.chatContent = ''
  }

  resize() {
    this.player.setSize(
      this.ref.nativeElement.offsetWidth,
      this.ref.nativeElement.offsetHeight
    )
    window.scrollBy(80,0);
  }

  chat() {
    this.showChat = !this.showChat;
    setTimeout(() =>
    this.resize(), 500);
  }

  showSearchBtn(){
    this.showSearch = !this.showSearch;
    if(this.showSearch) {
      this.showChat = true;
      this.resize();
    }
  }

  openSearchPlayer(longContent : any) {
    const modalRef = this.modalService.open(PlayerListComponent, { size: 'lg' }).result
      .then((videos: DocumentReference[]) => {
        this.roomService.addMovieToList(this.roomId, videos);
        getDoc(videos[videos.length - 1])
          .then( video => this.playList.push(video.data() as Movie))
          .catch( err => console.log(err));
      });
  }

  openInviteUser(content: any){
    this.modalService.open(content);
  }
  copyLink(){
    this._clipboardService.copy(this.urlPlayer);
    this.notification.create('success',
          'Thông báo',
          'Copy to clipboard',
          { nzDuration: 1000  }
        );
  }
  BackToHomeBtn(){
    this.router.navigate(['/home']);
  }

  syncWithHost() {
    docSnapshots(doc(this.firestore, 'room', this.roomId!))
    .subscribe(
      (docSnapshot) => {
        if(!docSnapshot.metadata.hasPendingWrites){

          this.room = docSnapshot.data() as Room;
          let videoRefs = docSnapshot.get('videos') as DocumentReference[];

          if(this.playerState !== this.room.videoState) {
            this.playerState = this.room.videoState;
            switch (this.playerState) {
              case 0:
                this.nextVideo();
                break;
              case 1:
                this.player.seekTo(this.room.videoTime)
                this.player.playVideo();
                break;
              case 2:
                this.player.pauseVideo();
                break;
            }
          }

          if(this.playerState != 0 && this.currentVideoId !== videoRefs[this.room.currentPlay].id) {
            getDoc(videoRefs[this.room.currentPlay]).then(v => {
              this.currentVideoId = (v.data() as Movie).videoId;
              this.vId.next((v.data() as Movie).videoId)
            })
          }

          this.playList = [];
          videoRefs.forEach(ref => {
            getDoc(ref)
              .then( video => this.playList.push(video.data() as Movie)
              ).catch(err => console.log(err));
          })
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }

  get uid() {
    return this.userSvc.getUid();
  }
}
