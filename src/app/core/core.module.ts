import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProgresBarComponent } from './components/progres-bar/progres-bar.component';

@NgModule({
  declarations: [
    NotFoundPageComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    ProgresBarComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule, FormsModule],
  exports: [NotFoundPageComponent, HeaderComponent, FooterComponent],
})
export class CoreModule { }
