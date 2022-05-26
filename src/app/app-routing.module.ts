import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard, canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { PlayerComponent } from './player/player.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ThuVienComponent } from './thu-vien/thu-vien.component';

// const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);
// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [{
    path: '',                component: HomeComponent,
  },{
    path: 'login', component: SignInComponent
  },{
    path: 'home', redirectTo: '',canActivate: [AuthGuard]
  },{
    path: 'library', component: ThuVienComponent
  },{
    path: 'movie/:id',       component: MovieDetailComponent
  },{
    path: 'player/:id',       component: PlayerComponent
  },{
    path: '**', component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
