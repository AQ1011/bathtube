import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { Chat } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) {
  }

  sendMessageToRoom(room: string, chat: Chat) {
    this.socket.emit('sendChat', { room: room, chat: chat})
  }

  connectToRoom(userName: string, room: string) {
    this.socket.emit('joinRoom', { user: userName, room: room})
  }

  onJoin(): Observable<string> {
    return this.socket.fromEvent<string>('joined');
  }

  onMessage(): Observable<Chat> {
    return this.socket.fromEvent<Chat>('message');
  }

  broadCastState(room: string, state: number, time: number): void {
    this.socket.emit('playerState', {room: room, state: state, time: time})
  }

  getPeers(): Observable<any> {
    return this.socket.fromEvent('peers')
  }

  getAnswer(): Promise<any> {
    return this.socket.fromOneTimeEvent('answer')
  }

  sendOffer(offer: any, peer: string) {
    this.socket.emit('offer', { peer: peer, offer: offer });
  }
}
