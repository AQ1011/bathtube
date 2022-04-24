import { User } from "@angular/fire/auth";

export class Room {
  id: string;
  videoId: string;
  participants: Array<User>;
  password: string;

  constructor() {
    this.id = '';
    this.videoId = '';
    this.password = '';
    this.participants = new Array<User>();
  }

}
