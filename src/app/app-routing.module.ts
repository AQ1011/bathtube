import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard, canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { PlayerComponent } from './player/player.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ThuVienComponent } from './thu-vien/thu-vien.component';

const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const redirectUnauthorizedToLoginWithParams = (next: ActivatedRouteSnapshot, route: RouterStateSnapshot) => {
  localStorage.setItem('last', route.url);
  return redirectUnauthorizedTo(['login']);
}
const redirectLoggedInToPrevious = (next: ActivatedRouteSnapshot, route: RouterStateSnapshot) => {
  console.log(localStorage.getItem('last')); return redirectLoggedInTo([])
}

const routes: Routes = [{
    path: '', pathMatch: 'full', redirectTo: 'home',
  },{
    path: 'login', component: SignInComponent, ...canActivate(redirectLoggedInToHome)
  },{
    path: 'home', component: HomeComponent,  ...canActivate(redirectUnauthorizedToLogin)
  },{
    path: 'library', component: ThuVienComponent,  ...canActivate(redirectUnauthorizedToLogin)
  },{
    path: 'movie/:id',       component: MovieDetailComponent, ...canActivate(redirectUnauthorizedToLogin)
  },{
    path: 'player/:id',       component: PlayerComponent, ...canActivate(redirectUnauthorizedToLogin)
  },{
    path: '**', component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
