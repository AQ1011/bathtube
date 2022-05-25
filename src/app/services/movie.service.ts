import { Injectable } from '@angular/core';
import { collectionSnapshots, doc, docSnapshots, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ref, Storage, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.moddel';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  public search = new BehaviorSubject<string>("");
  constructor(private firestore: Firestore,
    private storage: Storage) {
  }

  getMovie(id: string): Observable<Movie> {
    return docSnapshots(doc(this.firestore, 'video', id))
      .pipe(map((docSnapshots) => docSnapshots.data as any as Movie ))
  }

  getAllMovie(): Observable<Movie[]> {
    return collectionData(collection(this.firestore, 'video'))
      .pipe(map((coll) => coll.map(doc => doc as Movie)));
  }
}
