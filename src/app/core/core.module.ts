import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';



@NgModule({
  declarations: [
    NotFoundPageComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [NotFoundPageComponent, HeaderComponent]
})
export class CoreModule { }
