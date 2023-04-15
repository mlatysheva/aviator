import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/pages/not-found-page/not-found-page.component';
import { MainPageComponent } from './avia/pages/main-page/main-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    component: MainPageComponent,
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
