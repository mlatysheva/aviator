import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AviaService {
  search() {
    console.log('Search the flight');
  }
}
