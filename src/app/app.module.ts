import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { HomeComponent } from './home/home.component';
import { AngularFireModule } from '@angular/fire/compat';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { LoginComponent } from './login/login.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { PlayerComponent } from './player/player.component';
import { FormsModule } from '@angular/forms';
import { MovieDisplayComponent } from './movie-display/movie-display.component';
import { PlayerListComponent } from './player/player-list/player-list.component';
import { InviteComponent } from './player/invite/invite.component';
import { TruncatePipe } from './common/pipe/TruncatePipe';
import { NextDirective } from './shared/next.directive';
import { PrevDirective } from './shared/prev.directive';
import { FilterPipe } from './common/pipe/filter.pipe';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignInComponent } from './sign-in/sign-in.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MovieDetailComponent,
    PlayerComponent,
    MovieDisplayComponent,
    PlayerListComponent,
    InviteComponent,
    TruncatePipe,
    NextDirective,
    PrevDirective,
    FilterPipe,
    NotFoundComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    YouTubePlayerModule,
    NgbModule,
    FormsModule,
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
