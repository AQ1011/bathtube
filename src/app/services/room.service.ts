import { Injectable } from '@angular/core';
import { doc, DocumentSnapshot, Firestore, setDoc } from '@angular/fire/firestore';
import { Action, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { collection } from '@firebase/firestore';
import { Room } from '../models/room.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private firestore: Firestore,
      private afs: AngularFirestore) { }

  setRoom(room: Room): void {
    setDoc(doc(this.firestore, 'room', room.id), room);
  }

  getRoom(roomId: string): Observable<DocumentSnapshot<Room>> {
    return this.afs.doc<Room>('room/' + roomId)
  }
}
