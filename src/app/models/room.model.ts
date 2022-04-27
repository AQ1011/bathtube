import { User } from "@angular/fire/auth";
import { userInfo } from "os";

export class Room {
  id: string;
  videoId: string;
  participants: User[];
  password: string;

  constructor() {
    this.id = '';
    this.videoId = '';
    this.password = '';
    this.participants = new Array<User>();
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
