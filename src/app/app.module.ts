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
import { SignInComponent } from './sign-in/sign-in.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ThuVienComponent } from './thu-vien/thu-vien.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

registerLocaleData(en);

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
    ThuVienComponent,
    NavBarComponent,
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
    HttpClientModule,
    BrowserAnimationsModule,
    NzInputModule,
    NzGridModule,
    NzLayoutModule,
    NzButtonModule,
  ],
  providers: [NgbActiveModal, { provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
