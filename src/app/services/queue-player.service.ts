import { Movie } from './../models/movie.moddel';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueuePlayerService {
  public playerItemList: Movie[] = [];
  public movieList = new BehaviorSubject<any>([]);
constructor() { }
  getMovie(){
    return this.movieList.asObservable();
  }
  setMovie(movie: any){
    this.playerItemList.push(...movie);
    this.movieList.next(movie);
  }
  addMovie(movie: any){
    this.playerItemList.push(movie);
    this.movieList.next(this.playerItemList);
  }
}
