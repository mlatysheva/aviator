import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageComponent } from './pages/main-page/main-page.component';
import { AviaRoutingModule } from './avia-routing.module';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthModule } from '../auth/auth.module';

import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { searchReducer } from '../store/reducers/search.reducer';

@NgModule({
  declarations: [MainPageComponent, FlightSearchComponent],
  imports: [
    CommonModule,
    AviaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    AuthModule,
    HttpClientModule,
    StoreModule.forFeature('search', searchReducer),
  ],
  exports: [MatFormFieldModule, MatInputModule],
  providers: [MatDatepickerModule],
})
export class AviaModule {}
