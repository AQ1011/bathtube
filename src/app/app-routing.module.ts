import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard, canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { PlayerComponent } from './player/player.component';

// const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);
// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [{
    path: '',                component: HomeComponent,
  },{
    path: 'movie/:id',       component: MovieDetailComponent
  },{
    path: 'player/:id',       component: PlayerComponent
  },{
    path: '**', redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
