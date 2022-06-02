import { Injectable } from '@angular/core';
import { update } from '@angular/fire/database';
import { Firestore, docSnapshots, setDoc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { doc, DocumentData, DocumentReference, DocumentSnapshot } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.moddel';
import { Chat } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  constructor(private firestore: Firestore) { }

  get(collection: string, document: string): Observable<DocumentSnapshot<DocumentData>>  {
    return docSnapshots(doc(this.firestore, collection, document));
  }

  setMovie(collection: string, document: string, data: Movie): void {
    setDoc(doc(this.firestore, collection, document), data);
  }

  setChat(docRef: DocumentReference, data: any): void {
    // setDoc(docRef, data);
    // try {
    //   updateDoc(docRef,{
    //     chat: arrayUnion(data)
    //   })
    // } catch (e) {
    //   console.log(e);
    //   setDoc(docRef, {
    //     chat: [data]
    //   });
    // }
  }

}
