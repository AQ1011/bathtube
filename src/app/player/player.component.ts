import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Firestore, collection, doc, docSnapshots, updateDoc,  } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';
import { onSnapshot, query, setDoc } from '@firebase/firestore';
import { Chat } from '../models/room.model';
import { UserService } from '../services/user.service';
import { FireBaseService } from '../services/firebase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueuePlayerService } from '../services/queue-player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  @ViewChild(YouTubePlayer) player!: YouTubePlayer;
  @ViewChild('pp') ref!: ElementRef;

  videoId?: string;
  apiLoaded = false;
  isSync = true;
  messages: Chat[] = [];
  chatContent: string = '';
  showChat: boolean = true;
  showSearch: boolean = false;
  queueMovie: any = [];


  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private fbSvc: FireBaseService,
    private userSvc: UserService,
    private modalService: NgbModal,
    private queuePlayerService: QueuePlayerService) {
    this.route.params.subscribe((params) => {
      this.videoId = params['id'];
    })
  }

  ngOnInit(): void {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;

      docSnapshots(doc(this.firestore, 'room', this.videoId!)).subscribe((docSnapshot) => {
        if(!docSnapshot.metadata.hasPendingWrites){
          this.skipTo(docSnapshot.get('time'), docSnapshot.get('state'));
        }
      })

      docSnapshots(doc(this.firestore, 'chat', this.videoId!)).subscribe((docSnapshot) => {
        if(!docSnapshot.metadata.hasPendingWrites){
          this.messages = [...this.messages, docSnapshot.data() as Chat];}
      })

      this.queuePlayerService.getMovie().subscribe((movie) => {
        this.queueMovie = movie;
        console.log(this.queueMovie);
      })
    }
  }

  ngAfterViewInit(): void {
    this.player.width = this.ref.nativeElement.offsetWidth;
    this.player.height = this.ref.nativeElement.offsetHeight - 12;
    this.player.stateChange.subscribe((event) => {
      if (event.data == 1) {
        setDoc(doc(this.firestore, 'room', this.videoId!), {
          videoId: this.videoId,
          state: event.data,
          time: event.target.getCurrentTime()
        })
      }
    })
  }

  sendChat() {
    if(this.chatContent && this.userSvc.getUser())
      this.fbSvc.setChat('chat', this.videoId!, {user: this.userSvc.getDisplayName()!, content: this.chatContent, time: new Date()})
    else if(this.chatContent && !this.userSvc.getUser())
      this.fbSvc.setChat('chat', this.videoId!, { user: 'guest ;_;', content: this.chatContent, time: new Date()})
    this.chatContent = '';
  }

  hideChat() {
    let chat = document.getElementById('chat') as HTMLElement;
    chat.style.width = '0';
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
    this.player.width = this.ref.nativeElement.offsetWidth;
    this.player.height = this.ref.nativeElement.offsetHeight - 12;
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
    this.modalService.open(longContent, { size: 'lg' });
  }

  openInviteUser(content: any){
    this.modalService.open(content);
  }
}
