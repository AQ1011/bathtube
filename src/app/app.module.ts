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
import { YouTubePlayerModule } from '@angular/youtube-player';
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
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { VoiceChatComponent } from './player/voice-chat/voice-chat.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

registerLocaleData(en);
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {transports: ["websocket"]} };
// const config: SocketIoConfig = { url: 'https://bath-be.herokuapp.com/', options: {transports: ["websocket"]} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
    VoiceChatComponent,
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
    NzPopoverModule,
    NzDropDownModule,
    NzModalModule,
    NzNotificationModule,
    NzAvatarModule,
    NzMenuModule,
    NzToolTipModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    NgbActiveModal,
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
