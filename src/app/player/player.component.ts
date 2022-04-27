import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Firestore, collection, doc, docSnapshots, updateDoc,  } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';
import { onSnapshot, query, setDoc } from '@firebase/firestore';
import { Chat } from '../models/room.model';
import { UserService } from '../services/user.service';
import { FireBaseService } from '../services/firebase.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  @ViewChild(YouTubePlayer) player!: YouTubePlayer

  videoId?: string;
  apiLoaded = false;
  isSync = true;
  messages: Chat[] = [];
  chatContent: string = '';


  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private fbSvc: FireBaseService,
    private userSvc: UserService) {
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
        this.skipTo(docSnapshot.get('time'), docSnapshot.get('state'));
      })

      docSnapshots(doc(this.firestore, 'chat', this.videoId!)).subscribe((docSnapshot) => {
        // this.messages = [...this.messages, docSnapshot.data() as Chat];
        console.log(docSnapshot.get('time'));
      })
    }
  }

  ngAfterViewInit(): void {
    this.player.stateChange.subscribe((event) => {
      if (event.data == 1) {
        updateDoc(doc(this.firestore, 'room', 'randomRoomId'), {
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

  skipTo(time: number, state: number) {
    if(this.isSync) {
      this.player.seekTo(time, true);
      this.player.setPlaybackRate(1);
      this.isSync = false;
    }
    setTimeout(() => {
      this.isSync = true;
    }, 1000)
  }

  pause() {
    this.player.pauseVideo();
  }

  play() {
    this.player.playVideo();
  }
}
