import { Component, OnInit } from '@angular/core';
import { doc, DocumentReference, Firestore } from '@angular/fire/firestore';
import { getDownloadURL, ref,  Storage } from '@angular/fire/storage';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieService } from 'src/app/services/movie.service';
import { QueuePlayerService } from 'src/app/services/queue-player.service';
import { Movie } from '../../models/movie.moddel';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  movieList: Movie[] = []
  movieAdd: DocumentReference[] = [];
  apiLoaded: Boolean = false;
  searchInput = '';
  searchKey = '';
  constructor(
    private movieService: MovieService,
    private storage: Storage,
    private firestore: Firestore,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if(!this.apiLoaded){
      this.movieService.getAllMovie().subscribe((movies) => {
        this.movieList = [...movies];
        this.movieList.forEach(movie => {
          if(movie.image)
            getDownloadURL(ref(this.storage, 'image/' + movie.image)).then(url => movie.image = url);
        });
      })
    }
    this.movieService.search.subscribe(value => {
      this.searchKey = value;
    })
  }
  addMovieToQueue(movie: Movie){
    this.movieAdd.push(doc(this.firestore, 'video', movie.videoId))
    this.activeModal.close(this.movieAdd)
  }
  search(event: any){
    this.searchInput = (event.target as HTMLInputElement).value;
    this.movieService.search.next(this.searchInput);
  }
  removeSearch(){
    this.searchInput ='';
    this.movieService.search.next(this.searchInput);
    this.searchKey = '';
  }

}
