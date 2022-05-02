import { Component, OnInit } from '@angular/core';
import { getDownloadURL, ref,  Storage } from '@angular/fire/storage';
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
  apiLoaded: Boolean = false;
  constructor(private movieService: MovieService,private storage: Storage,private queuePlayerService: QueuePlayerService) { }

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
  }
  addMovieToQueue(movie: any){
    this.queuePlayerService.addMovie(movie);
  }

}
