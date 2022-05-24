import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Firestore, doc, docSnapshots, getDoc,  } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { DocumentReference } from '@firebase/firestore';
import { Chat, Room } from '../models/room.model';
import { UserService } from '../services/user.service';
import { FireBaseService } from '../services/firebase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueuePlayerService } from '../services/queue-player.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Movie } from '../models/movie.moddel';
import { RoomService } from '../services/room.service';
import { PlayerListComponent } from './player-list/player-list.component';

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
  showChat: boolean = true;
  showSearch: boolean = false;
  queueMovie: any = [];
  showSlideRight: boolean = true;
  currentVideoId: string = '';
  player: any;
  vId = new BehaviorSubject<string>('');
  playList: DocumentReference[] = []
  playerState: number = -1;
  room!: Room;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private fbSvc: FireBaseService,
    private userSvc: UserService,
    private modalService: NgbModal,
    private roomService: RoomService) {
    this.route.params.subscribe((params) => {
      this.roomId = params['id'];
    })
  }

  ngOnInit(): void {
    docSnapshots(doc(this.firestore, 'room', this.roomId!))
      .subscribe(
        (docSnapshot) => {
          if(!docSnapshot.metadata.hasPendingWrites){
            this.room = docSnapshot.data() as Room;
            let videoRefs = docSnapshot.get('videos') as DocumentReference[];
            this.playList = videoRefs;
            console.log(this.playList);
            if(this.playerState != 0) {
              getDoc(videoRefs[this.room.currentPlay]).then(v => {
                this.currentVideoId = (v.data() as Movie).videoId;
                this.vId.next((v.data() as Movie).videoId)
              })
            }
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
          videoId: '0srVchY9Z4A',
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
    switch(e.data) {
      case 0: this.nextVideo()
    }
  }

  nextVideo() {
    this.room.currentPlay++;
    if(this.room.currentPlay > this.room.videos.length)
      return;
    this.roomService.setRoom(this.room);
    this.player.loadVideoById(this.playList[this.room.currentPlay].id, 0);
  }

  sendChat() {
    this.fbSvc.setChat('chat', this.roomId!,
      {
        user: this.userSvc.getDisplayName() || 'guest ;_;',
        content: this.chatContent, time: new Date()
      })
  }

  hideChat() {
    let chat = document.getElementById('chat') as HTMLElement;
    chat.style.width = '0';
    document.getElementById('user-join')!.style.display = "none";
    this.resize();
  }

  skipTo(time: number, state: number) {
    if(this.isSync) {
      this.player.seekTo(time, true);
      this.player.setPlaybackRate(1);
      this.isSync = false;
    }
    setTimeout(() => {
      this.isSync = true;
    }, 2000)
  }

  pause() {
    this.player.pauseVideo();
  }

  play() {
    this.player.playVideo();
  }

  resize() {
    this.player.setSize(
      this.ref.nativeElement.offsetWidth,
      this.ref.nativeElement.offsetHeight - 12
    )
  }

  showChatBtn(){
    this.showChat = true;
    this.showSearch = false;
  }

  showSearchBtn(){
    this.showSearch = true;
    this.showChat = false;
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
}
