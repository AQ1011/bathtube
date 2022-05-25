import { Injectable } from '@angular/core';
import { arrayUnion, doc, docSnapshots, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { DocumentReference, updateDoc } from '@firebase/firestore';
import { Room } from '../models/room.model';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private firestore: Firestore) { }

  setRoom(room: Room): void {
    setDoc(doc(this.firestore, 'room', room.id), Object.assign({}, room));
  }

  getRoom(roomId: string): Observable<Room> {
    return docSnapshots(doc(this.firestore, 'room', roomId))
      .pipe(map(doc => doc.data() as Room))
  }

  addMovieToList(roomId: string, videos: DocumentReference[]) {
    updateDoc(doc(this.firestore, 'room', roomId),
      {
        videos: arrayUnion(...videos)
      }
    );
  }

  getChat(roomId: string): Promise<DocumentReference> {
    return getDoc(doc(this.firestore, 'room', roomId)).then((doc) => { return doc.get('chat') as DocumentReference})
  }
}
