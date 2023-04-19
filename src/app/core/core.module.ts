import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';



@NgModule({
  declarations: [
    NotFoundPageComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [NotFoundPageComponent, HeaderComponent, FooterComponent]
})
export class CoreModule { }
