import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Firestore, doc, docSnapshots, getDoc,  } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentReference } from '@firebase/firestore';
import { Chat, Room } from '../models/room.model';
import { UserService } from '../services/user.service';
import { FireBaseService } from '../services/firebase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Movie } from '../models/movie.moddel';
import { RoomService } from '../services/room.service';
import { PlayerListComponent } from './player-list/player-list.component';
import { debounce, debounceTime } from 'rxjs/operators';


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
  noVideo = false;
  color: string = '';
  showHeader = false;

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (event.clientY < 80)
    {
      this.showHeader = true;
    }
    else {
      this.showHeader = false;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private fbSvc: FireBaseService,
    private userSvc: UserService,
    private modalService: NgbModal,
    private roomService: RoomService,
    private router: Router) {
    this.route.params.subscribe((params) => {
      this.roomId = params['id'];
    })
  }

  ngOnInit(): void {
    this.getChatColor();
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    this.roomService.getChat(this.roomId).then(
      (chatRef) => {
        this.chatRef = chatRef;
        docSnapshots(chatRef).subscribe(
          (doc) => {
            if(!doc.metadata.hasPendingWrites && doc.data()) {
              this.chatLog.push(doc.data() as Chat)
              var element = document.getElementById("chat-log");
              element!.scrollTop = element!.scrollHeight;
            }
          }
        )
      }
    )
  }

  ngAfterViewInit(): void {
    if (!window.YT || !window.YT.Player) {
      window.onYouTubeIframeAPIReady = () => {
        this.player = new YT.Player('yt-player', {
          height: '320',
          width: '640',
          videoId: '',
          host: 'https://www.youtube.com',
          playerVars: {
            'origin': 'http://localhost:4200',
            'controls': 1,
            'modestbranding': 0,
            'rel': 0,
            'color': 'white',
            'autoplay': 0,
            'fs' : 0,
          },
          events: {
            'onReady': this.onReady.bind(this),
            'onStateChange': this.onPlayerStateChange.bind(this),
          }
        });
      }
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
    console.log('ready')
    getDoc(doc(this.firestore, 'room', this.roomId!))
      .then((doc) => {
        this.room = doc.data() as Room;
        if(this.room.viewer[0] !== this.userSvc.getDisplayName())
          this.syncWithHost();
        this.player.loadVideoById(this.room.videos[this.room.currentPlay].id, this.room.videoTime);
      });

    this.vId.subscribe(id => {
      this.player.loadVideoById(id, 0);
    })
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
    // else {
    //   switch(e.data) {
    //     case 0:
    //       this.nextVideo();
    //       break;
    //     case e.data !== this.room.videoState:
    //   };
    // }
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
      this.noVideo = true;
      return;
    }
    this.roomService.setRoom(this.room);
    this.player.loadVideoById(this.playList[this.room.currentPlay].videoId, 0);
  }

  sendChat() {
    if(this.chatContent) {
      this.fbSvc.setChat(this.chatRef,
        {
          user: this.userSvc.getDisplayName() || 'guest ;_;',
          content: this.chatContent, time: new Date(),
          color: this.color || '#ffffff',
        })
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

  showSearchBtn(){
    this.showSearch = !this.showSearch;
    if(this.showSearch)
      this.showChat = true;
  }

  openSearchPlayer(longContent : any) {
    const modalRef = this.modalService.open(PlayerListComponent, { size: 'lg' }).result
      .then((videos: DocumentReference[]) => {
        this.roomService.addMovieToList(this.roomId, videos);
      });
  }

  openInviteUser(content: any){
    this.modalService.open(content);
  }
  // copyLink(){
  //   this.clipboard.copy
  // }
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
            if(this.playerState === 1) {
              this.player.seekTo(this.room.videoTime)
            } else {
              this.player.cueVideoById(this.currentVideoId, this.room.videoTime);
              if(this.room.videoState === 1) {
                this.player.playVideo();
              }
            }
          }

          this.playerState = this.room.videoState;
          if(this.room.videoState === 2) {
            this.player.pauseVideo();
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
}
