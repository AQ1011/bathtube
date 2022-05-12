import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../models/movie.moddel';

@Injectable({
  providedIn: 'root'
})
export class MovieWatchedService {
  public playerItemList: Movie[] = [];
  public movieList = new BehaviorSubject<any>([]);
  constructor() { }
  getMovieWatched(){
    const dataWatched = JSON.parse(localStorage.getItem('myWatched')!);
    this.movieList.next(dataWatched);
    return this.movieList.asObservable();
  }
  setMovieWatched(movie: any){
    this.playerItemList.push(...movie);
    this.movieList.next(movie);
  }
  addMovieWatched(movie: any){
    this.playerItemList.push(movie);
    this.movieList.next(this.playerItemList);
    const jsonData = JSON.stringify(this.playerItemList)
    localStorage.setItem('myWatched', jsonData)
  }
}
