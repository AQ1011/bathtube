import { User } from "@angular/fire/auth";
import { DocumentReference } from "@angular/fire/firestore";
import { userInfo } from "os";

export class Room {
  id: string;
  videos: DocumentReference[];
  viewer: string[];

  constructor(id: string, videos: DocumentReference[], viewer: string[]) {
    this.id = id;
    this.videos = videos;
    this.viewer = viewer;
  }

}

export class Chat {
  user: string;
  content: string;
  time: Date;
  constructor( user?: string, content?: string, time?: Date) {
    this.user = 'guest ;_;';
    this.content = '';
    this. time = new Date();
    if(user) {
      this.user = user;
    }
    if(content) {
      this.content = content;
    }
    if(time) {
      this.time = time;
    }
  }
}
