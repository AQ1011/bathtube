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
  isSync = true;
  messages: Chat[] = [];
  chatContent: string = '';
  showChat = true;
  showSearch: boolean = false;
  showSlideRight: boolean = true;
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
    if (event.clientY < 66)
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
    this.getChatColor();
    docSnapshots(doc(this.firestore, 'room', this.roomId!))
      .subscribe(
        (docSnapshot) => {
          if(!docSnapshot.metadata.hasPendingWrites){
            let temp = docSnapshot.data() as Room;
            let videoRefs = docSnapshot.get('videos') as DocumentReference[];
            if(this.room.currentPlay > videoRefs.length - 1) {
              this.noVideo = true;
            }
            if (this.userSvc.getDisplayName() !== temp.viewer[0]) {
              this.room = temp;
              this.skipTo(temp.videoTime, temp.videoState);
            } else {
              if(this.room) {
                temp.videoState = this.room.videoState;
                temp.videoTime = this.room.videoTime;
              }
              this.room = temp;
            }
            if(this.playerState != 0) {
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

    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

  }

  ngAfterViewInit(): void {
    if (!window.YT || !window.YT.Player) {
      window.onYouTubeIframeAPIReady = () => {
        this.player = new YT.Player('yt-player', {
          height: '320',
          width: '640',
          videoId: '',//heck is this id
          playerVars: {
            'origin': 'http://localhost:4200',
            'controls': 1,
            'modestbranding': 0,
            'rel': 0,
            'color': 'white'
          },
          events: {
            'onReady': this.onPlayerReady.bind(this),
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

  onPlayerReady() {
    this.resize()
    this.vId.subscribe(id => {
      this.player.loadVideoById(id, 0);
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resize()
  }

  onPlayerStateChange(e: any) {
    if(e.data === 3 || e.data === -1)
      return;
    if(this.userSvc.getDisplayName() === this.room.viewer[0]) {
      let temp = this.room;
      temp.videoTime = this.player.getCurrentTime();
      temp.videoState = e.data;
      this.roomService.setRoom(temp);
    }
    else {
      switch(e.data) {
        case 0:
          this.nextVideo();
          break;
      };
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

  skipTo(time: number, state: number) {
    console.log('aaaaa')
    this.player.seekTo(time, state);
  }

  pause() {
    this.player.pauseVideo();
  }

  play() {
    this.player.playVideo();
  }

  resize() {
    console.log(this.ref.nativeElement.offsetHeight);
    this.player.setSize(
      this.ref.nativeElement.offsetWidth,
      this.ref.nativeElement.offsetHeight - 12
    )
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
}
