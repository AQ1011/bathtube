import { User } from "@angular/fire/auth";
import { DocumentReference } from "@angular/fire/firestore";
import { userInfo } from "os";

export class Room {
  id: string;
  videos: DocumentReference[];
  viewer: string[];
  currentPlay: number = 0;
  chat: DocumentReference;
  videoTime = 0;
  videoState = 0;
  constructor(id: string, videos: DocumentReference[], viewer: string[], chat: DocumentReference) {
    this.id = id;
    this.videos = videos;
    this.viewer = viewer;
    this.chat = chat;
  }

}

export class Chat {
  uid: string;
  user: string;
  content: string;
  time: Date;
  color: string;
  constructor( uid?: string, user?: string, content?: string, time?: Date, color?: string) {
    this.uid = '';
    this.user = 'guest ;_;';
    this.content = '';
    this. time = new Date();
    if(uid) {
      this.uid = uid;
    }
    if(user) {
      this.user = user;
    }
    if(content) {
      this.content = content;
    }
    if(time) {
      this.time = time;
    }
    if(color) {
      this.color = color;
    } else {
      this.color = '#ffffff'
    }
  }
}
