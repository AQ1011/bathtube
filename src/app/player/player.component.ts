import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, docSnapshots } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';
import { getDoc, setDoc } from '@firebase/firestore';
import { Room } from '../models/room.model';

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

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore) {
    route.params.subscribe((params) => {
      this.videoId = params['id'];
    })
    collection(firestore, 'room')
  }

  ngOnInit(): void {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
      setDoc(doc(this.firestore, 'room', 'randomRoomId'), { videoId: this.videoId})
      onSnapshot(doc(this.firestore, 'room', 'randomRoomId'), (doc) => {
        this.skipTo(doc.get('time'), doc.get('state'));
      })
    }
  }

  ngAfterViewInit(): void {
    this.player.stateChange.subscribe((event) => {
      if (event.data == 1) {
        setDoc(doc(this.firestore, 'room', 'randomRoomId'), {
          videoId: this.videoId,
          state: event.data,
          time: event.target.getCurrentTime()
        })

      }
    })
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
